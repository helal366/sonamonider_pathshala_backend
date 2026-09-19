import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import { managementStaffPatchServices } from "./managementStaff.patch.service.js";
import { TChangeManagementStaffRoleZodSchema } from "./managementStaff.patch.zod.validation.js";

const changeManagementStaffRole = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TChangeManagementStaffRoleZodSchema = req.body;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login", StatusCodes.BAD_REQUEST);
    }

    const result = await managementStaffPatchServices.changeManagementStaffRole(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Management staff role change successful.",
      data: result,
    });
  },
);

export const managementStaffPatchController = {
  changeManagementStaffRole,
};
