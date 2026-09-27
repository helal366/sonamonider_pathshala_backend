import { Router } from "express";
import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";
import { deleteUserController } from "./user.delete.controller.js";

import { deleteUserFieldZodSchema } from "./user.delete.zod.validation.js";

const router = Router();

// ============================================================
// DELETE BLOOD GROUP ROUTE
// ============================================================

router.delete(
  "/delete_blood_group",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserFieldZodSchema.deleteUserBloodGroupZodSchema),
  deleteUserController.deleteUserBloodGroup,
);

// ============================================================
// DELETE DATE OF BIRTH ROUTE
// ============================================================

router.delete(
  "/delete_date_of_birth",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserFieldZodSchema.deleteUserDateOfBirthZodSchema),
  deleteUserController.deleteUserDateOfBirth,
);

// ============================================================
// DELETE HEIGHT ROUTE
// ============================================================

router.delete(
  "/delete_height_in_cm",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserFieldZodSchema.deleteUserHeightZodSchema),
  deleteUserController.deleteUserHeight,
);

// ============================================================
// DELETE WEIGHT ROUTE
// ============================================================

router.delete(
  "/delete_weight_in_kg",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserFieldZodSchema.deleteUserWeightZodSchema),
  deleteUserController.deleteUserWeight,
);

// ============================================================
// DELETE RELIGION ROUTE
// ============================================================

router.delete(
  "/delete_religion",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserFieldZodSchema.deleteUserReligionZodSchema),
  deleteUserController.deleteUserReligion,
);

// ============================================================
// DELETE BIRTH CERTIFICATE NUMBER ROUTE
// ============================================================

router.delete(
  "/delete_birth_certificate_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(
    deleteUserFieldZodSchema.deleteUserBirthCertificateNumberZodSchema,
  ),
  deleteUserController.deleteUserBirthCertificateNumber,
);

// ============================================================
// DELETE NID NUMBER ROUTE
// ============================================================

router.delete(
  "/delete_nid_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserFieldZodSchema.deleteUserNidNumberZodSchema),
  deleteUserController.deleteUserNidNumber,
);

// ============================================================
// DELETE PHOTO URL ROUTE
// ============================================================

router.delete(
  "/delete_photo_url",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(deleteUserFieldZodSchema.deleteUserPhotoUrlZodSchema),
  deleteUserController.deleteUserPhotoUrl,
);

export const userDeleteRouter: Router = router;
