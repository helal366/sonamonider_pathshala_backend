import z4 from "zod/v4";

export const createRoleZodSchema = z4.object({
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

export type TCreateRoleZodSchema = z4.infer<typeof createRoleZodSchema>;

export const updateRoleZodSchema = z4.object({
  current_role_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Current role name is required."
          : "Invalid current role name format.",
    })
    .trim()
    .toUpperCase(),

  new_role_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "New role name is required."
          : "Invalid new role name format.",
    })
    .trim()
    .toUpperCase(),
});

export type TUpdateRoleZodSchema = z4.infer<
  typeof updateRoleZodSchema
>;
