import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodSchema } from "../../middlewares/validateZodSchema.js";
import { staffPaymentController } from "./staffPayment.controller.js";
import { staffPaymentZodSchema } from "./staffPayment.zodValidation.js";

const router = Router();

// ======================================================
// CREATE STAFF SALARY RATE ROUTE
// ======================================================
router.post(
  "/salary-rate",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(staffPaymentZodSchema.createStaffSalaryRateZodSchema),
  staffPaymentController.createStaffSalaryRate,
);

// ======================================================
// UPDATE A SINGLE STAFF SALARY RATE FIELD ROUTE
// ======================================================
router.patch(
  "/update_salary_rate_field",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(staffPaymentZodSchema.updateStaffSalaryRateFieldZodSchema),
  staffPaymentController.updateStaffSalaryRateField,
);

// ======================================================
// DELETE STAFF SALARY RATE ROUTE
// ======================================================
router.delete(
  "/delete_salary_rate",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(staffPaymentZodSchema.deleteStaffSalaryRateZodSchema),
  staffPaymentController.deleteStaffSalaryRate,
);

// ======================================================
// CREATE STAFF PAYMENT ROUTE
// ======================================================
router.post(
  "/payment",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(staffPaymentZodSchema.createStaffPaymentZodSchema),
  staffPaymentController.createStaffPayment,
);

// ======================================================
// UPDATE A SINGLE STAFF PAYMENT FIELD ROUTE
// ======================================================
router.patch(
  "/update_payment_field",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(staffPaymentZodSchema.updateStaffPaymentFieldZodSchema),
  staffPaymentController.updateStaffPaymentField,
);

// ======================================================
// DELETE STAFF PAYMENT ROUTE
// ======================================================
router.delete(
  "/delete_payment",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(staffPaymentZodSchema.deleteStaffPaymentZodSchema),
  staffPaymentController.deleteStaffPayment,
);

export const staffPaymentRouter: Router = router;
