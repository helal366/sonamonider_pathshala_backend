import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TCreatePromotionRequestZodSchema, TDeletePromotionRequestZodSchema } from "./promotionRequest.zod.validation";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { promotionRequestServices } from "./promotionRequest.service";

// =========================================================
// CREATE PROMOTION REQUEST CONTROLLER
// =========================================================
const createPromotionRequest = catchAsync(
  async (req: Request, res: Response) => {
    const payload: TCreatePromotionRequestZodSchema = req.body;
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await promotionRequestServices.createPromotionRequest(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Promotion request created successfully.`,
      data: result,
    });
  },
);

// =========================================================
// DELETE PROMOTION REQUEST CONTROLLER
// =========================================================
const deletePromotionRequest = catchAsync(
  async (req: Request, res: Response) => {
    const payload: TDeletePromotionRequestZodSchema = req.body;
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await promotionRequestServices.deletePromotionRequest(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: `Promotion request deleted successfully.`,
      data: result,
    });
  }
);
export const promotionRequestController = {
  createPromotionRequest,
  deletePromotionRequest
};
