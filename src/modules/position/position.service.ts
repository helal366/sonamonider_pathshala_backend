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

  // 1. Verify if the position name already exists to prevent duplicates
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

  // 2. Verify that the paired role exists in the master database
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

   // 3. Atomatically create the position record and write the audit trace log
  const createdNewPosition = await prisma.$transaction(async (transaction) => {
    const newPosition = await transaction.userPosition.create({
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

     // 🚀 B) FIXED: Direct high-performance Audit Log write passing mandatory changed_by_id and Prisma.JsonNull
    await transaction.auditLog.create({
      data: {
        entity_id: newPosition.id,
        entity_name: "UserPosition",
        old_value: Prisma.JsonNull, // Safely satisfies the structural Json column constraint
        new_value: {
          position_name: cleanPosition,
          role_name: cleanRole,
        },
        action: "CREATE",
        changed_by_id: loggedInUser.user_id, // Satisfies non-null database constraint rule
      },
    });
    return newPosition;
  });

  clearCachePositions();
  return createdNewPosition;
};

export const positionServices = {
  createPosition,
};
