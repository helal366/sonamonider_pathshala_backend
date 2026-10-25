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

const coCurricularActivitiesMarkFields = {
  al_quran_grade: grade("Al Quran grade"),
  conversation: grade("Conversation grade"),
  akhlake_hasanah: grade("Akhlake hasanah grade"),
  cultural_activities: grade("Cultural activities grade"),
  sports_scouts: grade("Sports and scouts grade"),
  exam_type: examType,
  student_result_id: studentResultId,
};

const createCoCurricularActivitiesMarkZodSchema = z4.object(
  coCurricularActivitiesMarkFields,
);
const updateCoCurricularActivitiesMarkZodSchema = z4.object(
  coCurricularActivitiesMarkFields,
);
const coCurricularActivitiesMarkIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid co-curricular activities mark ID format."),
});

const updateCoCurricularActivitiesMarkFieldZodSchema = z4.discriminatedUnion(
  "field",
  [
    z4.object({ field: z4.literal("al_quran_grade"), value: grade("Al Quran grade") }),
    z4.object({ field: z4.literal("conversation"), value: grade("Conversation grade") }),
    z4.object({ field: z4.literal("akhlake_hasanah"), value: grade("Akhlake hasanah grade") }),
    z4.object({ field: z4.literal("cultural_activities"), value: grade("Cultural activities grade") }),
    z4.object({ field: z4.literal("sports_scouts"), value: grade("Sports and scouts grade") }),
    z4.object({ field: z4.literal("exam_type"), value: examType }),
    z4.object({
      field: z4.literal("student_result_id"),
      value: studentResultId,
    }),
  ],
);

export type TCreateCoCurricularActivitiesMark = z4.infer<
  typeof createCoCurricularActivitiesMarkZodSchema
>;
export type TUpdateCoCurricularActivitiesMark = z4.infer<
  typeof updateCoCurricularActivitiesMarkZodSchema
>;
export type TUpdateCoCurricularActivitiesMarkField = z4.infer<
  typeof updateCoCurricularActivitiesMarkFieldZodSchema
>;

export const coCurricularActivitiesMarkZodSchema = {
  createCoCurricularActivitiesMarkZodSchema,
  updateCoCurricularActivitiesMarkZodSchema,
  updateCoCurricularActivitiesMarkFieldZodSchema,
  coCurricularActivitiesMarkIdParamsZodSchema,
};
