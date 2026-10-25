import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { annualExamMarkServices } from "./annualExamMark.service.js";
import {
  TCreateAnnualExamMark,
  TUpdateAnnualExamMark,
  TUpdateAnnualExamMarkField,
} from "./annualExamMark.zodValidation.js";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await annualExamMarkServices.createAnnualExamMark(
    req.body as TCreateAnnualExamMark,
    helperFunctions.requiredUser(req),
  );
  sendResponse(res, { success: true, statusCode: StatusCodes.CREATED, message: "Annual exam mark created successfully.", data: result });
});
const remove = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result = await annualExamMarkServices.deleteAnnualExamMark(req.params.id, helperFunctions.requiredUser(req));
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Annual exam mark deleted successfully.", data: result });
});
const update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result = await annualExamMarkServices.updateAnnualExamMark(req.params.id, req.body as TUpdateAnnualExamMark, helperFunctions.requiredUser(req));
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Annual exam mark updated successfully.", data: result });
});
const updateField = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result = await annualExamMarkServices.updateAnnualExamMarkField(req.params.id, req.body as TUpdateAnnualExamMarkField, helperFunctions.requiredUser(req));
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Annual exam mark field updated successfully.", data: result });
});
const getAll = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await annualExamMarkServices.getAllAnnualExamMarks();
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Annual exam marks retrieved successfully.", data: result });
});
const getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await annualExamMarkServices.getAnnualExamMarkById(req.params.id);
  sendResponse(res, { success: true, statusCode: StatusCodes.OK, message: "Annual exam mark retrieved successfully.", data: result });
});

export const annualExamMarkController = { create, remove, update, updateField, getAll, getById };
