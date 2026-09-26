import { Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../../utils/catchAsync.js";
import { helperFunctions } from "../../../helperFunctions/helpers/helperFunctions.js";
import { sendResponse } from "../../../utils/sendResponse.js";
import {
  deleteUserBloodGroupService,
  deleteUserDateOfBirthService,
  deleteUserHeightService,
  deleteUserWeightService,
  deleteUserReligionService,
  deleteUserBirthCertificateNumberService,
  deleteUserNidNumberService,
  deleteUserPhotoUrlService,
} from "./user.delete.service.js";

// ============================================================
// DELETE BLOOD GROUP
// ============================================================

export const deleteUserBloodGroup = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserBloodGroupService(
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
// DELETE DATE OF BIRTH
// ============================================================

export const deleteUserDateOfBirth = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserDateOfBirthService(
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
// DELETE HEIGHT
// ============================================================

export const deleteUserHeight = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserHeightService(
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
// DELETE WEIGHT
// ============================================================

export const deleteUserWeight = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserWeightService(
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
// DELETE RELIGION
// ============================================================

export const deleteUserReligion = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserReligionService(
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
// DELETE BIRTH CERTIFICATE NUMBER
// ============================================================

export const deleteUserBirthCertificateNumber = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserBirthCertificateNumberService(
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
// DELETE NID NUMBER
// ============================================================

export const deleteUserNidNumber = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserNidNumberService(
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
// DELETE PHOTO URL
// ============================================================

export const deleteUserPhotoUrl = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await deleteUserPhotoUrlService(
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
