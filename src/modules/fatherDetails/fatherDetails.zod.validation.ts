import { EducationDegree } from "#db-client";
import z4 from "zod/v4";

// ======================================================
// CREATE FATHER DETAILS
// ======================================================

export const createFatherDetailsZodSchema = z4.object({
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

export const connectFatherDetailsZodSchema = z4.object({
  user_id: z4.string().trim(),

  father_details_id: z4.string().trim(),
});

export type TConnectFatherDetailsZodSchema = z4.infer<
  typeof connectFatherDetailsZodSchema
>;

// ======================================================
// DELETE/DISCONNECT FATHER DETAILS
// ======================================================
export const disconnectFatherDetailsZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),
});

export type TDisconnectFatherDetailsZodSchema = z4.infer<
  typeof disconnectFatherDetailsZodSchema
>;


// ======================================================
// UPDATE FATHER NAME
// ======================================================

export const updateFatherNameZodSchema = z4.object({
  user_id: z4.string().trim(),

  father_name: z4.string("Invalid father name format.").trim(),
});

export type TUpdateFatherNameZodSchema = z4.infer<
  typeof updateFatherNameZodSchema
>;

// ======================================================
// UPDATE FATHER NID
// ======================================================

export const updateFatherNidZodSchema = z4.object({
  user_id: z4.string().trim(),

  nid_no: z4.string("Invalid national ID number format.").trim().nullable(),
});

export type TUpdateFatherNidZodSchema = z4.infer<
  typeof updateFatherNidZodSchema
>;

// ======================================================
// UPDATE FATHER OCCUPATION
// ======================================================

export const updateFatherOccupationZodSchema = z4.object({
  user_id: z4.string().trim(),

  occupation: z4.string("Invalid occupation format.").trim().nullable(),
});

export type TUpdateFatherOccupationZodSchema = z4.infer<
  typeof updateFatherOccupationZodSchema
>;

// ======================================================
// UPDATE FATHER JOB TITLE
// ======================================================

export const updateFatherJobTitleZodSchema = z4.object({
  user_id: z4.string().trim(),

  job_title: z4.string("Invalid job title format.").trim().nullable(),
});

export type TUpdateFatherJobTitleZodSchema = z4.infer<
  typeof updateFatherJobTitleZodSchema
>;

// ======================================================
// UPDATE FATHER EDUCATIONAL QUALIFICATION
// ======================================================

export const updateFatherEducationalQualificationZodSchema = z4.object({
  user_id: z4.string().trim(),

  educational_qualification: z4
    .enum(EducationDegree, "Invalid educational qualification format.")
    .nullable(),
});

export type TUpdateFatherEducationalQualificationZodSchema = z4.infer<
  typeof updateFatherEducationalQualificationZodSchema
>;

// ======================================================
// UPDATE FATHER MONTHLY INCOME
// ======================================================

export const updateFatherMonthlyIncomeZodSchema = z4.object({
  user_id: z4.string().trim(),

  monthly_income: z4
    .string("Invalid monthly income text format.")
    .trim()
    .nullable(),
});

export type TUpdateFatherMonthlyIncomeZodSchema = z4.infer<
  typeof updateFatherMonthlyIncomeZodSchema
>;

// ======================================================
// UPDATE FATHER MOBILE NO 1
// ======================================================

export const updateFatherMobileNo1ZodSchema = z4.object({
  user_id: z4.string().trim(),

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
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.").nullable(),
});

export type TUpdateFatherMobileNo1ZodSchema = z4.infer<
  typeof updateFatherMobileNo1ZodSchema
>;

// ======================================================
// UPDATE FATHER MOBILE NO 2
// ======================================================

export const updateFatherMobileNo2ZodSchema = z4.object({
  user_id: z4.string().trim(),

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
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.").nullable(),
});

export type TUpdateFatherMobileNo2ZodSchema = z4.infer<
  typeof updateFatherMobileNo2ZodSchema
>;

// ======================================================
// UPDATE FATHER MOBILE NO 3
// ======================================================

export const updateFatherMobileNo3ZodSchema = z4.object({
  user_id: z4.string().trim(),

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
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.").nullable(),
});

export type TUpdateFatherMobileNo3ZodSchema = z4.infer<
  typeof updateFatherMobileNo3ZodSchema
>;
