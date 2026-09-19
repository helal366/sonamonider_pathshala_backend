import { StatusCodes } from "http-status-codes";
import { checkRolePositionPair } from "../../../helperFunctions/cachedData/cache_positions.js";
import { AppError } from "../../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../../lib/prisma.js";
import { TChangeManagementStaffRoleZodSchema } from "./managementStaff.patch.zod.validation.js";

const changeManagementStaffRole = async (
  payload: TChangeManagementStaffRoleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { full_name, mobile_number, position_name, role_name } = payload;
  const cleanPosition = position_name.trim().toUpperCase();
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

  const targetStaff = await prisma.managementStaff.findUnique({
    where: {
      management_full_name_mobile_unique: {
        full_name,
        mobile_number,
      },
    },
    select: {
      id: true,
      current_role: { select: { role_name: true } },
      user_primary_data: {
        select: {
          id: true,
          role: { select: { role_name: true } },
        },
      },
    },
  });

  if (!targetStaff) {
    throw new AppError(
      "The requested management staff does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const positionExists = await checkRolePositionPair({
    role_name: cleanRole,
    position_name: cleanPosition,
  });

  return prisma.$transaction(async (transaction) => {
    const changedStaff = await transaction.managementStaff.update({
      where: { id: targetStaff.id },
      data: {
        current_role: {
          connect: { id: existingRole.id },
        },
        roles: {
          connect: { id: existingRole.id },
        },
        current_position: {
          connect: { id: positionExists.id },
        },
        user_primary_data: {
          update: {
            role: {
              connect: { role_name: cleanRole },
            },
            position: {
              connect: { id: positionExists.id },
            },
          },
        },
      },
      omit: { user_id: true },
    });

    await transaction.managementStaff.update({
      where: { id: actor.id },
      data: {
        audit_logs: {
          create: [
            {
              entity_id: targetStaff.id,
              entity_name: "ManagementStaff",
              old_value: {
                role_name: targetStaff.current_role?.role_name ?? null,
              },
              new_value: { role_name: cleanRole },
              action: "UPDATE",
            },
            {
              entity_id: targetStaff.user_primary_data.id,
              entity_name: "User",
              old_value: {
                role_name:
                  targetStaff.user_primary_data.role?.role_name ?? null,
              },
              new_value: { role_name: cleanRole },
              action: "UPDATE",
            },
          ],
        },
      },
    });

    return changedStaff;
  });
};

export const managementStaffPatchServices = {
  changeManagementStaffRole,
};
