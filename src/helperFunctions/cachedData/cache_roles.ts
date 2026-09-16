import { prisma } from "../../lib/prisma.js";

export interface ICacheRole {
  id: string;
  role_name: string;
}

let cacheValidRoles: Promise<ICacheRole[]> | null = null;
export const getValidRoles = async (): Promise<ICacheRole[]> => {
  if (!cacheValidRoles) {
    cacheValidRoles = (async () => {
      try {
        return await prisma.userRole.findMany({
          select: { id: true, role_name: true },
        });
      } catch (error) {
        cacheValidRoles = null;
        throw error;
      }
    })();
  }
  return cacheValidRoles;
};

// get valid role names
export const getValidRoleNames = async (): Promise<string[]> => {
  const rolesFromDB = await getValidRoles();
  return rolesFromDB.map((role) => role.role_name);
};

// if role update or create new role
export const clearCacheRoles = (): void => {
  cacheValidRoles = null;
};

// find the provided role
export const findRoleExistence = async (role_name: string) => {
  const validRoles = await getValidRoles();
  const findRole = validRoles.find(
    (singleRole) => singleRole.role_name === role_name,
  );
  return findRole;
};
