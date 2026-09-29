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
  TUpdateSingleUserFieldAdminZodSchema,
  TUpdateSingleUserFieldSuperAdminZodSchema,
  TUpdateUserPasswordZodSchema,
  TUpdateUserNameZodSchema,
} from "./user.zod.validation.js";
import { userServices } from "./user.service.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";

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
      message: result.email_sent
        ? "User created successfully."
        : "User created, but the verification email could not be sent. Request a resend.",
      data: result.user,
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

    const result = await userServices.changePassword(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: result.email_sent
        ? "Password changed successfully."
        : "Password changed successfully, but the notification email could not be sent.",
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
    const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);

    const result = await userServices.changeUserPosition(payload, loggedInUser);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Management staff position change successful.",
      data: result,
    });
  },
);

// UPDATE SINGLE USER FIELD ADMIN CONTROLLER
const updateSingleUserFieldAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const payload: TUpdateSingleUserFieldAdminZodSchema = req.body;
    const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);

    const result = await userServices.updateSingleUserFieldAdmin(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Field updated successfully.",
      data: result,
    });
  },
);

// UPDATE SINGLE USER FIELD ADMIN CONTROLLER
const updateSingleUserFieldSuperAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const payload: TUpdateSingleUserFieldSuperAdminZodSchema = req.body;
    const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);

    const result = await userServices.updateSingleUserFieldSuperAdmin(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Field updated successful.`,
      data: result,
    });
  },
);
// UPDATE USER NAME CONTROLLER
const updateUserName = catchAsync(async (req: Request, res: Response) => {
  const payload: TUpdateUserNameZodSchema = req.body;
  const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);

  const result = await userServices.updateUserName(payload, loggedInUser);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.email_sent
      ? "User name updated successfully."
      : "User name updated successfully, but the notification email could not be sent.",
    data: result,
  });
});
// UPDATE USER PASSWORD CONTROLLER
const updateUserPassword = catchAsync(async (req: Request, res: Response) => {
  const payload: TUpdateUserPasswordZodSchema = req.body;
  const loggedInUser: TLoggedInUser = helperFunctions.requiredUser(req);

  const result = await userServices.updateUserPassword(payload, loggedInUser);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: result.email_sent
      ? "Password updated successfully."
      : "Password updated successfully, but the notification email could not be sent.",
    data: result,
  });
});
export const userController = {
  createUser,
  changePassword,
  forgetPassword,
  promoteUserRolePosition,
  changeUserPosition,
  updateSingleUserFieldAdmin,
  updateSingleUserFieldSuperAdmin,
  updateUserName,
  updateUserPassword,
};
