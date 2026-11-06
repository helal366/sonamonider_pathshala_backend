import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions"
import { TCreateExamSubjectZodSchema, TDeleteExamSubjectParamsZodSchema } from "./examSubject.zodValidation";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { examSubjectServices } from "./examSubject.service";

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
        message: `Exam subject created.`,
        data: result
    })
});

// ===================================================================
// DELETE EXAM SUBJECT CONTROLLER
// ===================================================================
const deleteExamSubject = catchAsync(async(req:Request, res:Response)=>{
    const loggerInUser = helperFunctions.requiredUser(req);
    const {exam_subject_id} = req.params as unknown as TDeleteExamSubjectParamsZodSchema;

    const result = await examSubjectServices.deleteExamSubject(
        loggerInUser, exam_subject_id
    );
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Exam subject deleted.`,
        data: result
    })
})
export const examSubjectController = {
    createExamSubject,
    deleteExamSubject
}