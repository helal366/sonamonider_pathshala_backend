import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import {
  clearCachePositions,
  findPositionExistence,
} from "../../helperFunctions/cachedData/cache_positions.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreatePositionZodSchema,
  TUpdatePositionZodSchema,
} from "./position.zod.validation.js";
import { findRoleExistence } from "../../helperFunctions/cachedData/cache_roles.js";

// CREATE POSITION SERVICE LAYER
const createPosition = async (
  payload: TCreatePositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { position_name, role_name } = payload;

  const cleanPosition = position_name.trim().toUpperCase();
  const cleanRole = role_name.trim().toUpperCase();

  // 1. Verify if the position name already exists to prevent duplicates
  const existingPosition = await findPositionExistence(cleanPosition);
  if (existingPosition) {
    throw new AppError(
      `Your provided position : ${cleanPosition} already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  // 2. Verify that the role exists in the master database
  const existingRole = await findRoleExistence(cleanRole);
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

// UPATE POSITION SERVICE LAYER
const updatePosition = async (
  payload: TUpdatePositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { present_position_name, update_position_name } = payload;
  const cleanPresentPositionName = present_position_name.trim().toUpperCase();
  const cleanUpdatePositionName = update_position_name.trim().toUpperCase();

  // 1. Check present position name and update position name are same or not.
  if (cleanPresentPositionName === cleanUpdatePositionName) {
    throw new AppError(
      `Provided update position ${cleanUpdatePositionName}  is same as present position ${cleanPresentPositionName}`,
      StatusCodes.CONFLICT,
    );
  }

  //  2. Verify if the position name already exists or not.
  const existingPosition = await findPositionExistence(
    cleanPresentPositionName,
  );
  if (!existingPosition) {
    throw new AppError(
      `Provided present position ${cleanPresentPositionName} does not exists.`,
      StatusCodes.NOT_FOUND,
    );
  }

  //  3. Update position name and create audit log
  const updatedPositionResult = await prisma.$transaction(
    async (transaction) => {
      // 3a. Update the position
      const updatedPosition = await transaction.userPosition.update({
        where: { id: existingPosition.id },
        data: {
          position_name: cleanUpdatePositionName,
          updated_by_id: loggedInUser.user_id,
        },
      });

      // 3b. Create audit log
      await transaction.auditLog.create({
        data: {
          entity_id: updatedPosition.id,
          entity_name: "User Position",
          old_value: {
            position_name: cleanPresentPositionName,
          },
          new_value: {
            position_name: cleanUpdatePositionName,
          },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      });
      return updatedPosition;
    },
  );
  // 🚀 🆕 4. Invalidate memory cache values upon safe transaction complete execution
  clearCachePositions();
  return updatedPositionResult;
};

export const positionServices = {
  createPosition,
  updatePosition,
};
