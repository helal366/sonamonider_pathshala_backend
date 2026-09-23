import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import { TLoginZodSchema } from "./auth.zod.schema.js";
import bcrypt from "bcryptjs";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtTokens } from "../../utils/jwtTokens.js";
import { envVars } from "../../config/index.js";

// USER LOGIN
const login = async (payload: TLoginZodSchema) => {
  const { user_name, user_password } = payload;
  const userExistence = await prisma.user.findUnique({
    where: { user_name },
    include: {
      current_role: {
        select: { role_name: true },
      },
      current_position: {
        select: { position_name: true },
      },
    },
  });
  if (!userExistence)
    throw new AppError("User not found.", StatusCodes.NOT_FOUND);

  if (userExistence.is_deleted)
    throw new AppError(
      "User account has been deleted.",
      StatusCodes.UNAUTHORIZED,
    );

  if (userExistence.active_status === "INACTIVE")
    throw new AppError("User account is inactive.", StatusCodes.UNAUTHORIZED);
  if (!userExistence.user_password)
    throw new AppError(
      "User password not found. Set your password.",
      StatusCodes.NOT_FOUND,
    );

  const isPasswordValid = await bcrypt.compare(
    user_password,
    userExistence.user_password,
  );
  if (!isPasswordValid)
    throw new AppError("Wrong Password", StatusCodes.UNAUTHORIZED);

  const jwtPayload: JwtPayload = {
    user_id: userExistence.id,
    user_name,
    full_name: userExistence.full_name,
    mobile_number: userExistence.mobile_number,
    email: userExistence.email,
    active_status: userExistence.active_status,
    role_name: userExistence.current_role?.role_name,
    position_name: userExistence.current_position?.position_name,
  };

  const accessToken = jwtTokens.createToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET,
    envVars.JWT_ACCESS_EXPIRES_IN as SignOptions,
  );

  const refreshToken = jwtTokens.createToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET,
    envVars.JWT_REFRESH_EXPIRES_IN as SignOptions,
  );

  return { accessToken, refreshToken };
};

export const authServices = {
  login,
};
