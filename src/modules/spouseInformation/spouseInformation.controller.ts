import { Request, Response } from "express"
import { catchAsync } from "../../utils/catchAsync"
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { helperFunctions } from '../../helperFunctions/helpers/helperFunctions';
import { spouseInformationServices } from "./spouseInformation.service";

const createSpouseInformation = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req); 
    const result = await spouseInformationServices.createSpouseInformation( req.body, loggedInUser, ); 
    sendResponse(res, { 
        statusCode: StatusCodes.CREATED, 
        success: true, 
        message: "Spouse information created successfully.", 
        data: result, });
})
export const spouseInformationController = {
    createSpouseInformation
}