import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { subjectServices } from "./generalSubject.service.js";
import {
  TDeleteSubjectParams,
  TGetSingleSubjectParams,
  TUpdateSubjectParams,
} from "./generalSubject.zodValidation.js";

const createSubject = catchAsync(async (req: Request, res: Response) => {
  const user = helperFunctions.requiredUser(req);
  const result = await subjectServices.createSubject(req.body, user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Subject created successfully.",
    data: result,
  });
});

const updateSubject = catchAsync(async (req: Request, res: Response) => {
  const user = helperFunctions.requiredUser(req);
  const { id } = req.params as unknown as TUpdateSubjectParams;
  const result = await subjectServices.updateSubject(req.body, user, id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Subject updated successfully.",
    data: result,
  });
});

const updateSubjectSingleField = catchAsync(
  async (req: Request, res: Response) => {
    const user = helperFunctions.requiredUser(req);
    const { id } = req.params as unknown as TUpdateSubjectParams;
    const result = await subjectServices.updateSubjectSingleField(
      req.body,
      user,
      id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Subject field updated successfully.",
      data: result,
    });
  },
);

const deleteSubject = catchAsync(async (req: Request, res: Response) => {
  const user = helperFunctions.requiredUser(req);
  const { id } = req.params as unknown as TDeleteSubjectParams;
  const result = await subjectServices.deleteSubject(id, user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Subject deleted successfully.",
    data: result,
  });
});

const getAllSubjects = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await subjectServices.getAllSubjects();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Subjects retrieved successfully.",
    data: result,
  });
});

const getSingleSubject = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const { id } = req.params as unknown as TGetSingleSubjectParams;
  const result = await subjectServices.getSingleSubject(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Subject details retrieved successfully.",
    data: result,
  });
});

export const subjectController = {
  createSubject,
  updateSubject,
  updateSubjectSingleField,
  deleteSubject,
  getAllSubjects,
  getSingleSubject,
};
