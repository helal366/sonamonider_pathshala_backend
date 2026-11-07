import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { studentResultServices } from "./studentResult.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

// ======================================================
// CREATE STUDENT RESULT CONTROLLER
// ======================================================
const createStudentResult = catchAsync(async(req: Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await studentResultServices.createStudentResult();

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: `Student result created successfully.`,
        data: result
    })
});

export const studentResultController = {
    createStudentResult
}