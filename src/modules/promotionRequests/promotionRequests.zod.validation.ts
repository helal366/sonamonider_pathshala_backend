import z4 from "zod/v4";

const ROLES = [
  "MANAGEMENT",
  "ADMIN",
  "ACADEMIC",
  "TEACHER_ADMIN",
  "STUDENT",
  "GOVERNING_BODY",
] as const;
// =========================================================
// CREATE PROMOTION REQUEST ZOD SCHEMA
// =========================================================
const createPromotionRequestZodSchema = z4.object({
  user_id: z4.uuid({
    error: (issue) =>
      issue.input === undefined
        ? "Staff ID is required."
        : "Invalid Staff ID format.",
  }),

  old_position: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Staff old position is required."
          : "Invalid Staff old position format.",
    })
    .trim()
    .min(1, "Staff old position is required."),

  new_position: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Staff new position is required."
          : "Invalid Staff new position format.",
    })
    .trim()
    .min(1, "Staff new position is required."),

  old_role: z4.enum(ROLES, {
    error: (issue) =>
      issue.input === undefined
        ? "Staff old role is required."
        : "Invalid Staff old role format.",
  }),

  new_role: z4.enum(ROLES, {
    error: (issue) =>
      issue.input === undefined
        ? "Staff new role is required."
        : "Invalid Staff new role format.",
  }),
});
export type TCreatePromotionRequestZodSchema = z4.infer<
  typeof createPromotionRequestZodSchema
>;

export const promotionRequestsZodSchema = {
  createPromotionRequestZodSchema,
};
