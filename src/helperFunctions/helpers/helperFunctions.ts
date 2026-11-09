import { Request } from "express";
import { AppError } from "../globalError/globalErrorHelperFunction.js";
import { StatusCodes } from "http-status-codes";
import { Prisma } from "#db-client";

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

export const toAuditJson = (
  data: unknown,
): Prisma.InputJsonValue => {
  const serialized = JSON.stringify(data);

  if (serialized === undefined) {
    throw new Error("Unable to serialize audit log data.");
  }

  return JSON.parse(serialized) as Prisma.InputJsonValue;
};

const backendUrlVercel = "https://sonamoniderpathshalabackend.vercel.app/";
const backendUrlLocal = "http://localhost:5000/";
export const BACKEND_URL = backendUrlLocal;
export const FRONTEND_URL = "";
export const helperFunctions = {
  requiredUser,
  toMinutes
};
