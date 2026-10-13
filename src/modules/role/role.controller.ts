import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { roleServices } from "./role.service.js";
import {
  TCreateRoleZodSchema,
  TDeleteRoleParamsZodSchema,
  TGetSingleRoleParamsZodSchema,
  TUpdateRoleZodSchema,
} from "./role.zodValidation.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";

// ==========================================
// CREATE ROLE CONTROLLER
// ==========================================
const createRole = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const payload: TCreateRoleZodSchema = req.body;
    const result = await roleServices.createRole(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: `New Role created successfully.`,
      data: result,
    });
  },
);

// ==========================================
// UPDATE ROLE CONTROLLER
// ==========================================
const updateRole = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload: TUpdateRoleZodSchema = req.body;

    const result = await roleServices.updateRole(payload, loggedInUser);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Role updated successfully.`,
      data: result,
    });
  },
);

// ==========================================
// DELETE ROLE CONTROLLER
// ==========================================
const deleteRole = catchAsync(
  async (req: Request, res: Response) => {
    const {id} = req.params as unknown as TDeleteRoleParamsZodSchema;
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await roleServices.deleteRole(id, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Role deleted successfully.",
      data: result,
    });
  },
);

// ==========================================
// GET ALL ROLE NAMES CONTROLLER
// ==========================================
const getAllRoleNames = catchAsync(
  async (req: Request, res: Response) => {
    helperFunctions.requiredUser(req)
    const result = await roleServices.getAllRoleNames();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Master role name strings retrieved successfully.",
      data: result,
    });
  },
);

// ==========================================
// GET SINGLE ROLE CONTROLLER
// ==========================================
const getSingleRole = catchAsync(
  async (req: Request, res: Response) => {
    const {id} = req.params as unknown as TGetSingleRoleParamsZodSchema;

    const result = await roleServices.getSingleRole(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Role details retrieved successfully.",
      data: result,
    });
  },
);

export const roleController = {
  createRole,
  updateRole,
  deleteRole,
  getAllRoleNames,
  getSingleRole,
};
