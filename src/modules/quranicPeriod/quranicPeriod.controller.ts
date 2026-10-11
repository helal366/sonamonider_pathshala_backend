import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { quranicPeriodServices } from "./quranicPeriod.service.js";
import {
  TCreateQuranicPeriodZodSchema,
  TDeleteQuranicPeriodParamsZodSchema,
  TGetSingleQuranicPeriodParamsZodSchema,
  TUpdateQuranicPeriodParamsZodSchema,
  TUpdateQuranicPeriodSingleFieldParamsZodSchema,
  TUpdateQuranicPeriodSingleFieldPayload,
  TUpdateQuranicPeriodZodSchema,
} from "./quranicPeriod.zodValidation.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";

// =============================================================
// CREATE QURANIC PERIOD CONTROLLER
// =============================================================
const createQuranicPeriod = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const payload: TCreateQuranicPeriodZodSchema = req.body;
    const result = await quranicPeriodServices.createQuranicPeriod(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Quranic period created successfully.",
      data: result,
    });
  },
);

// ========================================================
// UPDATE QURANIC PERIOD CONTROLLER
// ========================================================
const updateQuranicPeriod = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const {id} = req.params as unknown as TUpdateQuranicPeriodParamsZodSchema
    const payload: TUpdateQuranicPeriodZodSchema = req.body;
    const result = await quranicPeriodServices.updateQuranicPeriod(
      payload,
      loggedInUser,
      id
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic period updated successfully.",
      data: result,
    });
  },
);

// =========================================================
// UPDATE QURANIC SINGLE FIELD CONTROLLER
// =========================================================
const updateQuranicPeriodSingleField = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const {id} = req.params as unknown as TUpdateQuranicPeriodSingleFieldParamsZodSchema
    const payload: TUpdateQuranicPeriodSingleFieldPayload = req.body;
    const result =
      await quranicPeriodServices.updateQuranicPeriodSingleField(
        payload,
        loggedInUser,
        id
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic period field updated successfully.",
      data: result,
    });
  },
);

// =========================================================
// DELETE QURANIC PERIOD CONTROLLER
// =========================================================
const deleteQuranicPeriod = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const {id}= req.params as unknown as TDeleteQuranicPeriodParamsZodSchema;
    const result = await quranicPeriodServices.deleteQuranicPeriod(
      id,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic period deleted successfully.",
      data: result,
    });
  },
);

// =========================================================
// GET ALL QURANIC PERIODS CONTROLLER
// =========================================================
const getAllQuranicPeriods = catchAsync(
  async (req: Request, res: Response) => {
    helperFunctions.requiredUser(req);
    const result = await quranicPeriodServices.getAllQuranicPeriods();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic periods retrieved successfully.",
      data: result,
    });
  },
);

// ===========================================================
// GET SINGLE QURANIC PERIOD CONTROLLER
// ===========================================================
const getSingleQuranicPeriod = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Safely parse from your validated path params middleware mapping block
    const { id } =
      req.params as unknown as TGetSingleQuranicPeriodParamsZodSchema;

    const result = await quranicPeriodServices.getSingleQuranicPeriod(
      id,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic  period details retrieved successfully.",
      data: result,
    });
  },
);

export const quranicPeriodController = {
  createQuranicPeriod,
  updateQuranicPeriod,
  deleteQuranicPeriod,
  getAllQuranicPeriods,
  getSingleQuranicPeriod,
  updateQuranicPeriodSingleField,
};
