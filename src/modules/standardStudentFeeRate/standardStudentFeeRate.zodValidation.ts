import {
  BillingFrequency,
  Department,
  Section,
  StudentFeeType,
  Version,
} from "#db-client";
import z4 from "zod/v4";

const createStandardStudentFeeRateZodSchema = z4.object({
  fee_type: z4.enum(StudentFeeType, "Invalid student fee type."),
  billing_frequency: z4.enum(BillingFrequency, "Invalid billing frequency."),
  amount: z4.number().nonnegative("Amount cannot be negative."),
  ic_duration_hrs: z4.number().nonnegative().nullable().optional(),
  qc_duration_hrs: z4.number().nonnegative().nullable().optional(),
  class_ids: z4
    .array(
      z4.uuid({
        error: "Each class ID must be a valid UUID string format.",
      }),
    )
    .min(1, "At least one class must be selected.")
    .refine((classIds) => new Set(classIds).size === classIds.length, {
      error: "Class IDs must not contain duplicates.",
    }),
  section: z4.enum(Section, "Invalid section format."),
  version: z4.enum(Version, "Invalid version format."),
  department: z4
    .enum(Department, "Invalid department format.")
    .nullable()
    .optional(),
});

export type TCreateStandardStudentFeeRateZodSchema = z4.infer<
  typeof createStandardStudentFeeRateZodSchema
>;

const updateStandardStudentFeeRateFieldZodSchema = z4.discriminatedUnion(
  "field",
  [
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
      field: z4.literal("ic_duration_hrs"),
      value: z4.number().nonnegative().nullable(),
    }),
    z4.object({
      field: z4.literal("qc_duration_hrs"),
      value: z4.number().nonnegative().nullable(),
    }),
    z4.object({
      field: z4.literal("department"),
      value: z4.enum(Department, "Invalid department format.").nullable(),
    }),
    z4.object({
      field: z4.literal("class_ids"),
      value: z4
        .array(
          z4.uuid({
            error: "Each class ID must be a valid UUID string format.",
          }),
        )
        .min(1, "At least one class must be selected.")
        .refine((classIds) => new Set(classIds).size === classIds.length, {
          error: "Class IDs must not contain duplicates.",
        }),
    }),
    z4.object({
      field: z4.literal("section"),
      value: z4.enum(Section, "Invalid section."),
    }),
    z4.object({
      field: z4.literal("version"),
      value: z4.enum(Version, "Invalid version."),
    }),
  ],
);

export type TUpdateStandardStudentFeeRateFieldZodSchema = z4.infer<
  typeof updateStandardStudentFeeRateFieldZodSchema
>;

const standardStudentFeeRateIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid standard student fee rate ID."),
});

export type TStandardStudentFeeRateIdParamsZodSchema = z4.infer<
  typeof standardStudentFeeRateIdParamsZodSchema
>;

const classIdParamsZodSchema = z4.object({
  class_id: z4.uuid("Invalid class ID."),
});

export type TStandardStudentFeeRateClassIdParamsZodSchema = z4.infer<
  typeof classIdParamsZodSchema
>;

export const standardStudentFeeRateZodSchema = {
  createStandardStudentFeeRateZodSchema,
  updateStandardStudentFeeRateFieldZodSchema,
  standardStudentFeeRateIdParamsZodSchema,
  classIdParamsZodSchema,
};
