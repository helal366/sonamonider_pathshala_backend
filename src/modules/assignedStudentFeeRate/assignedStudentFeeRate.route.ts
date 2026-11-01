import { Role } from "#db-client";
import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { assignedStudentFeeRateController } from "./assignedStudentFeeRate.controller.js";
import { assignedStudentFeeRateZodSchema } from "./assignedStudentFeeRate.zodValidation.js";

const router = Router();
const feeManagementRoles = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.TEACHER_ADMIN,
  Role.MANAGEMENT,
];

router.post(
  "/create_assigned_student_fee_rate",
  userAuth(...feeManagementRoles),
  validateZodSchema(
    assignedStudentFeeRateZodSchema.createAssignedStudentFeeRateZodSchema,
  ),
  assignedStudentFeeRateController.createAssignedStudentFeeRate,
);

router.patch(
  "/update_assigned_student_fee_rate_field/:id",
  userAuth(...feeManagementRoles),
  validateZodParams(
    assignedStudentFeeRateZodSchema.assignedStudentFeeRateIdParamsZodSchema,
  ),
  validateZodSchema(
    assignedStudentFeeRateZodSchema.updateAssignedStudentFeeRateFieldZodSchema,
  ),
  assignedStudentFeeRateController.updateAssignedStudentFeeRateField,
);

router.delete(
  "/delete_assigned_student_fee_rate/:id",
  userAuth(...feeManagementRoles),
  validateZodParams(
    assignedStudentFeeRateZodSchema.assignedStudentFeeRateIdParamsZodSchema,
  ),
  assignedStudentFeeRateController.deleteAssignedStudentFeeRate,
);

router.get(
  "/",
  userAuth(...feeManagementRoles),
  assignedStudentFeeRateController.getAllAssignedStudentFeeRates,
);

router.get(
  "/get_assigned_student_fee_rates_by_class_id/:class_id",
  userAuth(...feeManagementRoles),
  validateZodParams(assignedStudentFeeRateZodSchema.classIdParamsZodSchema),
  assignedStudentFeeRateController.getAssignedStudentFeeRatesByClassId,
);

export const assignedStudentFeeRateRouter: Router = router;
