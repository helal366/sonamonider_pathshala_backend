import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { quranicSubjectServices } from "./quranicSubject.service.js";
import {
  TCreateQuranicSubjectZodSchema,
  TQuranicSubjectIdParamsZodSchema,
  TUpdateQuranicSubjectSingleFieldPayload,
  TUpdateQuranicSubjectZodSchema,
} from "./quranicSubject.zodValidation.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";

// ===============================================
// CREATE QURANIC SUBJECT CONTROLLER
// ===============================================
const createQuranicSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const payload: TCreateQuranicSubjectZodSchema = req.body;
    const result = await quranicSubjectServices.createQuranicSubject(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Quranic subject created successfully.",
      data: result,
    });
  },
);

// ====================================================
// UPDATE QURANIC SUBJECT CONTROLLER
// ====================================================
const updateQuranicSubject = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { quranic_subject_id } = req.params as unknown as TQuranicSubjectIdParamsZodSchema;

    const payload: TUpdateQuranicSubjectZodSchema = req.body;
    const result = await quranicSubjectServices.updateQuranicSubject(
      payload,
      loggedInUser,
      quranic_subject_id,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic subject updated successfully.",
      data: result,
    });
  },
);

const updateQuranicSubjectSingleField = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const { quranic_subject_id } =
      req.params as unknown as TQuranicSubjectIdParamsZodSchema;
    const payload: TUpdateQuranicSubjectSingleFieldPayload = req.body;
    const result = await quranicSubjectServices.updateQuranicSubjectSingleField(
      payload,
      loggedInUser,
      quranic_subject_id,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic subject field updated successfully.",
      data: result,
    });
  },
);

// ====================================================
// DELETE QURANIC SUBJECT CONTROLLER
// ====================================================
const deleteQuranicSubject = catchAsync(async (req: Request, res: Response) => {
  const loggedInUser = helperFunctions.requiredUser(req);

  const { quranic_subject_id } = req.params as unknown as TQuranicSubjectIdParamsZodSchema;
  const result = await quranicSubjectServices.deleteQuranicSubject(
    quranic_subject_id,
    loggedInUser,
  );

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Quranic subject deleted successfully.",
    data: result,
  });
});

// =====================================================
// GET ALL QURANIC SUBJECTS CONTROLLER
// =====================================================
const getAllQuranicSubjects = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await quranicSubjectServices.getAllQuranicSubjects();

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic subjects retrieved successfully.",
      data: result,
    });
  },
);

// ======================================================
// GET SINGLE QURANIC SUBJECT CONTROLLER
// ======================================================
const getSingleQuranicSubject = catchAsync(
  async (req: Request, res: Response) => {
    // Safely parse from your validated path params middleware mapping block
    const { quranic_subject_id } = req.params as unknown as TQuranicSubjectIdParamsZodSchema;

    const result = await quranicSubjectServices.getSingleQuranicSubject(quranic_subject_id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Quranic subject details retrieved successfully.",
      data: result,
    });
  },
);

export const quranicSubjectController = {
  createQuranicSubject,
  updateQuranicSubject,
  updateQuranicSubjectSingleField,
  deleteQuranicSubject,
  getAllQuranicSubjects,
  getSingleQuranicSubject,
};
