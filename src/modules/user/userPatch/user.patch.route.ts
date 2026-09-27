import { Router } from "express";
import {userPatchController} from "./user.patch.controller.js";
import {updateUserPatchZodSchema} from "./user.patch.zod.validation.js";
import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";

const router = Router();

// ============================================================
// UPDATE FULL NAME
// ============================================================

router.patch(
  "/update_full_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserFullNameZodSchema),
  userPatchController.updateUserFullName,
);

// ============================================================
// UPDATE GENDER
// ============================================================

router.patch(
  "/update_gender",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserGenderZodSchema),
  userPatchController.updateUserGender,
);

// ============================================================
// UPDATE BLOOD GROUP
// ============================================================

router.patch(
  "/update_blood_group",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserBloodGroupZodSchema),
  userPatchController.updateUserBloodGroup,
);

// ============================================================
// UPDATE DATE OF BIRTH
// ============================================================

router.patch(
  "/update_date_of_birth",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserDateOfBirthZodSchema),
  userPatchController.updateUserDateOfBirth,
);

// ============================================================
// UPDATE HEIGHT
// ============================================================

router.patch(
  "/update_height_in_cm",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserHeightZodSchema),
  userPatchController.updateUserHeight,
);

// ============================================================
// UPDATE WEIGHT
// ============================================================

router.patch(
  "/update_weight_in_kg",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserWeightZodSchema),
  userPatchController.updateUserWeight,
);

// ============================================================
// UPDATE RELIGION
// ============================================================

router.patch(
  "/update_religion",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserReligionZodSchema),
  userPatchController.updateUserReligion,
);

// ============================================================
// UPDATE NATIONALITY
// ============================================================

router.patch(
  "/update_nationality",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserNationalityZodSchema),
  userPatchController.updateUserNationality,
);

// ============================================================
// UPDATE BIRTH CERTIFICATE NUMBER
// ============================================================

router.patch(
  "/update_birth_certificate_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserBirthCertificateNumberZodSchema),
  userPatchController.updateUserBirthCertificateNumber,
);

// ============================================================
// UPDATE NID NUMBER
// ============================================================

router.patch(
  "/update_nid_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserNidNumberZodSchema),
  userPatchController.updateUserNidNumber,
);

// ============================================================
// UPDATE PHOTO URL
// ============================================================

router.patch(
  "/update_photo_url",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserPhotoUrlZodSchema),
  userPatchController.updateUserPhotoUrl,
);

// ============================================================
// UPDATE MOBILE NUMBER
// ============================================================
router.patch(
  "/update_mobile_number",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserMobileNumberZodSchema),
  userPatchController.updateUserMobileNumber,
);
export const userPatchRouter: Router = router;

// ============================================================
// UPDATE EMAIL NUMBER
// ============================================================
router.patch(
  "/update_email",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserEmailZodSchema),
  userPatchController.updateUserEmail,
);

// ============================================================
// UPDATE MOBILE VERIFIED STATUS ROUTE
// ============================================================
router.patch(
  "/update_mobile_verified",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserMobileVerifiedZodSchema),
  userPatchController.updateUserMobileVerified,
);

// ============================================================
// UPDATE EMAIL VERIFIED STATUS ROUTE
// ============================================================
router.patch(
  "/update_email_verified",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateEmialVerifiedZodSchema),
  userPatchController.updateUserEmailVerified,
);

// ============================================================
// UPDATE ACTIVE STATUS ROUTE
// ============================================================
router.patch(
  "/update_active_status",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserActiveStatusZodSchema),
  userPatchController.updateUserActiveStatus,
);

// ============================================================
// UPDATE IS DELETED STATUS ROUTE
// ============================================================
router.patch(
  "/update_deleted_status",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserDeletedStatusZodSchema),
  userPatchController.updateUserDeletedStatus,
);

// ============================================================
// UPDATE USER NAME ROUTE
// ============================================================
router.patch(
  "/update_user_name",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserNameZodSchema),
  userPatchController.updateUserName,
);

// ============================================================
// UPDATE USER NAME ROUTE
// ============================================================
router.patch(
  "/update_user_password",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updateUserPatchZodSchema.updateUserPasswordZodSchema),
  userPatchController.updateUserPassword,
);
