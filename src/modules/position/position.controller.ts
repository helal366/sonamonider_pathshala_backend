import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { TCreatePositionZodSchema, TDeletePositionZodSchema, TUpdatePositionZodSchema } from "./position.zod.validation.js";
import { positionServices } from "./position.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";

// CREATE POSITION CONTROLLER
const createPosition = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = req.user;
    
        if (!loggedInUser) {
          throw new AppError(
            "Please login.",
            StatusCodes.BAD_REQUEST,
          );
        }
    const payload: TCreatePositionZodSchema = req.body;
    const result = await positionServices.createPosition(payload, loggedInUser);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: `New Position created successfully.`,
      data: result,
    });
  },
);

// UPDATE POSITION CONTROLLER
const updatePosition = catchAsync(
  async(req:Request, res: Response, next: NextFunction)=>{
    const loggedInUser = req.user;
    
        if (!loggedInUser) {
          throw new AppError(
            "Please login.",
            StatusCodes.BAD_REQUEST,
          );
        }
    const payload: TUpdatePositionZodSchema = req.body;
    const result = await positionServices.updatePosition(payload, loggedInUser);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Position updated successfully.`,
      data: result,
    });
  }
);


// DELETE POSITION CONTROLLER
const deletePosition = catchAsync(
  async(req:Request, res: Response, next: NextFunction)=>{
     const loggedInUser = req.user;
    
        if (!loggedInUser) {
          throw new AppError(
            "Please login.",
            StatusCodes.BAD_REQUEST,
          );
        }
    const payload: TDeletePositionZodSchema = req.body;
    const result = await positionServices.deletePosition(payload, loggedInUser);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Position purged and deleted successfully.`,
      data: result,
    });
  }
);


// GET ALL POSITIONS
const getAllPositions = catchAsync(
  async(req:Request, res: Response, next: NextFunction)=>{
    const loggedInUser = req.user;
    
        if (!loggedInUser) {
          throw new AppError(
            "Please login.",
            StatusCodes.BAD_REQUEST,
          );
        }
    const result = await positionServices.getAllPositions();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Positions retrived successfully.`,
      data: result,
    });
});

// GET SINGLE POSITION
const getSinglePosition= catchAsync(
  async(req:Request, res: Response, next: NextFunction)=>{
   const id  = req.params.id as string;

   const result = await positionServices.getSinglePosition(id);
   sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Position retrieved successfully.`,
      data: result,
    });
})
export const positionController = {
  createPosition,
  updatePosition,
  deletePosition,
  getAllPositions,
  getSinglePosition
};
