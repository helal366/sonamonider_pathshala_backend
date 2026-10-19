import { Request } from "express";
import { AppError } from "../globalError/globalErrorHelperFunction.js";
import { StatusCodes } from "http-status-codes";

const requiredUser = (req: Request) => {
  if (!req.user) {
    throw new AppError("Please login.", StatusCodes.UNAUTHORIZED);
  }
  return req.user;
};


const toMinutes = (time: string): number => {
  const [clock, period] = time.trim().toUpperCase().split(/\s+/);
  const [hours, minutes] = clock!.split(":").map(Number);

  const hours24 = (hours! % 12) + (period === "PM" ? 12 : 0);

  return hours24 * 60 + minutes!;
};
export const helperFunctions = {
  requiredUser,
  toMinutes
};
