import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { academicStaffServices } from "./academicStaff.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


// ===============================================
// ASSIGN GRAGE GROUP TEACHER SERVICE LAYER
// ===============================================
const assignGradeGroupTeacher= catchAsync(async(req:Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await academicStaffServices.assignGradeGroupTeacher(payload, loggedInUser);

    sendResponse(res, {
        success: true, 
        statusCode: StatusCodes.OK,
        message: `Teacher assigned to Grade or Group Teacher`,
        data: result
    })
});

export const academicStaffController = {
    assignGradeGroupTeacher
}