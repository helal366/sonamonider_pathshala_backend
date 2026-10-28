import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { academicStaffServices } from "./academicStaff.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import {
    TAssignGradeGroupTeacherZodSchema,
    TDisconnectGradeGroupTeacherZodSchema,
    TUpdateAcademicStaffFieldZodSchema,
    TUpdateSubjectForSubjectTeacherZodSchema,
} from "./academicStaff.zodValidation";

// ================================================
// UPDATE SUBJECT FOR SUBJECT TEAHER CONTROLLER
// ================================================
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

// ================================================
// UPDATE ACADEMIC STAFF FIELD CONTROLLER
// ================================================
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

// =============================================
// ASSIGN GRADE GROUP TEACHER CONTROLLER
// =============================================
const assignGradeGroupTeacher= catchAsync(async(req: Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload: TAssignGradeGroupTeacherZodSchema = req.body;
        const result = await academicStaffServices.assignGradeGroupTeacher(
          payload,
          loggedInUser,
        );
        sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: result.email_sent
            ? "Grade or Group teacher assigned successfully."
            : "Grade or Group teacher assigned successfully, but the notification email could not be sent.",
          data: result,
        });
});

// =============================================
// DISCONNECT GRADE GROUP TEACHER CONTROLLER
// =============================================
const disconnectGradeGroupTeacher= catchAsync(async(req: Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload: TDisconnectGradeGroupTeacherZodSchema = req.body;
        const result = await academicStaffServices.disconnectGradeGroupTeacher(
          payload,
          loggedInUser,
        );
        sendResponse(res, {
          success: true,
          statusCode: StatusCodes.OK,
          message: `Grade or Group teacher disconnected successfully.`,
          data: result,
        });
});
export const academicStaffController = {
    updateSubjectForSubjectTeacher,
    updateAcademicStaffField,
    assignGradeGroupTeacher,
    disconnectGradeGroupTeacher
}