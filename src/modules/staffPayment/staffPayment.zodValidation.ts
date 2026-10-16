import { SalaryChangeType, StaffPaymentType } from "#db-client";
import z4 from "zod/v4";

// ======================================================
// CREATE STAFF SALARY RATE ZOD SCHEMA
// ======================================================
const createStaffSalaryRateZodSchema = z4
  .object({
    academic_staff_id: z4.uuid("Invalid academic staff ID.").optional(),
    management_staff_id: z4.uuid("Invalid management staff ID.").optional(),
    monthly_salary: z4.number().nonnegative("Monthly salary cannot be negative."),
    eid_bonus: z4.number().nonnegative("Eid bonus cannot be negative."),
    change_type: z4.enum(SalaryChangeType).optional(),
    effective_from: z4.coerce.date().optional(),
    note: z4.string().trim().nullable().optional(),
  })
  .refine(
    ({ academic_staff_id, management_staff_id }) =>
      Boolean(academic_staff_id) !== Boolean(management_staff_id),
    "Provide exactly one of academic_staff_id or management_staff_id.",
  );

export type TCreateStaffSalaryRateZodSchema = z4.infer<
  typeof createStaffSalaryRateZodSchema
>;

// ======================================================
// CREATE STAFF PAYMENT ZOD SCHEMA
// ======================================================
const createStaffPaymentZodSchema = z4
  .object({
    academic_staff_id: z4.uuid("Invalid academic staff ID.").optional(),
    management_staff_id: z4.uuid("Invalid management staff ID.").optional(),
    payment_type: z4.enum(StaffPaymentType),
    payment_period_key: z4.string().trim().min(1, "Payment period is required."),
    amount: z4.number().nonnegative("Payment amount cannot be negative."),
    paid_at: z4.coerce.date().optional(),
    receipt_number: z4.string().trim().nullable().optional(),
  })
  .refine(
    ({ academic_staff_id, management_staff_id }) =>
      Boolean(academic_staff_id) !== Boolean(management_staff_id),
    "Provide exactly one of academic_staff_id or management_staff_id.",
  );

export type TCreateStaffPaymentZodSchema = z4.infer<
  typeof createStaffPaymentZodSchema
>;

// ======================================================
// UPDATE A SINGLE STAFF SALARY RATE FIELD ZOD SCHEMA
// ======================================================
const updateStaffSalaryRateFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    id: z4.uuid("Invalid staff salary rate ID."),
    field: z4.literal("monthly_salary"),
    value: z4.number().nonnegative("Monthly salary cannot be negative."),
  }),
  z4.object({
    id: z4.uuid("Invalid staff salary rate ID."),
    field: z4.literal("eid_bonus"),
    value: z4.number().nonnegative("Eid bonus cannot be negative."),
  }),
  z4.object({
    id: z4.uuid("Invalid staff salary rate ID."),
    field: z4.literal("change_type"),
    value: z4.enum(SalaryChangeType),
  }),
  z4.object({
    id: z4.uuid("Invalid staff salary rate ID."),
    field: z4.literal("effective_from"),
    value: z4.coerce.date(),
  }),
  z4.object({
    id: z4.uuid("Invalid staff salary rate ID."),
    field: z4.literal("note"),
    value: z4.string().trim().nullable(),
  }),
]);

export type TUpdateStaffSalaryRateFieldZodSchema = z4.infer<
  typeof updateStaffSalaryRateFieldZodSchema
>;

// ======================================================
// UPDATE A SINGLE STAFF PAYMENT FIELD ZOD SCHEMA
// ======================================================
const updateStaffPaymentFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    id: z4.uuid("Invalid staff payment ID."),
    field: z4.literal("payment_type"),
    value: z4.enum(StaffPaymentType),
  }),
  z4.object({
    id: z4.uuid("Invalid staff payment ID."),
    field: z4.literal("payment_period_key"),
    value: z4.string().trim().min(1, "Payment period is required."),
  }),
  z4.object({
    id: z4.uuid("Invalid staff payment ID."),
    field: z4.literal("amount"),
    value: z4.number().nonnegative("Payment amount cannot be negative."),
  }),
  z4.object({
    id: z4.uuid("Invalid staff payment ID."),
    field: z4.literal("paid_at"),
    value: z4.coerce.date(),
  }),
  z4.object({
    id: z4.uuid("Invalid staff payment ID."),
    field: z4.literal("receipt_number"),
    value: z4.string().trim().nullable(),
  }),
]);

export type TUpdateStaffPaymentFieldZodSchema = z4.infer<
  typeof updateStaffPaymentFieldZodSchema
>;

// ======================================================
// DELETE STAFF SALARY RATE ZOD SCHEMA
// ======================================================
const deleteStaffSalaryRateZodSchema = z4.object({
  id: z4.uuid("Invalid staff salary rate ID."),
});

export type TDeleteStaffSalaryRateZodSchema = z4.infer<
  typeof deleteStaffSalaryRateZodSchema
>;

// ======================================================
// DELETE STAFF PAYMENT ZOD SCHEMA
// ======================================================
const deleteStaffPaymentZodSchema = z4.object({
  id: z4.uuid("Invalid staff payment ID."),
});

export type TDeleteStaffPaymentZodSchema = z4.infer<
  typeof deleteStaffPaymentZodSchema
>;

export const staffPaymentZodSchema = {
  createStaffSalaryRateZodSchema,
  createStaffPaymentZodSchema,
  updateStaffSalaryRateFieldZodSchema,
  updateStaffPaymentFieldZodSchema,
  deleteStaffSalaryRateZodSchema,
  deleteStaffPaymentZodSchema,
};
