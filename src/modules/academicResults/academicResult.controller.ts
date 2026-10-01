import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { academicResultServices } from "./academicResult.service";

// ==========================================
// CREATE ACADEMIC RESULT CONTROLLER
// ==========================================
const createAcademicResult = catchAsync(async(req:Request, res:Response)=>{
    const payload = req.body;
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await academicResultServices.createAcademicResult(payload, loggedInUser)
});

export const academicResultController = {
    createAcademicResult
}