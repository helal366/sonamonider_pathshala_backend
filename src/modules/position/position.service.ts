import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { findRoleExistence } from "../../helperFunctions/cachedData/cache_roles.js";
import { prisma } from "../../lib/prisma.js";
import {
  clearCachePositions,
  findPositionExistence,
  getValidPositionNames,
} from "../../helperFunctions/cachedData/cache_positions.js";
import {
  TCreatePositionZodSchema,
  TDeletePositionZodSchema,
  TUpdatePositionZodSchema,
} from "./position.zod.validation.js";

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


// DELETE POSITION SERVICE LAYER
const deletePosition=async(
  payload: TDeletePositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
)=>{
  const {position_name} = payload;
  const cleanPositionName = position_name.trim().toUpperCase();

  // 1. Verify if the position exists and count current active structural occupants
  const existingPosition = await prisma.userPosition.findUnique({
    where: { position_name: cleanPositionName },
    include: {
      _count: {
        select: {
          user: { where: { is_deleted: false } }, // Counts active, non-soft-deleted users
          current_management_staffs: { where: { is_currently_active_staff: true } },
          management_promoted_history: true // Counts historical tracking dependencies
        }
      }
    }
  });

  if (!existingPosition) {
    throw new AppError(
      `Provided position name: ${cleanPositionName} does not exist.`, // Fixed typo "exists"
      StatusCodes.NOT_FOUND
    );
  }

   // 🚀 2. CRITICAL SAFETY GUARD: Prevent cascading relationship database crashes
   if (
    existingPosition._count.user > 0 || 
    existingPosition._count.current_management_staffs > 0 ||
    existingPosition._count.management_promoted_history > 0
  ) {
    throw new AppError(
      `Cannot hard delete Position: ${cleanPositionName}. It is currently assigned to active employees or referenced in past promotion histories.`,
      StatusCodes.CONFLICT
    );
  }

   // 3. Perform the secure direct hard delete and write log trace atomically
  const hardDeletePositionResult = await prisma.$transaction(async(transaction)=>{
    const hardDeletePosition = await transaction.userPosition.delete({
      where: {id: existingPosition.id},
    });

    await transaction.auditLog.create({
      data: {
        entity_id: existingPosition.id,
        entity_name: "UserPosition",
        old_value: {position_name: cleanPositionName},
        new_value: Prisma.JsonNull,
        action: "DELETE",
        changed_by_id: loggedInUser.user_id
      }
    })
    return hardDeletePosition
  });
  // 4. Invalidate structural performance caches immediately
  clearCachePositions();
  return hardDeletePositionResult;
};


// GET ALL POSITIONS SERVICE LAYER
const getAllPositions=async(
)=>{
  const allPositionsArray = await getValidPositionNames();
  return allPositionsArray;
};


// GET SINGLE POSITION SERVICE LAYER
const getSinglePosition=async(id:string)=>{
  const position = await prisma.userPosition.findUnique({
    where: { id },
    select: {
      id: true,
      position_name: true,
      role_name: true,
      created_at: true,
      updated_at: true,
      // Aggregates structural counts safely
      _count: {
        select: {
          user: { where: { is_deleted: false } }, // Active, non-soft-deleted users
          current_management_staffs: { where: { is_currently_active_staff: true } },
        },
      },
    },
  });

  if (!position) {
    throw new AppError(
      `Requested Position with ID: ${id} does not exist inside the database system.`,
      StatusCodes.NOT_FOUND,
    );
  };

  return position
}
export const positionServices = {
  createPosition,
  updatePosition,
  deletePosition,
  getAllPositions,
  getSinglePosition
};
