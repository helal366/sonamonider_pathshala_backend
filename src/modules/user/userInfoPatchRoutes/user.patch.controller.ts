import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync.js";
import { TChangeUserPositionZodSchema, TChangeUserRoleZodSchema } from "./user.patch.zod.validation.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { userPatchServices } from "./user.patch.service.js";

// CHANGE USER POSITION
const changeUserPosition = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload: TChangeUserPositionZodSchema = req.body;
    const loggedInUser = req.user;
    if (!loggedInUser)
      throw new AppError(`Please login`, StatusCodes.BAD_REQUEST);

    const result = await userPatchServices.changeUserPosition(
      payload,
      loggedInUser,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `User Position change successful`,
      data: result,
    });
  },
);


// CHANGE USER ROLE 
const changeUserRole = catchAsync(async(req:Request, res: Response, next: NextFunction)=>{
  const payload:TChangeUserRoleZodSchema=req.body;
  const loggedInUser = req.user;
  if(!loggedInUser){
    throw new AppError(`Please login`, StatusCodes.BAD_REQUEST);
  }

  const result = await userPatchServices.changeUserRole(
      payload,
      loggedInUser,
    );

  sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `User Role change successful`,
      data: result,
    });
})
export const userPatchController = {
  changeUserPosition,
  changeUserRole
};
