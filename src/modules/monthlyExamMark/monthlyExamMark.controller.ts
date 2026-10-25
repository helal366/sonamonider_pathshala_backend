import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { monthlyExamMarkServices } from "./monthlyExamMark.service.js";
import {
  TCreateMonthlyExamMark,
  TUpdateMonthlyExamMark,
  TUpdateMonthlyExamMarkField,
} from "./monthlyExamMark.zodValidation.js";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await monthlyExamMarkServices.createMonthlyExamMark(
    req.body as TCreateMonthlyExamMark,
    helperFunctions.requiredUser(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Monthly exam mark created successfully.",
    data: result,
  });
});

const remove = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result = await monthlyExamMarkServices.deleteMonthlyExamMark(
    req.params.id,
    helperFunctions.requiredUser(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Monthly exam mark deleted successfully.",
    data: result,
  });
});

const update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result = await monthlyExamMarkServices.updateMonthlyExamMark(
    req.params.id,
    req.body as TUpdateMonthlyExamMark,
    helperFunctions.requiredUser(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Monthly exam mark updated successfully.",
    data: result,
  });
});

const updateField = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result = await monthlyExamMarkServices.updateMonthlyExamMarkField(
    req.params.id,
    req.body as TUpdateMonthlyExamMarkField,
    helperFunctions.requiredUser(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Monthly exam mark field updated successfully.",
    data: result,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await monthlyExamMarkServices.getAllMonthlyExamMarks();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Monthly exam marks retrieved successfully.",
    data: result,
  });
});

const getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await monthlyExamMarkServices.getMonthlyExamMarkById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Monthly exam mark retrieved successfully.",
    data: result,
  });
});

export const monthlyExamMarkController = {
  create,
  remove,
  update,
  updateField,
  getAll,
  getById,
};
