import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { Request, Response } from "express";
import { spouseInformationPatchServices } from "./spouseInformation.patch.service.js";

// ============================================================
// UPDATE SPOUSE FULL NAME CONTROLLER
// ============================================================
const updateSpouseName=  catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await spouseInformationPatchServices.updateSpouseName(
      req.body,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE SPOUSE CONTACT NO CONTROLLER
// ============================================================

const updateSpouseContactNo = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationPatchServices.updateSpouseContactNo(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE SPOUSE FATHER NAME CONTROLLER
// ============================================================

const updateSpouseFatherName = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationPatchServices.updateSpouseFatherName(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE SPOUSE FATHER CONTACT NO CONTROLLER
// ============================================================

const updateSpouseFatherContactNo = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationPatchServices.updateSpouseFatherContactNo(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE SPOUSE MOTHER NAME CONTROLLER
// ============================================================

const updateSpouseMotherName = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationPatchServices.updateSpouseMotherName(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE SPOUSE MOTHER CONTACT NO CONTROLLER
// ============================================================

const updateSpouseMotherContactNo = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationPatchServices.updateSpouseMotherContactNo(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE SPOUSE OCCUPATION CONTROLLER
// ============================================================

const updateSpouseOccupation = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationPatchServices.updateSpouseOccupation(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE SPOUSE JOB TITLE CONTROLLER
// ============================================================

const updateSpouseJobTitle = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationPatchServices.updateSpouseJobTitle(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE SPOUSE MONTHLY INCOME CONTROLLER
// ============================================================

const updateSpouseMonthlyIncome = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationPatchServices.updateSpouseMonthlyIncome(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse information updated successfully.",
      data: result,
    });
  },
);

export const spouseInformationPatchController = {
  updateSpouseName,
  updateSpouseContactNo,
  updateSpouseFatherName,
  updateSpouseFatherContactNo,
  updateSpouseMotherName,
  updateSpouseMotherContactNo,
  updateSpouseOccupation,
  updateSpouseJobTitle,
  updateSpouseMonthlyIncome,
};
