import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { studentServices } from "./student.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

// =============================================
// STUDENT READMISSION CONTROLLER
// =============================================
const studentReadmission = catchAsync(async(req:Request, res:Response)=>{
    
});

// =============================================
// ADD RESPONSIBLE TEACHER CONTROLLER
// =============================================
const addResponsibleTeacher=catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await studentServices.addResponsibleTeacher(payload, loggedInUser);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Responsible teacher added successfully.`,
        data: result
    })
})
export const studentController = {
    studentReadmission,
    addResponsibleTeacher
}