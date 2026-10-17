import z4 from "zod/v4";

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

export const bookListZodSchema = {
    createBookListZodSchema,
}