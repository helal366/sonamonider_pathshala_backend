import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TLoginZodSchema } from "./auth.zod.schema";
import { authServices } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config";

// USER LOGIN
const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TLoginZodSchema = req.body;
    const { accessToken, refreshToken } = await authServices.login(payload);
    const isProduction = envVars.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
    };

    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User login successful.",
      data: { accessToken, refreshToken },
    });
  },
);

// USER LOGOUT
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const isProduction = envVars.NODE_ENV === "production";

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? ("none" as const) : ("lax" as const),
    });

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User logout successful.",
    });
  },
);

export const authController = {
  login,
  logout,
};
