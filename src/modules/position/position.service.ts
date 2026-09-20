import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { clearCachePositions } from "../../helperFunctions/cachedData/cache_positions.js";
import { prisma } from "../../lib/prisma.js";
import { TCreatePositionZodSchema } from "./position.zod.validation.js";

const createPosition = async (
  payload: TCreatePositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { position_name, role_name } = payload;

  const cleanPosition = position_name.trim().toUpperCase();
  const cleanRole = role_name.trim().toUpperCase();

  const existingPosition = await prisma.userPosition.findUnique({
    where: { position_name: cleanPosition },
    select: { id: true },
  });
  if (existingPosition) {
    throw new AppError(
      `Your provided position : ${cleanPosition} already exists.`,
      StatusCodes.CONFLICT,
    );
  }

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

  const createdNewPosition = await prisma.$transaction(async (transaction) => {
    const createdNewPosition = await transaction.userPosition.create({
      data: {
        position_name: cleanPosition,
        role: {
          connect: { id: existingRole.id },
        },
        created_by: {
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
              entity_id: createdNewPosition.id,
              entity_name: "UserPosition",
              old_value: Prisma.JsonNull,
              new_value: {
                position_name: cleanPosition,
                role_name: cleanRole,
              },
              action: "CREATE",
            },
          ],
        },
      },
    });

    return createdNewPosition;
  });

  clearCachePositions();
  return createdNewPosition;
};

export const positionServices = {
  createPosition,
};
