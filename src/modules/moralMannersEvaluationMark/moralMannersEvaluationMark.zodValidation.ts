import { ExamType, ResultGrade } from "#db-client";
import z4 from "zod/v4";

const grade = (field: string) =>
  z4.enum(ResultGrade, {
    error: (issue) =>
      issue.input === undefined
        ? `${field} is required.`
        : `Invalid ${field} format.`,
  });

const examType = z4.enum(ExamType, {
  error: (issue) =>
    issue.input === undefined
      ? "Exam type is required."
      : "Invalid exam type format.",
});

const studentResultId = z4.uuid({
  error: (issue) =>
    issue.input === undefined
      ? "Student result ID is required."
      : "Invalid student result ID format.",
});

const moralMannersEvaluationMarkFields = {
  cleanliness: grade("Cleanliness grade"),
  class_performance: grade("Class performance grade"),
  speaking_the_truth: grade("Speaking the truth grade"),
  speaking_the_correct: grade("Speaking correctly grade"),
  salat_religious_work: grade("Salat and religious work grade"),
  exam_type: examType,
  student_result_id: studentResultId,
};

const createMoralMannersEvaluationMarkZodSchema = z4.object(
  moralMannersEvaluationMarkFields,
);
const updateMoralMannersEvaluationMarkZodSchema = z4.object(
  moralMannersEvaluationMarkFields,
);
const moralMannersEvaluationMarkIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid moral manners evaluation mark ID format."),
});

const updateMoralMannersEvaluationMarkFieldZodSchema = z4.discriminatedUnion(
  "field",
  [
    z4.object({ field: z4.literal("cleanliness"), value: grade("Cleanliness grade") }),
    z4.object({ field: z4.literal("class_performance"), value: grade("Class performance grade") }),
    z4.object({ field: z4.literal("speaking_the_truth"), value: grade("Speaking the truth grade") }),
    z4.object({ field: z4.literal("speaking_the_correct"), value: grade("Speaking correctly grade") }),
    z4.object({ field: z4.literal("salat_religious_work"), value: grade("Salat and religious work grade") }),
    z4.object({ field: z4.literal("exam_type"), value: examType }),
    z4.object({
      field: z4.literal("student_result_id"),
      value: studentResultId,
    }),
  ],
);

export type TCreateMoralMannersEvaluationMark = z4.infer<
  typeof createMoralMannersEvaluationMarkZodSchema
>;
export type TUpdateMoralMannersEvaluationMark = z4.infer<
  typeof updateMoralMannersEvaluationMarkZodSchema
>;
export type TUpdateMoralMannersEvaluationMarkField = z4.infer<
  typeof updateMoralMannersEvaluationMarkFieldZodSchema
>;

export const moralMannersEvaluationMarkZodSchema = {
  createMoralMannersEvaluationMarkZodSchema,
  updateMoralMannersEvaluationMarkZodSchema,
  updateMoralMannersEvaluationMarkFieldZodSchema,
  moralMannersEvaluationMarkIdParamsZodSchema,
};
