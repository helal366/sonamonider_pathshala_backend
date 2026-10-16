import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { studentFeeController } from "./studentFee.controller.js";
import { studentFeeZodSchema } from "./studentFee.zodValidation.js";

const router = Router();

// ======================================================
// CREATE STUDENT FEE RATE ROUTE
// ======================================================
router.post(
  "/create_student_fee_rate",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN", "MANAGEMENT"),
  validateZodSchema(studentFeeZodSchema.createStudentFeeRateZodSchema),
  studentFeeController.createStudentFeeRate,
);

// ======================================================
// UPDATE A SINGLE STUDENT FEE RATE FIELD ROUTE
// ======================================================
router.patch(
  "/update_student_fee_rate_field/:id",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN", "MANAGEMENT"),
  validateZodParams(studentFeeZodSchema.studentFeeRateIdParamsZodSchema),
  validateZodSchema(studentFeeZodSchema.updateStudentFeeRateFieldZodSchema),
  studentFeeController.updateStudentFeeRateField,
);

// ======================================================
// DELETE STUDENT FEE RATE ROUTE
// ======================================================
router.delete(
  "/delete_student_fee_rate/:id",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN", "MANAGEMENT"),
  validateZodParams(studentFeeZodSchema.studentFeeRateIdParamsZodSchema),
  studentFeeController.deleteStudentFeeRate,
);

// ======================================================
// CREATE STUDENT FEE PAYMENT ROUTE
// ======================================================
router.post(
  "/create_student_fee_payment",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN", "MANAGEMENT"),
  validateZodSchema(studentFeeZodSchema.createStudentFeePaymentZodSchema),
  studentFeeController.createStudentFeePayment,
);

// ======================================================
// UPDATE A SINGLE STUDENT FEE PAYMENT FIELD ROUTE
// ======================================================
router.patch(
  "/update_student_fee_payment_field/:id",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN", "MANAGEMENT"),
  validateZodParams(studentFeeZodSchema.studentFeePaymentIdParamsZodSchema),
  validateZodSchema(studentFeeZodSchema.updateStudentFeePaymentFieldZodSchema),
  studentFeeController.updateStudentFeePaymentField,
);

// ======================================================
// DELETE STUDENT FEE PAYMENT ROUTE
// ======================================================
router.delete(
  "/delete_student_fee_payment/:id",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN", "MANAGEMENT"),
  validateZodParams(studentFeeZodSchema.studentFeePaymentIdParamsZodSchema),
  studentFeeController.deleteStudentFeePayment,
);

export const studentFeeRouter: Router = router;
