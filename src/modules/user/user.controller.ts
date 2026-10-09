import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import {
  TChangePasswordPayload,
  TChangeUserPositionZodSchema,
  TForgetPasswordPayload,
  TUserCreateZodSchema,
  TUpdateSingleUserFieldAdminZodSchema,
  TUpdateSingleUserFieldSuperAdminZodSchema,
  TUpdateUserPasswordZodSchema,
  TUpdateUserNameZodSchema,
} from "./user.zod.validation.js";
import { userServices } from "./user.service.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { createUserServices } from "./userCreation.service.js";

//=============================================
// CREATE USER CONTROLLER
//=============================================
const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;

    if (!loggedInUser) {
      throw new AppError("Please login.", StatusCodes.BAD_REQUEST);
    }

    const payload: TUserCreateZodSchema = req.body;
    const result = await createUserServices.createUser(payload, loggedInUser);
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

// ====================================
// CHANGE PASSWORD CONTROLLER
// ====================================
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

// ====================================
// FORGET PASSWORD CONTROLLER
// ====================================
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


// =====================================
// CHANGE USER POSITION CONTROLLER
// =====================================
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

// ===============================================
// UPDATE SINGLE USER FIELD ADMIN CONTROLLER
// ===============================================
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

// =================================================
// UPDATE SINGLE USER FIELD ADMIN CONTROLLER
// =================================================
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

// =================================================
// UPDATE USER NAME CONTROLLER
// =================================================
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

// =================================================
// UPDATE USER PASSWORD CONTROLLER
// =================================================
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
  changeUserPosition,
  updateSingleUserFieldAdmin,
  updateSingleUserFieldSuperAdmin,
  updateUserName,
  updateUserPassword,
};
