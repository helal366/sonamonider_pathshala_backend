import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { classServices } from "./class.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";


// =============================================
// CREATE CLASS NAME CONTROLLER
// =============================================
const createClass=catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await classServices.createClass(payload, loggedInUser);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: `Class created successfully.`,
        data: result
    })
});

export const classController = {
    createClass
}