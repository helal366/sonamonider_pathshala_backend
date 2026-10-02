import z4 from "zod/v4";

// =============================================
// CREATE CLASS NAME ZOD SCHEMA
// =============================================
const createClassZodSchema = z4.object({
    class_name: z4.string({
        error: (issue)=>{
            issue.input === undefined
            ? "Class name is required."
            : "Invalid class name format.";
        }
    }).trim().min(1, "Class name is required.")
});
export type TCreateClassZodSchema = z4.infer<typeof createClassZodSchema>;

// =============================================
// DELETE CLASS NAME ZOD SCHEMA
// =============================================
const deleteClassZodSchema = z4.object({
    params: z4.object({
        class_id: z4.uuid({
            error: (issue)=>{
                issue.input === undefined
                ? "Class ID is required."
                : "Invalid class ID format.";
            }
        })
    })
});
export type TDeleteClassZodSchema =z4.infer<typeof deleteClassZodSchema>
export const classZodSchema = {
    createClassZodSchema,
    deleteClassZodSchema
}