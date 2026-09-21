import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { StatusCodes } from "http-status-codes";
import { TConnectFatherDetailsZodSchema, TCreateFatherDetailsZodSchema } from "./fatherDetails.zod.validation";
import { fatherDetailsServices } from "./fatherDetails.service";
import { sendResponse } from "../../utils/sendResponse";

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
      statusCode: StatusCodes.CREATED,
      message: "Father details created successfully.",
      data: result,
    });
  },
);
export const fatherDetailsController = {
  createFatherDetails,
  connectFatherDetails
};
