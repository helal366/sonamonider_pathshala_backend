import z4 from "zod/v4";

// =========================================================
// CREATE PROMOTION REQUEST ZOD SCHEMA
// =========================================================
const createPromotionRequestZodSchema = z4.object({
    required_id: z4.uuid({
        error: (issue) =>
          issue.input === undefined
            ? "Staff ID is required."
            : "Invalid Staff ID format.",
      }),
      old_position: z4.string({
        error: (issue) =>
          issue.input === undefined
            ? "Staff old position is required."
            : "Invalid Staff old position format.",
      }).trim().min(1, "Staff old position is required."),

      new_position: z4.string({
        error: (issue) =>
          issue.input === undefined
            ? "Staff new position is required."
            : "Invalid Staff new position format.",
      }).trim().min(1, "Staff new position is required."),

      old_role: z4.string({
        error: (issue) =>
          issue.input === undefined
            ? "Staff old position is required."
            : "Invalid Staff old position format.",
      }).trim().min(1, "Staff old position is required."),

      new_role: z4.string({
        error: (issue) =>
          issue.input === undefined
            ? "Staff new position is required."
            : "Invalid Staff new position format.",
      }).trim().min(1, "Staff new position is required."),

});
export type TCreatePromotionRequestZodSchema = z4.infer<typeof createPromotionRequestZodSchema>;

export const promotionRequestsZodSchema = {
    createPromotionRequestZodSchema
}