import z4 from "zod/v4";

// ============================================
// CREATE POSITION ZOD SCHEMA
// ============================================
const createPositionZodSchema = z4.object({
  position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Position name is required."
          : "Invalid position name format.",
    })
    .trim()
    .min(1, "Position name is required.")
    .toUpperCase(),

});
export type TCreatePositionZodSchema = z4.infer<typeof createPositionZodSchema>;


// ======================================================
// UPDATE POSITION ZOD SCHEMA
// ======================================================
const updatePositionZodSchema = z4.object({
  present_position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Present position name is required."
          : "Invalid position name format.",
    })
    .trim()
    .min(1, "Present position name is required.")
    .toUpperCase(),

    update_position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Update position name is required."
          : "Invalid position name format.",
    })
    .trim()
    .min(1, "Update position name is required.")
    .toUpperCase(),
})
export type TUpdatePositionZodSchema = z4.infer<typeof updatePositionZodSchema>;

// ======================================================
// DELETE POSITION ZOD SCHEMA
// ======================================================
const deletePositionZodSchema = z4.object({
  position_name: z4.string({
    error: (issue)=>
      issue.input === undefined 
      ? "Position name is required"
      : "Invalid position name format"
  }).trim()
    .min(1, "Position name is required.")
    .toUpperCase(),
});
export type TDeletePositionZodSchema =z4.infer<typeof deletePositionZodSchema>;

// ========================================================
// GET SINGLE POSITION BY ID ZOD SCHEMA
// ========================================================
const getSinglePositionParamsZodSchema = z4.object({
  id: z4.uuid({ 
    message: "Invalid ID format. Must be a valid UUID." 
  }),
});
export type TGetSinglePositionParamsZodSchema = z4.infer<typeof getSinglePositionParamsZodSchema>;

export const positionZodSchema = {
  createPositionZodSchema,
  updatePositionZodSchema,
  deletePositionZodSchema,
  getSinglePositionParamsZodSchema
}