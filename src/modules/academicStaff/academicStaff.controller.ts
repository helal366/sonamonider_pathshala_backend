import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { academicStaffServices } from "./academicStaff.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import {
    TUpdateAcademicStaffFieldZodSchema,
    TUpdateSubjectForSubjectTeacherZodSchema,
} from "./academicStaff.zodValidation";

const updateSubjectForSubjectTeacher = catchAsync(async(req: Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload: TUpdateSubjectForSubjectTeacherZodSchema = req.body;
    const { id } = req.params as unknown as { id: string };
    const result = await academicStaffServices.updateSubjectForSubjectTeacher(payload, loggedInUser, id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Subject is successfully updated to Subject Teacher`,
        data: result
    })
});

const updateAcademicStaffField = catchAsync(async(req: Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload: TUpdateAcademicStaffFieldZodSchema = req.body;
    const { id } = req.params as unknown as { id: string };
    const result = await academicStaffServices.updateAcademicStaffField(payload, loggedInUser, id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Academic staff field updated successfully.`,
        data: result
    })
});

export const academicStaffController = {
    updateSubjectForSubjectTeacher,
    updateAcademicStaffField,
}