import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { moralMannersEvaluationMarkServices } from "./moralMannersEvaluationMark.service.js";
import {
  TCreateMoralMannersEvaluationMark,
  TUpdateMoralMannersEvaluationMark,
  TUpdateMoralMannersEvaluationMarkField,
} from "./moralMannersEvaluationMark.zodValidation.js";

const create = catchAsync(async (req: Request, res: Response) => {
  const result = await moralMannersEvaluationMarkServices.createMoralMannersEvaluationMark(
    req.body as TCreateMoralMannersEvaluationMark,
    helperFunctions.requiredUser(req),
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Moral manners evaluation mark created successfully.",
    data: result,
  });
});

const remove = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result =
    await moralMannersEvaluationMarkServices.deleteMoralMannersEvaluationMark(
      req.params.id,
      helperFunctions.requiredUser(req),
    );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Moral manners evaluation mark deleted successfully.",
    data: result,
  });
});

const update = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result =
    await moralMannersEvaluationMarkServices.updateMoralMannersEvaluationMark(
      req.params.id,
      req.body as TUpdateMoralMannersEvaluationMark,
      helperFunctions.requiredUser(req),
    );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Moral manners evaluation mark updated successfully.",
    data: result,
  });
});

const updateField = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  const result =
    await moralMannersEvaluationMarkServices.updateMoralMannersEvaluationMarkField(
      req.params.id,
      req.body as TUpdateMoralMannersEvaluationMarkField,
      helperFunctions.requiredUser(req),
    );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Moral manners evaluation mark field updated successfully.",
    data: result,
  });
});

const getAll = catchAsync(async (_req: Request, res: Response) => {
  helperFunctions.requiredUser(_req);
  const result =
    await moralMannersEvaluationMarkServices.getAllMoralMannersEvaluationMarks();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Moral manners evaluation marks retrieved successfully.",
    data: result,
  });
});

const getById = catchAsync(async (req: Request<{ id: string }>, res: Response) => {
  helperFunctions.requiredUser(req);
  const result =
    await moralMannersEvaluationMarkServices.getMoralMannersEvaluationMarkById(
      req.params.id,
    );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Moral manners evaluation mark retrieved successfully.",
    data: result,
  });
});

export const moralMannersEvaluationMarkController = {
  create,
  remove,
  update,
  updateField,
  getAll,
  getById,
};
