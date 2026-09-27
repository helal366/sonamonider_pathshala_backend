import { Request, Response } from "express";
import httpStatus from "http-status-codes";

import {updateUserPatchServices,} from "./user.patch.service.js";
import { catchAsync } from "../../../utils/catchAsync.js";
import { helperFunctions } from "../../../helperFunctions/helpers/helperFunctions.js";
import { sendResponse } from "../../../utils/sendResponse.js";

// ============================================================
// UPDATE FULL NAME
// ============================================================
const updateUserFullName = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserFullNameService(
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

const updateUserGender = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserGenderService(
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

const updateUserBloodGroup = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserBloodGroupService(
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

const updateUserDateOfBirth = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserDateOfBirthService(
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

const updateUserHeight = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserHeightService(
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

const updateUserWeight = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserWeightService(
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

const updateUserReligion = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserReligionService(
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

const updateUserNationality = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserNationalityService(
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

const updateUserBirthCertificateNumber = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserBirthCertificateNumberService(
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

const updateUserNidNumber = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserNidNumberService(
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

const updateUserPhotoUrl = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);

    const result = await updateUserPatchServices.updateUserPhotoUrlService(
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

// ============================================================
// UPDATE MOBILE NUMBER
// ============================================================
const updateUserMobileNumber = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await updateUserPatchServices.updateUserMobileNumberService(
      req.body.user_id,
      req.body.mobile_number,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User mobile number updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE EMAIL NUMBER CONTROLLER
// ============================================================
const updateUserEmail = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await updateUserPatchServices.updateUserEmailService(
      req.body.user_id,
      req.body.email,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User email updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE MOBILE VERIFIED STATUS CONTROLLER
// ============================================================
const updateUserMobileVerified = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await updateUserPatchServices.updateUserMobileVerifiedService(
      req.body.user_id,
      req.body.is_mobile_verified,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User mobile verified status updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE EMAIL VERIFIED STATUS CONTROLLER
// ============================================================
const updateUserEmailVerified = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await updateUserPatchServices.updateUserEmailVerifiedService(
      req.body.user_id,
      req.body.is_email_verified,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User email verified status updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE USER ACTIVE STATUS CONTROLLER
// ============================================================
const updateUserActiveStatus = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await updateUserPatchServices.updateUserActiveStatusService(
      req.body.user_id,
      req.body.active_status,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User active status updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE USER DELETED STATUS CONTROLLER
// ============================================================
const updateUserDeletedStatus = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await updateUserPatchServices.updateUserDeletedStatusService(
      req.body.user_id,
      req.body.is_deleted,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User deleted status updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE USER NAME CONTROLLER
// ============================================================
const updateUserName = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await updateUserPatchServices.updateUserNameService(
      req.body.user_id,
      req.body.user_name,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User name updated successfully.",
      data: result,
    });
  },
);

// ============================================================
// UPDATE USER PASSWORD CONTROLLER
// ============================================================
const updateUserPassword = catchAsync(
  async (req: Request, res: Response) => {
    const loggedInUser = helperFunctions.requiredUser(req);
    const result = await updateUserPatchServices.updateUserPasswordService(
      req.body.user_id,
      req.body.user_password,
      loggedInUser,
    );
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User password updated successfully.",
      data: result,
    });
  },
);

export const userPatchController = {
  // USER BASIC INFORMATION
  updateUserFullName,
  updateUserGender,
  updateUserBloodGroup,
  updateUserDateOfBirth,
  updateUserHeight,
  updateUserWeight,
  updateUserReligion,
  updateUserNationality,
  updateUserBirthCertificateNumber,
  updateUserNidNumber,
  updateUserPhotoUrl,

  // USER CONTACT INFORMATION
  updateUserMobileNumber,
  updateUserEmail,

  // USER VERIFICATION STATUS
  updateUserMobileVerified,
  updateUserEmailVerified,

  // USER ACCOUNT STATUS
  updateUserActiveStatus,
  updateUserDeletedStatus,

  // USER ACCOUNT CREDENTIALS
  updateUserName,
  updateUserPassword,
};


