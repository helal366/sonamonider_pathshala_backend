import z4 from "zod/v4";

const classHistoryIdParamsZodSchema = z4.object({
  id: z4.uuid("Invalid class history ID."),
});

export type TClassHistoryIdParamsZodSchema = z4.infer<
  typeof classHistoryIdParamsZodSchema
>;

const studentIdParamsZodSchema = z4.object({
  student_id: z4.uuid("Invalid student ID."),
});

export type TClassHistoryStudentIdParamsZodSchema = z4.infer<
  typeof studentIdParamsZodSchema
>;

const classIdParamsZodSchema = z4.object({
  class_id: z4.uuid("Invalid class ID."),
});

export type TClassHistoryClassIdParamsZodSchema = z4.infer<
  typeof classIdParamsZodSchema
>;

const academicYearIdParamsZodSchema = z4.object({
  academic_year_id: z4.uuid("Invalid academic year ID."),
});

export type TClassHistoryAcademicYearIdParamsZodSchema = z4.infer<
  typeof academicYearIdParamsZodSchema
>;

export const classHistoryZodSchema = {
  classHistoryIdParamsZodSchema,
  studentIdParamsZodSchema,
  classIdParamsZodSchema,
  academicYearIdParamsZodSchema,
};
