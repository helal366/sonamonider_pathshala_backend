import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { staffPaymentController } from "./staffPayment.controller.js";
import { staffPaymentZodSchema } from "./staffPayment.zodValidation.js";
import { Role } from "#db-client";

const router = Router();

// ======================================================
// CREATE STAFF SALARY RATE ROUTE
// ======================================================
router.post(
  "/salary-rate",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodSchema(staffPaymentZodSchema.createStaffSalaryRateZodSchema),
  staffPaymentController.createStaffSalaryRate,
);

// ======================================================
// UPDATE A SINGLE STAFF SALARY RATE FIELD ROUTE
// ======================================================
router.patch(
  "/update_salary_rate_field/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(staffPaymentZodSchema.staffSalaryRateIdParamsZodSchema),
  validateZodSchema(staffPaymentZodSchema.updateStaffSalaryRateFieldZodSchema),
  staffPaymentController.updateStaffSalaryRateField,
);

// ======================================================
// DELETE STAFF SALARY RATE ROUTE
// ======================================================
router.delete(
  "/delete_salary_rate/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(staffPaymentZodSchema.staffSalaryRateIdParamsZodSchema),
  staffPaymentController.deleteStaffSalaryRate,
);

// ======================================================
// CREATE STAFF PAYMENT ROUTE
// ======================================================
router.post(
  "/payment",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodSchema(staffPaymentZodSchema.createStaffPaymentZodSchema),
  staffPaymentController.createStaffPayment,
);

// ======================================================
// UPDATE A SINGLE STAFF PAYMENT FIELD ROUTE
// ======================================================
router.patch(
  "/update_payment_field/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(staffPaymentZodSchema.staffPaymentIdParamsZodSchema),
  validateZodSchema(staffPaymentZodSchema.updateStaffPaymentFieldZodSchema),
  staffPaymentController.updateStaffPaymentField,
);

// ======================================================
// DELETE STAFF PAYMENT ROUTE
// ======================================================
router.delete(
  "/delete_payment/:id",
 userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(staffPaymentZodSchema.staffPaymentIdParamsZodSchema),
  staffPaymentController.deleteStaffPayment,
);

export const staffPaymentRouter: Router = router;
