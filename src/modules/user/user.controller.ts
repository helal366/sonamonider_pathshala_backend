import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  TChangePasswordPayload,
  TForgetPasswordPayload,
  TUserCreatePayload,
} from "./user.zod.validation.js";
import { userServices } from "./user.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";

const createuser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TUserCreatePayload = req.body;
    const result = await userServices.createUser(payload);
    console.log({ result });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: `User created successfully.`,
      data: result,
    });
  },
);

const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TChangePasswordPayload = req.body;
    await userServices.changePassword(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password changed successfully.",
    });
  },
);

const forgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TForgetPasswordPayload = req.body;
    await userServices.forgetPassword(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        "A password reset verification code has been sent to your email address.",
    });
  },
);

export const userController = {
  createuser,
  changePassword,
  forgetPassword,
};
