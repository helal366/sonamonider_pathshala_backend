import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { motherDetailsServices } from "./motherDetails.service.js";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import {
  TConnectMotherDetailsZodSchema,
  TCreateMotherDetailsZodSchema,
  TDisconnectMotherDetailsZodSchema,
  TUpdateMotherDetailsFieldPayload,
} from "./motherDetails.zodValidation.js";

// ============================================================
// CREATE MOTHER DETAILS CONTROLLER
// ============================================================
const createMotherDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TCreateMotherDetailsZodSchema;

    const result = await motherDetailsServices.createMotherDetails(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Mother details created successfully.",
      data: result,
    });
  },
);

const connectMotherDetails = catchAsync(async (req: Request, res: Response) => {
  const loggedInUser = helperFunctions.requiredUser(req);
  const payload = req.body as TConnectMotherDetailsZodSchema;
  const result = await motherDetailsServices.connectMotherDetails(
    payload,
    loggedInUser,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Mother details connected successfully.",
    data: result,
  });
});

const updateMotherDetailsField = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TUpdateMotherDetailsFieldPayload;
    const result = await motherDetailsServices.updateMotherDetailsField(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Mother details updated successfully.",
      data: result,
    });
  },
);

const disconnectMotherDetails = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const payload = req.body as TDisconnectMotherDetailsZodSchema;
    const result = await motherDetailsServices.disconnectMotherDetails(
      payload,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Mother details disconnected successfully.",
      data: result,
    });
  },
);

export const motherDetailsController = {
  createMotherDetails,
  connectMotherDetails,
  updateMotherDetailsField,
  disconnectMotherDetails,
};
