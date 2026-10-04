import z4 from "zod/v4";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../helperFunctions/globalError/globalErrorHelperFunction";
import { StatusCodes } from "http-status-codes";

export const validateZodParams = <T extends Request["params"]>(
  zodSchema: z4.ZodType<T>,
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validates req.params instead of req.body
      const paramsPayload = await zodSchema.safeParseAsync(req.params); 
      if (!paramsPayload.success) {
        throw new AppError(
          paramsPayload.error.issues[0]?.message ?? "Invalid path parameters.",
          StatusCodes.BAD_REQUEST,
        );
      }
      req.params = paramsPayload.data; // Re-assigns the validated type parameters safely
      next();
    } catch (error) {
      next(error);
    }
  });
};
