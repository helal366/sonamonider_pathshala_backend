import { prisma } from "../../../lib/prisma.js";
import { TChangeUserPositionZodSchema } from "./user.patch.zod.validation.js";
import { checkRolePositionPair } from "../../../helperFunctions/cachedData/cache_positions.js";

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
      updated_by: {
        connect: { id: loggedInUser.user_id },
      },
    },
  });
};

export const userPatchServices = {
  changeUserPosition,
};
