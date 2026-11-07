import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { classServices } from "./class.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import {
  TClassIdParamsZodSchema,
  TUpdateClassFieldZodSchema,
} from "./class.zodValidation";

// =============================================
// CREATE CLASS NAME CONTROLLER
// =============================================
const createClassName = catchAsync(async (req: Request, res: Response) => {
  const loggedInUser = helperFunctions.requiredUser(req);
  const payload = req.body;
  const result = await classServices.createClassName(payload, loggedInUser);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: `Class created successfully.`,
    data: result,
  });
});

// =============================================
// DELETE CLASS NAME CONTROLLER
// =============================================
const deleteClassName = catchAsync(async (req: Request<TClassIdParamsZodSchema>, res: Response) => {
  const loggedInUser = helperFunctions.requiredUser(req);
  const { class_id } = req.params;

  const result = await classServices.deleteClassName(class_id, loggedInUser);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Class name deleted successfully.`,
    data: result,
  });
});

// =============================================
// UPDATE CLASS FIELD CONTROLLER
// =============================================
const updateClassField = catchAsync(async (req: Request<TClassIdParamsZodSchema>, res: Response) => {
  const loggedInUser = helperFunctions.requiredUser(req);
  const {class_id } = req.params;
  const { field, value } = req.body as TUpdateClassFieldZodSchema;
  const updatePayload = {
    class_id,
    field,
    value,
  };

  const result = await classServices.updateClassField(
    updatePayload,
    loggedInUser,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Class field updated successfully.`,
    data: result,
  });
});

// =============================================
// GET ALL CLASS NAME CONTROLLER
// =============================================
const getAllClassNames = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await classServices.getAllClassNames();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Class names retrieved successfully.`,
    data: result,
  });
});

// =============================================
// GET SINGLE CLASS NAME CONTROLLER
// =============================================
const getSingleClassByClassId = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const {class_id} = req.params as unknown as TClassIdParamsZodSchema
  const result = await classServices.getSingleClassByClassId(class_id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Class details retrieved successfully.",
    data: result,
  });
})
export const classController = {
  createClassName,
  deleteClassName,
  updateClassField,
  getAllClassNames,
  getSingleClassByClassId
};
