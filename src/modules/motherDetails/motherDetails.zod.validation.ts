import { EducationDegree } from "#db-client";
import z4 from "zod/v4";

// ============================================================
// CREATE MOTHER DETAILS
// ============================================================
const createMotherDetailsZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  mother_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Mother name is required."
          : "Invalid mother name.",
    })
    .trim()
    .min(2, "Mother name is required"),

  nid_no: z4.string("Invalid national ID number format.").trim().optional(),

  occupation: z4.string("Invalid occupation format.").trim().optional(),

  job_title: z4.string("Invalid job title format.").trim().optional(),

  educational_qualification: z4
    .enum(EducationDegree, "Invalid educational qualification format.")
    .optional(),

  monthly_income: z4
    .string("Invalid monthly income text format.")
    .trim()
    .optional(),

  mobile_no_1: z4.string("Invalid mobile number format.").trim().optional(),

  mobile_no_2: z4.string("Invalid mobile number format.").trim().optional(),

  mobile_no_3: z4.string("Invalid mobile number format.").trim().optional(),
});

export type TCreateMotherDetailsZodSchema = z4.infer<
  typeof createMotherDetailsZodSchema
>;

// ============================================================
// CONNECT MOTHER DETAILS
// ============================================================
const connectMotherDetailsZodSchema = z4.object({
  user_id: z4.string().trim(),

  mother_details_id: z4.string().trim(),
});

export type TConnectMotherDetailsZodSchema = z4.infer<
  typeof connectMotherDetailsZodSchema
>;

// ============================================================
// UPDATE A SINGLE MOTHER DETAILS FIELD
// ============================================================

const updateMotherDetailsFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    user_id: z4.string().trim().min(1, "User ID is required."),
    field: z4.literal("mother_name"),
    value: z4.string().trim().min(2, "Mother name is required."),
  }),
  z4.object({
    user_id: z4.string().trim().min(1, "User ID is required."),
    field: z4.literal("nid_no"),
    value: z4.string().trim().nullable(),
  }),
  z4.object({
    user_id: z4.string().trim().min(1, "User ID is required."),
    field: z4.literal("occupation"),
    value: z4.string().trim().nullable(),
  }),
  z4.object({
    user_id: z4.string().trim().min(1, "User ID is required."),
    field: z4.literal("job_title"),
    value: z4.string().trim().nullable(),
  }),
  z4.object({
    user_id: z4.string().trim().min(1, "User ID is required."),
    field: z4.literal("educational_qualification"),
    value: z4.enum(EducationDegree).nullable(),
  }),
  z4.object({
    user_id: z4.string().trim().min(1, "User ID is required."),
    field: z4.literal("monthly_income"),
    value: z4.string().trim().nullable(),
  }),
  ...(["mobile_no_1", "mobile_no_2", "mobile_no_3"] as const).map((field) =>
    z4.object({
      user_id: z4.string().trim().min(1, "User ID is required."),
      field: z4.literal(field),
      value: z4
        .string()
        .trim()
        .length(
          11,
          "Mobile number must be 11 digit Bangladeshi number start with 01",
        )
        .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.")
        .nullable(),
    }),
  ),
]);

export type TUpdateMotherDetailsFieldPayload = z4.infer<
  typeof updateMotherDetailsFieldZodSchema
>;

// ============================================================
// DELETE / DISCONNECT MOTHER DETAILS
// ============================================================

const disconnectMotherDetailsZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),
});

export type TDisconnectMotherDetailsZodSchema = z4.infer<
  typeof disconnectMotherDetailsZodSchema
>;

export const motherDetailsZodSchema = {
  createMotherDetailsZodSchema,
  connectMotherDetailsZodSchema,
  updateMotherDetailsFieldZodSchema,
  disconnectMotherDetailsZodSchema,
};
