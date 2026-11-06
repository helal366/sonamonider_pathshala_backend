import { Department, ExamSubjectName, Section, Version } from "#db-client";
import z4 from "zod/v4";

// ===================================================================
// CREATE EXAM SUBJECT ZOD SCHEMA
// ===================================================================
const createExamSubjectZodSchema = z4.object({
    class_id: z4.uuid("Invalid class ID format."),
    section: z4.enum(Section, "Invalid section."),
    version: z4.enum(Version, "Invalid version"),
    department: z4.enum(Department, "Invalid department").optional().default("GENERAL"),
    exam_subject_name: z4.enum(ExamSubjectName, "Invalid exam subject name")
})
export type TCreateExamSubjectZodSchema = z4.infer<typeof createExamSubjectZodSchema>;

// ===================================================================
// DELETE EXAM SUBJECT ZOD SCHEMA
// ===================================================================
const deleteExamSubjectParamsZodSchema = z4.object({
    exam_subject_id: z4.uuid("Invalid exam subject ID.")
});
export type TDeleteExamSubjectParamsZodSchema = z4.infer<
    typeof deleteExamSubjectParamsZodSchema
>;
export const examSubjectZodSchema = {
    createExamSubjectZodSchema,
    deleteExamSubjectParamsZodSchema
}