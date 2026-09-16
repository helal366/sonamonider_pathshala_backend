import { StatusCodes } from "http-status-codes";
import { clearCacheRoles } from "../../helperFunctions/cachedData/cache_roles";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TCreateRoleZodSchema } from "./role.zod.validation";

const createRole = async (payload: TCreateRoleZodSchema) => {
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

  const createdNewRole = await prisma.userRole.create({
    data: {
      role_name: cleanRole,
    },
  });
  clearCacheRoles();
  return createdNewRole;
};

export const roleServices = {
  createRole,
};
