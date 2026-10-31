import { Section, Shift, Version } from "#db-client";
import z4 from "zod/v4";

// ============================================================
// STUDENT READMISSION ZOD SCHEMA
// ============================================================
// =========================================================
// STUDENT READMISSION VALIDATION SCHEMA
// =========================================================
export const studentReadmissionZodSchema = z4.object({
  student_id: z4.uuid({
    error: (issue) =>
      issue.input === undefined
        ? "Student ID is required."
        : "Invalid Student ID format.",
  }),
  target_class_id: z4.uuid({
    error: (issue) =>
      issue.input === undefined
        ? "Target Class ID is required."
        : "Invalid Class ID format.",
  }),
  target_shift_name: z4.enum(Shift, {
    error: (issue) =>
      issue.input === undefined
        ? "Shift name is required."
        : "Invalid Shift format.",
  }),
  target_year_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Target Academic Year name is required."
          : "Invalid Academic Year format.",
    })
    .trim()
    .regex(/^\d{4}$/, "Academic year must be a four-digit year."),
  roll_number: z4.coerce
    .number({ error: (issue) => "Roll number must be an integer." })
    .int()
    .min(1, "Roll number must be greater than 0"),
  section: z4.enum(Section, "Invalid section format."),
  version: z4.enum(Version, "Invalid version format."),
  quranic_class_name: z4.string().trim().min(1, "Quranic class name is required."),
  quranic_class_period_ids: z4
    .array(
      z4.uuid({ error: "Each period ID must be a valid UUID string format." }),
    )
    .min(1, "At least one Quranic class period is required.")
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Quranic class period IDs must be unique.",
    }),
}).superRefine((data, ctx) => {
  if (data.target_shift_name === Shift.MORNING && data.section !== Section.MADRASHA) {
    ctx.addIssue({
      code: "custom",
      path: ["section"],
      message: "Morning shift only allows MADRASHA section.",
    });
  }
  if (data.target_shift_name === Shift.DAY && data.section !== Section.SCHOOL) {
    ctx.addIssue({
      code: "custom",
      path: ["section"],
      message: "Day shift only allows SCHOOL section.",
    });
  }
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

// =============================================
// DISCONNECT RESPONSIBLE TEACHER ZOD SCHEMA
// =============================================
const disconnectResponsibleTeacherZodSchema = z4.object({
  student_id: z4.uuid("Invalid Student ID format."),
});
export type TDisconnectResponsibleTeacherZodSchema = z4.infer<
  typeof disconnectResponsibleTeacherZodSchema
>;

export const studentZodSchema = {
  studentReadmissionZodSchema,
  addResponsibleTeacherZodSchema,
  disconnectResponsibleTeacherZodSchema,
};
