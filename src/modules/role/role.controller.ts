import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { roleServices } from "./role.service.js";
import { TCreateRoleZodSchema, TDeleteRoleZodSchema, TUpdateRoleZodSchema } from "./role.zod.validation.js";

// CREATE ROLE CONTROLLER
const createRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

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


// UPDATE ROLE CONTROLLER
const updateRole= catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
  const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const payload: TUpdateRoleZodSchema = req.body;

    const result = await roleServices.updateRole(
      payload,
      loggedInUser,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Role updated successfully.`,
      data: result
    })
});


// DELETE ROLE CONTROLLER
const deleteRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TDeleteRoleZodSchema = req.body;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please log in.", StatusCodes.UNAUTHORIZED);
    }

    const result = await roleServices.deleteRole(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Role deleted successfully.",
      data: result,
    });
  },
);


// GET ALL ROLE NAMES CONTROLLER
const getAllRoleNames = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await roleServices.getAllRoleNames();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Master role name strings retrieved successfully.",
      data: result,
    });
  },
);


// GET SINGLE ROLE CONTROLLER
const getSingleRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id  = req.params.id as string;

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
  getSingleRole
};
