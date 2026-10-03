import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { academicYearServices } from "./academicYear.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";

// ==========================================
// CREATE ACADEMIC YEAR CONTROLLER
// ==========================================
const createAcademicYear = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await academicYearServices.createAcademicYear(payload, loggedInUser);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: `Academic Year created successfully.`,
        data: result
    })
});

// ==========================================
// DELETE ACADEMIC YEAR CONTROLLER
// ==========================================
const deleteAcademicYear = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await academicYearServices.deleteAcademicYear(payload, loggedInUser);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Academic Year deleted successfully.`,
        data: result
    })
});

// ==========================================
// UPDATE ACADEMIC YEAR FIELD CONTROLLER
// ==========================================
const updateAcademicYearField = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await academicYearServices.updateAcademicYearField(payload, loggedInUser);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Academic Year updated successfully.`,
        data: result
    })
});
export const academicYearController = {
    createAcademicYear,
    deleteAcademicYear,
    updateAcademicYearField
}

