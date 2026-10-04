import z4 from "zod/v4";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../utils/catchAsync.js";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../helperFunctions/globalError/globalErrorHelperFunction.js";

export const validateZodSchema = (zodSchema: z4.ZodType) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = req.body || {};
      const result = zodSchema.safeParse(payload);
      if (!result.success) {
        throw new AppError(
          result.error.issues[0]?.message ?? "Invalid request body.",
          StatusCodes.BAD_REQUEST,
        );
      }
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  });
};
