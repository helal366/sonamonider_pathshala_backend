import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { classServices } from "./class.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { TDeleteClassZodSchema } from "./class.zod.validation";


// =============================================
// CREATE CLASS NAME CONTROLLER
// =============================================
const createClassName=catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await classServices.createClassName(payload, loggedInUser);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: `Class created successfully.`,
        data: result
    })
});

// =============================================
// DELETE CLASS NAME CONTROLLER
// =============================================
const deleteClassName = catchAsync(async(req:Request, res:Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload:TDeleteClassZodSchema = {
        params: req.params as TDeleteClassZodSchema["params"]
    };
    const {class_id} = payload.params;

    const result = await classServices.deleteClassName(class_id, loggedInUser);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Class name deleted successfully.`,
        data: result
    })
})
export const classController = {
    createClassName,
    deleteClassName
}