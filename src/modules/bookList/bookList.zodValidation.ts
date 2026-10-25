import { Section, Version } from "#db-client";
import z4 from "zod/v4";

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
  section: z4.enum(Section),
  class_name: z4.string({
    error: (issue)=>
      issue.input === undefined
    ? "Class name is required."
    :"Invalid class name format."
  }).trim().min(1, "Class name is required."),
  version: z4.enum(Version, {
    error: (issue) =>
      issue.input === undefined
        ? "Version is required."
        : "Invalid version format.",
  }),
});
export type TCreateBookListZodSchema = z4.infer<typeof createBookListZodSchema>;

// =====================================================================
// DELETE BOOK LIST ZOD SCHEMA
// =====================================================================
const deleteBookListParamsZodSchema = z4.object({
  id: z4.uuid("Invalid book list ID format."),
});
export type TDeleteBookListParamsZodSchema = z4.infer<
  typeof deleteBookListParamsZodSchema
>;

// =====================================================================
// UPDATE BOOK LIST SINGLE FIELD ZOD SCHEMA
// =====================================================================
const updateBookListSingleFieldParamsZodSchema = z4.object({
  id: z4.uuid("Book list ID is required."),
});
export type TUpdateBookListSingleFieldParamsZodSchema = z4.infer<
  typeof updateBookListSingleFieldParamsZodSchema
>;

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
// GET SINGLE BOOK LIST ZOD SCHEMA
// =====================================================================
const getSingleBookListParamsZodSchema = z4.object({
  id: z4.uuid("Book list ID is required."),
});
export type TGetSingleBookListParamsZodSchema = z4.infer<
  typeof getSingleBookListParamsZodSchema
>;

// =====================================================================
// GET BOOK LIST BY PUBLISHER ROUTE
// =====================================================================
const getBookListByPublisherZodSchema = z4.object({
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
export type TGetBookListByPublisherZodSchema =z4.infer<typeof getBookListByPublisherZodSchema>;


export const bookListZodSchema = {
  createBookListZodSchema,
  deleteBookListParamsZodSchema,
  updateBookListSingleFieldZodSchema,
  updateBookListSingleFieldParamsZodSchema,
  getBookListsByClassIdParamsZodSchema,
  getSingleBookListParamsZodSchema,
  getBookListByPublisherZodSchema
};
