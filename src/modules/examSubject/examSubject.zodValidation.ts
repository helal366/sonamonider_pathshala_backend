import { Department, ExamSubjectName, Section, Version } from "#db-client";
import z4 from "zod/v4";
// ===================================================================
// EXAM SUBJECT ID PARAMS ZOD SCHEMA
// ===================================================================
const examSubjectIdParamsZodSchema = z4.object({
  exam_subject_id: z4.uuid("Invalid exam subject ID."),
});
export type TExamSubjectIdParamsZodSchema = z4.infer<
  typeof examSubjectIdParamsZodSchema
>;

// ===================================================================
// CREATE EXAM SUBJECT ZOD SCHEMA
// ===================================================================
const createExamSubjectZodSchema = z4.object({
  class_id: z4.uuid("Invalid class ID format."),
  section: z4.enum(Section, "Invalid section."),
  version: z4.enum(Version, "Invalid version"),
  department: z4
    .enum(Department, "Invalid department")
    .optional()
    .default("GENERAL"),
  exam_subject_name: z4.enum(ExamSubjectName, "Invalid exam subject name"),
});
export type TCreateExamSubjectZodSchema = z4.infer<
  typeof createExamSubjectZodSchema
>;

// ===================================================================
// UPDATE EXAM SUBJECT ZOD SCHEMA
// ===================================================================
const updateExamSubjectZodSchema = z4.object({
  class_id: z4.uuid("Invalid class ID format."),
  section: z4.enum(Section, "Invalid section."),
  version: z4.enum(Version, "Invalid version"),
  department: z4.enum(Department, "Invalid department"),
  exam_subject_name: z4.enum(ExamSubjectName, "Invalid exam subject name"),
  is_active: z4.boolean(),
});
export type TUpdateExamSubjectZodSchema = z4.infer<
  typeof updateExamSubjectZodSchema
>;

// ===================================================================
// UPDATE EXAM SUBJECT SINGLE FIELD ZOD SCHEMA
// ===================================================================
const updateExamSubjectSingleFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    field: z4.literal("class_id"),
    value: z4
      .uuid({
        error: (issue) =>
          issue.input === undefined
            ? "Class ID is required."
            : "Invalid Class ID format.",
      }),
  }),
  z4.object({
    field: z4.literal("section"),
    value: z4
      .enum(Section,{
        error: (issue) =>
          issue.input === undefined
            ? "Section is required."
            : "Invalid Section format.",
      }),
  }),
  z4.object({
    field: z4.literal("version"),
    value: z4
      .enum(Version, {
        error: (issue) =>
          issue.input === undefined
            ? "Version is required."
            : "Invalid Version format.",
      }),
  }),
  z4.object({
    field: z4.literal("department"),
    value: z4
      .enum(Department, {
        error: (issue) =>
          issue.input === undefined
            ? "Department is required."
            : "Invalid Department format.",
      }),
  }),
  z4.object({
    field: z4.literal("exam_subject_name"),
    value: z4
      .enum(ExamSubjectName, {
        error: (issue) =>
          issue.input === undefined
            ? "Exam subject name is required."
            : "Invalid Exam subject name format.",
      }),
  }),
  z4.object({
    field: z4.literal("is_active"),
    value: z4
      .boolean({
        error: (issue) =>
          issue.input === undefined
            ? "Activity data is required."
            : "Invalid Activity data format.",
      }),
  }),
]);
export type TUpdateExamSubjectSingleFieldZodSchema = z4.infer<typeof updateExamSubjectSingleFieldZodSchema>;


export const examSubjectZodSchema = {
  examSubjectIdParamsZodSchema,
  createExamSubjectZodSchema,
  updateExamSubjectZodSchema,
  updateExamSubjectSingleFieldZodSchema,
};
