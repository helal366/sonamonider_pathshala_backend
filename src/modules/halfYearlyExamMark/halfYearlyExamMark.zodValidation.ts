import z4 from "zod/v4";

const mark = z4.coerce
  .number({ error: "Mark must be a valid number." })
  .finite()
  .min(0, "Mark cannot be negative.")
  .max(99_999_999.99, "Mark exceeds the maximum supported value.")
  .multipleOf(0.01, "Mark can have at most two decimal places.");

const halfYearlyExamMarkFields = {
  full_mark: mark,
  highest_mark: mark,
  obtained_mark: mark,
  student_result_id: z4.uuid("Invalid student result ID format."),
  book_list_id: z4.uuid("Invalid book list ID format."),
};
const createHalfYearlyExamMarkZodSchema = z4.object(halfYearlyExamMarkFields);
const updateHalfYearlyExamMarkZodSchema = z4.object(halfYearlyExamMarkFields);
const updateHalfYearlyExamMarkFieldZodSchema = z4.discriminatedUnion(
  "field",
  [
    z4.object({ field: z4.literal("full_mark"), value: mark }),
    z4.object({ field: z4.literal("highest_mark"), value: mark }),
    z4.object({ field: z4.literal("obtained_mark"), value: mark }),
    z4.object({
      field: z4.literal("student_result_id"),
      value: z4.uuid("Invalid student result ID format."),
    }),
    z4.object({
      field: z4.literal("book_list_id"),
      value: z4.uuid("Invalid book list ID format."),
    }),
  ],
);
const halfYearlyExamMarkIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid half-yearly exam mark ID format."),
});

export type TCreateHalfYearlyExamMark = z4.infer<
  typeof createHalfYearlyExamMarkZodSchema
>;
export type TUpdateHalfYearlyExamMark = z4.infer<
  typeof updateHalfYearlyExamMarkZodSchema
>;
export type TUpdateHalfYearlyExamMarkField = z4.infer<
  typeof updateHalfYearlyExamMarkFieldZodSchema
>;

export const halfYearlyExamMarkZodSchema = {
  createHalfYearlyExamMarkZodSchema,
  updateHalfYearlyExamMarkZodSchema,
  updateHalfYearlyExamMarkFieldZodSchema,
  halfYearlyExamMarkIdParamsZodSchema,
};
