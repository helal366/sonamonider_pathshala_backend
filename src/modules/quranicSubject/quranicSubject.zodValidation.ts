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
export type TCreateQuranicSubjectZodSchema = z4.infer<typeof createQuranicSubjectZodSchema>;

// =======================================================
// UPDATE QURANIC SUBJECT ZOD SCHEMA
// =======================================================
const updateQuranicSubjectParamsZodSchema = z4.object({
    id: z4.uuid({
    message: "Invalid Quranic Subject ID format. Must be a valid UUID.",
  }),
});
export type TUpdateQuranicSubjectParamsZodSchema =z4.infer<typeof updateQuranicSubjectParamsZodSchema>;

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

export type TUpdateQuranicSubjectZodSchema = z4.infer<typeof updateQuranicSubjectZodSchema>;

const updateQuranicSubjectSingleFieldParamsZodSchema = z4.object({
  id: z4.uuid({
    message: "Invalid Quranic Subject ID format. Must be a valid UUID.",
  }),
});
export type TUpdateQuranicSubjectSingleFieldParamsZodSchema = z4.infer<
  typeof updateQuranicSubjectSingleFieldParamsZodSchema
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

// DELETE QURANIC SUBJECT ZOD SCHEMA
const deleteQuranicSubjectParamsZodSchema = z4.object({
  id: z4.uuid({
    message: "Invalid Quranic Subject ID format. Must be a valid UUID.",
  }),
});

export type TDeleteQuranicSubjectParamsZodSchema = z4.infer<typeof deleteQuranicSubjectParamsZodSchema>;

// GET SINGLE QURANIC SUBJECT BY ID ZOD SCHEMA
const getSingleQuranicSubjectZodSchema = z4.object({
  id: z4.uuid({ 
    message: "Invalid ID format. Must be a valid UUID." 
  }),
});

export type TGetSingleQuranicSubjectZodSchema = z4.infer<typeof getSingleQuranicSubjectZodSchema>;

export const quranicSubjectZodSchema = {
    createQuranicSubjectZodSchema,
    updateQuranicSubjectParamsZodSchema,
    updateQuranicSubjectZodSchema,
    updateQuranicSubjectSingleFieldParamsZodSchema,
    updateQuranicSubjectSingleFieldZodSchema,
    deleteQuranicSubjectParamsZodSchema,
    getSingleQuranicSubjectZodSchema
}