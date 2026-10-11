import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { quranicSubjectServices } from "./quranicSubject.service.js";
import {
  TCreateQuranicSubjectZodSchema,
  TDeleteQuranicSubjectParamsZodSchema,
  TGetSingleQuranicSubjectZodSchema,
  TUpdateQuranicSubjectParamsZodSchema,
  TUpdateQuranicSubjectZodSchema,
} from "./quranicSubject.zodValidation.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";

// ===============================================
// CREATE QURANIC SUBJECT CONTROLLER
// ===============================================
const createQuranicSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const payload: TCreateQuranicSubjectZodSchema = req.body;
    const result = await quranicSubjectServices.createQuranicSubject(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Quranic subject created successfully.",
      data: result,
    });
  },
);

// ====================================================
// UPDATE QURANIC SUBJECT CONTROLLER
// ====================================================
const updateQuranicSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const {id} = req.params as unknown as TUpdateQuranicSubjectParamsZodSchema;

    const payload: TUpdateQuranicSubjectZodSchema = req.body;
    const result = await quranicSubjectServices.updateQuranicSubject(
      payload,
      loggedInUser,
      id
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic subject updated successfully.",
      data: result,
    });
  },
);

// ====================================================
// DELETE QURANIC SUBJECT CONTROLLER
// ====================================================
const deleteQuranicSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
    }

    const {id} = req.params as unknown as TDeleteQuranicSubjectParamsZodSchema;
    const result = await quranicSubjectServices.deleteQuranicSubject(
      id,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic subject deleted successfully.",
      data: result,
    });
  },
);

// =====================================================
// GET ALL QURANIC SUBJECTS CONTROLLER
// =====================================================
const getAllQuranicSubjects = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await quranicSubjectServices.getAllQuranicSubjects();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic subjects retrieved successfully.",
      data: result,
    });
  },
);

// ======================================================
// GET SINGLE QURANIC SUBJECT CONTROLLER
// ======================================================
const getSingleQuranicSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Safely parse from your validated path params middleware mapping block
    const { id } =
      req.params as unknown as TGetSingleQuranicSubjectZodSchema;

    const result =
      await quranicSubjectServices.getSingleQuranicSubject(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic subject details retrieved successfully.",
      data: result,
    });
  },
);

export const quranicSubjectController = {
  createQuranicSubject,
  updateQuranicSubject,
  deleteQuranicSubject,
  getAllQuranicSubjects,
  getSingleQuranicSubject,
};
