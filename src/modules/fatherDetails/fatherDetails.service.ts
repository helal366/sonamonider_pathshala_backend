import { StatusCodes } from "http-status-codes";
import { TConnectFatherDetailsZodSchema, TCreateFatherDetailsZodSchema } from "./fatherDetails.zod.validation";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { EducationDegree } from "#db-client";
import { Prisma } from "#db-client";

// CREATE FATHER DETAILS
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
  const loggedInUserRole = loggedInUser.role_name;
  if(loggedInUserRole !== "SUPER_ADMIN" && loggedInUserRole !== "TEACHER_ADMIN" && loggedInUserRole !== "ADMIN"){
    if(loggedInUser.user_id !== user_id){
        throw new AppError("Unauthorized access", StatusCodes.UNAUTHORIZED)
    }
  }
  const result = await prisma.$transaction(async (transaction) => {
    const fatherDetails = await transaction.fatherDetails.create({
      data: {
        father_name,
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
  });

  return result;
};

// CONNECT FATHER DETAILS
const connectFatherDetails = async(
    payload: TConnectFatherDetailsZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
)=>{

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

}
export const fatherDetailsServices = {
    createFatherDetails,
    connectFatherDetails
}
