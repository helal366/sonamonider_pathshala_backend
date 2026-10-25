import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { halfYearlyExamMarkServices } from "./halfYearlyExamMark.service.js";
import {
  TCreateHalfYearlyExamMark,
  TUpdateHalfYearlyExamMark,
  TUpdateHalfYearlyExamMarkField,
} from "./halfYearlyExamMark.zodValidation.js";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await halfYearlyExamMarkServices.createHalfYearlyExamMark(
    req.body as TCreateHalfYearlyExamMark,
    helperFunctions.requiredUser(req),
  );
  sendResponse(res, { success: true, statusCode: StatusCodes.CREATED, message: "Half-yearly exam mark created successfully.", data: result });
});
const remove = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result = await halfYearlyExamMarkServices.deleteHalfYearlyExamMark(req.params.id, helperFunctions.requiredUser(req));
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Half-yearly exam mark deleted successfully.", data: result });
});
const update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result = await halfYearlyExamMarkServices.updateHalfYearlyExamMark(req.params.id, req.body as TUpdateHalfYearlyExamMark, helperFunctions.requiredUser(req));
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Half-yearly exam mark updated successfully.", data: result });
});
const updateField = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result = await halfYearlyExamMarkServices.updateHalfYearlyExamMarkField(req.params.id, req.body as TUpdateHalfYearlyExamMarkField, helperFunctions.requiredUser(req));
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Half-yearly exam mark field updated successfully.", data: result });
});
const getAll = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await halfYearlyExamMarkServices.getAllHalfYearlyExamMarks();
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Half-yearly exam marks retrieved successfully.", data: result });
});
const getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await halfYearlyExamMarkServices.getHalfYearlyExamMarkById(req.params.id);
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Half-yearly exam mark retrieved successfully.", data: result });
});

export const halfYearlyExamMarkController = { create, remove, update, updateField, getAll, getById };
