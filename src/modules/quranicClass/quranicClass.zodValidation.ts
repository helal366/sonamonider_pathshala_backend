import z4 from "zod/v4";

// CREATE QURANIC CLASS ZOD SCHEMA
const createQuranicClassZodSchema = z4.object({
  quranic_class_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Quranic class name is required."
          : "Invalid Quranic class name format.",
    })
    .trim()
    .min(1, "Quranic class name cannot be empty."),
});

export type TCreateQuranicClassZodSchema = z4.infer<typeof createQuranicClassZodSchema>;

// UPDATE QURANIC CLASS ZOD SCHEMA
const updateQuranicClassZodSchema = z4.object({
  quranic_class_id: z4.uuid({
    message: "Invalid Quranic class ID format. Must be a valid UUID.",
  }),
  quranic_class_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "New Quranic class name is required."
          : "Invalid Quranic class name format.",
    })
    .trim()
    .min(1, "New Quranic class name cannot be empty."),
});

export type TUpdateQuranicClassZodSchema = z4.infer<typeof updateQuranicClassZodSchema>;

// DELETE QURANIC CLASS ZOD SCHEMA
const deleteQuranicClassZodSchema = z4.object({
  quranic_class_id: z4.uuid({
    message: "Invalid Quranic class ID format. Must be a valid UUID.",
  }),
});

export type TDeleteQuranicClassZodSchema = z4.infer<typeof deleteQuranicClassZodSchema>;

// GET SINGLE QURANIC CLASS BY ID ZOD SCHEMA
const getSingleQuranicClassZodSchema = z4.object({
  quranic_class_id: z4.uuid({ 
    message: "Invalid ID format. Must be a valid UUID." 
  }),
});

export type TGetSingleQuranicClassZodSchema = z4.infer<typeof getSingleQuranicClassZodSchema>;

export const quranicClassZodSchema = {
    createQuranicClassZodSchema,
    updateQuranicClassZodSchema,
    deleteQuranicClassZodSchema,
    getSingleQuranicClassZodSchema
}