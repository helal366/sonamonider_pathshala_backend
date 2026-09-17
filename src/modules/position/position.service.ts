import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { clearCachePositions } from "../../helperFunctions/cachedData/cache_positions.js";
import { prisma } from "../../lib/prisma.js";
import { TCreatePositionZodSchema } from "./position.zod.validation.js";

const createPosition = async (payload: TCreatePositionZodSchema) => {
  const { position_name, role_name } = payload;

  const cleanPosition = position_name.trim().toUpperCase();
  const cleanRole = role_name.trim().toUpperCase();

  const existingPosition = await prisma.userPosition.findUnique({
    where: { position_name: cleanPosition },
    select: { id: true },
  });
  if (existingPosition) {
    throw new AppError(
      `Your provided position : ${cleanPosition} already exists.`,
      StatusCodes.CONFLICT,
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

  const createdNewPosition = await prisma.userPosition.create({
    data: {
      position_name: cleanPosition,
      role: {
        connect: { id: existingRole.id },
      },
    },
  });

  clearCachePositions();
  return createdNewPosition;
};

export const positionServices = {
  createPosition,
};
