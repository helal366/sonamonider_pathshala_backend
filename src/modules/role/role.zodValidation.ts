import z4 from "zod/v4";

// CREATE ROLE ZOD SCHEMA
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

// UPDATE ROLE ZOD SCHEMA
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

export type TUpdateRoleZodSchema = z4.infer<typeof updateRoleZodSchema>;

// DELETE ROLE ZOD SCHEMA
export const deleteRoleZodSchema = z4.object({
  role_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Role name is required to execute deletion."
          : "Invalid role name format.",
    })
    .trim()
    .toUpperCase(),
});
export type TDeleteRoleZodSchema = z4.infer<typeof deleteRoleZodSchema>;

// GET SINGLE ROLE BY ID ZOD SCHEMA
export const getSingleRoleZodSchema = z4.object({
  params: z4.object({
    id: z4.uuid({ 
      message: "Invalid ID format. Must be a valid UUID." 
    }),
  }),
});
export type TGetSingleRoleInput = z4.infer<typeof getSingleRoleZodSchema>;
