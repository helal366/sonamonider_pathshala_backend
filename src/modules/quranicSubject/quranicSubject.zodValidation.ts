import z4 from "zod/v4";

// =======================================================
// CREATE QURANIC SUBJECT ZOD SCHEMA
// =======================================================
const createQuranicSubjectZodSchema = z4.object({
  quranic_subject_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Quranic Subject name is required."
          : "Invalid Quranic Subject name format.",
    })
    .trim()
    .min(1, "Quranic Subject name cannot be empty."),
});
export type TCreateQuranicSubjectZodSchema = z4.infer<
  typeof createQuranicSubjectZodSchema
>;

// =======================================================
// QURANIC SUBJECT ID PARAMS ZOD SCHEMA
// =======================================================
const quranicSubjectIdParamsZodSchema = z4.object({
  quranic_subject_id: z4.uuid({
    message: "Invalid Quranic Subject ID format. Must be a valid UUID.",
  }),
});
export type TQuranicSubjectIdParamsZodSchema = z4.infer<
  typeof quranicSubjectIdParamsZodSchema
>;

const updateQuranicSubjectZodSchema = z4.object({
  quranic_subject_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "New Quranic Subject name is required."
          : "Invalid Quranic Subject name format.",
    })
    .trim()
    .min(1, "New Quranic Subject name cannot be empty."),
});

export type TUpdateQuranicSubjectZodSchema = z4.infer<
  typeof updateQuranicSubjectZodSchema
>;


const updateQuranicSubjectSingleFieldZodSchema = z4.object({
  field: z4.literal("quranic_subject_name"),
  value: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Quranic Subject name is required."
          : "Invalid Quranic Subject name format.",
    })
    .trim()
    .min(1, "Quranic Subject name cannot be empty."),
});
export type TUpdateQuranicSubjectSingleFieldPayload = z4.infer<
  typeof updateQuranicSubjectSingleFieldZodSchema
>;


export const quranicSubjectZodSchema = {
  createQuranicSubjectZodSchema,
  quranicSubjectIdParamsZodSchema,
  updateQuranicSubjectZodSchema,
  updateQuranicSubjectSingleFieldZodSchema,
};
