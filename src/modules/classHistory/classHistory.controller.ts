import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { classHistoryServices } from "./classHistory.service.js";
import {
  TClassHistoryAcademicYearIdParamsZodSchema,
  TClassHistoryClassIdParamsZodSchema,
  TClassHistoryIdParamsZodSchema,
  TClassHistoryStudentIdParamsZodSchema,
} from "./classHistory.zodValidation.js";

const getAllClassHistories = catchAsync(
  async (req: Request, res: Response) => {
    helperFunctions.requiredUser(req);
    const result = await classHistoryServices.getAllClassHistories();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Class histories retrieved successfully.",
      data: result,
    });
  },
);

const getClassHistoryById = catchAsync(
  async (req: Request<TClassHistoryIdParamsZodSchema>, res: Response) => {
    helperFunctions.requiredUser(req);
    const result = await classHistoryServices.getClassHistoryById(
      req.params.id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Class history retrieved successfully.",
      data: result,
    });
  },
);

const getClassHistoriesByStudentId = catchAsync(
  async (req: Request<TClassHistoryStudentIdParamsZodSchema>, res: Response) => {
    helperFunctions.requiredUser(req);
    const result = await classHistoryServices.getClassHistoriesByStudentId(
      req.params.student_id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Student class histories retrieved successfully.",
      data: result,
    });
  },
);

const getClassHistoriesByClassId = catchAsync(
  async (req: Request<TClassHistoryClassIdParamsZodSchema>, res: Response) => {
    helperFunctions.requiredUser(req);
    const result = await classHistoryServices.getClassHistoriesByClassId(
      req.params.class_id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Class histories retrieved successfully.",
      data: result,
    });
  },
);

const getClassHistoriesByAcademicYearId = catchAsync(
  async (
    req: Request<TClassHistoryAcademicYearIdParamsZodSchema>,
    res: Response,
  ) => {
    helperFunctions.requiredUser(req);
    const result =
      await classHistoryServices.getClassHistoriesByAcademicYearId(
        req.params.academic_year_id,
      );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Academic year class histories retrieved successfully.",
      data: result,
    });
  },
);

export const classHistoryController = {
  getAllClassHistories,
  getClassHistoryById,
  getClassHistoriesByStudentId,
  getClassHistoriesByClassId,
  getClassHistoriesByAcademicYearId,
};
