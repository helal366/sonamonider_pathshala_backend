import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodQuery,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { studentFeeController } from "./studentFee.controller.js";
import { studentFeeZodSchema } from "./studentFee.zodValidation.js";
import { Role } from "#db-client";

const router = Router();

// ======================================================
// CREATE STUDENT FEE RATE ROUTE
// ======================================================
router.post(
  "/create_student_fee_rate",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodSchema(studentFeeZodSchema.createStudentFeeRateZodSchema),
  studentFeeController.createStudentFeeRate,
);

// ======================================================
// UPDATE A SINGLE STUDENT FEE RATE FIELD ROUTE
// ======================================================
router.patch(
  "/update_student_fee_rate_field/:student_fee_rate_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(studentFeeZodSchema.studentFeeRateIdParamsZodSchema),
  validateZodSchema(studentFeeZodSchema.updateStudentFeeRateFieldZodSchema),
  studentFeeController.updateStudentFeeRateField,
);

// ======================================================
// DELETE STUDENT FEE RATE ROUTE
// ======================================================
router.delete(
  "/delete_student_fee_rate/:student_fee_rate_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(studentFeeZodSchema.studentFeeRateIdParamsZodSchema),
  studentFeeController.deleteStudentFeeRate,
);

// ======================================================
// GET ALL STUDENT FEE RATE ROUTE
// ======================================================
router.get(
  "/",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  studentFeeController.getAllStudentFeeRates,
);

// ======================================================
// GET STUDENT FEE RATE BY STUDENT ID ROUTE
// ======================================================
router.get(
  "/get_student_fee_by_student_id/:student_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(studentFeeZodSchema.studentIdParamsZodSchema),
  validateZodSchema(studentFeeZodSchema.updateStudentFeePaymentFieldZodSchema),
  studentFeeController.getStudentFeeRateByStudentId,
);

// ======================================================
// GET ALL STUDENT FEE PAYMENT ROUTE
// ======================================================
router.get(
  "/get_all_student_fee_payments",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  studentFeeController.getAllStudentFeePayments,
);

// ======================================================
// GET STUDENT FEE PAYMENTS BY STUDENT ID ROUTE
// ======================================================
router.get(
  "/get_student_fee_payments_by_student_id/:student_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(studentFeeZodSchema.studentIdParamsZodSchema),
  validateZodQuery(studentFeeZodSchema.academicYearQueryZodSchema),
  studentFeeController.getStudentFeePaymentsByStudentId,
);
// ======================================================
// CREATE STUDENT FEE PAYMENT ROUTE
// ======================================================
router.post(
  "/create_student_fee_payment",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodSchema(studentFeeZodSchema.createStudentFeePaymentZodSchema),
  studentFeeController.createStudentFeePayment,
);

// ======================================================
// UPDATE A SINGLE STUDENT FEE PAYMENT FIELD ROUTE
// ======================================================
router.patch(
  "/update_student_fee_payment_field/:student_fee_payment_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(studentFeeZodSchema.studentFeePaymentIdParamsZodSchema),
  validateZodSchema(studentFeeZodSchema.updateStudentFeePaymentFieldZodSchema),
  studentFeeController.updateStudentFeePaymentField,
);

// ======================================================
// DELETE STUDENT FEE PAYMENT ROUTE
// ======================================================
router.delete(
  "/delete_student_fee_payment/:student_fee_payment_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(studentFeeZodSchema.studentFeePaymentIdParamsZodSchema),
  studentFeeController.deleteStudentFeePayment,
);

export const studentFeeRouter: Router = router;
