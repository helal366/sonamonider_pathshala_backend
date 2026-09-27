import { TLoggedInUser } from "../../../commonInterfaces/interfaces";
import { updateUserField } from "../userPatch/user.patch.service";

// ============================================================
// DELETE BLOOD GROUP SERVICE LAYER
// ============================================================
export const deleteUserBloodGroupService = async (
  userId: string,
  loggedInUser: TLoggedInUser,
) =>
  updateUserField(
    userId,
    "blood_group",
    null,
    loggedInUser,
  );

// ============================================================
// DELETE DATE OF BIRTH SERVICE LAYER
// ============================================================
export const deleteUserDateOfBirthService = async (
  userId: string,
  loggedInUser: TLoggedInUser,
) =>
  updateUserField(
    userId,
    "date_of_birth",
    null,
    loggedInUser,
  );

// ============================================================
// DELETE HEIGHT SERVICE LAYER
// ============================================================
export const deleteUserHeightService = async (
  userId: string,
  loggedInUser: TLoggedInUser,
) =>
  updateUserField(
    userId,
    "height_in_cm",
    null,
    loggedInUser,
  );

// ============================================================
// DELETE WEIGHT SERVICE LAYER
// ============================================================
export const deleteUserWeightService = async (
  userId: string,
  loggedInUser: TLoggedInUser,
) =>
  updateUserField(
    userId,
    "weight_in_kg",
    null,
    loggedInUser,
  );

// ============================================================
// DELETE RELIGION SERVICE LAYER
// ============================================================
export const deleteUserReligionService = async (
  userId: string,
  loggedInUser: TLoggedInUser,
) =>
  updateUserField(
    userId,
    "religion",
    null,
    loggedInUser,
  );

// ============================================================
// DELETE BIRTH CERTIFICATE NUMBER SERVICE LAYER
// ============================================================
export const deleteUserBirthCertificateNumberService = async (
  userId: string,
  loggedInUser: TLoggedInUser,
) =>
  updateUserField(
    userId,
    "birth_certificate_number",
    null,
    loggedInUser,
  );

// ============================================================
// DELETE NID NUMBER SERVICE LAYER
// ============================================================
export const deleteUserNidNumberService = async (
  userId: string,
  loggedInUser: TLoggedInUser,
) =>
  updateUserField(
    userId,
    "nid_number",
    null,
    loggedInUser,
  );

// ============================================================
// DELETE PHOTO URL SERVICE LAYER
// ============================================================
export const deleteUserPhotoUrlService = async (
  userId: string,
  loggedInUser: TLoggedInUser,
) =>
  updateUserField(
    userId,
    "photo_url",
    null,
    loggedInUser,
  );


export const deleteUserService = {
    deleteUserBloodGroupService,
  deleteUserDateOfBirthService,
  deleteUserHeightService,
  deleteUserWeightService,
  deleteUserReligionService,
  deleteUserBirthCertificateNumberService,
  deleteUserNidNumberService,
  deleteUserPhotoUrlService,
}