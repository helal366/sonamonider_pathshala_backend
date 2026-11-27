import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { studentFeeServices } from "./studentFee.service.js";
import {
  TCreateStudentFeePaymentZodSchema,
  TCreateStudentFeeAssessmentZodSchema,
  TAcademicYearQueryZodSchema,
  TStudentFeePaymentIdParamsZodSchema,
  TStudentFeeAssessmentIdParamsZodSchema,
  TStudentIdParamsZodSchema,
  TUpdateStudentFeePaymentFieldZodSchema,
  TUpdateStudentFeeAssessmentFieldZodSchema,
} from "./studentFee.zodValidation.js";

// ======================================================
// CREATE STUDENT FEE ASSESSMENT CONTROLLER
// ======================================================
const createStudentFeeAssessment = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateStudentFeeAssessmentZodSchema;
    const result = await studentFeeServices.createStudentFeeAssessment(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Student fee assessment created successfully.",
      data: result,
    });
  },
);

// ======================================================
// UPDATE A SINGLE STUDENT FEE ASSESSMENT FIELD CONTROLLER
// ======================================================
const updateStudentFeeAssessmentField = catchAsync(
  async (req: Request<TStudentFeeAssessmentIdParamsZodSchema>, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateStudentFeeAssessmentFieldZodSchema;
    const { student_fee_assessment_id } = req.params;
    const result = await studentFeeServices.updateStudentFeeAssessmentField(
      payload,
      loggedInUser,
      student_fee_assessment_id,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Student fee assessment updated successfully.",
      data: result,
    });
  },
);

// ======================================================
// DELETE STUDENT FEE ASSESSMENT CONTROLLER
// ======================================================
const deleteStudentFeeAssessment = catchAsync(
  async (req: Request<TStudentFeeAssessmentIdParamsZodSchema>, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { student_fee_assessment_id } = req.params;
    const result = await studentFeeServices.deleteStudentFeeAssessment(
      student_fee_assessment_id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Student fee assessment deleted successfully.",
      data: result,
    });
  },
);

// ======================================================
// GET ALL STUDENT FEE ASSESSMENT CONTROLLER
// ======================================================
const getAllStudentFeeAssessments = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await studentFeeServices.getAllStudentFeeAssessments(loggedInUser);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "All student fee assessments retrieved successfully.",
      data: result,
    });
  },
);

// ======================================================
// GET STUDENT FEE ASSESSMENT BY STUDENT ID CONTROLLER
// ======================================================
const getStudentFeeAssessmentByStudentId = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { student_id } = req.params as unknown as TStudentIdParamsZodSchema;
    const { academic_year_name } =
      req.query as unknown as TAcademicYearQueryZodSchema;
    const result = await studentFeeServices.getStudentFeeAssessmentByStudentId(
      loggedInUser,
      student_id,
      academic_year_name,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Student fee assessments retrieved successfully.",
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
    const result =
      await studentFeeServices.getAllStudentFeePayments(loggedInUser);
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
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { student_id } = req.params as unknown as TStudentIdParamsZodSchema;
    const { academic_year_name } =
      req.query as unknown as TAcademicYearQueryZodSchema;
    const result = await studentFeeServices.getStudentFeePaymentsByStudentId(
      loggedInUser,
      student_id,
      academic_year_name,
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
  async (req: Request<TStudentFeePaymentIdParamsZodSchema>, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateStudentFeePaymentFieldZodSchema;
    const { student_fee_payment_id } = req.params;
    const result = await studentFeeServices.updateStudentFeePaymentField(
      payload,
      loggedInUser,
      student_fee_payment_id,
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
  async (req: Request<TStudentFeePaymentIdParamsZodSchema>, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { student_fee_payment_id } = req.params;
    const result = await studentFeeServices.deleteStudentFeePayment(
      student_fee_payment_id,
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
  createStudentFeeAssessment,
  updateStudentFeeAssessmentField,
  deleteStudentFeeAssessment,
  getAllStudentFeeAssessments,
  getStudentFeeAssessmentByStudentId,
  getAllStudentFeePayments,
  getStudentFeePaymentsByStudentId,
  createStudentFeePayment,
  updateStudentFeePaymentField,
  deleteStudentFeePayment,
};
