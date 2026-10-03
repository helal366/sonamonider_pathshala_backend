import z4 from "zod/v4";

// ============================================================
// STUDENT READMISSION ZOD SCHEMA
// ============================================================
const studentReadmissionZodSchema = z4.object({
  student_id: z4.uuid({
    error: (issue) => {
      issue.input === undefined
        ? "Student ID is required."
        : "Invalid student ID format.";
    },
  }),
  
});
export type TStudentReadmissionZodSchema = z4.infer<typeof studentReadmissionZodSchema>;

export const studentZodSchema = {
  studentReadmissionZodSchema,
}