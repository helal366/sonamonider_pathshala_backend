import { Prisma } from "#db-client";
import { prisma } from "../../lib/prisma";
import { motherDetailsHelperFunctions } from "./motherDetails.helperFunction";
import {
  IMotherDetails,
  ITargetUser,
  LoggedInUser,
} from "./motherDetails.interface";

import {
  TConnectMotherDetailsZodSchema,
  TCreateMotherDetailsZodSchema,
  TDisconnectMotherDetailsZodSchema,
} from "./motherDetails.zod.validation";

// ============================================================
// CREATE MOTHER DETAILS CONTROLLER
// ============================================================
const createMotherDetails = async (
  payload: TCreateMotherDetailsZodSchema,
  loggedInUser: LoggedInUser,
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
  loggedInUser: LoggedInUser,
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

// ============================================================
// DISCONNECT MOTHER DETAILS CONTROLLER
// ============================================================
const disconnectMotherDetails = async (
  payload: TDisconnectMotherDetailsZodSchema,
  loggedInUser: LoggedInUser,
) => {
  const { user_id } = payload;

  const targetUser: ITargetUser =
    await motherDetailsHelperFunctions.getTargetUser(user_id);

  const motherDetailsId = targetUser.mother_details_id as string;
  const motherDetails = targetUser.mother_details as IMotherDetails;

  return prisma.$transaction(async (transaction) => {
    // Check how many users are currently connected
    const connectedUserCount = await prisma.user.count({
      where: {
        mother_details_id: motherDetailsId,
      },
    });

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

    if (connectedUserCount === 1) {
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
  disconnectMotherDetails,
};

// import { StatusCodes } from "http-status-codes";
// import { EducationDegree, Prisma } from "#db-client";

// import { prisma } from "../../lib/prisma";
// import {
//   TConnectMotherDetailsZodSchema,
//   TCreateMotherDetailsZodSchema,
//   TUpdateMotherEducationalQualificationZodSchema,
//   TUpdateMotherJobTitleZodSchema,
//   TUpdateMotherMonthlyIncomeZodSchema,
//   TUpdateMotherMobileNo1ZodSchema,
//   TUpdateMotherMobileNo2ZodSchema,
//   TUpdateMotherMobileNo3ZodSchema,
//   TUpdateMotherNameZodSchema,
//   TUpdateMotherNidZodSchema,
//   TUpdateMotherOccupationZodSchema,
// } from "./motherDetails.zod.validation";
// import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";

// type LoggedInUser = NonNullable<Express.Request["user"]>;
// type MotherDetailsField =
//   | "mother_name"
//   | "nid_no"
//   | "occupation"
//   | "job_title"
//   | "educational_qualification"
//   | "monthly_income"
//   | "mobile_no_1"
//   | "mobile_no_2"
//   | "mobile_no_3";
// type MotherDetailsValue = string | EducationDegree | null;

// const createMotherDetails = async (
//   payload: TCreateMotherDetailsZodSchema,
//   loggedInUser: LoggedInUser,
// ) => {
//   const {
//     user_id,
//     mother_name,
//     nid_no,
//     occupation,
//     job_title,
//     educational_qualification,
//     monthly_income,
//     mobile_no_1,
//     mobile_no_2,
//     mobile_no_3,
//   } = payload;

//   const targetUser = await prisma.user.findUnique({
//     where: { id: user_id },
//     select: { id: true, mother_details_id: true },
//   });

//   if (!targetUser) {
//     throw new AppError(
//       "The provided user does not exist.",
//       StatusCodes.NOT_FOUND,
//     );
//   }
//   if (targetUser.mother_details_id) {
//     throw new AppError(
//       "Mother details already exist for this user.",
//       StatusCodes.CONFLICT,
//     );
//   }

//   const motherDetails = await prisma.$transaction(async (transaction) => {
//     const created = await transaction.motherDetails.create({
//       data: {
//         mother_name,
//         ...(nid_no !== undefined && { nid_no }),
//         ...(occupation !== undefined && { occupation }),
//         ...(job_title !== undefined && { job_title }),
//         ...(educational_qualification !== undefined && {
//           educational_qualification:
//             educational_qualification as EducationDegree,
//         }),
//         ...(monthly_income !== undefined && { monthly_income }),
//         ...(mobile_no_1 !== undefined && { mobile_no_1 }),
//         ...(mobile_no_2 !== undefined && { mobile_no_2 }),
//         ...(mobile_no_3 !== undefined && { mobile_no_3 }),
//         created_by: { connect: { id: loggedInUser.user_id } },
//       },
//     });

//     await transaction.user.update({
//       where: { id: user_id },
//       data: { mother_details: { connect: { id: created.id } } },
//     });

//     await transaction.user.update({
//       where: { id: loggedInUser.user_id },
//       data: {
//         audit_logs: {
//           create: {
//             entity_id: created.id,
//             entity_name: "MotherDetails",
//             old_value: Prisma.JsonNull,
//             new_value: { ...payload },
//             action: "CREATE",
//           },
//         },
//       },
//     });

//     return created;
//   });

//   return motherDetails;
// };

// const connectMotherDetails = async (
//   payload: TConnectMotherDetailsZodSchema,
//   loggedInUser: LoggedInUser,
// ) => {
//   const { user_id, mother_details_id } = payload;
//   const [targetUser, motherDetails] = await Promise.all([
//     prisma.user.findUnique({
//       where: { id: user_id },
//       select: { id: true, mother_details_id: true },
//     }),
//     prisma.motherDetails.findUnique({
//       where: { id: mother_details_id },
//       select: { id: true },
//     }),
//   ]);

//   if (!targetUser) {
//     throw new AppError(
//       "The provided user does not exist.",
//       StatusCodes.NOT_FOUND,
//     );
//   }
//   if (!motherDetails) {
//     throw new AppError(
//       "The provided mother details do not exist.",
//       StatusCodes.NOT_FOUND,
//     );
//   }
//   if (targetUser.mother_details_id) {
//     throw new AppError(
//       "This user already has mother details connected.",
//       StatusCodes.CONFLICT,
//     );
//   }

//   return prisma.$transaction(async (transaction) => {
//     const updatedUser = await transaction.user.update({
//       where: { id: user_id },
//       data: { mother_details: { connect: { id: mother_details_id } } },
//       select: { id: true, full_name: true, mother_details: true },
//     });

//     await transaction.motherDetails.update({
//       where: { id: mother_details_id },
//       data: { updated_by: { connect: { id: loggedInUser.user_id } } },
//     });

//     await transaction.user.update({
//       where: { id: loggedInUser.user_id },
//       data: {
//         audit_logs: {
//           create: {
//             entity_id: mother_details_id,
//             entity_name: "MotherDetails",
//             old_value: Prisma.JsonNull,
//             new_value: { ...payload },
//             action: "UPDATE",
//           },
//         },
//       },
//     });

//     return updatedUser;
//   });
// };

// const updateMotherField = async (
//   user_id: string,
//   field: MotherDetailsField,
//   value: MotherDetailsValue,
//   loggedInUser: LoggedInUser,
// ) => {
//   const targetUser = await prisma.user.findUnique({
//     where: { id: user_id },
//     select: { id: true, mother_details_id: true },
//   });

//   if (!targetUser) {
//     throw new AppError(
//       "The provided user does not exist.",
//       StatusCodes.NOT_FOUND,
//     );
//   }
//   if (!targetUser.mother_details_id) {
//     throw new AppError(
//       "Mother details do not exist for this user.",
//       StatusCodes.NOT_FOUND,
//     );
//   }

//   const existing = await prisma.motherDetails.findUnique({
//     where: { id: targetUser.mother_details_id },
//     select: { id: true, [field]: true } as Prisma.MotherDetailsSelect,
//   });

//   if (!existing) {
//     throw new AppError("Mother details do not exist.", StatusCodes.NOT_FOUND);
//   }

//   return prisma.$transaction(async (transaction) => {
//     const updated = await transaction.motherDetails.update({
//       where: { id: existing.id },
//       data: {
//         [field]: value,
//         updated_by: { connect: { id: loggedInUser.user_id } },
//       } as Prisma.MotherDetailsUpdateInput,
//     });

//     await transaction.user.update({
//       where: { id: loggedInUser.user_id },
//       data: {
//         audit_logs: {
//           create: {
//             entity_id: existing.id,
//             entity_name: "MotherDetails",
//             old_value: {
//               user_id,
//               [field]: (existing as Record<string, unknown>)[field],
//             } as Prisma.InputJsonValue,
//             new_value: { user_id, [field]: value } as Prisma.InputJsonValue,
//             action: "UPDATE",
//           },
//         },
//       },
//     });

//     return updated;
//   });
// };

// const updateMotherName = (
//   payload: TUpdateMotherNameZodSchema,
//   user: LoggedInUser,
// ) =>
//   updateMotherField(payload.user_id, "mother_name", payload.mother_name, user);
// const updateMotherNid = (
//   payload: TUpdateMotherNidZodSchema,
//   user: LoggedInUser,
// ) => updateMotherField(payload.user_id, "nid_no", payload.nid_no, user);
// const updateMotherOccupation = (
//   payload: TUpdateMotherOccupationZodSchema,
//   user: LoggedInUser,
// ) => updateMotherField(payload.user_id, "occupation", payload.occupation, user);
// const updateMotherJobTitle = (
//   payload: TUpdateMotherJobTitleZodSchema,
//   user: LoggedInUser,
// ) => updateMotherField(payload.user_id, "job_title", payload.job_title, user);
// const updateMotherEducationalQualification = (
//   payload: TUpdateMotherEducationalQualificationZodSchema,
//   user: LoggedInUser,
// ) =>
//   updateMotherField(
//     payload.user_id,
//     "educational_qualification",
//     payload.educational_qualification,
//     user,
//   );
// const updateMotherMonthlyIncome = (
//   payload: TUpdateMotherMonthlyIncomeZodSchema,
//   user: LoggedInUser,
// ) =>
//   updateMotherField(
//     payload.user_id,
//     "monthly_income",
//     payload.monthly_income,
//     user,
//   );
// const updateMotherMobileNo1 = (
//   payload: TUpdateMotherMobileNo1ZodSchema,
//   user: LoggedInUser,
// ) =>
//   updateMotherField(payload.user_id, "mobile_no_1", payload.mobile_no_1, user);
// const updateMotherMobileNo2 = (
//   payload: TUpdateMotherMobileNo2ZodSchema,
//   user: LoggedInUser,
// ) =>
//   updateMotherField(payload.user_id, "mobile_no_2", payload.mobile_no_2, user);
// const updateMotherMobileNo3 = (
//   payload: TUpdateMotherMobileNo3ZodSchema,
//   user: LoggedInUser,
// ) =>
//   updateMotherField(payload.user_id, "mobile_no_3", payload.mobile_no_3, user);

// export const motherDetailsServices = {
//   createMotherDetails,
//   connectMotherDetails,
//   updateMotherName,
//   updateMotherNid,
//   updateMotherOccupation,
//   updateMotherJobTitle,
//   updateMotherEducationalQualification,
//   updateMotherMonthlyIncome,
//   updateMotherMobileNo1,
//   updateMotherMobileNo2,
//   updateMotherMobileNo3,
// };
