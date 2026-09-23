import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import {
  TChangePasswordPayload,
  TChangeUserPositionZodSchema,
  TPromoteUserRolePositionZodSchema,
  TForgetPasswordPayload,
  TUserCreatePayload,
} from "./user.zod.validation.js";
import { userServices } from "./user.service.js";

// CREATE USER
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const payload: TUserCreatePayload = req.body;
    const result = await userServices.createUser(payload, loggedInUser);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: `User created successfully.`,
      data: result,
    });
  },
);

// CHANGE PASSWORD
const changePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TChangePasswordPayload = req.body;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    await userServices.changePassword(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Password changed successfully.",
    });
  },
);

// FORGET PASSWORD
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


// PROMOTE USER ROLE POSITION
const promoteUserRolePosition = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TPromoteUserRolePositionZodSchema = req.body;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const result = await userServices.promoteUserRolePosition(
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

// CHANGE USER POSITION
const changeUserPosition = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TChangeUserPositionZodSchema = req.body;
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const result =
      await userServices.changeUserPosition(
        payload,
        loggedInUser,
      );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Management staff position change successful.",
      data: result,
    });
  },
);
export const userController = {
  createUser,
  changePassword,
  forgetPassword,
  promoteUserRolePosition,
  changeUserPosition
};
