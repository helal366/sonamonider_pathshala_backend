import { Request } from "express";
import { AppError } from "../globalError/globalErrorHelperFunction";
import { StatusCodes } from "http-status-codes";

const requiredUser = (req: Request) => {
  if (!req.user) {
    throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
  }
  return req.user;
};
export const helperFunctions = {
    requiredUser
}