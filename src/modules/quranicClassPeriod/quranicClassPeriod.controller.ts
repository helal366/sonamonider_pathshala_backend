import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { quranicClassPeriodServices } from "./quranicClassPeriod.service.js";
import { 
  TCreateQuranicClassPeriodZodSchema, 
  TDeleteQuranicClassPeriodZodSchema, 
  TGetSingleQuranicClassPeriodZodSchema, 
  TUpdateQuranicClassPeriodSingleFieldPayload, 
  TUpdateQuranicClassPeriodZodSchema 
} from "./quranicClassPeriod.zodValidation.js";

// CREATE QURANIC CLASS PERIOD CONTROLLER
const createQuranicClassPeriod = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const payload: TCreateQuranicClassPeriodZodSchema = req.body;
    const result = await quranicClassPeriodServices.createQuranicClassPeriod(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Quranic class period created successfully.",
      data: result,
    });
  },
);

// ========================================================
// UPDATE QURANIC CLASS PERIOD CONTROLLER
// ========================================================
const updateQuranicClassPeriod = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const payload: TUpdateQuranicClassPeriodZodSchema = req.body;
    const result = await quranicClassPeriodServices.updateQuranicClassPeriod(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic class period updated successfully.",
      data: result,
    });
  },
);

// =========================================================
// UPDATE QURANIC CLASS SINGLE FIELD CONTROLLER
// =========================================================
const updateQuranicClassPeriodSingleField = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateQuranicClassPeriodSingleFieldPayload = req.body;
    const result = await quranicClassPeriodServices.updateQuranicClassPeriodSingleField(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic class period field updated successfully.",
      data: result,
    });
  },
);

// =========================================================
// DELETE QURANIC CLASS PERIOD CONTROLLER
// =========================================================
const deleteQuranicClassPeriod = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TDeleteQuranicClassPeriodZodSchema = req.body;
    const result = await quranicClassPeriodServices.deleteQuranicClassPeriod(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic class period deleted successfully.",
      data: result,
    });
  },
);

// GET ALL QURANIC CLASS PERIODS CONTROLLER
const getAllQuranicClassPeriods = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await quranicClassPeriodServices.getAllQuranicClassPeriods();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic class periods retrieved successfully.",
      data: result,
    });
  },
);

// GET SINGLE QURANIC CLASS PERIOD CONTROLLER
const getSingleQuranicClassPeriod = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Safely parse from your validated path params middleware mapping block
    const { quranic_class_period_id } = req.params as unknown as TGetSingleQuranicClassPeriodZodSchema;

    const result = await quranicClassPeriodServices.getSingleQuranicClassPeriod(quranic_class_period_id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic class period details retrieved successfully.",
      data: result,
    });
  },
);

export const quranicClassPeriodController = {
  createQuranicClassPeriod,
  updateQuranicClassPeriod,
  deleteQuranicClassPeriod,
  getAllQuranicClassPeriods,
  getSingleQuranicClassPeriod,
  updateQuranicClassPeriodSingleField
};
