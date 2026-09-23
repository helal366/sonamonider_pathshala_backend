import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { clearCacheRoles } from "../../helperFunctions/cachedData/cache_roles.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateRoleZodSchema,
  TUpdateRoleZodSchema,
} from "./role.zod.validation.js";

// CREATE ROLE POST ROUTE
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
      `Your provided role : ${cleanRole} already exixts.`,
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
        entity_name: "UserRole",
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

// UPDATE ROLE PATCH ROUTE
const updateRole = async (
  payload: TUpdateRoleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { current_role_name, new_role_name } = payload;

  const cleanCurrentRole = current_role_name.trim().toUpperCase();
  const cleanNewRole = new_role_name.trim().toUpperCase();

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
        entity_name: "UserRole",
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

export const roleServices = {
  createRole,
  updateRole,
};
