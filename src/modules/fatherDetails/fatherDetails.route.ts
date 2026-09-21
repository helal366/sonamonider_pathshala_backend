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
} from "./fatherDetails.zod.validation";

import { userAuth } from "../../middlewares/userAuth";

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

// UPDATE FATHER NAME
router.patch(
  "/update_father_name",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherNameZodSchema),
  fatherDetailsController.updateFatherName,
);

// UPDATE NID
router.patch(
  "/update_father_nid",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherNidZodSchema),
  fatherDetailsController.updateFatherNid,
);

// UPDATE OCCUPATION
router.patch(
  "/update_father_occupation",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherOccupationZodSchema),
  fatherDetailsController.updateFatherOccupation,
);

// UPDATE JOB TITLE
router.patch(
  "/update_father_job_title",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherJobTitleZodSchema),
  fatherDetailsController.updateFatherJobTitle,
);

// UPDATE EDUCATIONAL QUALIFICATION
router.patch(
  "/update_father_educational_qualification",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherEducationalQualificationZodSchema),
  fatherDetailsController.updateFatherEducationalQualification,
);

// UPDATE MONTHLY INCOME
router.patch(
  "/update_father_monthly_income",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherMonthlyIncomeZodSchema),
  fatherDetailsController.updateFatherMonthlyIncome,
);

// UPDATE MOBILE NO 1
router.patch(
  "/update_father_mobile_no_1",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherMobileNo1ZodSchema),
  fatherDetailsController.updateFatherMobileNo1,
);

// UPDATE MOBILE NO 2
router.patch(
  "/update_father_mobile_no_2",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherMobileNo2ZodSchema),
  fatherDetailsController.updateFatherMobileNo2,
);

// UPDATE MOBILE NO 3
router.patch(
  "/update_father_mobile_no_3",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(updateFatherMobileNo3ZodSchema),
  fatherDetailsController.updateFatherMobileNo3,
);

export const fatherDetailsRouter: Router = router;
