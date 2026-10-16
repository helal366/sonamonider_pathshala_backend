import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { staffPaymentServices } from "./staffPayment.service.js";
import {
  TCreateStaffPaymentZodSchema,
  TCreateStaffSalaryRateZodSchema,
  TStaffPaymentIdParamsZodSchema,
  TStaffSalaryRateIdParamsZodSchema,
  TUpdateStaffPaymentFieldZodSchema,
  TUpdateStaffSalaryRateFieldZodSchema,
} from "./staffPayment.zodValidation.js";

// ======================================================
// CREATE STAFF SALARY RATE CONTROLLER
// ======================================================
const createStaffSalaryRate = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateStaffSalaryRateZodSchema;
    const result = await staffPaymentServices.createStaffSalaryRate(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Staff salary rate created successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE A SINGLE STAFF SALARY RATE FIELD CONTROLLER
// ======================================================
const updateStaffSalaryRateField = catchAsync(
  async (
    req: Request<TStaffSalaryRateIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateStaffSalaryRateFieldZodSchema;
    const { id } = req.params;
    const result = await staffPaymentServices.updateStaffSalaryRateField(
      payload,
      loggedInUser,
      id,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Staff salary rate field updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// DELETE STAFF SALARY RATE CONTROLLER
// ======================================================
const deleteStaffSalaryRate = catchAsync(
  async (
    req: Request<TStaffSalaryRateIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { id } = req.params;
    const result = await staffPaymentServices.deleteStaffSalaryRate(
      id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Staff salary rate deleted successfully.",
      data: result,
    });
  },
);

// ======================================================
// CREATE STAFF PAYMENT CONTROLLER
// ======================================================
const createStaffPayment = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateStaffPaymentZodSchema;
    const result = await staffPaymentServices.createStaffPayment(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Staff payment created successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE A SINGLE STAFF PAYMENT FIELD CONTROLLER
// ======================================================
const updateStaffPaymentField = catchAsync(
  async (
    req: Request<TStaffPaymentIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateStaffPaymentFieldZodSchema;
    const { id } = req.params;
    const result = await staffPaymentServices.updateStaffPaymentField(
      payload,
      loggedInUser,
      id,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Staff payment field updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// DELETE STAFF PAYMENT CONTROLLER
// ======================================================
const deleteStaffPayment = catchAsync(
  async (
    req: Request<TStaffPaymentIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { id } = req.params;
    const result = await staffPaymentServices.deleteStaffPayment(
      id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Staff payment deleted successfully.",
      data: result,
    });
  },
);

export const staffPaymentController = {
  createStaffSalaryRate,
  updateStaffSalaryRateField,
  deleteStaffSalaryRate,
  createStaffPayment,
  updateStaffPaymentField,
  deleteStaffPayment,
};
