import z4 from "zod/v4";

// ==========================================================
// ARABIC SUBJECT ID PARAMS ZOD SCHEMA
// ==========================================================
const idParamsSchema = z4.object({
  id: z4.uuid("Invalid Arabic subject ID format."),
});

// ==========================================================
// ARABIC SUBJECT NAME ZOD SCHEMA
// ==========================================================
const subjectNameSchema = z4
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "Arabic subject name is required."
        : "Invalid Arabic subject name format.",
  })
  .trim()
  .min(1, "Arabic subject name cannot be empty.");

// ==========================================================
// CREATE ARABIC SUBJECT ZOD SCHEMA
// ==========================================================
const createArabicSubjectZodSchema = z4.object({
  arabic_subject_name: subjectNameSchema,
});

// ==========================================================
// UPDATE ARABIC SUBJECT ZOD SCHEMA
// ==========================================================
const updateArabicSubjectZodSchema = z4.object({
  arabic_subject_name: subjectNameSchema,
});

// ==========================================================
// UPDATE ARABIC SUBJECT SINGLE FIELD ZOD SCHEMA
// ==========================================================
const updateArabicSubjectSingleFieldZodSchema = z4.object({
  field: z4.literal("arabic_subject_name"),
  value: subjectNameSchema,
});

// ==========================================================
// ARABIC SUBJECT ZOD SCHEMA TYPES
// ==========================================================
export type TCreateArabicSubjectZodSchema = z4.infer<
  typeof createArabicSubjectZodSchema
>;
export type TUpdateArabicSubjectZodSchema = z4.infer<
  typeof updateArabicSubjectZodSchema
>;
export type TUpdateArabicSubjectSingleFieldPayload = z4.infer<
  typeof updateArabicSubjectSingleFieldZodSchema
>;

// ==========================================================
// EXPORT ARABIC SUBJECT ZOD SCHEMAS
// ==========================================================
export const arabicSubjectZodSchema = {
  createArabicSubjectZodSchema,
  updateArabicSubjectParamsZodSchema: idParamsSchema,
  updateArabicSubjectZodSchema,
  updateArabicSubjectSingleFieldParamsZodSchema: idParamsSchema,
  updateArabicSubjectSingleFieldZodSchema,
  deleteArabicSubjectParamsZodSchema: idParamsSchema,
  getSingleArabicSubjectParamsZodSchema: idParamsSchema,
};

// ==========================================================
// ARABIC SUBJECT ID PARAMS TYPE
// ==========================================================
export type TArabicSubjectIdParams = z4.infer<typeof idParamsSchema>;