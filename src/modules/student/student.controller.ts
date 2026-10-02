import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";

const studentReadmission = catchAsync(async(req:Request, res:Response)=>{
    
});

export const studentController = {
    studentReadmission
}