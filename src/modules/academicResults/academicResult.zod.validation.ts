import z4 from "zod/v4";

// ==========================================
// CREATE ACADEMIC RESULT ZOD SCHEMA 
// ==========================================
const createAcademicResultZodSchema = z4.object({
    required_id: z4.string({error: (issue)=>{
        issue.input === undefined ? "User ID  is required" : "Invalid user ID format."
    }}).trim().min(1, "User ID  is required"),

    role_name: z4.string({error: (issue)=>{
        issue.input === undefined ? "Role name is required.":"Invalid role name format."
    }}).trim().min(1, "Role name is required."),

    position_name: z4.string({error: (issue)=>{
        issue.input === undefined ? "Position name is required." : "Invalid position name format."
    }}),

    ssc_result     : z4.string().trim().optional(),
    dakhil_result  : z4.string().trim().optional(),
    hsc_result     : z4.string().trim().optional(),
    alim_result    : z4.string().trim().optional(),
    hons_result    : z4.string().trim().optional(),
    fazil_result   : z4.string().trim().optional(),
    masters_result : z4.string().trim().optional(),
    kamil          : z4.string().trim().optional(),

});
export type TCreateAcademicResultZodSchema = z4.infer<typeof createAcademicResultZodSchema>

export const academicResultZodSchema = {
    createAcademicResultZodSchema
}