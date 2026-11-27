import { BillingFrequency, StudentFeeType } from "#db-client";
import z4 from "zod/v4";

// ======================================================
// CREATE STUDENT FEE ASSESSMENT ZOD SCHEMA
// ======================================================
const createStudentFeeAssessmentZodSchema = z4
  .object({
    class_history_id: z4.uuid("Invalid class history ID."),
    fee_type: z4.enum(StudentFeeType, "Invalid student fee type."),
    billing_frequency: z4.enum(BillingFrequency, "Invalid billing frequency."),
    discount_amount: z4.number().nonnegative("Discount cannot be negative."),
  });

export type TCreateStudentFeeAssessmentZodSchema = z4.infer<
  typeof createStudentFeeAssessmentZodSchema
>;

// ======================================================
// CREATE STUDENT FEE PAYMENT ZOD SCHEMA
// ======================================================
const createStudentFeePaymentZodSchema = z4.object({
  student_id: z4.uuid("Invalid student ID."),
  academic_year_id: z4.uuid("Invalid academic year ID."),
  fee_type: z4.enum(StudentFeeType, "Invalid student fee type."),
  billing_frequency: z4.enum(BillingFrequency, "Invalid billing frequency."),
  billing_period_key: z4.string().trim().min(1, "Billing period is required."),
  amount_paid: z4.number().nonnegative("Amount cannot be negative."),
  paid_at: z4.coerce.date().optional(),
  receipt_number: z4.string().trim().nullable().optional(),
  online_payment_gateway: z4.string().optional(),
  online_tran_id: z4.string().optional()
});

export type TCreateStudentFeePaymentZodSchema = z4.infer<
  typeof createStudentFeePaymentZodSchema
>;

// ======================================================
// UPDATE A SINGLE STUDENT FEE ASSESSMENT FIELD ZOD SCHEMA
// ======================================================
const updateStudentFeeAssessmentFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    field: z4.literal("fee_type"),
    value: z4.enum(StudentFeeType, "Invalid student fee type."),
  }),
  z4.object({
    field: z4.literal("billing_frequency"),
    value: z4.enum(BillingFrequency, "Invalid billing frequency."),
  }),
  z4.object({
    field: z4.literal("amount"),
    value: z4.number().nonnegative("Amount cannot be negative."),
  }),
  z4.object({
    field: z4.literal("discount_amount"),
    value: z4.number().nonnegative("Discount cannot be negative."),
  }),
]);

export type TUpdateStudentFeeAssessmentFieldZodSchema = z4.infer<
  typeof updateStudentFeeAssessmentFieldZodSchema
>;

// ======================================================
// UPDATE A SINGLE STUDENT FEE PAYMENT FIELD ZOD SCHEMA
// ======================================================
const updateStudentFeePaymentFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    field: z4.literal("fee_type"),
    value: z4.enum(StudentFeeType, "Invalid student fee type."),
  }),
  z4.object({
    field: z4.literal("billing_frequency"),
    value: z4.enum(BillingFrequency, "Invalid billing frequency."),
  }),
  z4.object({
    field: z4.literal("billing_period_key"),
    value: z4.string().trim().min(1, "Billing period is required."),
  }),
  z4.object({
    field: z4.literal("amount_paid"),
    value: z4.number().nonnegative("Amount cannot be negative."),
  }),
  z4.object({
    field: z4.literal("paid_at"),
    value: z4.coerce.date(),
  }),
  z4.object({
    field: z4.literal("receipt_number"),
    value: z4.string().trim().nullable(),
  }),
  z4.object({
    field: z4.literal("online_payment_gateway"),
    value: z4.string().trim().nullable(),
  }),
  z4.object({
    field: z4.literal("online_tran_id"),
    value: z4.string().trim().nullable(),
  }),
]);

export type TUpdateStudentFeePaymentFieldZodSchema = z4.infer<
  typeof updateStudentFeePaymentFieldZodSchema
>;

// ======================================================
// STUDENT FEE ASSESSMENT ZOD SCHEMA
// ======================================================
const studentFeeAssessmentIdParamsZodSchema = z4.object({
  student_fee_assessment_id: z4.uuid("Invalid student fee assessment ID."),
});

export type TStudentFeeAssessmentIdParamsZodSchema = z4.infer<
  typeof studentFeeAssessmentIdParamsZodSchema
>;

// ======================================================
// DELETE STUDENT FEE PAYMENT ZOD SCHEMA
// ======================================================
const studentFeePaymentIdParamsZodSchema = z4.object({
  student_fee_payment_id: z4.uuid("Invalid student fee payment ID."),
});

export type TStudentFeePaymentIdParamsZodSchema = z4.infer<
  typeof studentFeePaymentIdParamsZodSchema
>;

// ======================================================
// GET STUDENT FEES BY STUDENT ID ZOD SCHEMA
// ======================================================
const studentIdParamsZodSchema = z4.object({
  student_id: z4.uuid("Invalid student ID."),
});
export type TStudentIdParamsZodSchema = z4.infer<
  typeof studentIdParamsZodSchema
>;

// ===========================================================================
// GET STUDENT FEES BY STUDENT ID WITH ACADEMIC YEAR QUERY ZOD SCHEMA
// ===========================================================================
const academicYearQueryZodSchema = z4.object({
  academic_year_name: z4
    .string()
    .regex(
      /^2\d{3}$/,
      "Academic year must start with 2 and contain exactly 4 digits.",
    ),
});
export type TAcademicYearQueryZodSchema = z4.infer<
  typeof academicYearQueryZodSchema
>;
export const studentFeeZodSchema = {
  createStudentFeeAssessmentZodSchema,
  createStudentFeePaymentZodSchema,
  updateStudentFeeAssessmentFieldZodSchema,
  updateStudentFeePaymentFieldZodSchema,
  studentFeeAssessmentIdParamsZodSchema,
  studentFeePaymentIdParamsZodSchema,
  studentIdParamsZodSchema,
  academicYearQueryZodSchema,
};
