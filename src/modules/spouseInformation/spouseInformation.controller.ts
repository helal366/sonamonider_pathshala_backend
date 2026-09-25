import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../utils/sendResponse";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { spouseInformationServices } from "./spouseInformation.service";

// ============================================================
// CREATE SPOUSE INFORMATION CONTROLLER
// ============================================================
const createSpouseInformation = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await spouseInformationServices.createSpouseInformation(
      req.body,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Spouse information created successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE SPOUSE INFORMATION CONTROLLER
// ============================================================
const deleteSpouseInformation = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await spouseInformationServices.deleteSpouseInformation(
      req.body,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE SPOUSE FULL NAME CONTROLLER
// ============================================================
const updateSpouseName=  catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await spouseInformationServices.updateSpouseName(
      req.body,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information deleted successfully.",
      data: result,
    });
  },
);
export const spouseInformationController = {
  createSpouseInformation,
  deleteSpouseInformation,
  updateSpouseName
};
