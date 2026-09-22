import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { sendResponse } from "../../utils/sendResponse";

import {
  TDisconnectFatherDetailsZodSchema,
} from "./fatherDetails.zod.validation";
import { fatherDetailsDeleteServices } from "./fatherDetails.delete.service";


/**
 * ======================================================
 * DELETE FATHER NID
 * ======================================================
 */
const deleteFatherNid = catchAsync(
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
      await fatherDetailsDeleteServices.deleteFatherNid(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father NID deleted successfully.",
      data: result,
    });
  },
);


/**
 * ======================================================
 * DELETE FATHER OCCUPATION
 * ======================================================
 */
const deleteFatherOccupation = catchAsync(
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
      await fatherDetailsDeleteServices.deleteFatherOccupation(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father occupation deleted successfully.",
      data: result,
    });
  },
);


/**
 * ======================================================
 * DELETE FATHER JOB TITLE
 * ======================================================
 */
const deleteFatherJobTitle = catchAsync(
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
      await fatherDetailsDeleteServices.deleteFatherJobTitle(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father job title deleted successfully.",
      data: result,
    });
  },
);


/**
 * ======================================================
 * DELETE FATHER EDUCATIONAL QUALIFICATION
 * ======================================================
 */
const deleteFatherEducationalQualification = catchAsync(
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
      await fatherDetailsDeleteServices.deleteFatherEducationalQualification(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father educational qualification deleted successfully.",
      data: result,
    });
  },
);


/**
 * ======================================================
 * DELETE FATHER MONTHLY INCOME
 * ======================================================
 */
const deleteFatherMonthlyIncome = catchAsync(
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
      await fatherDetailsDeleteServices.deleteFatherMonthlyIncome(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father monthly income deleted successfully.",
      data: result,
    });
  },
);


/**
 * ======================================================
 * DELETE FATHER MOBILE NO 1
 * ======================================================
 */
const deleteFatherMobileNo1 = catchAsync(
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
      await fatherDetailsDeleteServices.deleteFatherMobileNo1(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father mobile number 1 deleted successfully.",
      data: result,
    });
  },
);


/**
 * ======================================================
 * DELETE FATHER MOBILE NO 2
 * ======================================================
 */
const deleteFatherMobileNo2 = catchAsync(
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
      await fatherDetailsDeleteServices.deleteFatherMobileNo2(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father mobile number 2 deleted successfully.",
      data: result,
    });
  },
);


/**
 * ======================================================
 * DELETE FATHER MOBILE NO 3
 * ======================================================
 */
const deleteFatherMobileNo3 = catchAsync(
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
      await fatherDetailsDeleteServices.deleteFatherMobileNo3(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father mobile number 3 deleted successfully.",
      data: result,
    });
  },
);


export const fatherDetailsDeleteController = {
  deleteFatherNid,
  deleteFatherOccupation,
  deleteFatherJobTitle,
  deleteFatherEducationalQualification,
  deleteFatherMonthlyIncome,
  deleteFatherMobileNo1,
  deleteFatherMobileNo2,
  deleteFatherMobileNo3,
};