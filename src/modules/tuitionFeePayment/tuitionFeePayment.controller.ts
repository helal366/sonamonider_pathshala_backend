import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { tuitionFeePaymentServices } from "./tuitionFeePayment.service";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";

// =========================================================
// Create Tuition Fee Route
// =========================================================
const createTuitionFeePayment = catchAsync(async(req:Request, res:Response)=>{
    if(!req.user){
        throw new AppError(`Please login.`, StatusCodes.BAD_REQUEST)
    }
    const payload = req.body;
    const user_id = req.user?.user_id;

    console.log({user_id})
    const result = await tuitionFeePaymentServices.createTuitionFeePayment(
        payload,
        user_id
    );
    sendResponse(res,{
        success: true,
        statusCode: StatusCodes.OK,
        message: ``,
        data: result
    })
})
export const tuitionFeePaymentController = {
    createTuitionFeePayment
}