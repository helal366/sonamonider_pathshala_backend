import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { TCreatePromotionRequestZodSchema } from "./promotionRequests.zod.validation"
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { promotionRequestServices } from "./promotionRequests.service";


const createPromotionRequest= catchAsync(async(req:Request, res:Response)=>{
    const payload:TCreatePromotionRequestZodSchema= req.body;
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await promotionRequestServices.createPromotionRequest(
        payload, loggedInUser
    );

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Promotion request created successfully.`,
        data: result
    })
})
export const promotionRequestController ={
    createPromotionRequest
}