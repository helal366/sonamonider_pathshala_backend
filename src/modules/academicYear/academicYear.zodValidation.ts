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
const academicYearIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid academic year ID."),
});
export type TAcademicYearIdParamsZodSchema = z4.infer<
  typeof academicYearIdParamsZodSchema
>;

// ==========================================
// UPDATE ACADEMIC YEAR FIELD ZOD SCHEMA
// ==========================================
const updateAcademicYearFieldZodSchema = z4.object({
  field: z4.enum(AcademicYearField, "Invalid Academic year format."),
  value: z4.string().trim().min(1, "Academic year value is required.")
});
export type TUpdateAcademicYearFieldZodSchema = z4.infer<
  typeof updateAcademicYearFieldZodSchema
>;

// ==========================================
// GET SINGLE ACADEMIC YEAR ZOD SCHEMA
// ==========================================
const getSingleAcademicYearZodSchema = z4.object({
  id: z4.uuid("Invalid ID format."),
});
export type TGetSingleAcademicYearZodSchema = z4.infer<typeof getSingleAcademicYearZodSchema>;

export const academicYearZodSchema = {
  createAcademicYearZodSchema,
  academicYearIdParamsZodSchema,
  updateAcademicYearFieldZodSchema,
  getSingleAcademicYearZodSchema
};
