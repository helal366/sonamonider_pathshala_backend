import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions"
import { TCreateExamSubjectZodSchema, TExamSubjectIdParamsZodSchema, TUpdateExamSubjectSingleFieldZodSchema, TUpdateExamSubjectZodSchema } from "./examSubject.zodValidation";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { examSubjectServices } from "./examSubject.service";
import { prisma } from '../../lib/prisma';

// ===================================================================
// CREATE EXAM SUBJECT CONTROLLER
// ===================================================================
const createExamSubject = catchAsync(async(req:Request, res:Response)=>{
    const loggerInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateExamSubjectZodSchema;
    const result = await examSubjectServices.createExamSubject(
        loggerInUser, payload
    );

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: `Exam subject created successfully.`,
        data: result
    })
});

// ===================================================================
// DELETE EXAM SUBJECT CONTROLLER
// ===================================================================
const deleteExamSubject = catchAsync(async(req:Request, res:Response)=>{
    const loggerInUser = helperFunctions.requiredUser(req);
    const {exam_subject_id} = req.params as unknown as TExamSubjectIdParamsZodSchema;

    const result = await examSubjectServices.deleteExamSubject(
        loggerInUser, exam_subject_id
    );
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Exam subject deleted successfully.`,
        data: result
    })
});

// ===================================================================
// UPDATE EXAM SUBJECT CONTROLLER
// ===================================================================
const updateExamSubject = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const {exam_subject_id} = req.params as unknown as TExamSubjectIdParamsZodSchema;
    const payload = req.body as TUpdateExamSubjectZodSchema;

    const result = await examSubjectServices.updateExamSubject(
        loggedInUser, payload, exam_subject_id
    );
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Exam subject updated successfully.`,
        data: result
    })
});

// ===================================================================
// UPDATE EXAM SUBJECT SINGLE FIELD CONTROLLER
// ===================================================================
const updateSingleFieldExamSubject = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateExamSubjectSingleFieldZodSchema;
    const {exam_subject_id} = req.params as unknown as TExamSubjectIdParamsZodSchema;
    const result = await examSubjectServices.updateSingleFieldExamSubject(
        loggedInUser, payload, exam_subject_id
    );

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Exam subject field ${payload.field} updated successfully.`,
        data: result
    })
});

// ===================================================================
// GET ALL EXAM SUBJECTS CONTROLLER
// ===================================================================
const getAllExamSubjects = catchAsync(async(req:Request, res:Response)=>{
    helperFunctions.requiredUser(req);
    const result = await examSubjectServices.getAllExamSubjects();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `All exam subjects retrieved successfully.`,
        data: result
    })
});

// ===================================================================
// GET EXAM SUBJECT BY ID SERVICE LAYER
// ===================================================================
const getExamSubjectById = catchAsync(async(req:Request, res:Response)=>{
    const {exam_subject_id} = req.params as unknown as TExamSubjectIdParamsZodSchema;
    const result = await examSubjectServices.getExamSubjectById(exam_subject_id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Exam subject retrieved successfully.`,
        data: result
    })
});
export const examSubjectController = {
    createExamSubject,
    deleteExamSubject,
    updateExamSubject,
    updateSingleFieldExamSubject,
    getAllExamSubjects,
    getExamSubjectById
}