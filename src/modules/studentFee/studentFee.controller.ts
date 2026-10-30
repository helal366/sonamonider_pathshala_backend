import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { studentFeeServices } from "./studentFee.service.js";
import {
  TCreateStudentFeePaymentZodSchema,
  TCreateStudentFeeRateZodSchema,
  TStudentFeePaymentIdParamsZodSchema,
  TStudentFeeRateIdParamsZodSchema,
  TStudentIdParamsZodSchema,
  TUpdateStudentFeePaymentFieldZodSchema,
  TUpdateStudentFeeRateFieldZodSchema,
} from "./studentFee.zodValidation.js";

// ======================================================
// CREATE STUDENT FEE RATE CONTROLLER
// ======================================================
const createStudentFeeRate = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateStudentFeeRateZodSchema;
    const result = await studentFeeServices.createStudentFeeRate(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Student fee rate created successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE A SINGLE STUDENT FEE RATE FIELD CONTROLLER
// ======================================================
const updateStudentFeeRateField = catchAsync(
  async (
    req: Request<TStudentFeeRateIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateStudentFeeRateFieldZodSchema;
    const { id } = req.params;
    const result = await studentFeeServices.updateStudentFeeRateField(
      payload,
      loggedInUser,
      id,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Student fee rate updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// DELETE STUDENT FEE RATE CONTROLLER
// ======================================================
const deleteStudentFeeRate = catchAsync(
  async (
    req: Request<TStudentFeeRateIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { id } = req.params;
    const result = await studentFeeServices.deleteStudentFeeRate(
      id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Student fee rate deleted successfully.",
      data: result,
    });
  },
);

// ======================================================
// GET ALL STUDENT FEE RATE CONTROLLER
// ======================================================
const getAllStudentFeeRates = catchAsync(async(req: Request, res: Response)=>{
  const loggedInUser = helperFunctions.requiredUser(req);
  const result = await studentFeeServices.getAllStudentFeeRates(loggedInUser);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "All student fee rate retrieved successfully.",
    data : result
  }) 
});

// ======================================================
// GET STUDENT FEE RATE BY STUDENT ID CONTROLLER
// ======================================================
const getStudentFeeRateByStudentId = catchAsync(
  async (
    req: Request<TStudentIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { student_id } = req.params;
    const result = await studentFeeServices.getStudentFeeRateByStudentId(
      loggedInUser,
      student_id,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Student fee rates retrieved successfully.",
      data: result,
    });
  },
);

// ======================================================
// GET ALL STUDENT FEE PAYMENT CONTROLLER
// ======================================================
const getAllStudentFeePayments = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await studentFeeServices.getAllStudentFeePayments(loggedInUser);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All student fee payments retrieved successfully.",
      data: result,
    });
  },
);

// ======================================================
// GET STUDENT FEE PAYMENTS BY STUDENT ID CONTROLLER
// ======================================================
const getStudentFeePaymentsByStudentId = catchAsync(
  async (req: Request<TStudentIdParamsZodSchema>, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { student_id } = req.params;
    const result = await studentFeeServices.getStudentFeePaymentsByStudentId(
      loggedInUser,
      student_id,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Student fee payments retrieved successfully.",
      data: result,
    });
  },
);

// ======================================================
// CREATE STUDENT FEE PAYMENT CONTROLLER
// ======================================================
const createStudentFeePayment = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateStudentFeePaymentZodSchema;
    const result = await studentFeeServices.createStudentFeePayment(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Student fee payment created successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE A SINGLE STUDENT FEE PAYMENT FIELD CONTROLLER
// ======================================================
const updateStudentFeePaymentField = catchAsync(
  async (
    req: Request<TStudentFeePaymentIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateStudentFeePaymentFieldZodSchema;
    const { id } = req.params;
    const result = await studentFeeServices.updateStudentFeePaymentField(
      payload,
      loggedInUser,
      id,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Student fee payment updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// DELETE STUDENT FEE PAYMENT CONTROLLER
// ======================================================
const deleteStudentFeePayment = catchAsync(
  async (
    req: Request<TStudentFeePaymentIdParamsZodSchema>,
    res: Response,
  ) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { id } = req.params;
    const result = await studentFeeServices.deleteStudentFeePayment(
      id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Student fee payment deleted successfully.",
      data: result,
    });
  },
);

export const studentFeeController = {
  createStudentFeeRate,
  updateStudentFeeRateField,
  deleteStudentFeeRate,
  getAllStudentFeeRates,
  getStudentFeeRateByStudentId,
  getAllStudentFeePayments,
  getStudentFeePaymentsByStudentId,
  createStudentFeePayment,
  updateStudentFeePaymentField,
  deleteStudentFeePayment,
};
