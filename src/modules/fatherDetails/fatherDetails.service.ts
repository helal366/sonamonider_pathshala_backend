import { StatusCodes } from "http-status-codes";

import {
  TConnectFatherDetailsZodSchema,
  TCreateFatherDetailsZodSchema,
  TDisconnectFatherDetailsZodSchema,
} from "./fatherDetails.zod.validation";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";

import { EducationDegree, Prisma } from "#db-client";

// ======================================================
// CREATE FATHER DETAILS
// ======================================================

const createFatherDetails = async (
  payload: TCreateFatherDetailsZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const {
    user_id,
    father_name,
    nid_no,
    occupation,
    job_title,
    educational_qualification,
    monthly_income,
    mobile_no_1,
    mobile_no_2,
    mobile_no_3,
  } = payload;

  const targetUser = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      id: true,
      father_details_id: true,
    },
  });

  if (!targetUser) {
    throw new AppError(
      "The provided user does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (targetUser.father_details_id) {
    throw new AppError(
      "Father details already exist for this user.",
      StatusCodes.CONFLICT,
    );
  }

  const optionalDataPayload = {
    ...(nid_no !== undefined && { nid_no }),
    ...(occupation !== undefined && { occupation }),
    ...(job_title !== undefined && { job_title }),
    ...(educational_qualification !== undefined && {
      educational_qualification: educational_qualification as EducationDegree,
    }),
    ...(monthly_income !== undefined && { monthly_income }),
    ...(mobile_no_1 !== undefined && { mobile_no_1 }),
    ...(mobile_no_2 !== undefined && { mobile_no_2 }),
    ...(mobile_no_3 !== undefined && { mobile_no_3 }),
  };

  const result = await prisma.$transaction(
    async (transaction) => {
      // 1. Create FatherDetails record
      const fatherDetails = await transaction.fatherDetails.create({
        data: {
          father_name,
          ...optionalDataPayload,

          created_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 2. Link FatherDetails back to User profile
      await transaction.user.update({
        where: {
          id: user_id,
        },
        data: {
          father_details: {
            connect: {
              id: fatherDetails.id,
            },
          },
        },
      });

      // 🚀 3. FIXED: Direct, high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.createMany({
        data: [
          {
            entity_id: fatherDetails.id,
            entity_name: "FatherDetails",
            old_value: Prisma.JsonNull,
            new_value: {
              father_name,
              ...optionalDataPayload,
            },
            action: "CREATE",
            changed_by_id: loggedInUser.user_id,
          },
          {
            entity_id: user_id,
            entity_name: "User",
            old_value: { father_details_id: null },
            new_value: { father_details_id: fatherDetails.id },
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
          },
        ],
      });

      return fatherDetails;
    },
    {
      timeout: 10000,
    },
  );

  return result;
};

// ======================================================
// CONNECT FATHER DETAILS
// ======================================================

const connectFatherDetails = async (
  payload: TConnectFatherDetailsZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, father_details_id } = payload;

  const [targetUser, fatherDetails] = await Promise.all([
    prisma.user.findUnique({
      where: {
        id: user_id,
      },
      select: {
        id: true,
        full_name: true,
        father_details_id: true,
      },
    }),

    prisma.fatherDetails.findUnique({
      where: {
        id: father_details_id,
      },
      select: {
        id: true,
        father_name: true,
      },
    }),
  ]);

  if (!targetUser) {
    throw new AppError(
      "The provided user does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (!fatherDetails) {
    throw new AppError(
      "The provided father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (targetUser.father_details_id) {
    throw new AppError(
      "This user already has father details connected.",
      StatusCodes.CONFLICT,
    );
  }

  const result = await prisma.$transaction(async (transaction) => {
    // 1. Connect FatherDetails to the target User profile
    const updatedUser = await transaction.user.update({
      where: {
        id: user_id,
      },
      data: {
        father_details: {
          connect: {
            id: father_details_id,
          },
        },
      },
      select: {
        id: true,
        full_name: true,
        father_details: true,
      },
    });

    // 2. Track who updated the FatherDetails master entry
    await transaction.fatherDetails.update({
      where: {
        id: father_details_id,
      },
      data: {
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    // 🚀 3. FIXED: Direct high-performance Audit Log write passing mandatory changed_by_id
    await transaction.auditLog.createMany({
      data: [
        {
          entity_id: user_id,
          entity_name: "User",
          old_value: { father_details_id: null },
          new_value: { father_details_id: father_details_id },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
        {
          entity_id: father_details_id,
          entity_name: "FatherDetails",
          old_value: Prisma.JsonNull, // Represents connecting a new child user to this father
          new_value: {
            action: "CONNECTED_TO_USER",
            user_id: user_id,
            user_full_name: targetUser.full_name,
            father_name: fatherDetails.father_name,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      ],
    });
    return updatedUser;
  });

  return result;
};

// ======================================================
// DISCONNECT FATHER DETAILS
// ======================================================
const disconnectFatherDetails = async (
  payload: TDisconnectFatherDetailsZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id } = payload;

  const targetUser = await prisma.user.findUnique({
    where: {
      id: user_id,
    },
    select: {
      id: true,
      full_name: true,
      father_details_id: true,
      father_details: {
        select: {
          id: true,
          father_name: true,
        },
      },
    },
  });

  if (!targetUser) {
    throw new AppError(
      "The provided user does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (!targetUser.father_details_id || !targetUser.father_details) {
    throw new AppError(
      "This user does not have father details connected.",
      StatusCodes.NOT_FOUND,
    );
  }

  const fatherDetailsId = targetUser.father_details_id;

  const result = await prisma.$transaction(
    async (transaction) => {
      // Count how many users are connected to this FatherDetails
      const connectionCount = await transaction.user.count({
        where: {
          father_details_id: fatherDetailsId,
        },
      });

      if (connectionCount === 0) {
        throw new AppError(
          "Father details connection data is inconsistent.",
          StatusCodes.CONFLICT,
        );
      }

      // Disconnect FatherDetails from the target user
      const updatedUser = await transaction.user.update({
        where: {
          id: user_id,
        },
        data: {
          father_details: {
            disconnect: true,
          },
        },
        select: {
          id: true,
          full_name: true,
          father_details_id: true,
        },
      });

      // If this was the only connection,
      // delete the FatherDetails record.
      if (connectionCount === 1) {
        await transaction.fatherDetails.delete({
          where: {
            id: fatherDetailsId,
          },
        });
      }

      // Create audit log
      await transaction.auditLog.createMany({
        data: [
          {
            entity_id: fatherDetailsId,
            entity_name: "FatherDetails",
            old_value: {
              user_id,
              father_details_id: fatherDetailsId,
              father_name: targetUser.father_details?.father_name,
            },
            new_value: {
              user_id,
              father_details_id: null,
              father_details_deleted: connectionCount === 1,
            },
            action: connectionCount === 1 ? "DELETE" : "UPDATE",
            changed_by_id: loggedInUser.user_id,
          },
          {
            entity_id: user_id,
            entity_name: "User",
            old_value: { father_details_id: fatherDetailsId },
            new_value: { father_details_id: null },
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
          },
        ],
      });

      return {
        user: updatedUser,
        father_details_deleted: connectionCount === 1,
      };
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

export const fatherDetailsServices = {
  createFatherDetails,
  connectFatherDetails,
  disconnectFatherDetails,
};
