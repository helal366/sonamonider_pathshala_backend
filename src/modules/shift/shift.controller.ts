import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { catchAsync } from "../../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { shiftServices } from "./shift.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { shiftZodSchema } from "./shift.zod.validation";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";

// =============================================
// CREATE SHIFT CONTROLLER
// =============================================
const createShift=catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    
    const result = await shiftServices.createShift( payload, loggedInUser,);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: `Shift name created successfully.`,
        data: result
    })
});

// =============================================
// DELETE SHIFT CONTROLLER
// =============================================
const deleteShift=catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const {id} = req.params ;
    const safeParse_shift_id = shiftZodSchema.deleteShiftZodSchema.safeParse({id});
    if(!safeParse_shift_id.success){
        throw new AppError(safeParse_shift_id.error.issues[0]?.message ?? "Invalid Shift ID format.",StatusCodes.BAD_REQUEST)
    }
    const result = await shiftServices.deleteShift(safeParse_shift_id.data.id, loggedInUser);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Shift name deleted.`,
        data: result
    })
});

// =============================================
// UPDATE SHIFT FIELD CONTROLLER
// =============================================
const updateShiftField = catchAsync(async(req:Request, res:Response)=>{

})
export const shiftController = {
    createShift,
    deleteShift,
    updateShiftField
}