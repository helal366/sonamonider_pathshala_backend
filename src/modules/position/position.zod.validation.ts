import z4 from "zod/v4";


// CREATE POSITION ZOD SCHEMA
export const createPositionZodSchema = z4.object({
  position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Position name is required."
          : "Invalid position name format.",
    })
    .trim()
    .toUpperCase(),
    
  role_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Role name is required."
          : "Invalid role name format.",
    })
    .trim()
    .toUpperCase(),
});

export type TCreatePositionZodSchema = z4.infer<typeof createPositionZodSchema>;


// UPDATE POSITION ZOD SCHEMA
export const updatePositionZodSchema = z4.object({
  present_position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Present position name is required."
          : "Invalid position name format.",
    })
    .trim()
    .toUpperCase(),

    update_position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Update position name is required."
          : "Invalid position name format.",
    })
    .trim()
    .toUpperCase(),
})

export type TUpdatePositionZodSchema = z4.infer<typeof updatePositionZodSchema>;


// DELETE POSITION ZOD SCHEMA
export const deletePositionZodSchema = z4.object({
  position_name: z4.string({
    error: (issue)=>{
      issue.input === undefined 
      ? "Position name is required"
      : "Invalid position name format"
    }
  })
});

export type TDeletePositionZodSchema =z4.infer<typeof deletePositionZodSchema>;


// GET SINGLE POSITION BY ID ZOD SCHEMA
export const getSinglePositionZodSchema = z4.object({
  params: z4.object({
    id: z4.uuid({ 
      message: "Invalid ID format. Must be a valid UUID." 
    }),
  }),
});
export type TGetSinglePositionInput = z4.infer<typeof getSinglePositionZodSchema>;