import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { standardStudentFeeRateServices } from "./standardStudentFeeRate.service.js";
import {
  TStandardStudentFeeRateClassIdParamsZodSchema,
  TStandardStudentFeeRateIdParamsZodSchema,
  TCreateStandardStudentFeeRateZodSchema,
  TUpdateStandardStudentFeeRateFieldZodSchema,
} from "./standardStudentFeeRate.zodValidation.js";

const createStandardStudentFeeRate = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateStandardStudentFeeRateZodSchema;
    const result =
      await standardStudentFeeRateServices.createStandardStudentFeeRate(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Standard student fee rate created successfully.",
      data: result,
    });
  },
);

const updateStandardStudentFeeRateField = catchAsync(
  async (
    req: Request<TStandardStudentFeeRateIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateStandardStudentFeeRateFieldZodSchema;
    const result =
      await standardStudentFeeRateServices.updateStandardStudentFeeRateField(
        req.params.id,
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Standard student fee rate updated successfully.",
      data: result,
    });
  },
);

const deleteStandardStudentFeeRate = catchAsync(
  async (
    req: Request<TStandardStudentFeeRateIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result =
      await standardStudentFeeRateServices.deleteStandardStudentFeeRate(
        req.params.id,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Standard student fee rate deleted successfully.",
      data: result,
    });
  },
);

const getAllStandardStudentFeeRates = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result =
      await standardStudentFeeRateServices.getAllStandardStudentFeeRates(
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Standard student fee rates retrieved successfully.",
      data: result,
    });
  },
);

const getStandardStudentFeeRatesByClassId = catchAsync(
  async (
    req: Request<TStandardStudentFeeRateClassIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result =
      await standardStudentFeeRateServices.getStandardStudentFeeRatesByClassId(
        req.params.class_id,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Standard student fee rates retrieved successfully.",
      data: result,
    });
  },
);

export const standardStudentFeeRateController = {
  createStandardStudentFeeRate,
  updateStandardStudentFeeRateField,
  deleteStandardStudentFeeRate,
  getAllStandardStudentFeeRates,
  getStandardStudentFeeRatesByClassId,
};
