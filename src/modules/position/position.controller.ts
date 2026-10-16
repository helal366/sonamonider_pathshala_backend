import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  TCreatePositionZodSchema,
  TDeletePositionZodSchema,
  TGetSinglePositionParamsZodSchema,
  TUpdatePositionZodSchema,
} from "./position.zodValidation.js";
import { positionServices } from "./position.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
// ==================================================
// CREATE POSITION CONTROLLER
// ==================================================
const createPosition = catchAsync(async (req: Request, res: Response) => {
  const loggedInUser = helperFunctions.requiredUser(req);
  const payload: TCreatePositionZodSchema = req.body;
  const result = await positionServices.createPosition(payload, loggedInUser);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: `New Position created successfully.`,
    data: result,
  });
});

// ===================================================
// UPDATE POSITION CONTROLLER
// ===================================================
const updatePosition = catchAsync(async (req: Request, res: Response) => {
  const loggedInUser = helperFunctions.requiredUser(req);
  const payload: TUpdatePositionZodSchema = req.body;
  const result = await positionServices.updatePosition(payload, loggedInUser);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Position updated successfully.`,
    data: result,
  });
});

// ===================================================
// DELETE POSITION CONTROLLER
// ===================================================
const deletePosition = catchAsync(async (req: Request, res: Response) => {
  const loggedInUser = helperFunctions.requiredUser(req);
  const payload: TDeletePositionZodSchema = req.body;
  const result = await positionServices.deletePosition(payload, loggedInUser);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Position purged and deleted successfully.`,
    data: result,
  });
});

// ===================================================
// GET ALL POSITIONS CONTROLLER
// ===================================================
const getAllPositions = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await positionServices.getAllPositions();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Positions retrived successfully.`,
    data: result,
  });
});

// ===================================================
// GET SINGLE POSITION CONTROLLER
// ===================================================
const getSinglePosition = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params as unknown as TGetSinglePositionParamsZodSchema;

  const result = await positionServices.getSinglePosition(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Position retrieved successfully.`,
    data: result,
  });
});
export const positionController = {
  createPosition,
  updatePosition,
  deletePosition,
  getAllPositions,
  getSinglePosition,
};
