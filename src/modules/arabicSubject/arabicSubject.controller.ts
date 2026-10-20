import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { arabicSubjectServices } from "./arabicSubject.service.js";
import { TArabicSubjectIdParams } from "./arabicSubject.zodValidation.js";

// ==========================================================
// CREATE ARABIC SUBJECT CONTROLLER
// ==========================================================
const createArabicSubject = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await arabicSubjectServices.createArabicSubject(
      req.body,
      loggedInUser,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Arabic subject created successfully.",
      data: result,
    });
  },
);

// ==========================================================
// UPDATE ARABIC SUBJECT CONTROLLER
// ==========================================================
const updateArabicSubject = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { id } = req.params as unknown as TArabicSubjectIdParams;
    const result = await arabicSubjectServices.updateArabicSubject(
      req.body,
      loggedInUser,
      id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Arabic subject updated successfully.",
      data: result,
    });
  },
);

// ==========================================================
// UPDATE ARABIC SUBJECT SINGLE FIELD CONTROLLER
// ==========================================================
const updateArabicSubjectSingleField = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { id } = req.params as unknown as TArabicSubjectIdParams;
    const result = await arabicSubjectServices.updateArabicSubjectSingleField(
      req.body,
      loggedInUser,
      id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Arabic subject field updated successfully.",
      data: result,
    });
  },
);

// ==========================================================
// DELETE ARABIC SUBJECT CONTROLLER
// ==========================================================
const deleteArabicSubject = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { id } = req.params as unknown as TArabicSubjectIdParams;
    const result = await arabicSubjectServices.deleteArabicSubject(
      id,
      loggedInUser,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Arabic subject deleted successfully.",
      data: result,
    });
  },
);

// ==========================================================
// GET ALL ARABIC SUBJECTS CONTROLLER
// ==========================================================
const getAllArabicSubjects = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await arabicSubjectServices.getAllArabicSubjects();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Arabic subjects retrieved successfully.",
      data: result,
    });
  },
);

// ==========================================================
// GET SINGLE ARABIC SUBJECT CONTROLLER
// ==========================================================
const getSingleArabicSubject = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params as unknown as TArabicSubjectIdParams;
    const result = await arabicSubjectServices.getSingleArabicSubject(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Arabic subject details retrieved successfully.",
      data: result,
    });
  },
);

// ==========================================================
// EXPORT ARABIC SUBJECT CONTROLLERS
// ==========================================================
export const arabicSubjectController = {
  createArabicSubject,
  updateArabicSubject,
  updateArabicSubjectSingleField,
  deleteArabicSubject,
  getAllArabicSubjects,
  getSingleArabicSubject,
};