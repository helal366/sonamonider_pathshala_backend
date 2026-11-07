import z4 from "zod/v4";

// ======================================================
// CREATE STUDENT RESULT ZOD SCHEMA
// ======================================================
const createStudentResultZodSchema = z4.object({

});
export type TCreateStudentResultZodSchema =z4.infer<typeof createStudentResultZodSchema>

export const studentResultZodSchema = {
    createStudentResultZodSchema,
}