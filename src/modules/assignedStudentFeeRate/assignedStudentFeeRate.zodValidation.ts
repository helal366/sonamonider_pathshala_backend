import { BillingFrequency, Section, StudentFeeType, Version } from "#db-client";
import z4 from "zod/v4";

const createAssignedStudentFeeRateZodSchema = z4.object({
  fee_type: z4.enum(StudentFeeType, "Invalid student fee type."),
  billing_frequency: z4.enum(BillingFrequency, "Invalid billing frequency."),
  amount: z4.number().nonnegative("Amount cannot be negative."),
  class_id: z4.uuid("Invalid class ID."),
  section: z4.enum(Section, "Invalid section."),
  version: z4.enum(Version, "Invalid version."),
});

export type TCreateAssignedStudentFeeRateZodSchema = z4.infer<
  typeof createAssignedStudentFeeRateZodSchema
>;

const updateAssignedStudentFeeRateFieldZodSchema = z4.discriminatedUnion(
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
      field: z4.literal("class_id"),
      value: z4.uuid("Invalid class ID."),
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

export type TUpdateAssignedStudentFeeRateFieldZodSchema = z4.infer<
  typeof updateAssignedStudentFeeRateFieldZodSchema
>;

const assignedStudentFeeRateIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid assigned student fee rate ID."),
});

export type TAssignedStudentFeeRateIdParamsZodSchema = z4.infer<
  typeof assignedStudentFeeRateIdParamsZodSchema
>;

const classIdParamsZodSchema = z4.object({
  class_id: z4.uuid("Invalid class ID."),
});

export type TAssignedStudentFeeRateClassIdParamsZodSchema = z4.infer<
  typeof classIdParamsZodSchema
>;

export const assignedStudentFeeRateZodSchema = {
  createAssignedStudentFeeRateZodSchema,
  updateAssignedStudentFeeRateFieldZodSchema,
  assignedStudentFeeRateIdParamsZodSchema,
  classIdParamsZodSchema,
};
