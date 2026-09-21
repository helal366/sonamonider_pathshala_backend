import { EducationDegree } from "#db-client";
import z4 from "zod/v4";

// CREATE ZOD SCHEMA
export const createFatherDetailsZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid user ID.",
    })
    .trim(),

  father_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Father name is required."
          : "Invalid father name.",
    })
    .trim(),

  nid_no: z4.string("Invalid national ID number format.").trim().optional(),
  occupation: z4.string("Invalid occupation format.").trim().optional(),
  job_title: z4.string("Invalid job title format.").trim().optional(),
  educational_qualification: z4.enum(EducationDegree,"Invalid educational qualification format.").optional(),
  monthly_income: z4.string("Invalid monthly income text format.").trim().optional(),
  mobile_no_1: z4.string("Invalid mobile number format.").trim().optional(),
  mobile_no_2: z4.string("Invalid mobile number format.").trim().optional(),
  mobile_no_3: z4.string("Invalid mobile number format.").trim().optional(),
});

export type TCreateFatherDetailsZodSchema = z4.infer<
  typeof createFatherDetailsZodSchema
>;


// CONNECT ZOD SCHEMA
export const connectFatherDetailsZodSchema = z4.object({
  user_id: z4.string().trim(),
  father_details_id: z4.string().trim(),
});

export type TConnectFatherDetailsZodSchema = z4.infer<
  typeof connectFatherDetailsZodSchema
>;

// gender: z4.enum(Gender, "Invalid gender."),