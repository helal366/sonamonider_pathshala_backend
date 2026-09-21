import { StatusCodes } from "http-status-codes";

import {
  TConnectFatherDetailsZodSchema,
  TCreateFatherDetailsZodSchema,
  TUpdateFatherNameZodSchema,
  TUpdateFatherNidZodSchema,
  TUpdateFatherOccupationZodSchema,
  TUpdateFatherJobTitleZodSchema,
  TUpdateFatherEducationalQualificationZodSchema,
  TUpdateFatherMonthlyIncomeZodSchema,
  TUpdateFatherMobileNo1ZodSchema,
  TUpdateFatherMobileNo2ZodSchema,
  TUpdateFatherMobileNo3ZodSchema,
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
      educational_qualification:
        educational_qualification as EducationDegree,
    }),
    ...(monthly_income !== undefined && { monthly_income }),
    ...(mobile_no_1 !== undefined && { mobile_no_1 }),
    ...(mobile_no_2 !== undefined && { mobile_no_2 }),
    ...(mobile_no_3 !== undefined && { mobile_no_3 }),
  };

  const result = await prisma.$transaction(
    async (transaction) => {
      const fatherDetails =
        await transaction.fatherDetails.create({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: fatherDetails.id,
                entity_name: "FatherDetails",
                old_value: Prisma.JsonNull,
                new_value: {
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
                },
                action: "CREATE",
              },
            ],
          },
        },
      });

      return fatherDetails;
    },
    {
      timeout: 15000,
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

    await transaction.user.update({
      where: {
        id: loggedInUser.user_id,
      },
      data: {
        audit_logs: {
          create: [
            {
              entity_id: father_details_id,
              entity_name: "FatherDetails",
              old_value: Prisma.JsonNull,
              new_value: {
                user_id,
                father_details_id,
              },
              action: "UPDATE",
            },
          ],
        },
      },
    });

    return updatedUser;
  });

  return result;
};

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

  const existingFatherDetails =
    await prisma.fatherDetails.findUnique({
      where: {
        id: targetUser.father_details_id,
      },
      select: {
        id: true,
        father_name: true,
      },
    });

  if (!existingFatherDetails) {
    throw new AppError(
      "Father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
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
              },
            ],
          },
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

  const existingFatherDetails =
    await prisma.fatherDetails.findUnique({
      where: {
        id: targetUser.father_details_id,
      },
      select: {
        id: true,
        nid_no: true,
      },
    });

  if (!existingFatherDetails) {
    throw new AppError(
      "Father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: existingFatherDetails.id,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  nid_no: existingFatherDetails.nid_no,
                },
                new_value: {
                  user_id,
                  nid_no,
                },
                action: "UPDATE",
              },
            ],
          },
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

  const existingFatherDetails =
    await prisma.fatherDetails.findUnique({
      where: {
        id: targetUser.father_details_id,
      },
      select: {
        id: true,
        occupation: true,
      },
    });

  if (!existingFatherDetails) {
    throw new AppError(
      "Father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: existingFatherDetails.id,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  occupation: existingFatherDetails.occupation,
                },
                new_value: {
                  user_id,
                  occupation,
                },
                action: "UPDATE",
              },
            ],
          },
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

  const existingFatherDetails =
    await prisma.fatherDetails.findUnique({
      where: {
        id: targetUser.father_details_id,
      },
      select: {
        id: true,
        job_title: true,
      },
    });

  if (!existingFatherDetails) {
    throw new AppError(
      "Father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: existingFatherDetails.id,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  job_title: existingFatherDetails.job_title,
                },
                new_value: {
                  user_id,
                  job_title,
                },
                action: "UPDATE",
              },
            ],
          },
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

  const existingFatherDetails =
    await prisma.fatherDetails.findUnique({
      where: {
        id: targetUser.father_details_id,
      },
      select: {
        id: true,
        educational_qualification: true,
      },
    });

  if (!existingFatherDetails) {
    throw new AppError(
      "Father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
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
              },
            ],
          },
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

  const existingFatherDetails =
    await prisma.fatherDetails.findUnique({
      where: {
        id: targetUser.father_details_id,
      },
      select: {
        id: true,
        monthly_income: true,
      },
    });

  if (!existingFatherDetails) {
    throw new AppError(
      "Father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: existingFatherDetails.id,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  monthly_income:
                    existingFatherDetails.monthly_income,
                },
                new_value: {
                  user_id,
                  monthly_income,
                },
                action: "UPDATE",
              },
            ],
          },
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

  const existingFatherDetails =
    await prisma.fatherDetails.findUnique({
      where: {
        id: targetUser.father_details_id,
      },
      select: {
        id: true,
        mobile_no_1: true,
      },
    });

  if (!existingFatherDetails) {
    throw new AppError(
      "Father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: existingFatherDetails.id,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  mobile_no_1:
                    existingFatherDetails.mobile_no_1,
                },
                new_value: {
                  user_id,
                  mobile_no_1,
                },
                action: "UPDATE",
              },
            ],
          },
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

  const existingFatherDetails =
    await prisma.fatherDetails.findUnique({
      where: {
        id: targetUser.father_details_id,
      },
      select: {
        id: true,
        mobile_no_2: true,
      },
    });

  if (!existingFatherDetails) {
    throw new AppError(
      "Father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: existingFatherDetails.id,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  mobile_no_2:
                    existingFatherDetails.mobile_no_2,
                },
                new_value: {
                  user_id,
                  mobile_no_2,
                },
                action: "UPDATE",
              },
            ],
          },
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

  const existingFatherDetails =
    await prisma.fatherDetails.findUnique({
      where: {
        id: targetUser.father_details_id,
      },
      select: {
        id: true,
        mobile_no_3: true,
      },
    });

  if (!existingFatherDetails) {
    throw new AppError(
      "Father details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const result = await prisma.$transaction(
    async (transaction) => {
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
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

      await transaction.user.update({
        where: {
          id: loggedInUser.user_id,
        },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: existingFatherDetails.id,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  mobile_no_3:
                    existingFatherDetails.mobile_no_3,
                },
                new_value: {
                  user_id,
                  mobile_no_3,
                },
                action: "UPDATE",
              },
            ],
          },
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

export const fatherDetailsServices = {
  createFatherDetails,
  connectFatherDetails,

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