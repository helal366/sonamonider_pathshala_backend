import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { academicYearServices } from "./academicYear.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { TGetSingleAcademicYearZodSchema } from "./academicYear.zod.validation";

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

// ==========================================
// GET ALL ACADEMIC YEAR CONTROLLER
// ==========================================
const getAllAcademicYearName = catchAsync(async(req:Request, res:Response)=>{
    helperFunctions.requiredUser(req);
    const result = await academicYearServices.getAllAcademicYearName();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Academic Years retrieved successfully.`,
        data: result
    })
});

const getSingleAcademicYearWithHistory= catchAsync(async(req:Request, res:Response)=>{
    helperFunctions.requiredUser(req);
    const payload:TGetSingleAcademicYearZodSchema = {
        params: req.params as TGetSingleAcademicYearZodSchema["params"]
    };
    const academic_year_id = payload.params.academic_year_id
    const result = await academicYearServices.getSingleAcademicYearWithHistory(academic_year_id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Academic Year retrieved successfully.`,
        data: result
    })
});
export const academicYearController = {
    createAcademicYear,
    deleteAcademicYear,
    updateAcademicYearField,
    getAllAcademicYearName,
    getSingleAcademicYearWithHistory
}

