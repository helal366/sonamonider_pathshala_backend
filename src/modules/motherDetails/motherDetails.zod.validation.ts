import { EducationDegree } from "#db-client";
import z4 from "zod/v4";

export const createMotherDetailsZodSchema = z4.object({
  user_id: z4.string().trim(),
  mother_name: z4.string().trim(),
  nid_no: z4.string().trim().optional(),
  occupation: z4.string().trim().optional(),
  job_title: z4.string().trim().optional(),
  educational_qualification: z4.enum(EducationDegree).optional(),
  monthly_income: z4.string().trim().optional(),
  mobile_no_1: z4.string().trim().optional(),
  mobile_no_2: z4.string().trim().optional(),
  mobile_no_3: z4.string().trim().optional(),
});

export type TCreateMotherDetailsZodSchema = z4.infer<
  typeof createMotherDetailsZodSchema
>;

export const connectMotherDetailsZodSchema = z4.object({
  user_id: z4.string().trim(),
  mother_details_id: z4.string().trim(),
});

export type TConnectMotherDetailsZodSchema = z4.infer<
  typeof connectMotherDetailsZodSchema
>;

export const updateMotherNameZodSchema = z4.object({
  user_id: z4.string().trim(),
  mother_name: z4.string().trim(),
});
export type TUpdateMotherNameZodSchema = z4.infer<
  typeof updateMotherNameZodSchema
>;

export const updateMotherNidZodSchema = z4.object({
  user_id: z4.string().trim(),
  nid_no: z4.string().trim().nullable(),
});
export type TUpdateMotherNidZodSchema = z4.infer<
  typeof updateMotherNidZodSchema
>;

export const updateMotherOccupationZodSchema = z4.object({
  user_id: z4.string().trim(),
  occupation: z4.string().trim().nullable(),
});
export type TUpdateMotherOccupationZodSchema = z4.infer<
  typeof updateMotherOccupationZodSchema
>;

export const updateMotherJobTitleZodSchema = z4.object({
  user_id: z4.string().trim(),
  job_title: z4.string().trim().nullable(),
});
export type TUpdateMotherJobTitleZodSchema = z4.infer<
  typeof updateMotherJobTitleZodSchema
>;

export const updateMotherEducationalQualificationZodSchema = z4.object({
  user_id: z4.string().trim(),
  educational_qualification: z4.enum(EducationDegree).nullable(),
});
export type TUpdateMotherEducationalQualificationZodSchema = z4.infer<
  typeof updateMotherEducationalQualificationZodSchema
>;

export const updateMotherMonthlyIncomeZodSchema = z4.object({
  user_id: z4.string().trim(),
  monthly_income: z4.string().trim().nullable(),
});
export type TUpdateMotherMonthlyIncomeZodSchema = z4.infer<
  typeof updateMotherMonthlyIncomeZodSchema
>;

export const updateMotherMobileNo1ZodSchema = z4.object({
  user_id: z4.string().trim(),
  mobile_no_1: z4.string().trim().nullable(),
});
export type TUpdateMotherMobileNo1ZodSchema = z4.infer<
  typeof updateMotherMobileNo1ZodSchema
>;

export const updateMotherMobileNo2ZodSchema = z4.object({
  user_id: z4.string().trim(),
  mobile_no_2: z4.string().trim().nullable(),
});
export type TUpdateMotherMobileNo2ZodSchema = z4.infer<
  typeof updateMotherMobileNo2ZodSchema
>;

export const updateMotherMobileNo3ZodSchema = z4.object({
  user_id: z4.string().trim(),
  mobile_no_3: z4.string().trim().nullable(),
});
export type TUpdateMotherMobileNo3ZodSchema = z4.infer<
  typeof updateMotherMobileNo3ZodSchema
>;
