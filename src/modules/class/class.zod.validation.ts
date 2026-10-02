import z4 from "zod/v4";

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


export const classZodSchema = {
    createClassZodSchema
}