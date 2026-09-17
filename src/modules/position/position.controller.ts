import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { TCreatePositionZodSchema } from "./position.zod.validation.js";
import { positionServices } from "./position.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";

const createPosition = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TCreatePositionZodSchema = req.body;
    const result = await positionServices.createPosition(payload);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: `New Position created successfully.`,
      data: result,
    });
  },
);

export const positionController = {
  createPosition,
};
