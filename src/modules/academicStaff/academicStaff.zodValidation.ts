import z4 from "zod/v4";

const academicStaffParamsZodSchema = z4.object({
  id: z4.uuid("Invalid academic staff ID format."),
});
// ================================================
// UPDATE SUBJECT FOR SUBJECT TEAHER ZOD SCHEMA
// ================================================
const updateSubjectForSubjectTeacherZodSchema = z4.union([
  z4.object({
    current_subject: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Current Subject is required."
            : "Invalid Current Subject format.",
      })
      .trim()
      .nullable(),
    new_subject: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "New Subject is required."
            : "Invalid New Subject format.",
      })
      .trim()
      .nullable(),
  }),
]);
export type TUpdateSubjectForSubjectTeacherZodSchema = z4.infer<
  typeof updateSubjectForSubjectTeacherZodSchema
>;

// ================================================
// UPDATE ACADEMIC STAFF FIELD ZOD SCHEMA
// ================================================
const updateAcademicStaffFieldZodSchema = z4.union([
  z4.object({
    field: z4.literal("teaching_experience_year"),
    value: z4.number().int().min(0),
  }),
  z4.object({
    field: z4.literal("teaching_experience_month"),
    value: z4.number().int().min(0).max(11)
  }),
  z4.object({
    field: z4.literal("alternative_contact_no"),
    value: z4
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
  }),
  z4.object({
    field: z4.literal("extra_curricular_activities"),
    value: z4.string("Invalid format.").trim()
  })
]);
export type TUpdateAcademicStaffFieldZodSchema = z4.infer<typeof updateAcademicStaffFieldZodSchema>

// =============================================
// ASSIGN GRADE GROUP TEACHER ZOD SCHEMA
// =============================================
const assignGradeGroupTeacherZodSchema = z4.object({
    class_id: z4.uuid({
        error: (issue)=>
            issue.input === undefined
        ?"Class ID is required."
        :"Invalid Class ID format."
    }),
    
    academicStaff_id: z4.uuid({
        error: (issue)=>
            issue.input === undefined
        ?"Academic staff ID is required."
        :"Invalid Academic staff ID format."
    }),

})
export type TAssignGradeGroupTeacherZodSchema = z4.infer<typeof assignGradeGroupTeacherZodSchema>

// =============================================
// DISCONNECT GRADE GROUP TEACHER ZOD SCHEMA
// =============================================
const disconnectGradeGroupTeacherZodSchema =z4.object({
    class_id: z4.uuid({
        error: (issue)=>
            issue.input === undefined
        ?"Class ID is required."
        :"Invalid Class ID format."
    }),
    academicStaff_id: z4.uuid({
        error: (issue)=>
            issue.input === undefined
        ?"Teacher ID is required."
        :"Invalid Teacher ID format."
    }),

});
export type TDisconnectGradeGroupTeacherZodSchema =z4.infer<typeof disconnectGradeGroupTeacherZodSchema>

export const academicStaffZodSchema = {
  academicStaffParamsZodSchema,
  updateSubjectForSubjectTeacherZodSchema,
  updateAcademicStaffFieldZodSchema,
  assignGradeGroupTeacherZodSchema,
  disconnectGradeGroupTeacherZodSchema
};
