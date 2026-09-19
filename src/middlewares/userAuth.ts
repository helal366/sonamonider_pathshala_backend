import type { NextFunction, Request, Response } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma.js";
import { envVars } from "../config/index.js";
import { catchAsync } from "../utils/catchAsync.js";
import { jwtTokens } from "../utils/jwtTokens.js";
import { sendResponse } from "../utils/sendResponse.js";
import { AppError } from "../helperFunctions/globalError/globalErrorHelperFunction.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        user_name: string;
        full_name: string;
        mobile_number: string;
        email: string;
        role_name: string;
        position_name: string;
      };
    }
  }
}

type AuthTokenPayload = JwtPayload & {
  user_id: string;
  user_name: string;
  full_name: string;
  role_name: string;
  position_name?: string;
};

const isAuthTokenPayload = (
  value: string | JwtPayload,
): value is AuthTokenPayload => {
  return (
    typeof value !== "string" &&
    typeof value.user_id === "string" &&
    typeof value.user_name === "string" &&
    typeof value.full_name === "string" &&
    typeof value.role_name === "string" &&
    (value.position_name === undefined ||
      typeof value.position_name === "string")
  );
};

export const userAuth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const token =
      req.cookies?.accessToken ??
      (authorization?.startsWith("Bearer ")
        ? authorization.slice("Bearer ".length).trim()
        : authorization);

    if (!token) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Please login. Token not authenticated.",
      });
      return;
    }

    const verifiedToken = jwtTokens.verifyToken(
      token,
      envVars.JWT_ACCESS_SECRET,
    );

    if (!verifiedToken.success) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: verifiedToken.error,
      });
      return;
    }

    const payload = verifiedToken.data;
    if (!payload || !isAuthTokenPayload(payload)) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: "Invalid token payload.",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.user_id },
      include: {
        role: { select: { role_name: true } },
        position: { select: { position_name: true } },
      },
    });

    if (!user || user.is_deleted) {
      throw new AppError("User account is Deleted.", StatusCodes.UNAUTHORIZED);
    }

    if (user.active_status === "INACTIVE") {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: "User account is Inactive.",
      });
      return;
    }

    const currentRole = user.role?.role_name;
    if (!currentRole || currentRole !== payload.role_name) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: "User role is invalid or has changed.",
      });
      return;
    }

    if (requiredRoles.length > 0 && !requiredRoles.includes(currentRole)) {
      sendResponse(res, {
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: "You do not have permission to access this resource.",
      });
      return;
    }

    req.user = {
      user_id: user.id,
      user_name: user.user_name ?? payload.user_name,
      full_name: user.full_name,
      mobile_number: user.mobile_number,
      email: user.email ?? "",
      role_name: currentRole,
      position_name:
        user.position?.position_name ?? payload.position_name ?? "",
    };

    next();
  });
};
