import { StatusCodes } from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../../utils/sendResponse.js";
import { fatherDetailsPatchServices } from "./fatherDetails.patch.service.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import {
    TUpdateFatherNameZodSchema,
    TUpdateFatherNidZodSchema,
    TUpdateFatherOccupationZodSchema,
    TUpdateFatherJobTitleZodSchema,
    TUpdateFatherEducationalQualificationZodSchema,
    TUpdateFatherMonthlyIncomeZodSchema,
    TUpdateFatherMobileNo1ZodSchema,
    TUpdateFatherMobileNo2ZodSchema,
    TUpdateFatherMobileNo3ZodSchema,
} from "./fatherDetails.zod.validation.js";


// ======================================================
// UPDATE FATHER NAME
// ======================================================
const updateFatherName = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateFatherNameZodSchema = req.body;

    const result =
      await fatherDetailsPatchServices.updateFatherName(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father name updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE FATHER NID
// ======================================================

const updateFatherNid = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateFatherNidZodSchema = req.body;

    const result =
      await fatherDetailsPatchServices.updateFatherNid(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father NID updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE FATHER OCCUPATION
// ======================================================

const updateFatherOccupation = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateFatherOccupationZodSchema = req.body;

    const result =
      await fatherDetailsPatchServices.updateFatherOccupation(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father occupation updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE FATHER JOB TITLE
// ======================================================

const updateFatherJobTitle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateFatherJobTitleZodSchema = req.body;

    const result =
      await fatherDetailsPatchServices.updateFatherJobTitle(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father job title updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE FATHER EDUCATIONAL QUALIFICATION
// ======================================================

const updateFatherEducationalQualification = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateFatherEducationalQualificationZodSchema =
      req.body;

    const result =
      await fatherDetailsPatchServices.updateFatherEducationalQualification(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        "Father educational qualification updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE FATHER MONTHLY INCOME
// ======================================================

const updateFatherMonthlyIncome = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateFatherMonthlyIncomeZodSchema = req.body;

    const result =
      await fatherDetailsPatchServices.updateFatherMonthlyIncome(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father monthly income updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE FATHER MOBILE NO 1
// ======================================================

const updateFatherMobileNo1 = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateFatherMobileNo1ZodSchema = req.body;

    const result =
      await fatherDetailsPatchServices.updateFatherMobileNo1(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father mobile number 1 updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE FATHER MOBILE NO 2
// ======================================================

const updateFatherMobileNo2 = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateFatherMobileNo2ZodSchema = req.body;

    const result =
      await fatherDetailsPatchServices.updateFatherMobileNo2(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father mobile number 2 updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE FATHER MOBILE NO 3
// ======================================================

const updateFatherMobileNo3 = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TUpdateFatherMobileNo3ZodSchema = req.body;

    const result =
      await fatherDetailsPatchServices.updateFatherMobileNo3(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Father mobile number 3 updated successfully.",
      data: result,
    });
  },
);

export const fatherDetailsPatchController = {

  updateFatherName,
  updateFatherNid,
  updateFatherOccupation,
  updateFatherJobTitle,
  updateFatherEducationalQualification,
  updateFatherMonthlyIncome,
  updateFatherMobileNo1,
  updateFatherMobileNo2,
  updateFatherMobileNo3,
};