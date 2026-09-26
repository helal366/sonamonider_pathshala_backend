import { Router } from "express";

import {
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
  updateUserMobileNumber,
  updateUserEmail,
} from "./user.patch.controller.js";

import {
  updateUserFullNameZodSchema,
  updateUserGenderZodSchema,
  updateUserBloodGroupZodSchema,
  updateUserDateOfBirthZodSchema,
  updateUserHeightZodSchema,
  updateUserWeightZodSchema,
  updateUserReligionZodSchema,
  updateUserNationalityZodSchema,
  updateUserBirthCertificateNumberZodSchema,
  updateUserNidNumberZodSchema,
  updateUserPhotoUrlZodSchema,
  updateUserMobileNumberZodSchema,
  updateUserEmailZodSchema,
} from "./user.patch.zod.validation.js";

import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";

const router = Router();

// ============================================================
// UPDATE FULL NAME
// ============================================================

router.patch(
  "/update_full_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserFullNameZodSchema),
  updateUserFullName,
);

// ============================================================
// UPDATE GENDER
// ============================================================

router.patch(
  "/update_gender",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserGenderZodSchema),
  updateUserGender,
);

// ============================================================
// UPDATE BLOOD GROUP
// ============================================================

router.patch(
  "/update_blood_group",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserBloodGroupZodSchema),
  updateUserBloodGroup,
);

// ============================================================
// UPDATE DATE OF BIRTH
// ============================================================

router.patch(
  "/update_date_of_birth",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserDateOfBirthZodSchema),
  updateUserDateOfBirth,
);

// ============================================================
// UPDATE HEIGHT
// ============================================================

router.patch(
  "/update_height_in_cm",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserHeightZodSchema),
  updateUserHeight,
);

// ============================================================
// UPDATE WEIGHT
// ============================================================

router.patch(
  "/update_weight_in_kg",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserWeightZodSchema),
  updateUserWeight,
);

// ============================================================
// UPDATE RELIGION
// ============================================================

router.patch(
  "/update_religion",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserReligionZodSchema),
  updateUserReligion,
);

// ============================================================
// UPDATE NATIONALITY
// ============================================================

router.patch(
  "/update_nationality",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserNationalityZodSchema),
  updateUserNationality,
);

// ============================================================
// UPDATE BIRTH CERTIFICATE NUMBER
// ============================================================

router.patch(
  "/update_birth_certificate_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserBirthCertificateNumberZodSchema),
  updateUserBirthCertificateNumber,
);

// ============================================================
// UPDATE NID NUMBER
// ============================================================

router.patch(
  "/update_nid_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserNidNumberZodSchema),
  updateUserNidNumber,
);

// ============================================================
// UPDATE PHOTO URL
// ============================================================

router.patch(
  "/update_photo_url",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPhotoUrlZodSchema),
  updateUserPhotoUrl,
);

// ============================================================
// UPDATE MOBILE NUMBER
// ============================================================
router.patch(
  "/update_mobile_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserMobileNumberZodSchema),
  updateUserMobileNumber,
);
export const userPatchRouter: Router = router;

// ============================================================
// UPDATE EMAIL NUMBER
// ============================================================
router.patch(
  "/update_email",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserEmailZodSchema),
  updateUserEmail,
);
