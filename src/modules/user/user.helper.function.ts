import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import { IExistencePayload, IUserCount } from "./user.interface.js";

const userExistence = async ({
  role_name: role,
  full_name,
  mobile_number,
}: IExistencePayload) => {
  let user = null;
  if (
    role === "SUPER_ADMIN" ||
    role === "TEACHER_ADMIN" ||
    role === "ADMIN" ||
    role === "MANAGEMENT"
  ) {
    user = await prisma.managementStaff.findUnique({
      where: {
        management_full_name_mobile_unique: {
          full_name,
          mobile_number,
        },
      },
    });
  } else if (role === "STUDENT") {
  } else if (role === "GOVERNING_BODY") {
  } else if (role === "ACADEMIC") {
  }
  return user;
};

const userCount = async ({ role_name: role, mobile_number }: IUserCount) => {
  let userCount = 0;
  if (
    role === "SUPER_ADMIN" ||
    role === "TEACHER_ADMIN" ||
    role === "ADMIN" ||
    role === "MANAGEMENT"
  ) {
    userCount = await prisma.managementStaff.count({
      where: {
        mobile_number,
      },
    });
  } else if (role === "STUDENT") {
  } else if (role === "GOVERNING_BODY") {
  } else if (role === "TEACHER" || role === "ACADEMIC") {
  }
  return userCount;
};

const userCreationRolePostionCheck = (
  role_name: string,
  position_name: string,
) => {
  // role_name and position_name are or create user not of loggedInUser
  // CHECK THE ROLE IS PERMITTED OR NOT.
  if (
    role_name !== "MANAGEMENT" &&
    role_name !== "ACADEMIC" &&
    role_name !== "STUDENT" &&
    role_name !== "GOVERNING_BODY"
  ) {
    throw new AppError(
      `The user with the provided role ${role_name} is not allowed to create.`,
      StatusCodes.UNAUTHORIZED,
    );
  }

  // CHECK THE POSITION IS PERMITTED OR NOT.
  if (
    position_name !== "MANAGEMENT_STAFF" &&
    position_name !== "ACADEMIC_STAFF" &&
    position_name !== "STUDENT" &&
    position_name !== "GOVERNING_BODY"
  ) {
    throw new AppError(`The user with the provided position ${position_name} is not allowed to create.`, StatusCodes.UNAUTHORIZED)
  }
};
export const userHelperFunction = {
  userExistence,
  userCount,
  userCreationRolePostionCheck
};
