import z4 from "zod/v4";

// =====================================================
// CREATE ROLE ZOD SCHEMA
// =====================================================
const createRoleZodSchema = z4.object({
  role_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Role name is required."
          : "Invalid role name format.",
    })
    .trim()
    .min(1, "Role name is required.")
    .toUpperCase(),
});

export type TCreateRoleZodSchema = z4.infer<typeof createRoleZodSchema>;

// =====================================================
// UPDATE ROLE ZOD SCHEMA
// =====================================================
const updateRoleZodSchema = z4.object({
  current_role_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Current role name is required."
          : "Invalid current role name format.",
    })
    .trim()
    .min(1, "Current role name is required.")
    .toUpperCase(),

  new_role_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "New role name is required."
          : "Invalid new role name format.",
    })
    .trim()
    .min(1, "New role name is required.")
    .toUpperCase(),
});

export type TUpdateRoleZodSchema = z4.infer<typeof updateRoleZodSchema>;

// =======================================================
// DELETE ROLE ZOD SCHEMA
// =======================================================
const deleteRoleParamsZodSchema = z4.object({
  id: z4
    .uuid({
      error: (issue) =>
        issue.input === undefined
          ? "Role name is required to execute deletion."
          : "Invalid role name format.",
    })
    .trim(),
});
export type TDeleteRoleParamsZodSchema = z4.infer<typeof deleteRoleParamsZodSchema>;

// =======================================================
// GET SINGLE ROLE BY ID ZOD SCHEMA
// =======================================================
const getSingleRoleParamsZodSchema = z4.object({
  id: z4.uuid({ 
    message: "Invalid ID format. Must be a valid UUID." 
  }),
});
export type TGetSingleRoleParamsZodSchema = z4.infer<typeof getSingleRoleParamsZodSchema>;

export const roleZodSchema = {
  createRoleZodSchema,
  updateRoleZodSchema,
  deleteRoleParamsZodSchema,
  getSingleRoleParamsZodSchema
}
