import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import {
  updateUserFullNameService,
  updateUserGenderService,
  updateUserBloodGroupService,
  updateUserDateOfBirthService,
  updateUserHeightService,
  updateUserWeightService,
  updateUserReligionService,
  updateUserNationalityService,
  updateUserBirthCertificateNumberService,
  updateUserNidNumberService,
  updateUserPhotoUrlService,
} from "./user.patch.service.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { helperFunctions } from "../../../helperFunctions/helpers/helperFunctions.js";
import { sendResponse } from "../../../utils/sendResponse.js";


// ============================================================
// UPDATE FULL NAME
// ============================================================

export const updateUserFullName = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserFullNameService(
      req.body.user_id,
      req.body.full_name,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User full name updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE GENDER
// ============================================================

export const updateUserGender = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserGenderService(
      req.body.user_id,
      req.body.gender,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User gender updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE BLOOD GROUP
// ============================================================

export const updateUserBloodGroup = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserBloodGroupService(
      req.body.user_id,
      req.body.blood_group,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User blood group updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE DATE OF BIRTH
// ============================================================

export const updateUserDateOfBirth = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserDateOfBirthService(
      req.body.user_id,
      req.body.date_of_birth,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User date of birth updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE HEIGHT
// ============================================================

export const updateUserHeight = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserHeightService(
      req.body.user_id,
      req.body.height_in_cm,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User height updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE WEIGHT
// ============================================================

export const updateUserWeight = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserWeightService(
      req.body.user_id,
      req.body.weight_in_kg,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User weight updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE RELIGION
// ============================================================

export const updateUserReligion = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserReligionService(
      req.body.user_id,
      req.body.religion,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User religion updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE NATIONALITY
// ============================================================

export const updateUserNationality = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserNationalityService(
      req.body.user_id,
      req.body.nationality,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User nationality updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE BIRTH CERTIFICATE NUMBER
// ============================================================

export const updateUserBirthCertificateNumber = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserBirthCertificateNumberService(
      req.body.user_id,
      req.body.birth_certificate_number,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User birth certificate number updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE NID NUMBER
// ============================================================

export const updateUserNidNumber = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserNidNumberService(
      req.body.user_id,
      req.body.nid_number,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User NID number updated successfully.",
      data: result,
    });
  },
);


// ============================================================
// UPDATE PHOTO URL
// ============================================================

export const updateUserPhotoUrl = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPhotoUrlService(
      req.body.user_id,
      req.body.photo_url,
      loggedInUser,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User photo URL updated successfully.",
      data: result,
    });
  },
);

