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

// =========================================================
// DELETE PROMOTION REQUEST ZOD SCHEMA
// =========================================================
const deletePromotionRequestZodSchema = z4.object({
  promotion_request_id: z4.uuid({
    error: (issue) =>
      issue.input === undefined
        ? "Promotion request ID is required."
        : "Invalid Promotion request ID format.",
  }),
});
export type TDeletePromotionRequestZodSchema = z4.infer<
  typeof deletePromotionRequestZodSchema
>;

// =========================================================
// ACTION PROMOTION REQUEST ZOD SCHEMA
// =========================================================
export const actionPromotionRequestZodSchema = z4
  .object({
    promotion_request_id: z4.uuid({
      error: (issue) =>
        issue.input === undefined
          ? "Promotion request ID is required."
          : "Invalid promotion request ID format.",
    }),
    action_status: z4.enum(["APPROVED", "REJECTED"], {
      error: (issue) => "Action status must be either APPROVED or REJECTED.",
    }),
    rejection_reason: z4.string().trim().optional(),
    effective_date: z4
      .string()
      .check(z4.iso.datetime("Invalid date format. Expected an ISO string.")),
  })
  .transform((data) => {
    if (
      data.action_status === "REJECTED" &&
      (!data.rejection_reason || data.rejection_reason.trim() === "")
    ) {
      return {
        ...data,
        rejection_reason: "Super Admin decission.",
      };
    }
    return data;
  });
export type TActionPromotionRequestZodSchema = z4.infer<
  typeof actionPromotionRequestZodSchema
>;

// =========================================================
// GET PROMOTION REQUESTS FILTER ZOD SCHEMA
// =========================================================
const getPromotionRequestsZodSchema = z4.object({
  page: z4.coerce.number().int().min(1).default(1),
  limit: z4.coerce.number().int().min(1).max(100).default(10),
  status: z4.enum(["PENDING", "APPROVED", "REJECTED"]).optional(),
  full_name: z4.string("Invalid full name format.").trim().optional(), // Explicit name input
  mobile_number: z4.string("Invalid mobile number format.").trim().optional(), // Explicit mobile number input
});

export type TGetPromotionRequestsZodSchema = z4.infer<
  typeof getPromotionRequestsZodSchema
>;

// =========================================================
// GET SINGLE PROMOTION REQUEST ZOD SCHEMA
// =========================================================
const getSinglePromotionRequestZodSchema = z4.object({
  promotion_request_id: z4.uuid({
    error: (issue) =>
      issue.input === undefined
        ? "Promotion request ID parameter is required."
        : "Invalid promotion request ID parameter format.",
  }),
});

export type TGetSinglePromotionRequestZodSchema = z4.infer<typeof getSinglePromotionRequestZodSchema>;

export const promotionRequestsZodSchema = {
  createPromotionRequestZodSchema,
  deletePromotionRequestZodSchema,
  actionPromotionRequestZodSchema,
  getPromotionRequestsZodSchema,
  getSinglePromotionRequestZodSchema
};
