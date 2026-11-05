import z4 from "zod/v4";

const mark = z4.coerce
  .number({ error: "Mark must be a valid number." })
  .min(0, "Mark cannot be negative.")
  .max(99_999_999.99, "Mark exceeds the maximum supported value.")
  .multipleOf(0.01, "Mark can have at most two decimal places.");

const halfYearlyExamMarkFields = {
  full_mark: mark,
  highest_mark: mark,
  obtained_mark: mark,
  student_result_id: z4.uuid("Invalid student result ID format."),
  exam_subject_id: z4.uuid("Invalid exam subject ID format."),
};
const halfYearlyExamMarkBaseSchema = z4.object(halfYearlyExamMarkFields);
const validateMark = (
  data: z4.output<typeof halfYearlyExamMarkBaseSchema>,
  ctx: z4.RefinementCtx,
) => {
  // Rule A: Highest mark must be less than or equal to full mark
  if (data.highest_mark > data.full_mark) {
    ctx.addIssue({
      code: "custom",
      message: `Highest mark cannot exceed the full mark (${data.full_mark}).`,
      path: ["highest_mark"],
    });
  }

  // Rule B: Obtained mark must be less than or equal to full mark
  if (data.obtained_mark > data.full_mark) {
    ctx.addIssue({
      code: "custom",
      message: `Obtained mark cannot exceed the full mark (${data.full_mark}).`,
      path: ["obtained_mark"],
    });
  }

  // Rule C: Obtained mark must be less than or equal to highest mark
  if (data.obtained_mark > data.highest_mark) {
    ctx.addIssue({
      code: "custom",
      message: `Obtained mark cannot exceed the highest mark (${data.highest_mark}).`,
      path: ["obtained_mark"],
    });
  }
};
const createHalfYearlyExamMarkZodSchema =
  halfYearlyExamMarkBaseSchema.superRefine(validateMark);
const updateHalfYearlyExamMarkZodSchema =
  halfYearlyExamMarkBaseSchema.superRefine(validateMark);
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
      field: z4.literal("exam_subject_id"),
      value: z4.uuid("Invalid exam subject ID format."),
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
