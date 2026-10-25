import z4 from "zod/v4";

const mark = z4.coerce
  .number({ error: "Mark must be a valid number." })
  .finite()
  .min(0, "Mark cannot be negative.")
  .max(99_999_999.99, "Mark exceeds the maximum supported value.")
  .multipleOf(0.01, "Mark can have at most two decimal places.");

const monthlyFields = {
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
const updateMonthlyExamMarkFieldZodSchema = z4.object({
  field: z4.enum([
    "january_mark",
    "february_mark",
    "march_mark",
    "april_mark",
    "july_mark",
    "august_mark",
    "september_mark",
    "october_mark",
  ]),
  value: mark,
});
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
