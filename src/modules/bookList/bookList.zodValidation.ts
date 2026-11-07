import { Section, Version } from "#db-client";
import z4 from "zod/v4";

// =====================================================================
// BOOK LIST ID PARAMS ZOD SCHEMA
// =====================================================================
const bookListIdParamsZodSchema = z4.object({
  book_list_id: z4.uuid("Invalid book list ID format."),
});
export type TBookListIdParamsZodSchema = z4.infer<
  typeof bookListIdParamsZodSchema
>;
// =====================================================================
// CREATE BOOK LIST ZOD SCHEMA
// =====================================================================
const createBookListZodSchema = z4.object({
  book_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Book name is required."
          : "Invalid book name format.",
    })
    .trim()
    .min(1, "Book name is required"),

  publisher: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Publisher is required."
          : "Invalid publisher format.",
    })
    .trim()
    .min(1, "Publisher is required."),
  isBookMain: z4.boolean({
    error: (issue) =>
      issue.input === undefined
        ? "Main book status is required."
        : "Main book status must be a boolean.",
  }),
  section: z4.enum(Section),
  class_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Class name is required."
          : "Invalid class name format.",
    })
    .trim()
    .min(1, "Class name is required."),
  version: z4.enum(Version, {
    error: (issue) =>
      issue.input === undefined
        ? "Version is required."
        : "Invalid version format.",
  }),
});
export type TCreateBookListZodSchema = z4.infer<typeof createBookListZodSchema>;


// =====================================================================
// UPDATE BOOK LIST SINGLE FIELD ZOD SCHEMA
// =====================================================================
const updateBookListSingleFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    field: z4.literal("book_name"),
    value: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Book name is required."
            : "Invalid book name format.",
      })
      .trim()
      .min(1, "Book name is required."),
  }),
  z4.object({
    field: z4.literal("publisher"),
    value: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Publisher is required."
            : "Invalid publisher format.",
      })
      .trim()
      .min(1, "Publisher is required."),
  }),
  z4.object({
    field: z4.literal("isBookMain"),
    value: z4.boolean({
      error: "Main book status must be a boolean.",
    }),
  }),
  z4.object({
    field: z4.literal("class_name"),
    value: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Class name is required."
            : "Invalid class name format.",
      })
      .trim()
      .min(1, "Class name is required."),
  }),
  z4.object({
    field: z4.literal("section"),
    value: z4.enum(Section, {
      error: (issue) =>
        issue.input === undefined
          ? "Section is required."
          : "Invalid section format.",
    }),
  }),
  z4.object({
    field: z4.literal("version"),
    value: z4.enum(Version, {
      error: (issue) =>
        issue.input === undefined
          ? "Version is required."
          : "Invalid version format.",
    }),
  }),
]);
export type TUpdateBookListSingleFieldZodSchema = z4.infer<
  typeof updateBookListSingleFieldZodSchema
>;

// =====================================================================
// GET BOOK LIST BY CLASS ID ZOD SCHEMA
// =====================================================================
const getBookListsByClassIdParamsZodSchema = z4.object({
  class_id: z4.uuid("Invalid Class ID format."),
});
export type TGetBookListsByClassIdParamsZodSchema = z4.infer<
  typeof getBookListsByClassIdParamsZodSchema
>;


// =====================================================================
// GET BOOK LIST BY PUBLISHER ROUTE
// =====================================================================
const getBookListByPublisherParamsZodSchema = z4.object({
  publisher: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Publisher is required"
          : "Invalid publisher format.",
    })
    .trim()
    .min(1, "Publisher is required"),
});
export type TGetBookListByPublisherParamsZodSchema = z4.infer<
  typeof getBookListByPublisherParamsZodSchema
>;

export const bookListZodSchema = {
  bookListIdParamsZodSchema,
  createBookListZodSchema,
  updateBookListSingleFieldZodSchema,
  getBookListsByClassIdParamsZodSchema,
  getBookListByPublisherParamsZodSchema,
};
