import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { clearCacheRoles } from "../../helperFunctions/cachedData/cache_roles.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import { TCreateRoleZodSchema } from "./role.zod.validation.js";

const createRole = async (
  payload: TCreateRoleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]> ,
) => {
  const { role_name } = payload;
  const cleanRole = role_name.trim().toUpperCase();

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
