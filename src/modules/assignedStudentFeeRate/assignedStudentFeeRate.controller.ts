import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { assignedStudentFeeRateServices } from "./assignedStudentFeeRate.service.js";
import {
  TAssignedStudentFeeRateClassIdParamsZodSchema,
  TAssignedStudentFeeRateIdParamsZodSchema,
  TCreateAssignedStudentFeeRateZodSchema,
  TUpdateAssignedStudentFeeRateFieldZodSchema,
} from "./assignedStudentFeeRate.zodValidation.js";

const createAssignedStudentFeeRate = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateAssignedStudentFeeRateZodSchema;
    const result = await assignedStudentFeeRateServices.createAssignedStudentFeeRate(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Assigned student fee rate created successfully.",
      data: result,
    });
  },
);

const updateAssignedStudentFeeRateField = catchAsync(
  async (
    req: Request<TAssignedStudentFeeRateIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateAssignedStudentFeeRateFieldZodSchema;
    const result =
      await assignedStudentFeeRateServices.updateAssignedStudentFeeRateField(
        req.params.id,
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Assigned student fee rate updated successfully.",
      data: result,
    });
  },
);

const deleteAssignedStudentFeeRate = catchAsync(
  async (
    req: Request<TAssignedStudentFeeRateIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result =
      await assignedStudentFeeRateServices.deleteAssignedStudentFeeRate(
        req.params.id,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Assigned student fee rate deleted successfully.",
      data: result,
    });
  },
);

const getAllAssignedStudentFeeRates = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result =
      await assignedStudentFeeRateServices.getAllAssignedStudentFeeRates(
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Assigned student fee rates retrieved successfully.",
      data: result,
    });
  },
);

const getAssignedStudentFeeRatesByClassId = catchAsync(
  async (
    req: Request<TAssignedStudentFeeRateClassIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result =
      await assignedStudentFeeRateServices.getAssignedStudentFeeRatesByClassId(
        req.params.class_id,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Assigned student fee rates retrieved successfully.",
      data: result,
    });
  },
);

export const assignedStudentFeeRateController = {
  createAssignedStudentFeeRate,
  updateAssignedStudentFeeRateField,
  deleteAssignedStudentFeeRate,
  getAllAssignedStudentFeeRates,
  getAssignedStudentFeeRatesByClassId,
};
