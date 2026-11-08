import z4 from "zod/v4";

const mark = z4.coerce
  .number({ error: "Mark must be a valid number." })
  .finite()
  .min(0, "Mark cannot be negative.")
  .max(99_999_999.99, "Mark exceeds the maximum supported value.")
  .multipleOf(0.01, "Mark can have at most two decimal places.");

const monthlyFields = {
  class_history_id: z4.uuid("Invalid class history ID format."),
  january_mark: mark,
  february_mark: mark,
  march_mark: mark,
  april_mark: mark,
  july_mark: mark,
  august_mark: mark,
  september_mark: mark,
  october_mark: mark,
};
const createMonthlyExamMarkZodSchema = z4.object(monthlyFields);
const updateMonthlyExamMarkZodSchema = z4.object(monthlyFields);
const updateMonthlyExamMarkFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    field: z4.literal("class_history_id"),
    value: z4.uuid("Invalid class history ID format."),
  }),
  z4.object({ field: z4.literal("january_mark"), value: mark }),
  z4.object({ field: z4.literal("february_mark"), value: mark }),
  z4.object({ field: z4.literal("march_mark"), value: mark }),
  z4.object({ field: z4.literal("april_mark"), value: mark }),
  z4.object({ field: z4.literal("july_mark"), value: mark }),
  z4.object({ field: z4.literal("august_mark"), value: mark }),
  z4.object({ field: z4.literal("september_mark"), value: mark }),
  z4.object({ field: z4.literal("october_mark"), value: mark }),
]);
const monthlyExamMarkIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid monthly exam mark ID format."),
});

export type TCreateMonthlyExamMark = z4.infer<
  typeof createMonthlyExamMarkZodSchema
>;
export type TUpdateMonthlyExamMark = z4.infer<
  typeof updateMonthlyExamMarkZodSchema
>;
export type TUpdateMonthlyExamMarkField = z4.infer<
  typeof updateMonthlyExamMarkFieldZodSchema
>;

export const monthlyExamMarkZodSchema = {
  createMonthlyExamMarkZodSchema,
  updateMonthlyExamMarkZodSchema,
  updateMonthlyExamMarkFieldZodSchema,
  monthlyExamMarkIdParamsZodSchema,
};
