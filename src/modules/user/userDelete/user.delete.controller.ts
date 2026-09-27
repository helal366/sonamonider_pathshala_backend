import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../../utils/catchAsync.js";
import { helperFunctions } from "../../../helperFunctions/helpers/helperFunctions.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import { deleteUserService } from "./user.delete.service.js";

// ============================================================
// DELETE BLOOD GROUP CONTROLLER
// ============================================================

export const deleteUserBloodGroup = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserService.deleteUserBloodGroupService(
      req.body.user_id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User blood group deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE DATE OF BIRTH CONTROLLER
// ============================================================

export const deleteUserDateOfBirth = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserService.deleteUserDateOfBirthService(
      req.body.user_id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User date of birth deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE HEIGHT CONTROLLER
// ============================================================

export const deleteUserHeight = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserService.deleteUserHeightService(
      req.body.user_id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User height deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE WEIGHT CONTROLLER
// ============================================================

export const deleteUserWeight = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserService.deleteUserWeightService(
      req.body.user_id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User weight deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE RELIGION CONTROLLER
// ============================================================

export const deleteUserReligion = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserService.deleteUserReligionService(
      req.body.user_id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User religion deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE BIRTH CERTIFICATE NUMBER CONTROLLER
// ============================================================

export const deleteUserBirthCertificateNumber = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result =
      await deleteUserService.deleteUserBirthCertificateNumberService(
        req.body.user_id,
        loggedInUser,
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User birth certificate number deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE NID NUMBER CONTROLLER
// ============================================================

export const deleteUserNidNumber = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserService.deleteUserNidNumberService(
      req.body.user_id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User NID number deleted successfully.",
      data: result,
    });
  },
);

// ============================================================
// DELETE PHOTO URL CONTROLLER
// ============================================================

export const deleteUserPhotoUrl = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserService.deleteUserPhotoUrlService(
      req.body.user_id,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User photo URL deleted successfully.",
      data: result,
    });
  },
);
export const deleteUserController = {
  deleteUserBloodGroup,
  deleteUserDateOfBirth,
  deleteUserHeight,
  deleteUserWeight,
  deleteUserReligion,
  deleteUserBirthCertificateNumber,
  deleteUserNidNumber,
  deleteUserPhotoUrl,
};
