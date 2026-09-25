import { EducationDegree } from "#db-client";
import z4 from "zod/v4";

// ============================================================
// CREATE MOTHER DETAILS
// ============================================================

export const createMotherDetailsZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  mother_name: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Mother name is required."
        : "Invalid mother name.",
  }).trim(),

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
    .string("Invalid mobile number format.")
    .trim()
    .optional(),

  mobile_no_2: z4
    .string("Invalid mobile number format.")
    .trim()
    .optional(),

  mobile_no_3: z4
    .string("Invalid mobile number format.")
    .trim()
    .optional(),
});

export type TCreateMotherDetailsZodSchema = z4.infer<
  typeof createMotherDetailsZodSchema
>;

// ============================================================
// CONNECT MOTHER DETAILS
// ============================================================

export const connectMotherDetailsZodSchema = z4.object({
  user_id: z4.string().trim(),

  mother_details_id: z4.string().trim(),
});

export type TConnectMotherDetailsZodSchema = z4.infer<
  typeof connectMotherDetailsZodSchema
>;

// ============================================================
// PATCH MOTHER NAME
// ============================================================

export const updateMotherNameZodSchema = z4.object({
  user_id: z4.string().trim(),

  mother_name: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Mother name is required."
        : "Invalid mother name.",
  }).trim(),
});

export type TUpdateMotherNameZodSchema = z4.infer<
  typeof updateMotherNameZodSchema
>;

// ============================================================
// PATCH MOTHER NID
// ============================================================

export const updateMotherNidZodSchema = z4.object({
  user_id: z4.string().trim(),

  nid_no: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "NID number is required."
        : "Invalid national ID number format.",
  }).trim().nullable(),
});

export type TUpdateMotherNidZodSchema = z4.infer<
  typeof updateMotherNidZodSchema
>;

// ============================================================
// PATCH MOTHER OCCUPATION
// ============================================================

export const updateMotherOccupationZodSchema = z4.object({
  user_id: z4.string().trim(),

  occupation: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Occupation is required."
        : "Invalid occupation format.",
  }).trim().nullable(),
});

export type TUpdateMotherOccupationZodSchema = z4.infer<
  typeof updateMotherOccupationZodSchema
>;

// ============================================================
// PATCH MOTHER JOB TITLE
// ============================================================

export const updateMotherJobTitleZodSchema = z4.object({
  user_id: z4.string().trim(),

  job_title: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Job title is required."
        : "Invalid job title format.",
  }).trim().nullable(),
});

export type TUpdateMotherJobTitleZodSchema = z4.infer<
  typeof updateMotherJobTitleZodSchema
>;

// ============================================================
// PATCH MOTHER EDUCATIONAL QUALIFICATION
// ============================================================

export const updateMotherEducationalQualificationZodSchema = z4.object({
  user_id: z4.string().trim(),

  educational_qualification: z4
    .enum(EducationDegree, {
      error: (issue) =>
        issue.input === undefined
          ? "Educational qualification is required."
          : "Invalid educational qualification format.",
    })
    .nullable(),
});

export type TUpdateMotherEducationalQualificationZodSchema = z4.infer<
  typeof updateMotherEducationalQualificationZodSchema
>;

// ============================================================
// PATCH MOTHER MONTHLY INCOME
// ============================================================

export const updateMotherMonthlyIncomeZodSchema = z4.object({
  user_id: z4.string().trim(),

  monthly_income: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Monthly income is required."
        : "Invalid monthly income text format.",
  }).trim().nullable(),
});

export type TUpdateMotherMonthlyIncomeZodSchema = z4.infer<
  typeof updateMotherMonthlyIncomeZodSchema
>;

// ============================================================
// PATCH MOTHER MOBILE NO 1
// ============================================================

export const updateMotherMobileNo1ZodSchema = z4.object({
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
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.")
    .nullable(),
});

export type TUpdateMotherMobileNo1ZodSchema = z4.infer<
  typeof updateMotherMobileNo1ZodSchema
>;

// ============================================================
// PATCH MOTHER MOBILE NO 2
// ============================================================

export const updateMotherMobileNo2ZodSchema = z4.object({
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
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.")
    .nullable(),
});

export type TUpdateMotherMobileNo2ZodSchema = z4.infer<
  typeof updateMotherMobileNo2ZodSchema
>;

// ============================================================
// PATCH MOTHER MOBILE NO 3
// ============================================================

export const updateMotherMobileNo3ZodSchema = z4.object({
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
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number.")
    .nullable(),
});

export type TUpdateMotherMobileNo3ZodSchema = z4.infer<
  typeof updateMotherMobileNo3ZodSchema
>;

// ============================================================
// DELETE / DISCONNECT MOTHER DETAILS
// ============================================================

export const disconnectMotherDetailsZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),
});

export type TDisconnectMotherDetailsZodSchema = z4.infer<
  typeof disconnectMotherDetailsZodSchema
>;



// import { EducationDegree } from "#db-client";
// import z4 from "zod/v4";

// export const createMotherDetailsZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   mother_name: z4.string().trim(),
//   nid_no: z4.string().trim().optional(),
//   occupation: z4.string().trim().optional(),
//   job_title: z4.string().trim().optional(),
//   educational_qualification: z4.enum(EducationDegree).optional(),
//   monthly_income: z4.string().trim().optional(),
//   mobile_no_1: z4.string().trim().optional(),
//   mobile_no_2: z4.string().trim().optional(),
//   mobile_no_3: z4.string().trim().optional(),
// });

// export type TCreateMotherDetailsZodSchema = z4.infer<
//   typeof createMotherDetailsZodSchema
// >;

// export const connectMotherDetailsZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   mother_details_id: z4.string().trim(),
// });

// export type TConnectMotherDetailsZodSchema = z4.infer<
//   typeof connectMotherDetailsZodSchema
// >;

// export const updateMotherNameZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   mother_name: z4.string().trim(),
// });
// export type TUpdateMotherNameZodSchema = z4.infer<
//   typeof updateMotherNameZodSchema
// >;

// export const updateMotherNidZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   nid_no: z4.string().trim().nullable(),
// });
// export type TUpdateMotherNidZodSchema = z4.infer<
//   typeof updateMotherNidZodSchema
// >;

// export const updateMotherOccupationZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   occupation: z4.string().trim().nullable(),
// });
// export type TUpdateMotherOccupationZodSchema = z4.infer<
//   typeof updateMotherOccupationZodSchema
// >;

// export const updateMotherJobTitleZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   job_title: z4.string().trim().nullable(),
// });
// export type TUpdateMotherJobTitleZodSchema = z4.infer<
//   typeof updateMotherJobTitleZodSchema
// >;

// export const updateMotherEducationalQualificationZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   educational_qualification: z4.enum(EducationDegree).nullable(),
// });
// export type TUpdateMotherEducationalQualificationZodSchema = z4.infer<
//   typeof updateMotherEducationalQualificationZodSchema
// >;

// export const updateMotherMonthlyIncomeZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   monthly_income: z4.string().trim().nullable(),
// });
// export type TUpdateMotherMonthlyIncomeZodSchema = z4.infer<
//   typeof updateMotherMonthlyIncomeZodSchema
// >;

// export const updateMotherMobileNo1ZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   mobile_no_1: z4.string().trim().nullable(),
// });
// export type TUpdateMotherMobileNo1ZodSchema = z4.infer<
//   typeof updateMotherMobileNo1ZodSchema
// >;

// export const updateMotherMobileNo2ZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   mobile_no_2: z4.string().trim().nullable(),
// });
// export type TUpdateMotherMobileNo2ZodSchema = z4.infer<
//   typeof updateMotherMobileNo2ZodSchema
// >;

// export const updateMotherMobileNo3ZodSchema = z4.object({
//   user_id: z4.string().trim(),
//   mobile_no_3: z4.string().trim().nullable(),
// });
// export type TUpdateMotherMobileNo3ZodSchema = z4.infer<
//   typeof updateMotherMobileNo3ZodSchema
// >;
