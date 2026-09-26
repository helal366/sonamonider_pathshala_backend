import { EducationDegree } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TUpdateFatherEducationalQualificationZodSchema,
  TUpdateFatherJobTitleZodSchema,
  TUpdateFatherMobileNo1ZodSchema,
  TUpdateFatherMobileNo2ZodSchema,
  TUpdateFatherMobileNo3ZodSchema,
  TUpdateFatherMonthlyIncomeZodSchema,
  TUpdateFatherNameZodSchema,
  TUpdateFatherNidZodSchema,
  TUpdateFatherOccupationZodSchema,
} from "./fatherDetails.zod.validation.js";

// ======================================================
// UPDATE FATHER NAME
// ======================================================
const updateFatherName = async (
  payload: TUpdateFatherNameZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, father_name } = payload;

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

  if (!targetUser.father_details_id) {
    throw new AppError(
      "Father details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingFatherDetails = await prisma.fatherDetails.findUnique({
    where: {
      id: targetUser.father_details_id,
    },
    select: {
      id: true,
      father_name: true,
    },
  });

  if (!existingFatherDetails) {
    throw new AppError("Father details do not exist.", StatusCodes.NOT_FOUND);
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails = await transaction.fatherDetails.update({
        where: {
          id: existingFatherDetails.id,
        },
        data: {
          father_name,

          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 🚀 FIXED: Direct high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.create({
        data: {
          entity_id: existingFatherDetails.id,
          entity_name: "FatherDetails",
          old_value: {
            user_id,
            father_name: existingFatherDetails.father_name,
          },
          new_value: {
            user_id,
            father_name,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      });

      return updatedFatherDetails;
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

// ======================================================
// UPDATE FATHER NID
// ======================================================

const updateFatherNid = async (
  payload: TUpdateFatherNidZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, nid_no } = payload;

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

  if (!targetUser.father_details_id) {
    throw new AppError(
      "Father details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingFatherDetails = await prisma.fatherDetails.findUnique({
    where: {
      id: targetUser.father_details_id,
    },
    select: {
      id: true,
      nid_no: true,
    },
  });

  if (!existingFatherDetails) {
    throw new AppError("Father details do not exist.", StatusCodes.NOT_FOUND);
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails = await transaction.fatherDetails.update({
        where: {
          id: existingFatherDetails.id,
        },
        data: {
          nid_no,

          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 🚀 FIXED: Direct high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.create({
        data: {
          entity_id: existingFatherDetails.id,
          entity_name: "FatherDetails",
          old_value: {
            user_id, // Preserves your contextual link to the executing child profile
            nid_no: existingFatherDetails.nid_no,
          },
          new_value: {
            user_id,
            nid_no,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id, // Satisfies non-null database schema constraint rule
        },
      });
      return updatedFatherDetails;
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

// ======================================================
// UPDATE FATHER OCCUPATION
// ======================================================

const updateFatherOccupation = async (
  payload: TUpdateFatherOccupationZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, occupation } = payload;

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

  if (!targetUser.father_details_id) {
    throw new AppError(
      "Father details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingFatherDetails = await prisma.fatherDetails.findUnique({
    where: {
      id: targetUser.father_details_id,
    },
    select: {
      id: true,
      occupation: true,
    },
  });

  if (!existingFatherDetails) {
    throw new AppError("Father details do not exist.", StatusCodes.NOT_FOUND);
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails = await transaction.fatherDetails.update({
        where: {
          id: existingFatherDetails.id,
        },
        data: {
          occupation,

          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 🚀 FIXED: Direct high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.create({
        data: {
          entity_id: existingFatherDetails.id,
          entity_name: "FatherDetails",
          old_value: {
            user_id, // Preserves your contextual link to the executing child profile
            occupation: existingFatherDetails.occupation,
          },
          new_value: {
            user_id,
            occupation,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id, // Satisfies non-null database schema constraint rule
        },
      });

      return updatedFatherDetails;
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

// ======================================================
// UPDATE FATHER JOB TITLE
// ======================================================

const updateFatherJobTitle = async (
  payload: TUpdateFatherJobTitleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, job_title } = payload;

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

  if (!targetUser.father_details_id) {
    throw new AppError(
      "Father details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingFatherDetails = await prisma.fatherDetails.findUnique({
    where: {
      id: targetUser.father_details_id,
    },
    select: {
      id: true,
      job_title: true,
    },
  });

  if (!existingFatherDetails) {
    throw new AppError("Father details do not exist.", StatusCodes.NOT_FOUND);
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails = await transaction.fatherDetails.update({
        where: {
          id: existingFatherDetails.id,
        },
        data: {
          job_title,

          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 🚀 FIXED: Direct high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.create({
        data: {
          entity_id: existingFatherDetails.id,
          entity_name: "FatherDetails",
          old_value: {
            user_id, // Preserves your contextual link to the executing child profile
            job_title: existingFatherDetails.job_title,
          },
          new_value: {
            user_id,
            job_title,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id, // Satisfies non-null database schema constraint rule
        },
      });

      return updatedFatherDetails;
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

// ======================================================
// UPDATE EDUCATIONAL QUALIFICATION
// ======================================================

const updateFatherEducationalQualification = async (
  payload: TUpdateFatherEducationalQualificationZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, educational_qualification } = payload;

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

  if (!targetUser.father_details_id) {
    throw new AppError(
      "Father details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingFatherDetails = await prisma.fatherDetails.findUnique({
    where: {
      id: targetUser.father_details_id,
    },
    select: {
      id: true,
      educational_qualification: true,
    },
  });

  if (!existingFatherDetails) {
    throw new AppError("Father details do not exist.", StatusCodes.NOT_FOUND);
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails = await transaction.fatherDetails.update({
        where: {
          id: existingFatherDetails.id,
        },
        data: {
          educational_qualification:
            educational_qualification as EducationDegree | null,

          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 🚀 FIXED: Direct high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.create({
        data: {
          entity_id: existingFatherDetails.id,
          entity_name: "FatherDetails",
          old_value: {
            user_id,
            educational_qualification:
              existingFatherDetails.educational_qualification,
          },
          new_value: {
            user_id,
            educational_qualification,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      });

      return updatedFatherDetails;
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

// ======================================================
// UPDATE MONTHLY INCOME
// ======================================================

const updateFatherMonthlyIncome = async (
  payload: TUpdateFatherMonthlyIncomeZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, monthly_income } = payload;

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

  if (!targetUser.father_details_id) {
    throw new AppError(
      "Father details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingFatherDetails = await prisma.fatherDetails.findUnique({
    where: {
      id: targetUser.father_details_id,
    },
    select: {
      id: true,
      monthly_income: true,
    },
  });

  if (!existingFatherDetails) {
    throw new AppError("Father details do not exist.", StatusCodes.NOT_FOUND);
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails = await transaction.fatherDetails.update({
        where: {
          id: existingFatherDetails.id,
        },
        data: {
          monthly_income,

          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 🚀 FIXED: Direct high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.create({
        data: {
          entity_id: existingFatherDetails.id,
          entity_name: "FatherDetails",
          old_value: {
            user_id,
            monthly_income: existingFatherDetails.monthly_income,
          },
          new_value: {
            user_id,
            monthly_income,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      });

      return updatedFatherDetails;
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

// ======================================================
// UPDATE MOBILE NO 1
// ======================================================

const updateFatherMobileNo1 = async (
  payload: TUpdateFatherMobileNo1ZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, mobile_no_1 } = payload;

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

  if (!targetUser.father_details_id) {
    throw new AppError(
      "Father details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingFatherDetails = await prisma.fatherDetails.findUnique({
    where: {
      id: targetUser.father_details_id,
    },
    select: {
      id: true,
      mobile_no_1: true,
    },
  });

  if (!existingFatherDetails) {
    throw new AppError("Father details do not exist.", StatusCodes.NOT_FOUND);
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails = await transaction.fatherDetails.update({
        where: {
          id: existingFatherDetails.id,
        },
        data: {
          mobile_no_1,

          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 🚀 FIXED: Direct high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.create({
        data: {
          entity_id: existingFatherDetails.id,
          entity_name: "FatherDetails",
          old_value: {
            user_id,
            mobile_no_1: existingFatherDetails.mobile_no_1,
          },
          new_value: {
            user_id,
            mobile_no_1,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      });

      return updatedFatherDetails;
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

// ======================================================
// UPDATE MOBILE NO 2
// ======================================================

const updateFatherMobileNo2 = async (
  payload: TUpdateFatherMobileNo2ZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, mobile_no_2 } = payload;

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

  if (!targetUser.father_details_id) {
    throw new AppError(
      "Father details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingFatherDetails = await prisma.fatherDetails.findUnique({
    where: {
      id: targetUser.father_details_id,
    },
    select: {
      id: true,
      mobile_no_2: true,
    },
  });

  if (!existingFatherDetails) {
    throw new AppError("Father details do not exist.", StatusCodes.NOT_FOUND);
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails = await transaction.fatherDetails.update({
        where: {
          id: existingFatherDetails.id,
        },
        data: {
          mobile_no_2,

          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 🚀 FIXED: Direct high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.create({
        data: {
          entity_id: existingFatherDetails.id,
          entity_name: "FatherDetails",
          old_value: {
            user_id,
            mobile_no_2: existingFatherDetails.mobile_no_2,
          },
          new_value: {
            user_id,
            mobile_no_2,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      });

      return updatedFatherDetails;
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

// ======================================================
// UPDATE MOBILE NO 3
// ======================================================

const updateFatherMobileNo3 = async (
  payload: TUpdateFatherMobileNo3ZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { user_id, mobile_no_3 } = payload;

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

  if (!targetUser.father_details_id) {
    throw new AppError(
      "Father details do not exist for this user.",
      StatusCodes.NOT_FOUND,
    );
  }

  const existingFatherDetails = await prisma.fatherDetails.findUnique({
    where: {
      id: targetUser.father_details_id,
    },
    select: {
      id: true,
      mobile_no_3: true,
    },
  });

  if (!existingFatherDetails) {
    throw new AppError("Father details do not exist.", StatusCodes.NOT_FOUND);
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails = await transaction.fatherDetails.update({
        where: {
          id: existingFatherDetails.id,
        },
        data: {
          mobile_no_3,

          updated_by: {
            connect: {
              id: loggedInUser.user_id,
            },
          },
        },
      });

      // 🚀 FIXED: Direct high-performance Audit Log creation passing mandatory changed_by_id
      await transaction.auditLog.create({
        data: {
          entity_id: existingFatherDetails.id,
          entity_name: "FatherDetails",
          old_value: {
            user_id,
            mobile_no_3: existingFatherDetails.mobile_no_3,
          },
          new_value: {
            user_id,
            mobile_no_3,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      });

      return updatedFatherDetails;
    },
    {
      timeout: 15000,
    },
  );

  return result;
};

// ======================================================
// EXPORT
// ======================================================

export const fatherDetailsPatchServices = {
  updateFatherName,
  updateFatherNid,
  updateFatherOccupation,
  updateFatherJobTitle,
  updateFatherEducationalQualification,
  updateFatherMonthlyIncome,
  updateFatherMobileNo1,
  updateFatherMobileNo2,
  updateFatherMobileNo3,
};
