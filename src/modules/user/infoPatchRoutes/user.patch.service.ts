import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../../lib/prisma.js";
import {
  TChangeUserPositionZodSchema,
  TChangeUserRoleZodSchema,
} from "./user.patch.zod.validation.js";
import { checkRolePositionPair } from "../../../helperFunctions/cachedData/cache_positions.js";

const changeUserRole = async (
  payload: TChangeUserRoleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { role_name, position_name } = payload;
  const cleanPosition = position_name.trim().toUpperCase();
  const cleanRole = role_name.trim().toUpperCase();

  // Check role existance
  const existingRole = await prisma.userRole.findUnique({
    where: { role_name: cleanRole },
    select: { id: true },
  });

  if (!existingRole) {
    throw new AppError(
      `Your provided role : ${cleanRole} does not exist.`,
      StatusCodes.NOT_FOUND,
    );
  }
  // Check that the position belongs to the requested role
  const positionExists = await checkRolePositionPair({
    role_name: cleanRole,
    position_name: cleanPosition,
  });

  //  Change the user role
  const changedRole = await prisma.user.update({
    where: { id: loggedInUser.user_id },
    data: {
      role: {
        connect: { role_name: cleanRole },
      },
      position: {
        connect: { id: positionExists.id },
      },
    },
  });

  return changedRole;
};

const changeUserPosition = async (
  payload: TChangeUserPositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const cleanPosition = payload.position_name.trim().toUpperCase();

  const positionExists = await checkRolePositionPair({
    role_name: loggedInUser.role_name,
    position_name: cleanPosition,
  });

  return prisma.user.update({
    where: { id: loggedInUser.user_id },
    data: {
      position: {
        connect: { id: positionExists.id },
      },
    },
  });
};

export const userPatchServices = {
  changeUserRole,
  changeUserPosition,
};
