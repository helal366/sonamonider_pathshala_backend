import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { helperFunctions } from "../../helperFunctions/helpers/helperFunctions";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { spouseInformationDeleteServices } from "./spouseInformation.delete.service";

// ============================================================
// DELETE SPOUSE CONTACT NO
// ============================================================
const deleteSpouseContactNo = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationDeleteServices.deleteSpouseContactNo(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse contact no deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE SPOUSE FATHER NAME
// ============================================================
const deleteSpouseFatherName = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationDeleteServices.deleteSpouseFatherName(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse father name deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE SPOUSE FATHER CONTACT NO
// ============================================================
const deleteSpouseFatherContactNo = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationDeleteServices.deleteSpouseFatherContactNo(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse father contact no deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE SPOUSE MOTHER NAME
// ============================================================
const deleteSpouseMotherName = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationDeleteServices.deleteSpouseMotherName(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse mother name deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE SPOUSE MOTHER CONTACT NO
// ============================================================
const deleteSpouseMotherContactNo = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationDeleteServices.deleteSpouseMotherContactNo(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse mother contact no deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE SPOUSE OCCUPATION
// ============================================================
const deleteSpouseOccupation = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationDeleteServices.deleteSpouseOccupation(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse occupation deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE SPOUSE JOB TITLE
// ============================================================
const deleteSpouseJobTitle = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationDeleteServices.deleteSpouseJobTitle(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse job title deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE SPOUSE MONTHLY INCOME
// ============================================================
const deleteSpouseMonthlyIncome = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await spouseInformationDeleteServices.deleteSpouseMonthlyIncome(
        req.body,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Spouse monthly income deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// EXPORT SPOUSE INFORMATION DELETE CONTROLLERS
// ============================================================
export const spouseInformationDeleteController = {
  deleteSpouseContactNo,
  deleteSpouseFatherName,
  deleteSpouseFatherContactNo,
  deleteSpouseMotherName,
  deleteSpouseMotherContactNo,
  deleteSpouseOccupation,
  deleteSpouseJobTitle,
  deleteSpouseMonthlyIncome,
};
