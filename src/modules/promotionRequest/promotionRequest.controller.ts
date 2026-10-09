import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { TActionPromotionRequestZodSchema, TCreatePromotionRequestZodSchema, TDeletePromotionRequestZodSchema, TGetPromotionRequestsZodSchema, TGetSinglePromotionRequestZodSchema } from "./promotionRequest.zod.validation";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { promotionRequestServices } from "./promotionRequest.service";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { promotionRequestActionServices } from "./promotionRequest.actionService";
import { promotionRequestGetServices } from "./promotionRequest.getService";

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

// =========================================================
// ACTION PROMOTION REQUEST CONTROLLER
// =========================================================
const actionPromotionRequest=catchAsync(async(req: Request, res: Response)=>{
  const payload: TActionPromotionRequestZodSchema = req.body;
  if(!payload){
    throw new AppError(`Payload not found.`, StatusCodes.NOT_FOUND)
  }
  const loggedInUser = helperFunctions.requiredUser(req);
  
  const result = await promotionRequestActionServices.actionPromotionRequest(payload, loggedInUser);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Promotion request has been processed as ${payload.action_status} successfully.`,
    data: result,
  });
});

// =========================================================
// GET PROMOTION REQUESTS FILTER CONTROLLER
// =========================================================
const getAllPromotionRequests=catchAsync(async(req: Request, res: Response)=>{
  helperFunctions.requiredUser(req);
  const payload = req.query as unknown as TGetPromotionRequestsZodSchema;
  const result = await promotionRequestGetServices.getPromotionRequests(payload);
  const {meta, data} =result;
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: `Promotion requests retrieved successfully.`,
    data: {
      meta,
      requests:data
    }
  });

});

// =========================================================
// GET SINGLE PROMOTION REQUEST CONTROLLER
// =========================================================
const getSinglePromotionRequest = catchAsync(async (req: Request, res: Response) => {
  helperFunctions.requiredUser(req);
  
  // Cast and capture safely from route path parameters
  const { promotion_request_id } = req.params as unknown as TGetSinglePromotionRequestZodSchema;
  
  const result = await promotionRequestGetServices.getPromotionRequestById(promotion_request_id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Promotion request details retrieved successfully.",
    data: result,
  });
});

export const promotionRequestController = {
  createPromotionRequest,
  deletePromotionRequest,
  actionPromotionRequest,
  getAllPromotionRequests,
  getSinglePromotionRequest
};
