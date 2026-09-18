import z4 from "zod/v4";

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
