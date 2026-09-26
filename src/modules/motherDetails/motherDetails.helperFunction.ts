import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";

interface ITargetUserMotherDetailsPayload {
  user_id: string;
  mother_details_id: string;
}

async function getTargetUser(user_id: string) {
  const targetUser = await prisma.user.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      full_name: true,
      mother_details_id: true,
      mother_details: {
        select: {
          id: true,
          mother_name: true,
          nid_no: true,
          occupation: true,
          job_title: true,
          educational_qualification: true,
          monthly_income: true,
          mobile_no_1: true,
          mobile_no_2: true,
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
  if (!targetUser.mother_details_id || !targetUser.mother_details) {
    throw new AppError(
      "Mother details are not connected to this user.",
      StatusCodes.NOT_FOUND,
    );
  }
  return targetUser;
}
const getTargetUserMotherDetails = async (
  payload: ITargetUserMotherDetailsPayload,
) => {
  const { user_id, mother_details_id } = payload;
  const [targetUser, motherDetails] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user_id },
      select: {
        id: true,
        full_name: true,
        mother_details_id: true,
        mother_details: {
          select: {
            id: true,
            mother_name: true,
            nid_no: true,
            occupation: true,
            job_title: true,
            educational_qualification: true,
            monthly_income: true,
            mobile_no_1: true,
            mobile_no_2: true,
            mobile_no_3: true,
          },
        },
      },
    }),

    prisma.motherDetails.findUnique({
      where: { id: mother_details_id },
      select: {
        id: true,
        mother_name: true,
        nid_no: true,
        occupation: true,
        job_title: true,
        educational_qualification: true,
        monthly_income: true,
        mobile_no_1: true,
        mobile_no_2: true,
        mobile_no_3: true,
      },
    }),
  ]);

  if (!targetUser) {
    throw new AppError(
      "The provided user does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (!motherDetails) {
    throw new AppError(
      "The provided mother details do not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (targetUser.mother_details_id) {
    throw new AppError(
      "This user already has mother details connected.",
      StatusCodes.CONFLICT,
    );
  }
  return { targetUser, motherDetails };
};

export const motherDetailsHelperFunctions = {
  getTargetUser,
  getTargetUserMotherDetails,
};
