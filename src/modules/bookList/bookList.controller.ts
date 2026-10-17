import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const createBookList = catchAsync(async(req:Request, res: Response)=>{
    
});

export const bookListController = {
    createBookList
}