import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { bookListServices } from "./bookList.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { bookListZodSchema, TDeleteBookListParamsZodSchema, TGetBookListsByClassIdParamsZodSchema, TUpdateBookListSingleFieldParamsZodSchema } from "./bookList.zodValidation";

// =====================================================================
// CREATE BOOK LIST CONTROLLER
// =====================================================================
const createBookList = catchAsync(async(req:Request, res: Response)=>{
    const LoggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body;
    const result =await bookListServices.createBookList(LoggedInUser, payload);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.CREATED,
        message: `Book list created successfully.`,
        data: result
    })
});

// =====================================================================
// DELETE BOOK LIST CONTROLLER
// =====================================================================
const deleteBookList = catchAsync(async(req:Request, res: Response)=>{
    const LoggedInUser = helperFunctions.requiredUser(req);
    const {id} = req.params as unknown as TDeleteBookListParamsZodSchema;
    const result = await bookListServices.deleteBookList(LoggedInUser, id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Book list deleted successfully.`,
        data: result
    })
});

// =====================================================================
// UPDATE BOOK LIST SINGLE FIELD CONTROLLER
// =====================================================================
const updateBookListSingleField = catchAsync(async(req:Request, res: Response)=>{
    const LoggedInUser = helperFunctions.requiredUser(req);
    const {id} = req.params as unknown as TUpdateBookListSingleFieldParamsZodSchema;
    const payload = req.body;
    const result = await bookListServices.updateBookListSingleField(LoggedInUser, payload, id);
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Book list single field updated successfully.`,
        data : result
    })
});

// =====================================================================
// GET ALL BOOK LIST CONTROLLER
// =====================================================================
const getAllBookList = catchAsync(async(req:Request, res: Response)=>{
    helperFunctions.requiredUser(req);
    const result = await bookListServices.getAllBookList();
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Book lists retrieved successfully.`,
        data : result
    })
});

// =====================================================================
// GET BOOK LIST BY CLASS ID CONTROLLER
// =====================================================================
const getBookListByClass = catchAsync(async(req:Request, res: Response)=>{
    helperFunctions.requiredUser(req);
    const {class_id} = req.params as unknown as TGetBookListsByClassIdParamsZodSchema;
    const result = await bookListServices.getBookListByClass(class_id)
    sendResponse(res, {
        success: true,
        statusCode: StatusCodes.OK,
        message: `Book lists retrieved successfully.`,
        data : result
    })
});

export const bookListController = {
    createBookList,
    deleteBookList,
    updateBookListSingleField,
    getAllBookList,
    getBookListByClass
}