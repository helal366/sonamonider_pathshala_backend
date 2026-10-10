import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { quranicClassServices } from "./quranicClass.service.js";
import { TCreateQuranicClassZodSchema, TDeleteQuranicClassZodSchema, TGetSingleQuranicClassZodSchema, TUpdateQuranicClassZodSchema } from "./quranicClass.zodValidation.js";

// ===============================================
// CREATE QURANIC CLASS CONTROLLER
// ===============================================
const createQuranicClass = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const payload: TCreateQuranicClassZodSchema = req.body;
    const result = await quranicClassServices.createQuranicClass(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Quranic class created successfully.",
      data: result,
    });
  },
);

// ====================================================
// UPDATE QURANIC CLASS CONTROLLER
// ====================================================
const updateQuranicClass = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const payload: TUpdateQuranicClassZodSchema = req.body;
    const result = await quranicClassServices.updateQuranicClass(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic class updated successfully.",
      data: result,
    });
  },
);

// ====================================================
// DELETE QURANIC CLASS CONTROLLER
// ====================================================
const deleteQuranicClass = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const payload: TDeleteQuranicClassZodSchema = req.body;
    const result = await quranicClassServices.deleteQuranicClass(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic class deleted successfully.",
      data: result,
    });
  },
);

// =====================================================
// GET ALL QURANIC CLASSES CONTROLLER
// =====================================================
const getAllQuranicClasses = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await quranicClassServices.getAllQuranicClasses();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic classes retrieved successfully.",
      data: result,
    });
  },
);

// ======================================================
// GET SINGLE QURANIC CLASS CONTROLLER
// ======================================================
const getSingleQuranicClass = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Safely parse from your validated path params middleware mapping block
    const { quranic_class_id } = req.params as unknown as TGetSingleQuranicClassZodSchema;

    const result = await quranicClassServices.getSingleQuranicClass(quranic_class_id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic class details retrieved successfully.",
      data: result,
    });
  },
);

export const quranicClassController = {
  createQuranicClass,
  updateQuranicClass,
  deleteQuranicClass,
  getAllQuranicClasses,
  getSingleQuranicClass,
};
