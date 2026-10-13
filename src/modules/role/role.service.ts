import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import {
  clearCacheRoles,
  getValidRoleNames,
} from "../../helperFunctions/cachedData/cache_roles.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateRoleZodSchema,
  TDeleteRoleParamsZodSchema,
  TUpdateRoleZodSchema,
} from "./role.zodValidation.js";
// ===============================================
// CREATE ROLE SERVICE LAYER
// ===============================================
const createRole = async (
  payload: TCreateRoleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { role_name } = payload;
  const cleanRole = role_name.trim().toUpperCase();

  // 1. Check whether the role name already exists to prevent duplication
  const checkExistence = await prisma.userRole.findUnique({
    where: { role_name: cleanRole },
    select: { id: true },
  });
  if (checkExistence) {
    throw new AppError(
      `The role "${cleanRole}" already exists.`,
      StatusCodes.CONFLICT,
    );
  }

  // 2. Execute record creation inside an atomic transaction block
  const createdNewRole = await prisma.$transaction(async (transaction) => {
    // A) Insert the new role directly into the master table
    const newRole = await transaction.userRole.create({
      data: {
        role_name: cleanRole,
        created_by: {
          connect: { id: loggedInUser.user_id },
        },
      },
    });

    // 🚀 B) FIXED: Direct high-performance Audit Log write passing mandatory changed_by_id and Prisma.JsonNull
    await transaction.auditLog.create({
      data: {
        entity_id: newRole.id,
        entity_name: "userRole",
        old_value: Prisma.JsonNull, // Expresses empty state for a new record safely
        new_value: {
          role_name: cleanRole,
        },
        action: "CREATE",
        changed_by_id: loggedInUser.user_id, // Satisfies non-null database schema constraint
      },
    });

    return newRole;
  });

  clearCacheRoles();
  return createdNewRole;
};

// ===============================================
// UPDATE ROLE SERVICE LAYER
// ===============================================
const updateRole = async (
  payload: TUpdateRoleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { current_role_name, new_role_name } = payload;

  const cleanCurrentRole = current_role_name.trim().toUpperCase();
  const cleanNewRole = new_role_name.trim().toUpperCase();

  // Check the similarity of new and old roles
  if (cleanCurrentRole === cleanNewRole) {
    throw new AppError(
      "The new role name must be different from the current role name.",
      StatusCodes.BAD_REQUEST,
    );
  }

  // Check whether current role exists
  const currentRole = await prisma.userRole.findUnique({
    where: {
      role_name: cleanCurrentRole,
    },
    select: {
      id: true,
      role_name: true,
    },
  });

  if (!currentRole) {
    throw new AppError(
      `Role: ${current_role_name} does not exist.`,
      StatusCodes.NOT_FOUND,
    );
  }

  // Check whether new role name already exists
  const newRoleExists = await prisma.userRole.findUnique({
    where: {
      role_name: cleanNewRole,
    },
    select: {
      id: true,
    },
  });

  if (newRoleExists) {
    throw new AppError(
      `Role: ${new_role_name} already exists.`,
      StatusCodes.CONFLICT,
    );
  }
  const updatedRole = await prisma.$transaction(async (transaction) => {
    // A) Update the role text directly in the master table
    const updatedRole = await transaction.userRole.update({
      where: {
        id: currentRole.id,
      },
      data: {
        role_name: cleanNewRole,

        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    // 🚀 B) FIXED: Direct high-performance Audit Log write passing mandatory changed_by_id
    await transaction.auditLog.create({
      data: {
        entity_id: updatedRole.id,
        entity_name: "userRole",
        old_value: {
          role_name: cleanCurrentRole,
        },
        new_value: {
          role_name: cleanNewRole,
        },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id, // Satisfies non-null database constraint
      },
    });

    return updatedRole;
  });

  // 4. Invalidate memory cache on successful execution finish
  clearCacheRoles();

  return updatedRole;
};

// ===============================================
// DELETE ROLE SERVICE LAYER
// ===============================================
const deleteRole = async (
  role_id: string,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const cleanRoleId = role_id.trim();

  // 1. Verify target role exists and check if any active users occupy it
  const existingRole = await prisma.userRole.findUnique({
    where: { id: cleanRoleId },
    include: {
      _count: {
        select: {
          user: true,
        },
      },
    },
  });

  if (!existingRole) {
    throw new AppError(`Proviced role does not exists`, StatusCodes.NOT_FOUND);
  }

  // 2. Block deletion if active personnel are assigned to this role
  if (existingRole._count.user > 0) {
    throw new AppError(
      `Cannot delete role "${existingRole.role_name}" because users are still assigned to it.`,
      StatusCodes.CONFLICT,
    );
  }

  // 3. Atomically execute soft-delete update and write audit trace logs
  const deletionResult = await prisma.$transaction(async (transaction) => {
    const hardDeletedRole = await transaction.userRole.delete({
      where: { id: existingRole.id },
    });

    // Write deletion action down into structural Audit Logs database model
    await transaction.auditLog.create({
      data: {
        entity_id: existingRole.id,
        entity_name: "userRole",
        old_value: { role_name: existingRole.role_name },
        new_value: Prisma.JsonNull, // Expresses final status value state removal clearly
        action: "DELETE",
        changed_by_id: loggedInUser.user_id, // Satisfies non-null database constraint rule
      },
    });

    return hardDeletedRole;
  });

  // 4. Invalidate structural performance caches immediately
  clearCacheRoles();

  return deletionResult;
};

// ===========================================
// GET ALL ROLE NAMES SERVICE LAYER
// ===========================================
const getAllRoleNames = async (): Promise<string[]> => {
  // Invokes your custom caching promise mechanism cleanly
  const roleNamesArray = await getValidRoleNames();

  return roleNamesArray;
};

// =================================================
// GET SINGLE ROLE SERVICE LAYER
// =================================================
const getSingleRole = async (id: string) => {
  const role = await prisma.userRole.findUnique({
    where: { id },
    select: {
      id: true,
      role_name: true,
      created_at: true,
      updated_at: true,
      // Aggregates structural counts safely
      _count: {
        select: {
          user: true, 
          current_management_staffs: true,
          current_academic_staffs: true,
          current_students: true,
          current_governing_bodies: true,
        },
      },
    },
  });

  if (!role) {
    throw new AppError(
      `Requested Role with ID: ${id} does not exist inside the database system.`,
      StatusCodes.NOT_FOUND,
    );
  }

  return role;
};


export const roleServices = {
  createRole,
  updateRole,
  deleteRole,
  getAllRoleNames,
  getSingleRole,
};
