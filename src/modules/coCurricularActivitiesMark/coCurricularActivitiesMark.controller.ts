import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { coCurricularActivitiesMarkServices } from "./coCurricularActivitiesMark.service.js";
import {
  TCreateCoCurricularActivitiesMark,
  TUpdateCoCurricularActivitiesMark,
  TUpdateCoCurricularActivitiesMarkField,
} from "./coCurricularActivitiesMark.zodValidation.js";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await coCurricularActivitiesMarkServices.createCoCurricularActivitiesMark(
    req.body as TCreateCoCurricularActivitiesMark,
    helperFunctions.requiredUser(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Co-curricular activities mark created successfully.",
    data: result,
  });
});

const remove = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result =
    await coCurricularActivitiesMarkServices.deleteCoCurricularActivitiesMark(
      req.params.id,
      helperFunctions.requiredUser(req),
    );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Co-curricular activities mark deleted successfully.",
    data: result,
  });
});

const update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result =
    await coCurricularActivitiesMarkServices.updateCoCurricularActivitiesMark(
      req.params.id,
      req.body as TUpdateCoCurricularActivitiesMark,
      helperFunctions.requiredUser(req),
    );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Co-curricular activities mark updated successfully.",
    data: result,
  });
});

const updateField = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result =
    await coCurricularActivitiesMarkServices.updateCoCurricularActivitiesMarkField(
      req.params.id,
      req.body as TUpdateCoCurricularActivitiesMarkField,
      helperFunctions.requiredUser(req),
    );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Co-curricular activities mark field updated successfully.",
    data: result,
  });
});

const getAll = catchAsync(async (_req: Request, res: Response) => {
  helperFunctions.requiredUser(_req);
  const result =
    await coCurricularActivitiesMarkServices.getAllCoCurricularActivitiesMarks();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Co-curricular activities marks retrieved successfully.",
    data: result,
  });
});

const getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  helperFunctions.requiredUser(req);
  const result =
    await coCurricularActivitiesMarkServices.getCoCurricularActivitiesMarkById(
      req.params.id,
    );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Co-curricular activities mark retrieved successfully.",
    data: result,
  });
});

export const coCurricularActivitiesMarkController = {
  create,
  remove,
  update,
  updateField,
  getAll,
  getById,
};
