import { Role } from "#db-client";
import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { standardStudentFeeRateController } from "./standardStudentFeeRate.controller.js";
import { standardStudentFeeRateZodSchema } from "./standardStudentFeeRate.zodValidation.js";

const router = Router();
const feeManagementRoles = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.TEACHER_ADMIN,
  Role.MANAGEMENT,
];

router.post(
  "/create_standard_student_fee_rate",
  userAuth(...feeManagementRoles),
  validateZodSchema(
    standardStudentFeeRateZodSchema.createStandardStudentFeeRateZodSchema,
  ),
  standardStudentFeeRateController.createStandardStudentFeeRate,
);

router.patch(
  "/update_standard_student_fee_rate_field/:id",
  userAuth(...feeManagementRoles),
  validateZodParams(
    standardStudentFeeRateZodSchema.standardStudentFeeRateIdParamsZodSchema,
  ),
  validateZodSchema(
    standardStudentFeeRateZodSchema.updateStandardStudentFeeRateFieldZodSchema,
  ),
  standardStudentFeeRateController.updateStandardStudentFeeRateField,
);

router.delete(
  "/delete_standard_student_fee_rate/:id",
  userAuth(...feeManagementRoles),
  validateZodParams(
    standardStudentFeeRateZodSchema.standardStudentFeeRateIdParamsZodSchema,
  ),
  standardStudentFeeRateController.deleteStandardStudentFeeRate,
);

router.get(
  "/",
  userAuth(...feeManagementRoles),
  standardStudentFeeRateController.getAllStandardStudentFeeRates,
);

router.get(
  "/get_standard_student_fee_rates_by_class_id/:class_id",
  userAuth(...feeManagementRoles),
  validateZodParams(standardStudentFeeRateZodSchema.classIdParamsZodSchema),
  standardStudentFeeRateController.getStandardStudentFeeRatesByClassId,
);

export const standardStudentFeeRateRouter: Router = router;
