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
export type TStudentReadmissionZodSchema = z4.infer<
  typeof studentReadmissionZodSchema
>;

// =============================================
// ADD RESPONSIBLE TEACHER ZOD SCHEMA
// =============================================
const addResponsibleTeacherZodSchema = z4.object({
  student_id: z4.uuid("Invalid Student ID format."),
  teacher_full_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Full name is required."
          : "Invalid name format",
    })
    .trim()
    .min(1, "Full name is required."),
  teacher_mobile_number: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Mobile number is required."
          : "Invalid mobile number format.",
    })
    .trim()
    .length(
      11,
      "Mobile number must be 11 digit Bangladeshi number start with 01",
    )
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number."),
});
export type TAddResponsibleTeacherZodSchema = z4.infer<
  typeof addResponsibleTeacherZodSchema
>;
export const studentZodSchema = {
  studentReadmissionZodSchema,
  addResponsibleTeacherZodSchema,
};
