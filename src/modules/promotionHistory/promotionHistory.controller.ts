import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { promotionHistoryServices } from "./promotionHistory.service.js";
import {
  TPromotionHistoryEntityIdParamsZodSchema,
  TPromotionHistoryIdParamsZodSchema,
} from "./promotionHistory.zodValidation.js";

const getAllPromotionHistories = catchAsync(
  async (req: Request, res: Response) => {
    helperFunctions.requiredUser(req);
    const result = await promotionHistoryServices.getAllPromotionHistories();
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Promotion histories retrieved successfully.",
      data: result,
    });
  },
);

const getPromotionHistoryById = catchAsync(
  async (req: Request<TPromotionHistoryIdParamsZodSchema>, res: Response) => {
    helperFunctions.requiredUser(req);
    const result = await promotionHistoryServices.getPromotionHistoryById(
      req.params.id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Promotion history retrieved successfully.",
      data: result,
    });
  },
);

const getPromotionHistoryByManagementStaffId = catchAsync(
  async (
    req: Request<TPromotionHistoryEntityIdParamsZodSchema>,
    res: Response,
  ) => {
    helperFunctions.requiredUser(req);
    const result = await promotionHistoryServices.getPromotionHistoryByEntity(
      "management_staff",
      req.params.entity_id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Management staff promotion history retrieved successfully.",
      data: result,
    });
  },
);

const getPromotionHistoryByAcademicStaffId = catchAsync(
  async (
    req: Request<TPromotionHistoryEntityIdParamsZodSchema>,
    res: Response,
  ) => {
    helperFunctions.requiredUser(req);
    const result = await promotionHistoryServices.getPromotionHistoryByEntity(
      "academic_staff",
      req.params.entity_id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Academic staff promotion history retrieved successfully.",
      data: result,
    });
  },
);

const getPromotionHistoryByStudentId = catchAsync(
  async (
    req: Request<TPromotionHistoryEntityIdParamsZodSchema>,
    res: Response,
  ) => {
    helperFunctions.requiredUser(req);
    const result = await promotionHistoryServices.getPromotionHistoryByEntity(
      "student",
      req.params.entity_id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Student promotion history retrieved successfully.",
      data: result,
    });
  },
);

const getPromotionHistoryByGoverningBodyId = catchAsync(
  async (
    req: Request<TPromotionHistoryEntityIdParamsZodSchema>,
    res: Response,
  ) => {
    helperFunctions.requiredUser(req);
    const result = await promotionHistoryServices.getPromotionHistoryByEntity(
      "governing_body",
      req.params.entity_id,
    );
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "Governing body promotion history retrieved successfully.",
      data: result,
    });
  },
);

export const promotionHistoryController = {
  getAllPromotionHistories,
  getPromotionHistoryById,
  getPromotionHistoryByManagementStaffId,
  getPromotionHistoryByAcademicStaffId,
  getPromotionHistoryByStudentId,
  getPromotionHistoryByGoverningBodyId,
};
