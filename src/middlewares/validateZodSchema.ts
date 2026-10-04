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


// PARAMS
export const validateZodParams = <T>(
  zodSchema: z4.ZodType<T>,
) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await zodSchema.safeParseAsync(req.params);
    if (!result.success) {
      throw new AppError(
        result.error.issues[0]?.message ?? "Invalid path parameters.",
        StatusCodes.BAD_REQUEST,
      );
    }

    req.params = result.data as any;
    next();
  });
};

// ALL
type RequestParts = Pick<Request, "body" | "query" | "params">;
const validateZodSchemaAll = <T extends RequestParts>(
  schema: z4.ZodType<T>,
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const payload = await schema.safeParseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!payload.success) {
      throw new AppError(
        payload.error.issues[0]?.message ?? "Invalid request.",
        StatusCodes.BAD_REQUEST,
      );
    }

    req.body = payload.data.body;
    req.query = payload.data.query;
    req.params = payload.data.params;
    next();
  });