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
  } else if (role === "TEACHER" || role === "ACADEMIC") {
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

export const userHelperFunction = {
  userExistence,
  userCount,
};
