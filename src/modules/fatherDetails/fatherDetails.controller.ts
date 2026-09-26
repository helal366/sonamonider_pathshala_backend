import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";

import {
  TConnectFatherDetailsZodSchema,
  TCreateFatherDetailsZodSchema,
  TDisconnectFatherDetailsZodSchema,
} from "./fatherDetails.zod.validation.js";

import { fatherDetailsServices } from "./fatherDetails.service.js";
import { sendResponse } from "../../utils/sendResponse.js";

// ======================================================
// CREATE FATHER DETAILS
// ======================================================

const createFatherDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TCreateFatherDetailsZodSchema = req.body;

    const result = await fatherDetailsServices.createFatherDetails(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Father details created successfully.",
      data: result,
    });
  },
);

// ======================================================
// CONNECT FATHER DETAILS
// ======================================================

const connectFatherDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TConnectFatherDetailsZodSchema = req.body;

    const result =
      await fatherDetailsServices.connectFatherDetails(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father details connected successfully.",
      data: result,
    });
  },
);


// ======================================================
// DISCONNECT FATHER DETAILS
// ======================================================
const disconnectFatherDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError(
        "Please login.",
        StatusCodes.UNAUTHORIZED,
      );
    }

    const payload: TDisconnectFatherDetailsZodSchema = req.body;

    const result =
      await fatherDetailsServices.disconnectFatherDetails(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father details disconnected successfully.",
      data: result,
    });
  },
);

// ======================================================
// EXPORT
// ======================================================

export const fatherDetailsController = {
  createFatherDetails,
  connectFatherDetails,
  disconnectFatherDetails,
};