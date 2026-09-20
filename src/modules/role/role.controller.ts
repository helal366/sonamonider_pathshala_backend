import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { roleServices } from "./role.service.js";
import { TCreateRoleZodSchema, TUpdateRoleZodSchema } from "./role.zod.validation.js";

// CREATE ROLE POST ROUTE
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


// UPDATE ROLE PATCH ROUTE
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
})
export const roleController = {
  createRole,
  updateRole
};
