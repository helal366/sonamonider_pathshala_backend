import { Router } from "express";
import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";
import {
  deleteUserBloodGroup,
  deleteUserDateOfBirth,
  deleteUserHeight,
  deleteUserWeight,
  deleteUserReligion,
  deleteUserBirthCertificateNumber,
  deleteUserNidNumber,
  deleteUserPhotoUrl,
} from "./user.delete.controller.js";

import {
  deleteUserBloodGroupZodSchema,
  deleteUserDateOfBirthZodSchema,
  deleteUserHeightZodSchema,
  deleteUserWeightZodSchema,
  deleteUserReligionZodSchema,
  deleteUserBirthCertificateNumberZodSchema,
  deleteUserNidNumberZodSchema,
  deleteUserPhotoUrlZodSchema,
} from "./user.delete.zod.validation.js";



const router = Router();

// ============================================================
// DELETE BLOOD GROUP
// ============================================================

router.delete(
  "/delete_blood_group",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserBloodGroupZodSchema),
  deleteUserBloodGroup,
);

// ============================================================
// DELETE DATE OF BIRTH
// ============================================================

router.delete(
  "/delete_date_of_birth",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserDateOfBirthZodSchema),
  deleteUserDateOfBirth,
);

// ============================================================
// DELETE HEIGHT
// ============================================================

router.delete(
  "/delete_height_in_cm",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserHeightZodSchema),
  deleteUserHeight,
);

// ============================================================
// DELETE WEIGHT
// ============================================================

router.delete(
  "/delete_weight_in_kg",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserWeightZodSchema),
  deleteUserWeight,
);

// ============================================================
// DELETE RELIGION
// ============================================================

router.delete(
  "/delete_religion",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserReligionZodSchema),
  deleteUserReligion,
);

// ============================================================
// DELETE BIRTH CERTIFICATE NUMBER
// ============================================================

router.delete(
  "/delete_birth_certificate_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserBirthCertificateNumberZodSchema),
  deleteUserBirthCertificateNumber,
);

// ============================================================
// DELETE NID NUMBER
// ============================================================

router.delete(
  "/delete_nid_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserNidNumberZodSchema),
  deleteUserNidNumber,
);

// ============================================================
// DELETE PHOTO URL
// ============================================================

router.delete(
  "/delete_photo_url",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserPhotoUrlZodSchema),
  deleteUserPhotoUrl,
);

export const userDeleteRouter: Router = router;
