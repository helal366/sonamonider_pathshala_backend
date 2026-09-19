import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { clearCacheRoles } from "../../helperFunctions/cachedData/cache_roles.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import { TCreateRoleZodSchema } from "./role.zod.validation.js";

const createRole = async (
  payload: TCreateRoleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { role_name } = payload;
  const cleanRole = role_name.trim().toUpperCase();

  const actor = await prisma.managementStaff.findUnique({
    where: { user_id: loggedInUser.user_id },
    select: { id: true },
  });

  if (!actor) {
    throw new AppError(
      "Only management staff user not found.",
      StatusCodes.FORBIDDEN,
    );
  }

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

  return prisma.$transaction(async (transaction) => {
    const createdNewRole = await transaction.userRole.create({
      data: {
        role_name: cleanRole,
        created_by: {
          connect: { id: actor.id },
        },
      },
    });

    await transaction.managementStaff.update({
      where: { id: actor.id },
      data: {
        audit_logs: {
          create: [
            {
              entity_id: createdNewRole.id,
              entity_name: "UserRole",
              old_value: Prisma.JsonNull,
              new_value: {
                role_name: cleanRole,
              },
              action: "CREATE",
            },
          ],
        },
      },
    });

    clearCacheRoles();
    return createdNewRole;
  });
};

export const roleServices = {
  createRole,
};
