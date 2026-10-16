import { BillingFrequency, StudentFeeType } from "#db-client";
import z4 from "zod/v4";

// ======================================================
// CREATE STUDENT FEE RATE ZOD SCHEMA
// ======================================================
const createStudentFeeRateZodSchema = z4.object({
  student_id: z4.uuid("Invalid student ID."),
  fee_type: z4.enum(StudentFeeType, "Invalid student fee type."),
  billing_frequency: z4.enum(BillingFrequency, "Invalid billing frequency."),
  amount: z4.number().nonnegative("Amount cannot be negative."),
  effective_from: z4.coerce.date().optional(),
  effective_to: z4.coerce.date().nullable().optional(),
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
  amount: z4.number().nonnegative("Amount cannot be negative."),
  paid_at: z4.coerce.date().optional(),
  receipt_number: z4.string().trim().nullable().optional(),
});

export type TCreateStudentFeePaymentZodSchema = z4.infer<
  typeof createStudentFeePaymentZodSchema
>;

// ======================================================
// UPDATE A SINGLE STUDENT FEE RATE FIELD ZOD SCHEMA
// ======================================================
const updateStudentFeeRateFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    id: z4.uuid("Invalid student fee rate ID."),
    field: z4.literal("fee_type"),
    value: z4.enum(StudentFeeType, "Invalid student fee type."),
  }),
  z4.object({
    id: z4.uuid("Invalid student fee rate ID."),
    field: z4.literal("billing_frequency"),
    value: z4.enum(BillingFrequency, "Invalid billing frequency."),
  }),
  z4.object({
    id: z4.uuid("Invalid student fee rate ID."),
    field: z4.literal("amount"),
    value: z4.number().nonnegative("Amount cannot be negative."),
  }),
  z4.object({
    id: z4.uuid("Invalid student fee rate ID."),
    field: z4.literal("effective_from"),
    value: z4.coerce.date(),
  }),
  z4.object({
    id: z4.uuid("Invalid student fee rate ID."),
    field: z4.literal("effective_to"),
    value: z4.coerce.date().nullable(),
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
    id: z4.uuid("Invalid student fee payment ID."),
    field: z4.literal("fee_type"),
    value: z4.enum(StudentFeeType, "Invalid student fee type."),
  }),
  z4.object({
    id: z4.uuid("Invalid student fee payment ID."),
    field: z4.literal("billing_frequency"),
    value: z4.enum(BillingFrequency, "Invalid billing frequency."),
  }),
  z4.object({
    id: z4.uuid("Invalid student fee payment ID."),
    field: z4.literal("billing_period_key"),
    value: z4.string().trim().min(1, "Billing period is required."),
  }),
  z4.object({
    id: z4.uuid("Invalid student fee payment ID."),
    field: z4.literal("amount"),
    value: z4.number().nonnegative("Amount cannot be negative."),
  }),
  z4.object({
    id: z4.uuid("Invalid student fee payment ID."),
    field: z4.literal("paid_at"),
    value: z4.coerce.date(),
  }),
  z4.object({
    id: z4.uuid("Invalid student fee payment ID."),
    field: z4.literal("receipt_number"),
    value: z4.string().trim().nullable(),
  }),
]);

export type TUpdateStudentFeePaymentFieldZodSchema = z4.infer<
  typeof updateStudentFeePaymentFieldZodSchema
>;

// ======================================================
// DELETE STUDENT FEE RATE ZOD SCHEMA
// ======================================================
const deleteStudentFeeRateZodSchema = z4.object({
  id: z4.uuid("Invalid student fee rate ID."),
});

export type TDeleteStudentFeeRateZodSchema = z4.infer<
  typeof deleteStudentFeeRateZodSchema
>;

// ======================================================
// DELETE STUDENT FEE PAYMENT ZOD SCHEMA
// ======================================================
const deleteStudentFeePaymentZodSchema = z4.object({
  id: z4.uuid("Invalid student fee payment ID."),
});

export type TDeleteStudentFeePaymentZodSchema = z4.infer<
  typeof deleteStudentFeePaymentZodSchema
>;

export const studentFeeZodSchema = {
  createStudentFeeRateZodSchema,
  createStudentFeePaymentZodSchema,
  updateStudentFeeRateFieldZodSchema,
  updateStudentFeePaymentFieldZodSchema,
  deleteStudentFeeRateZodSchema,
  deleteStudentFeePaymentZodSchema,
};
