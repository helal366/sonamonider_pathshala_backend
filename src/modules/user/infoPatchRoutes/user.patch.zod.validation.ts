import z4 from "zod/v4";

export const changeUserRoleZodSchema = z4.object({
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

export type TChangeUserRoleZodSchema = z4.infer<typeof changeUserRoleZodSchema>;

export const changeUserPositionZodSchema = z4.object({
  position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Position name is required."
          : "Invalid position name format.",
    })
    .trim()
    .toUpperCase(),
});

export type TChangeUserPositionZodSchema = z4.infer<
  typeof changeUserPositionZodSchema
>;
