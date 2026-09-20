import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse.js";
import { emailServices } from "./email.service.js";
import type {
  TResendOtpForgetPasswordPayload,
  TResendOtpEmailPayload,
  TVerifyForgetPasswordPayload,
  TVerifyEmailPayload,
} from "./email.zod.validation.js";

const resendOtpEmailVerify = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TResendOtpEmailPayload = req.body;

    await emailServices.resendOtpEmailVerify(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "A new verification code has been sent to your email address.",
    });
  },
);

const sendForgetPasswordOtp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TResendOtpForgetPasswordPayload = req.body;

    await emailServices.sendForgetPasswordOtp(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        "A password reset verification code has been sent to your email address.",
    });
  },
);

const verifyEmail = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TVerifyEmailPayload = req.body;

    await emailServices.verifyEmail(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        "Email verified successfully. Your login password has been sent to your email address.",
    });
  },
);

const verifyEmailForgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TVerifyForgetPasswordPayload = req.body;

    await emailServices.verifyEmailForgetPassword(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        "Password reset successfully. Your new password has been sent to your email address.",
    });
  },
);

const resendOtpForgetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TResendOtpForgetPasswordPayload = req.body;

    await emailServices.resendOtpForgetPassword(payload);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message:
        "A new password reset verification code has been sent to your email address.",
    });
  },
);

export const emailController = {
  sendForgetPasswordOtp,
  resendOtpEmailVerify,
  verifyEmail,
  verifyEmailForgetPassword,
  resendOtpForgetPassword,
};
