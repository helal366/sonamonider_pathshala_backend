import { StatusCodes } from "http-status-codes";
import {
  checkRolePositionPair,
  findPositionExistence,
} from "../../helperFunctions/cachedData/cache_positions.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";


export const managementStaffPatchServices = {
};
