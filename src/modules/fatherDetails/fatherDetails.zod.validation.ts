import { EducationDegree } from "#db-client";
import z4 from "zod/v4";

// ======================================================
// CREATE FATHER DETAILS
// ======================================================
const createFatherDetailsZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  father_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Father name is required."
          : "Invalid father name.",
    })
    .trim()
    .min(2, "Father name is required"),

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

  mobile_no_1: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Mobile number is required."
          : "Invalid mobile number format.",
    })
    .trim()
    .length(
      11,
      "Mobile number must be 11 digit Bangladeshi number start with 01",
    )
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.")
    .optional(),

  mobile_no_2: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Mobile number is required."
          : "Invalid mobile number format.",
    })
    .trim()
    .length(
      11,
      "Mobile number must be 11 digit Bangladeshi number start with 01",
    )
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.")
    .optional(),

  mobile_no_3: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Mobile number is required."
          : "Invalid mobile number format.",
    })
    .trim()
    .length(
      11,
      "Mobile number must be 11 digit Bangladeshi number start with 01",
    )
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.")
    .optional(),
});

export type TCreateFatherDetailsZodSchema = z4.infer<
  typeof createFatherDetailsZodSchema
>;

// ======================================================
// CONNECT FATHER DETAILS
// ======================================================
const connectFatherDetailsZodSchema = z4.object({
  user_id: z4.string().trim(),
  father_details_id: z4.string().trim(),
});

export type TConnectFatherDetailsZodSchema = z4.infer<
  typeof connectFatherDetailsZodSchema
>;

// ======================================================
// DELETE/DISCONNECT FATHER DETAILS
// ======================================================
const disconnectFatherDetailsZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),
});

export type TDisconnectFatherDetailsZodSchema = z4.infer<
  typeof disconnectFatherDetailsZodSchema
>;

// ======================================================
// UPDATE FATHER NAME
// ======================================================

const updateFatherDetailsFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    user_id: z4.string().trim().min(1, "User ID is required."),
    field: z4.literal("father_name"),
    value: z4.string().trim().min(2, "Father name is required."),
  }),
  ...(["nid_no", "occupation", "job_title", "monthly_income"] as const).map(
    (field) =>
      z4.object({
        user_id: z4.string().trim().min(1, "User ID is required."),
        field: z4.literal(field),
        value: z4.string().trim().nullable(),
      }),
  ),
  z4.object({
    user_id: z4.string().trim().min(1, "User ID is required."),
    field: z4.literal("educational_qualification"),
    value: z4.enum(EducationDegree).nullable(),
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

export type TUpdateFatherDetailsFieldPayload = z4.infer<
  typeof updateFatherDetailsFieldZodSchema
>;

export const fatherDetailsZodSchema = {
  createFatherDetailsZodSchema,
  connectFatherDetailsZodSchema,
  disconnectFatherDetailsZodSchema,
  updateFatherDetailsFieldZodSchema,
};
