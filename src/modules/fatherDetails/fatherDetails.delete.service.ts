import { StatusCodes } from "http-status-codes";

import {
  TDisconnectFatherDetailsZodSchema,
} from "./fatherDetails.zod.validation";

import { prisma } from "../../lib/prisma";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";




// ======================================================
// DELETE FATHER NID
// ======================================================

const deleteFatherNid = async (
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
      father_details_id: true,
      father_details: {
        select: {
          id: true,
          nid_no: true,
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
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
          where: {
            id: fatherDetailsId,
          },
          data: {
            nid_no: null,
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
                entity_id: fatherDetailsId,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  nid_no: targetUser.father_details?.nid_no,
                },
                new_value: {
                  user_id,
                  nid_no: null,
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
// DELETE FATHER OCCUPATION
// ======================================================

const deleteFatherOccupation = async (
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
      father_details_id: true,
      father_details: {
        select: {
          id: true,
          occupation: true,
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
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
          where: {
            id: fatherDetailsId,
          },
          data: {
            occupation: null,
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
                entity_id: fatherDetailsId,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  occupation: targetUser.father_details?.occupation,
                },
                new_value: {
                  user_id,
                  occupation: null,
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
// DELETE FATHER JOB TITLE
// ======================================================

const deleteFatherJobTitle = async (
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
      father_details_id: true,
      father_details: {
        select: {
          id: true,
          job_title: true,
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
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
          where: {
            id: fatherDetailsId,
          },
          data: {
            job_title: null,
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
                entity_id: fatherDetailsId,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  job_title: targetUser.father_details?.job_title,
                },
                new_value: {
                  user_id,
                  job_title: null,
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
// DELETE FATHER EDUCATIONAL QUALIFICATION
// ======================================================

const deleteFatherEducationalQualification = async (
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
      father_details_id: true,
      father_details: {
        select: {
          id: true,
          educational_qualification: true,
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
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
          where: {
            id: fatherDetailsId,
          },
          data: {
            educational_qualification: null,
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
                entity_id: fatherDetailsId,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  educational_qualification:
                    targetUser.father_details?.educational_qualification,
                },
                new_value: {
                  user_id,
                  educational_qualification: null,
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
// DELETE FATHER MONTHLY INCOME
// ======================================================

const deleteFatherMonthlyIncome = async (
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
      father_details_id: true,
      father_details: {
        select: {
          id: true,
          monthly_income: true,
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
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
          where: {
            id: fatherDetailsId,
          },
          data: {
            monthly_income: null,
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
                entity_id: fatherDetailsId,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  monthly_income:
                    targetUser.father_details?.monthly_income,
                },
                new_value: {
                  user_id,
                  monthly_income: null,
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
// DELETE FATHER MOBILE NO 1
// ======================================================

const deleteFatherMobileNo1 = async (
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
      father_details_id: true,
      father_details: {
        select: {
          id: true,
          mobile_no_1: true,
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
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
          where: {
            id: fatherDetailsId,
          },
          data: {
            mobile_no_1: null,
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
                entity_id: fatherDetailsId,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  mobile_no_1:
                    targetUser.father_details?.mobile_no_1,
                },
                new_value: {
                  user_id,
                  mobile_no_1: null,
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
// DELETE FATHER MOBILE NO 2
// ======================================================

const deleteFatherMobileNo2 = async (
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
      father_details_id: true,
      father_details: {
        select: {
          id: true,
          mobile_no_2: true,
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
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
          where: {
            id: fatherDetailsId,
          },
          data: {
            mobile_no_2: null,
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
                entity_id: fatherDetailsId,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  mobile_no_2:
                    targetUser.father_details?.mobile_no_2,
                },
                new_value: {
                  user_id,
                  mobile_no_2: null,
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
// DELETE FATHER MOBILE NO 3
// ======================================================

const deleteFatherMobileNo3 = async (
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
      father_details_id: true,
      father_details: {
        select: {
          id: true,
          mobile_no_3: true,
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
      const updatedFatherDetails =
        await transaction.fatherDetails.update({
          where: {
            id: fatherDetailsId,
          },
          data: {
            mobile_no_3: null,
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
                entity_id: fatherDetailsId,
                entity_name: "FatherDetails",
                old_value: {
                  user_id,
                  mobile_no_3:
                    targetUser.father_details?.mobile_no_3,
                },
                new_value: {
                  user_id,
                  mobile_no_3: null,
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


export const fatherDetailsDeleteServices = {
  deleteFatherNid,
  deleteFatherOccupation,
  deleteFatherJobTitle,
  deleteFatherEducationalQualification,
  deleteFatherMonthlyIncome,
  deleteFatherMobileNo1,
  deleteFatherMobileNo2,
  deleteFatherMobileNo3,
};