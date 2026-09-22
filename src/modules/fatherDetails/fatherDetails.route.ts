import { Router } from "express";

import { fatherDetailsController } from "./fatherDetails.controller";

import { validateZodSchema } from "../../middlewares/validate.zod.schema";

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
} from "./fatherDetails.zod.validation";

import { userAuth } from "../../middlewares/userAuth";
import { fatherDetailsPatchController } from "./fatherDetails.patch.controller";

const router = Router();

router.post(
  "/create_father_details",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(createFatherDetailsZodSchema),
  fatherDetailsController.createFatherDetails,
);

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

export const fatherDetailsRouter: Router = router;
