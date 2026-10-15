import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { classRoutineServices } from "./classRoutine.service.js";
import {
  TDeleteClassRoutineParams,
  TGetSingleClassRoutineParams,
  TUpdateClassRoutineParams,
} from "./classRoutine.zodValidation.js";

const createClassRoutine = catchAsync(async (req: Request, res: Response) => {
  const user = helperFunctions.requiredUser(req);
  const result = await classRoutineServices.createClassRoutine(req.body, user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Class routine created successfully.",
    data: result,
  });
});

const updateClassRoutine = catchAsync(async (req: Request, res: Response) => {
  const user = helperFunctions.requiredUser(req);
  const { id } = req.params as unknown as TUpdateClassRoutineParams;
  const result = await classRoutineServices.updateClassRoutine(
    req.body,
    user,
    id,
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Class routine updated successfully.",
    data: result,
  });
});

const updateClassRoutineSingleField = catchAsync(
  async (req: Request, res: Response) => {
    const user = helperFunctions.requiredUser(req);
    const { id } = req.params as unknown as TUpdateClassRoutineParams;
    const result = await classRoutineServices.updateClassRoutineSingleField(
      req.body,
      user,
      id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Class routine field updated successfully.",
      data: result,
    });
  },
);

const deleteClassRoutine = catchAsync(async (req: Request, res: Response) => {
  const user = helperFunctions.requiredUser(req);
  const { id } = req.params as unknown as TDeleteClassRoutineParams;
  const result = await classRoutineServices.deleteClassRoutine(id, user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Class routine deleted successfully.",
    data: result,
  });
});

const getAllClassRoutines = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await classRoutineServices.getAllClassRoutines();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Class routines retrieved successfully.",
    data: result,
  });
});

const getSingleClassRoutine = catchAsync(
  async (req: Request, res: Response) => {
    helperFunctions.requiredUser(req);
    const { id } = req.params as unknown as TGetSingleClassRoutineParams;
    const result = await classRoutineServices.getSingleClassRoutine(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Class routine details retrieved successfully.",
      data: result,
    });
  },
);

export const classRoutineController = {
  createClassRoutine,
  updateClassRoutine,
  updateClassRoutineSingleField,
  deleteClassRoutine,
  getAllClassRoutines,
  getSingleClassRoutine,
};
