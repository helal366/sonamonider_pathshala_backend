import { BillingFrequency, StudentFeeType } from "#db-client";
import z4 from "zod/v4";

// ======================================================
// CREATE STUDENT FEE RATE ZOD SCHEMA
// ======================================================
const createStudentFeeRateZodSchema = z4
  .object({
    class_history_id: z4.uuid("Invalid class ID."),
    fee_type: z4.enum(StudentFeeType, "Invalid student fee type."),
    billing_frequency: z4.enum(BillingFrequency, "Invalid billing frequency."),
    amount: z4.number().nonnegative("Amount cannot be negative."),
    discount_amount: z4.number().nonnegative("Amount cannot be negative."),
    amount_to_pay: z4.number().nonnegative("Amount cannot be negative."),
  })
  .superRefine((data, ctx) => {
    if (data.discount_amount > data.amount) {
      ctx.addIssue({
        code: "custom",
        path: ["discount_amount"],
        message: "Discount amount can not be greater than actual amount.",
      });
    }
    if (data.amount_to_pay !== data.amount - data.discount_amount) {
      ctx.addIssue({
        code: "custom",
        path: ["amount_to_pay"],
        message: "Amount to pay must equal amount minus discount amount.",
      });
    }
  });

export type TCreateStudentFeeRateZodSchema = z4.infer<
  typeof createStudentFeeRateZodSchema
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
  amount_to_pay: z4.number().nonnegative("Amount cannot be negative."),
  paid_at: z4.coerce.date().optional(),
  receipt_number: z4.string().trim().nullable().optional(),
  online_payment_gateway: z4.string().optional(),
  online_tran_id: z4.string().optional()
});

export type TCreateStudentFeePaymentZodSchema = z4.infer<
  typeof createStudentFeePaymentZodSchema
>;

// ======================================================
// UPDATE A SINGLE STUDENT FEE RATE FIELD ZOD SCHEMA
// ======================================================
const updateStudentFeeRateFieldZodSchema = z4.discriminatedUnion("field", [
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
]);

export type TUpdateStudentFeeRateFieldZodSchema = z4.infer<
  typeof updateStudentFeeRateFieldZodSchema
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
    field: z4.literal("amount_to_pay"),
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
// DELETE STUDENT FEE RATE ZOD SCHEMA
// ======================================================
const studentFeeRateIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid student fee rate ID."),
});

export type TStudentFeeRateIdParamsZodSchema = z4.infer<
  typeof studentFeeRateIdParamsZodSchema
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
  createStudentFeeRateZodSchema,
  createStudentFeePaymentZodSchema,
  updateStudentFeeRateFieldZodSchema,
  updateStudentFeePaymentFieldZodSchema,
  studentFeeRateIdParamsZodSchema,
  studentFeePaymentIdParamsZodSchema,
  studentIdParamsZodSchema,
  academicYearQueryZodSchema,
};
