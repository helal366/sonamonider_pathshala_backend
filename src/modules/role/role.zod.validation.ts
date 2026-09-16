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
