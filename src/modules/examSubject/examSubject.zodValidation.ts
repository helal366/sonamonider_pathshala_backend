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

const examSubjectFields = {
  class_id: z4.uuid("Invalid class ID format."),
  section: z4.enum(Section, "Invalid section."),
  version: z4.enum(Version, "Invalid version"),
  department: z4
    .enum(Department, "Invalid department")
    .optional()
    .default("GENERAL"),
  exam_subject_name: z4.enum(ExamSubjectName, "Invalid exam subject name"),
  is_active: z4.boolean().optional().default(true),
};
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

export const examSubjectZodSchema = {
  examSubjectIdParamsZodSchema,
  createExamSubjectZodSchema,
  updateExamSubjectZodSchema,
};
