import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { arabicPeriodServices } from "./arabicPeriod.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { TDeleteArabicPeriodParamsZodSchema } from "./arabicPeriod.zodValidation";

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
})
export const arabicPeriodController = {
    createArabicPeriod,
    deleteArabicPeriod
}