import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import { motherDetailsHelperFunctions } from "./motherDetails.helperFunction.js";
import { ITargetUser } from "./motherDetails.interface.js";

import {
  TConnectMotherDetailsZodSchema,
  TCreateMotherDetailsZodSchema,
  TDisconnectMotherDetailsZodSchema,
  TUpdateMotherDetailsFieldPayload,
} from "./motherDetails.zod.validation.js";

// ============================================================
// CREATE MOTHER DETAILS CONTROLLER
// ============================================================
const createMotherDetails = async (
  payload: TCreateMotherDetailsZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const {
    user_id,
    mother_name,
    nid_no,
    occupation,
    job_title,
    educational_qualification,
    monthly_income,
    mobile_no_1,
    mobile_no_2,
    mobile_no_3,
  } = payload;

  const targetUser: ITargetUser =
    await motherDetailsHelperFunctions.getTargetUser(user_id);

  if (targetUser.mother_details_id) {
    throw new AppError(
      "Mother details are already connected to this user.",
      StatusCodes.CONFLICT,
    );
  }

  const motherDetails = await prisma.$transaction(async (transaction) => {
    const created = await transaction.motherDetails.create({
      data: {
        mother_name,
        ...(nid_no !== undefined && { nid_no }),
        ...(occupation !== undefined && { occupation }),
        ...(job_title !== undefined && { job_title }),
        ...(educational_qualification !== undefined && {
          educational_qualification,
        }),
        ...(monthly_income !== undefined && { monthly_income }),
        ...(mobile_no_1 !== undefined && { mobile_no_1 }),
        ...(mobile_no_2 !== undefined && { mobile_no_2 }),
        ...(mobile_no_3 !== undefined && { mobile_no_3 }),
        created_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.user.update({
      where: { id: user_id },
      data: {
        mother_details: {
          connect: {
            id: created.id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "MotherDetails",
        old_value: Prisma.JsonNull,
        new_value: {
          user_id,
          user_full_name: targetUser.full_name,
          mother_name: created.mother_name,
          nid_no: created.nid_no,
          occupation: created.occupation,
          job_title: created.job_title,
          educational_qualification: created.educational_qualification,
          monthly_income: created.monthly_income,
          mobile_no_1: created.mobile_no_1,
          mobile_no_2: created.mobile_no_2,
          mobile_no_3: created.mobile_no_3,
        },
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    return created;
  });

  return motherDetails;
};

// ============================================================
// CONNECT MOTHER DETAILS CONTROLLER
// ============================================================
const connectMotherDetails = async (
  payload: TConnectMotherDetailsZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { user_id, mother_details_id } = payload;

  const { targetUser, motherDetails } =
    await motherDetailsHelperFunctions.getTargetUserMotherDetails({
      user_id,
      mother_details_id,
    });

  return prisma.$transaction(async (transaction) => {
    const updatedUser = await transaction.user.update({
      where: { id: user_id },
      data: {
        mother_details: {
          connect: {
            id: mother_details_id,
          },
        },
      },
      select: {
        id: true,
        full_name: true,
        mother_details: true,
      },
    });

    await transaction.motherDetails.update({
      where: { id: mother_details_id },
      data: {
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.createMany({
      data: [
        {
          entity_id: user_id,
          entity_name: "User",
          old_value: {
            mother_details_id: null,
          },
          new_value: {
            mother_details_id,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
        {
          entity_id: mother_details_id,
          entity_name: "MotherDetails",
          old_value: Prisma.JsonNull,
          new_value: {
            user_id,
            user_full_name: targetUser.full_name,
            mother_name: motherDetails.mother_name,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      ],
    });

    return updatedUser;
  });
};

// UPDATE A SINGLE MOTHER DETAILS FIELD
const updateMotherDetailsField = async (
  payload: TUpdateMotherDetailsFieldPayload,
  loggedInUser: TLoggedInUser,
) => {
  const { user_id, field, value } = payload;
  const targetUser = await motherDetailsHelperFunctions.getTargetUser(user_id);
  const motherDetailsId = targetUser.mother_details_id;
  const motherDetails = targetUser.mother_details;

  if (!motherDetailsId || !motherDetails) {
    throw new AppError(
      "Mother details are not connected to this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  return prisma.$transaction(async (transaction) => {
    const updated = await transaction.motherDetails.update({
      where: { id: motherDetailsId },
      data: {
        [field]: value,
        updated_by: { connect: { id: loggedInUser.user_id } },
      } as Prisma.MotherDetailsUpdateInput,
    });

    await transaction.auditLog.create({
      data: {
        entity_id: motherDetailsId,
        entity_name: "MotherDetails",
        old_value: { user_id, [field]: motherDetails[field] },
        new_value: { user_id, [field]: value },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    return updated;
  });
};

// ============================================================
// DISCONNECT MOTHER DETAILS CONTROLLER
// ============================================================
const disconnectMotherDetails = async (
  payload: TDisconnectMotherDetailsZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { user_id } = payload;

  const targetUser: ITargetUser =
    await motherDetailsHelperFunctions.getTargetUser(user_id);

  const motherDetailsId = targetUser.mother_details_id;
  const motherDetails = targetUser.mother_details;

  if (!motherDetailsId || !motherDetails) {
    throw new AppError(
      "Mother details are not connected to this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  return prisma.$transaction(async (transaction) => {
    const updatedUser = await transaction.user.update({
      where: { id: user_id },
      data: {
        mother_details: {
          disconnect: true,
        },
      },
      select: {
        id: true,
        full_name: true,
        mother_details_id: true,
      },
    });

    await transaction.motherDetails.update({
      where: { id: motherDetailsId },
      data: {
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: user_id,
        entity_name: "User",
        old_value: {
          mother_details_id: motherDetailsId,
        },
        new_value: {
          mother_details_id: null,
        },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    const remainingConnectedUsers = await transaction.user.count({
      where: { mother_details_id: motherDetailsId },
    });

    if (remainingConnectedUsers === 0) {
      await transaction.motherDetails.delete({
        where: {
          id: motherDetailsId,
        },
      });

      await transaction.auditLog.create({
        data: {
          entity_id: motherDetailsId,
          entity_name: "MotherDetails",
          old_value: {
            user_id,
            user_full_name: targetUser.full_name,
            mother_name: motherDetails.mother_name,
          },
          new_value: Prisma.JsonNull,
          action: "DELETE",
          changed_by_id: loggedInUser.user_id,
        },
      });
    } else {
      await transaction.auditLog.create({
        data: {
          entity_id: motherDetailsId,
          entity_name: "MotherDetails",
          old_value: {
            user_id,
            user_full_name: targetUser.full_name,
            mother_name: motherDetails.mother_name,
          },
          new_value: Prisma.JsonNull,
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      });
    }

    return updatedUser;
  });
};

export const motherDetailsServices = {
  createMotherDetails,
  connectMotherDetails,
  updateMotherDetailsField,
  disconnectMotherDetails,
};
