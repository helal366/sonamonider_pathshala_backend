import { StatusCodes } from "http-status-codes";
import {
  checkRolePositionPair,
  findPositionExistence,
} from "../../../helperFunctions/cachedData/cache_positions.js";
import { AppError } from "../../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../../lib/prisma.js";
import {
  TChangeManagementStaffPositionZodSchema,
  TChangeManagementStaffRoleZodSchema,
} from "./managementStaff.patch.zod.validation.js";

// CHANGE ROLE
const changeManagementStaffRole = async (
  payload: TChangeManagementStaffRoleZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { full_name, mobile_number, position_name, role_name } = payload;
  const cleanPosition = position_name.trim().toUpperCase();
  const cleanRole = role_name.trim().toUpperCase();

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
      current_position: { select: { position_name: true } },
      user_primary_data: {
        select: {
          id: true,
          role: { select: { role_name: true } },
          position: { select: { position_name: true } },
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
        updated_by: {
          connect: { id: loggedInUser.user_id },
        },
        current_role: {
          connect: { id: existingRole.id },
        },
        roles: {
          connect: { id: existingRole.id },
        },
        positions: {
          connect: { id: positionExists.id },
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
            updated_by: {
              connect: { id: loggedInUser.user_id },
            },
          },
        },
      },
      omit: { user_id: true },
    });

    await transaction.user.update({
      where: { id: loggedInUser.user_id },
      data: {
        audit_logs: {
          create: [
            {
              entity_id: targetStaff.id,
              entity_name: "ManagementStaff",
              old_value: {
                current_role_name: targetStaff.current_role?.role_name ?? null,
                current_position_name:
                  targetStaff.current_position?.position_name ?? null,
              },
              new_value: {
                current_role_name: cleanRole,
                current_position_name: cleanPosition,
              },
              action: "UPDATE",
            },
            {
              entity_id: targetStaff.user_primary_data.id,
              entity_name: "User",
              old_value: {
                role_name:
                  targetStaff.user_primary_data.role?.role_name ?? null,
                position_name:
                  targetStaff.user_primary_data.position?.position_name ?? null,
              },
              new_value: {
                role_name: cleanRole,
                position_name: cleanPosition,
              },
              action: "UPDATE",
            },
          ],
        },
      },
    });

    return changedStaff;
  });
};

// CHANGE POSITION
const changeManagementStaffPosition = async (
  payload: TChangeManagementStaffPositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { full_name, mobile_number, position_name } = payload;
  const cleanPosition = position_name.trim().toUpperCase();

  const positionExists = await findPositionExistence(cleanPosition);

  if (!positionExists) {
    throw new AppError(
      `Provided Position: ${cleanPosition} is not a valid position`,
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
      current_position: { select: { position_name: true } },
      current_role: { select: { role_name: true } },
      positions: { select: { position_name: true } },
      user_primary_data: {
        select: {
          id: true,
          position: { select: { position_name: true } },
          role: { select: { role_name: true } },
        },
      },
    },
  });

  if (!targetStaff || !targetStaff.current_role) {
    throw new AppError(
      "The requested management staff does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (!targetStaff.user_primary_data) {
    throw new AppError(
      "The requested user does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const currentRoleName = targetStaff.current_role.role_name;

  await checkRolePositionPair({
    role_name: currentRoleName,
    position_name: cleanPosition,
  });
  const previousPositions = targetStaff.positions.map(
    (position) => position.position_name,
  );

  return prisma.$transaction(async (transaction) => {
    const changedStaff = await transaction.managementStaff.update({
      where: { id: targetStaff.id },
      data: {
        updated_by: {
          connect: { id: loggedInUser.user_id },
        },
        positions: {
          connect: { id: positionExists.id },
        },
        current_position: {
          connect: { id: positionExists.id },
        },
        user_primary_data: {
          update: {
            position: {
              connect: { id: positionExists.id },
            },
            updated_by: {
              connect: { id: loggedInUser.user_id },
            },
          },
        },
      },
      omit: { user_id: true },
    });

    await transaction.user.update({
      where: { id: loggedInUser.user_id },
      data: {
        audit_logs: {
          create: [
            {
              entity_id: targetStaff.id,
              entity_name: "ManagementStaff",
              old_value: {
                current_position_name:
                  targetStaff.current_position?.position_name ?? null,
                positions: previousPositions,
              },
              new_value: {
                current_position_name: cleanPosition,
                positions: [...previousPositions, cleanPosition],
              },
              action: "UPDATE",
            },
            {
              entity_id: targetStaff.user_primary_data.id,
              entity_name: "User",
              old_value: {
                position_name:
                  targetStaff.user_primary_data.position?.position_name ?? null,
              },
              new_value: { position_name: cleanPosition },
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
  changeManagementStaffPosition,
};
