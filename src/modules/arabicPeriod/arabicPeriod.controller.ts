import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { arabicPeriodServices } from "./arabicPeriod.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { TDeleteArabicPeriodParamsZodSchema, TGetSingleArabicPeriodParamsZodSchema, TUpdateArabicPeriodSingleFieldParamsZodSchema } from "./arabicPeriod.zodValidation";

// ==========================================================
// CREATE ARABIC PERIOD CONTROLLER
// ==========================================================
const createArabicPeriod = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await arabicPeriodServices.createArabicPeriod(payload, loggedInUser);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: `Arabic period created successfully.`,
        data: result
    })
});

// ==========================================================
// DELETE ARABIC PERIOD CONTROLLER
// ==========================================================
const deleteArabicPeriod = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const {id} = req.params as unknown as TDeleteArabicPeriodParamsZodSchema;
    const result = await arabicPeriodServices.deleteArabicPeriod(id, loggedInUser);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Arabic period deleted successfully.`,
        data: result
    })
});


// ==========================================================
// UPDATE ARABIC PERIOD SINGLE FIELD CONTROLLER
// ==========================================================
const updateArabicPeriodSingleField = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const {id} = req.params as unknown as TUpdateArabicPeriodSingleFieldParamsZodSchema;
    const payload = req.body;
    const result = await arabicPeriodServices.updateArabicPeriodSingleField(
        payload, id, loggedInUser
    );

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Single field updated successfully.`,
        data: result
    })
});

// ==========================================================
// GET ALL ARABIC PERIOD CONTROLLER
// ==========================================================
const getAllArabicPeriods = catchAsync(async(req:Request, res:Response)=>{
    helperFunctions.requiredUser(req);
    const result = await arabicPeriodServices.getAllArabicPeriods()

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Arabic periods retrieved successfully.`,
        data: result
    })
});

// ==========================================================
// GET SINGLE ARABIC PERIOD CONTROLLER
// ==========================================================
const getSingleArabicPeriod= catchAsync(async(req:Request, res:Response)=>{
    helperFunctions.requiredUser(req);
    const {id} = req.params as unknown as TGetSingleArabicPeriodParamsZodSchema
    const result = await arabicPeriodServices.getSingleArabicPeriod(id);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Arabic period retrieved successfully.`,
        data: result
    })
})
export const arabicPeriodController = {
    createArabicPeriod,
    deleteArabicPeriod,
    updateArabicPeriodSingleField,
    getAllArabicPeriods,
    getSingleArabicPeriod
}