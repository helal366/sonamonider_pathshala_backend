import z4 from "zod/v4";

// =====================================================================
// CREATE BOOK LIST ZOD SCHEMA
// =====================================================================
const createBookListZodSchema = z4.object({
    book_name: z4.string({
        error: (issue)=>
            issue.input === undefined ? "Book name is required.":"Invalid book name format."
    }).trim().min(1, "Book name is required"),

    publisher: z4.string({
        error: (issue)=>
            issue.input === undefined ? "Publisher is required.": "Invalid publisher format."
    }).trim().min(1, "Publisher is required."),

    class_id: z4.uuid("Invalid class ID format.")
});
export type TCreateBookListZodSchema = z4.infer<typeof createBookListZodSchema>;


// =====================================================================
// DELETE BOOK LIST SERVICE LAYER
// =====================================================================
const deleteBookListParamsZodSchema = z4.object({
    id: z4.uuid("Invalid book list ID format.")
});
export type TDeleteBookListParamsZodSchema =z4.infer<typeof deleteBookListParamsZodSchema>;


export const bookListZodSchema = {
    createBookListZodSchema,
    deleteBookListParamsZodSchema
}