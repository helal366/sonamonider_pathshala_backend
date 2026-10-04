import z4 from "zod/v4";
import { StatusCodes } from "http-status-codes";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../utils/catchAsync.js";

type RequestParts = Pick<Request, "body" | "query" | "params">;

export const validateZodSchemaAll = <T extends RequestParts>(
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
