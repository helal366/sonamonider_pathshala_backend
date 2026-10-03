import z4 from "zod/v4";
const AcademicYearField = ["academic_year_name"] as const

// ==========================================
// CREATE ACADEMIC YEAR ZOD SCHEMA
// ==========================================
const createAcademicYearZodSchema = z4.object({
  academic_year_name: z4
    .string({
      error: (issue) => {
        issue.input === undefined
          ? "Academic year is required."
          : "Invalid Academic year format.";
      },
    })
    .trim()
    .min(1, "Academic year is required."),
});
export type TCreateAcademicYearZodSchema = z4.infer<
  typeof createAcademicYearZodSchema
>;

// ==========================================
// DELETE ACADEMIC YEAR ZOD SCHEMA
// ==========================================
const deleteAcademicYearZodSchema = z4.object({
  academic_year_id: z4.uuid({
    error: (issue) => {
      issue.input === undefined
        ? "Academic year ID is required."
        : "Invalid Academic year ID format.";
    },
  }),
});
export type TdeleteAcademicYearZodSchema = z4.infer<
  typeof deleteAcademicYearZodSchema
>;

// ==========================================
// UPDATE ACADEMIC YEAR FIELD ZOD SCHEMA
// ==========================================
const updateAcademicYearFieldZodSchema = z4.object({
  academic_year_id: z4.uuid({
    error: (issue) => {
      issue.input === undefined
        ? "Academic year ID is required."
        : "Invalid Academic year ID format.";
    },
  }),
  field: z4.enum(AcademicYearField, "Invalid Academic year format."),
  value: z4.string().trim().min(1, "Academic year value is required.")
});
export type TUpdateAcademicYearFieldZodSchema = z4.infer<
  typeof updateAcademicYearFieldZodSchema
>;

export const academicYearZodSchema = {
  createAcademicYearZodSchema,
  deleteAcademicYearZodSchema,
  updateAcademicYearFieldZodSchema,
};
