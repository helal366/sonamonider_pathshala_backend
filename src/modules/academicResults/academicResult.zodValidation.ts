import z4 from "zod/v4";
import { AcademicResult_Update_Fields, Staff_Role_Name } from "./academicResult.interface";

// ==========================================
// CREATE ACADEMIC RESULT ZOD SCHEMA
// ==========================================
const createAcademicResultZodSchema = z4.object({
  required_id: z4
    .uuid({
      error: (issue) => {
        issue.input === undefined
          ? "Record ID  is required"
          : "Invalid user ID format.";
      },
    })
    .trim()
    .min(1, "Record ID  is required"),

  role_name: z4
    .string({
      error: (issue) => {
        issue.input === undefined
          ? "Role name is required."
          : "Invalid role name format.";
      },
    })
    .trim()
    .min(1, "Role name is required."),

  position_name: z4.string({
    error: (issue) => {
      issue.input === undefined
        ? "Position name is required."
        : "Invalid position name format.";
    },
  }),

  ssc_result: z4.string().trim().optional(),
  dakhil_result: z4.string().trim().optional(),
  hsc_result: z4.string().trim().optional(),
  alim_result: z4.string().trim().optional(),
  hons_result: z4.string().trim().optional(),
  fazil_result: z4.string().trim().optional(),
  masters_result: z4.string().trim().optional(),
  kamil: z4.string().trim().optional(),
});
export type TCreateAcademicResultZodSchema = z4.infer<
  typeof createAcademicResultZodSchema
>;

// ==========================================
// DELETE ACADEMIC RESULT ZOD SCHEMA
// ==========================================
const deleteAcademicResultZodSchema = z4.object({
  academic_result_id: z4
    .uuid({
      error: (issue) => {
        issue.input === undefined
          ? "Academic result ID  is required"
          : "Invalid user ID format.";
      },
    })
    .trim()
    .min(1, "Academic result ID  is required"),
});
export type TDeleteAcademicResultZodSchema = z4.infer<
  typeof deleteAcademicResultZodSchema
>;

// ==========================================
// UPDATE ACADEMIC RESULT FIELD ZOD SCHEMA
// ==========================================
const updateAcademicResultFieldZodSchema = z4.object({
  academic_result_id: z4
    .uuid({
      error: (issue) => {
        issue.input === undefined
          ? "Academic result ID  is required"
          : "Invalid user ID format.";
      },
    })
    .trim()
    .min(1, "Academic result ID  is required"),

  field: z4.enum(AcademicResult_Update_Fields, "Invalid field name"),
  value: z4
    .string({
      error: (issue) => {
        issue.input === undefined
          ? "Field value is required"
          : "Invalid Field value name format.";
      },
    })
    .trim()
    .nullable(),
});
export type TUpdateAcademicResultField = z4.infer<
  typeof updateAcademicResultFieldZodSchema
>;

// ===============================================
// GET SINGLE ACADEMIC RESULT BY ID ZOD SCHEMA
// ===============================================
const getSingleAcademicResultZodSchema = z4.object({
  params: z4.object({
    academic_result_id: z4
      .uuid({
        error: (issue) => {
          issue.input === undefined
            ? "Academic result ID required"
            : "Invalid academic result ID format.";
        },
      })
      .trim(),
  }),
});
export type TGetSingleAcademicResultZodSchema = z4.infer<
  typeof getSingleAcademicResultZodSchema
>;

// ===============================================
// GET ACADEMIC RESULT BY STAFF ID ZOD SCHEMA
// ===============================================
const getAcademicResultByStaffIdZodSchema = z4.object({
  params: z4.object({
    staff_id: z4.uuid({
      error: (issue) => {
        issue.input === undefined
          ? "Staff ID or Governing Body ID is required."
          : "Invalid ID format";
      },
    }),

    staff_role_name: z4.enum(Staff_Role_Name, "Invalid Role Name Format")
  }),
});
export type TGetAcademicResultByStaffIdZodSchema = z4.infer<typeof getAcademicResultByStaffIdZodSchema>;

export const academicResultZodSchema = {
  createAcademicResultZodSchema,
  deleteAcademicResultZodSchema,
  updateAcademicResultFieldZodSchema,
  getSingleAcademicResultZodSchema,
  getAcademicResultByStaffIdZodSchema
};
