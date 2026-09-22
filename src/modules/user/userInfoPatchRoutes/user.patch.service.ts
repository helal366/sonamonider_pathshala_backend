import { prisma } from "../../../lib/prisma.js";
import { TChangeUserPositionZodSchema, TChangeUserRoleZodSchema } from "./user.patch.zod.validation.js";
import { checkRolePositionPair } from "../../../helperFunctions/cachedData/cache_positions.js";
import { findRoleExistence } from "../../../helperFunctions/cachedData/cache_roles.js";
import { AppError } from "../../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { StatusCodes } from "http-status-codes";

// CHANGE USER POSITION
const changeUserPosition = async (
  payload: TChangeUserPositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const cleanPosition = payload.position_name.trim().toUpperCase();

  const positionExists = await checkRolePositionPair({
    role_name: loggedInUser.role_name,
    position_name: cleanPosition,
  });

  return prisma.$transaction(async (transaction) => {
    const updatedUser = await transaction.user.update({
      where: { id: loggedInUser.user_id },
      data: {
        position: {
          connect: { id: positionExists.id },
        },
        updated_by: {
          connect: { id: loggedInUser.user_id },
        },
      },
    });

    await transaction.user.update({
      where: { id: loggedInUser.user_id },
      data: {
        audit_logs: {
          create: [
            {
              entity_id: loggedInUser.user_id,
              entity_name: "User",
              old_value: {
                position_name: loggedInUser.position_name || null,
              },
              new_value: {
                position_name: cleanPosition,
              },
              action: "UPDATE",
            },
          ],
        },
      },
    });

    return updatedUser;
  });
};

// CHANGE USER ROLE 
const changeUserRole=async(
   payload: TChangeUserRoleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
)=>{
  const cleanPosition = payload.position_name.trim().toUpperCase();
  const cleanRole = payload.role_name.trim().toUpperCase();

  const roleExistance = await findRoleExistence(cleanRole);
  if(!roleExistance)
    throw new AppError(`Provided Role ${payload.role_name} not found.`, StatusCodes.NOT_FOUND);

    const positionExists = await checkRolePositionPair({
    role_name: cleanRole,
    position_name: cleanPosition,
  });
}
export const userPatchServices = {
  changeUserPosition,
  changeUserRole
};
