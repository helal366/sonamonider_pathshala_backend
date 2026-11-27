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
// CREATE STUDENT FEE ASSESSMENT ROUTE
// ======================================================
router.post(
  "/create_student_fee_assessment",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodSchema(studentFeeZodSchema.createStudentFeeAssessmentZodSchema),
  studentFeeController.createStudentFeeAssessment,
);

// ======================================================
// UPDATE A SINGLE STUDENT FEE ASSESSMENT FIELD ROUTE
// ======================================================
router.patch(
  "/update_student_fee_assessment_field/:student_fee_assessment_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(studentFeeZodSchema.studentFeeAssessmentIdParamsZodSchema),
  validateZodSchema(studentFeeZodSchema.updateStudentFeeAssessmentFieldZodSchema),
  studentFeeController.updateStudentFeeAssessmentField,
);

// ======================================================
// DELETE STUDENT FEE ASSESSMENT ROUTE
// ======================================================
router.delete(
  "/delete_student_fee_assessment/:student_fee_assessment_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(studentFeeZodSchema.studentFeeAssessmentIdParamsZodSchema),
  studentFeeController.deleteStudentFeeAssessment,
);

// ======================================================
// GET ALL STUDENT FEE ASSESSMENT ROUTE
// ======================================================
router.get(
  "/",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  studentFeeController.getAllStudentFeeAssessments,
);

// ======================================================
// GET STUDENT FEE ASSESSMENTS BY STUDENT ID ROUTE
// ======================================================
router.get(
  "/get_student_fee_assessments_by_student_id/:student_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN, Role.MANAGEMENT),
  validateZodParams(studentFeeZodSchema.studentIdParamsZodSchema),
  validateZodQuery(studentFeeZodSchema.academicYearQueryZodSchema),
  studentFeeController.getStudentFeeAssessmentByStudentId,
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
