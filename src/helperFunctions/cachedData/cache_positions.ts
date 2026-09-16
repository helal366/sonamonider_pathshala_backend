import { StatusCodes } from "http-status-codes";
import {
  ICachePosition,
  IRolePositionPairPayload,
} from "../../commonInterfaces/interfaces.js";
import { prisma } from "../../lib/prisma.js";
import { AppError } from "../globalError/globalErrorHelperFunction.js";

let cacheValidPositions: Promise<ICachePosition[]> | null = null;

export const getValidPositions = async (): Promise<ICachePosition[]> => {
  if (!cacheValidPositions) {
    cacheValidPositions = (async () => {
      try {
        return await prisma.userPosition.findMany({
          select: {
            id: true,
            position_name: true,
            role: { select: { role_name: true } },
          },
        });
      } catch (error) {
        cacheValidPositions = null;
        throw error;
      }
    })();
  }
  return cacheValidPositions;
};

// get position names
export const getValidPositionNames = async (): Promise<string[]> => {
  const positions = await getValidPositions();
  return positions.map((position) => position.position_name);
};

// if position update or new position create
export const clearCachePositions = (): void => {
  cacheValidPositions = null;
};

// find the provided position
export const findPositionExistence = async (position_name: string) => {
  const validPositions = await getValidPositions();
  const findPosition = validPositions.find(
    (singlePosition) => singlePosition.position_name === position_name,
  );
  return findPosition;
};

// check role position pair
export const checkRolePositionPair = async ({
  role_name,
  position_name,
}: IRolePositionPairPayload) => {
  const findPosition = await findPositionExistence(position_name);
  if (!findPosition) {
    throw new AppError(
      `Provided Position: ${position_name} is not a valid position`,
      StatusCodes.NOT_FOUND,
    );
  }
  if (findPosition.role.role_name !== role_name) {
    throw new AppError(`Role Position pair mismatch`, StatusCodes.CONFLICT);
  }
  return findPosition;
};
