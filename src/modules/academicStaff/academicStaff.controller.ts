import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { academicStaffServices } from "./academicStaff.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


// ===============================================
// UPDATE GRAGE GROUP TEACHER CONTROLLER
// ===============================================
const updateGradeGroupTeacher = catchAsync(async(req:Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await academicStaffServices.updateGradeGroupTeacher(payload, loggedInUser);

    sendResponse(res, {
        success: true, 
        statusCode: StatusCodes.OK,
        message: ` Grade or Group Teacher updated successfully.`,
        data: result
    })
})
export const academicStaffController = {
    updateGradeGroupTeacher
}