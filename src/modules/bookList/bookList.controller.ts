import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { bookListServices } from "./bookList.service";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { TDeleteAddressZodSchema } from "../address/address.zodValidation";
import { TDeleteBookListParamsZodSchema } from "./bookList.zodValidation";


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
})
export const bookListController = {
    createBookList,
    deleteBookList
}