import { Router } from "express";
import { fatherDetailsController } from "./fatherDetails.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { userAuth } from "../../middlewares/userAuth.js";
import { fatherDetailsPatchController } from "./fatherDetails.patch.controller.js";
import { fatherDetailsDeleteController } from "./fatherDetails.delete.controller.js";
import {
  connectFatherDetailsZodSchema,
  createFatherDetailsZodSchema,
  updateFatherNameZodSchema,
  updateFatherNidZodSchema,
  updateFatherOccupationZodSchema,
  updateFatherJobTitleZodSchema,
  updateFatherEducationalQualificationZodSchema,
  updateFatherMonthlyIncomeZodSchema,
  updateFatherMobileNo1ZodSchema,
  updateFatherMobileNo2ZodSchema,
  updateFatherMobileNo3ZodSchema,
  disconnectFatherDetailsZodSchema,
} from "./fatherDetails.zod.validation.js";


const router = Router();

// CREATE FATHER DETAILS
router.post(
  "/create_father_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(createFatherDetailsZodSchema),
  fatherDetailsController.createFatherDetails,
);

// CONNECT FATHER DETAILS
router.post(
  "/connect_father_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(connectFatherDetailsZodSchema),
  fatherDetailsController.connectFatherDetails,
);

// DISCONNECT FATHER DETAILS
router.delete(
  "/disconnect_father_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectFatherDetailsZodSchema),
  fatherDetailsController.disconnectFatherDetails,
);

// UPDATE FATHER NAME
router.patch(
  "/update_father_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherNameZodSchema),
  fatherDetailsPatchController.updateFatherName,
);

// UPDATE NID
router.patch(
  "/update_father_nid",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherNidZodSchema),
  fatherDetailsPatchController.updateFatherNid,
);

// UPDATE OCCUPATION
router.patch(
  "/update_father_occupation",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherOccupationZodSchema),
  fatherDetailsPatchController.updateFatherOccupation,
);

// UPDATE JOB TITLE
router.patch(
  "/update_father_job_title",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherJobTitleZodSchema),
  fatherDetailsPatchController.updateFatherJobTitle,
);

// UPDATE EDUCATIONAL QUALIFICATION
router.patch(
  "/update_father_educational_qualification",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherEducationalQualificationZodSchema),
  fatherDetailsPatchController.updateFatherEducationalQualification,
);

// UPDATE MONTHLY INCOME
router.patch(
  "/update_father_monthly_income",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherMonthlyIncomeZodSchema),
  fatherDetailsPatchController.updateFatherMonthlyIncome,
);

// UPDATE MOBILE NO 1
router.patch(
  "/update_father_mobile_no_1",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherMobileNo1ZodSchema),
  fatherDetailsPatchController.updateFatherMobileNo1,
);

// UPDATE MOBILE NO 2
router.patch(
  "/update_father_mobile_no_2",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherMobileNo2ZodSchema),
  fatherDetailsPatchController.updateFatherMobileNo2,
);

// UPDATE MOBILE NO 3
router.patch(
  "/update_father_mobile_no_3",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherMobileNo3ZodSchema),
  fatherDetailsPatchController.updateFatherMobileNo3,
);


// ======================================================
// DELETE FATHER NID
// ======================================================

router.delete(
  "/delete_father_nid",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectFatherDetailsZodSchema),
  fatherDetailsDeleteController.deleteFatherNid,
);


// ======================================================
// DELETE FATHER OCCUPATION
// ======================================================

router.delete(
  "/delete_father_occupation",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectFatherDetailsZodSchema),
  fatherDetailsDeleteController.deleteFatherOccupation,
);


// ======================================================
// DELETE FATHER JOB TITLE
// ======================================================

router.delete(
  "/delete_father_job_title",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectFatherDetailsZodSchema),
  fatherDetailsDeleteController.deleteFatherJobTitle,
);


// ======================================================
// DELETE FATHER EDUCATIONAL QUALIFICATION
// ======================================================

router.delete(
  "/delete_father_educational_qualification",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectFatherDetailsZodSchema),
  fatherDetailsDeleteController.deleteFatherEducationalQualification,
);


// ======================================================
// DELETE FATHER MONTHLY INCOME
// ======================================================

router.delete(
  "/delete_father_monthly_income",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectFatherDetailsZodSchema),
  fatherDetailsDeleteController.deleteFatherMonthlyIncome,
);


// ======================================================
// DELETE FATHER MOBILE NO 1
// ======================================================

router.delete(
  "/delete_father_mobile_no_1",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectFatherDetailsZodSchema),
  fatherDetailsDeleteController.deleteFatherMobileNo1,
);


// ======================================================
// DELETE FATHER MOBILE NO 2
// ======================================================

router.delete(
  "/delete_father_mobile_no_2",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectFatherDetailsZodSchema),
  fatherDetailsDeleteController.deleteFatherMobileNo2,
);


// ======================================================
// DELETE FATHER MOBILE NO 3
// ======================================================

router.delete(
  "/delete_father_mobile_no_3",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(disconnectFatherDetailsZodSchema),
  fatherDetailsDeleteController.deleteFatherMobileNo3,
);

export const fatherDetailsRouter: Router = router;
