import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { periodServices } from "./generalPeriod.service.js";
import {
  TDeletePeriodParams,
  TGetSinglePeriodParams,
  TUpdatePeriodParams,
} from "./generalPeriod.zodValidation.js";

const createPeriod = catchAsync(async (req: Request, res: Response) => {
  const user = helperFunctions.requiredUser(req);
  const result = await periodServices.createPeriod(req.body, user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Period created successfully.",
    data: result,
  });
});

const updatePeriod = catchAsync(async (req: Request, res: Response) => {
  const user = helperFunctions.requiredUser(req);
  const { id } = req.params as unknown as TUpdatePeriodParams;
  const result = await periodServices.updatePeriod(req.body, user, id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Period updated successfully.",
    data: result,
  });
});

const updatePeriodSingleField = catchAsync(
  async (req: Request, res: Response) => {
    const user = helperFunctions.requiredUser(req);
    const { id } = req.params as unknown as TUpdatePeriodParams;
    const result = await periodServices.updatePeriodSingleField(
      req.body,
      user,
      id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Period field updated successfully.",
      data: result,
    });
  },
);

const deletePeriod = catchAsync(async (req: Request, res: Response) => {
  const user = helperFunctions.requiredUser(req);
  const { id } = req.params as unknown as TDeletePeriodParams;
  const result = await periodServices.deletePeriod(id, user);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Period deleted successfully.",
    data: result,
  });
});

const getAllPeriods = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const result = await periodServices.getAllPeriods();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Periods retrieved successfully.",
    data: result,
  });
});

const getSinglePeriod = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  const { id } = req.params as unknown as TGetSinglePeriodParams;
  const result = await periodServices.getSinglePeriod(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Period details retrieved successfully.",
    data: result,
  });
});

export const periodController = {
  createPeriod,
  updatePeriod,
  updatePeriodSingleField,
  deletePeriod,
  getAllPeriods,
  getSinglePeriod,
};
