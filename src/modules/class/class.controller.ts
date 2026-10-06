import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { classServices } from "./class.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { TDeleteClassNameZodSchema, TUpdateClassFieldZodSchema } from "./class.zod.validation";


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
    const payload:TDeleteClassNameZodSchema = {
        params: req.params as TDeleteClassNameZodSchema["params"]
    };
    const {class_id} = payload.params;

    const result = await classServices.deleteClassName(class_id, loggedInUser);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Class name deleted successfully.`,
        data: result
    })
});

// =============================================
// UPDATE CLASS FIELD CONTROLLER
// =============================================
const updateClassField = catchAsync(async(req:Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload:TUpdateClassFieldZodSchema={
        params: req.params as TUpdateClassFieldZodSchema["params"],
        body: req.body as TUpdateClassFieldZodSchema["body"]
    };
    const {class_id} = payload.params;
    const {field, value} = payload.body;
    const updatePayload = {
        class_id, field, value
    }

    const result = await classServices.updateClassField(updatePayload, loggedInUser);

    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Class field updated successfully.`,
        data: result
    })
});

// =============================================
// GET ALL CLASS NAME CONTROLLER
// =============================================
const getAllClassNames = catchAsync(async(req:Request, res: Response)=>{
    helperFunctions.requiredUser(req);
    const result = await classServices.getAllClassNames();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Class names retrieved successfully.`,
        data: result
    })
});

const assignGradeGroupTeacher = catchAsync(async(req:Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await classServices.assignGradeGroupTeacher(payload, loggedInUser);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Grade or Group teacher assigned successfully.`,
        data: result
    })
});

// =============================================
// DISCONNECT GRADE GROUP TEACHER CONTROLLER
// =============================================
const disconnectGradeGroupTeacher = catchAsync(async(req:Request, res: Response)=>{
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result = await classServices.disconnectGradeGroupTeacher(payload, loggedInUser);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Grade or Group teacher assigned successfully.`,
        data: result
    })
})
export const classController = {
    createClassName,
    deleteClassName,
    updateClassField,
    getAllClassNames,
    assignGradeGroupTeacher,
    disconnectGradeGroupTeacher
}