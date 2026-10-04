import z4 from "zod/v4";

// =============================================
// CREATE SHIFT ZOD SCHEMA
// =============================================
const createShiftZodSchema = z4.object({
    shift_name: z4.string({
        error: (issue)=>{
            issue.input === undefined
            ? "Shift name is required." 
            : "Invalid Shift name format."
        }
    })
});
export type TCreateShiftZodSchema = z4.infer<typeof createShiftZodSchema>;

// =============================================
// DELETE SHIFT ZOD SCHEMA
// =============================================
const deleteShiftZodSchema = z4.object({
    id: z4.uuid({
         error: (issue)=>{
            issue.input === undefined
            ? "Shift ID is required." 
            : "Invalid Shift ID format."
        }
    })
});
export type TDeleteShiftZodSchema = z4.infer<typeof deleteShiftZodSchema>;

// =============================================
// UPDATE SHIFT ZOD SCHEMA
// =============================================
const updateShiftFieldZodSchema = z4.object({

})
export const shiftZodSchema = {
    createShiftZodSchema,
    deleteShiftZodSchema
}