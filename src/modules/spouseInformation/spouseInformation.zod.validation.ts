import z4 from "zod/v4";


// ============================================================
// CREATE SPOUSE INFORMATION ZOD SCHEMA
// ============================================================
const spouseAddressZodSchema = z4.object({
  house_no: z4.string().trim().optional(),
  house_name: z4.string().trim().optional(),
  plot_no: z4.string().trim().optional(),
  road_no: z4.string().trim().optional(),
  neighbourhood: z4.string().trim().optional(),
  region: z4.string().trim().optional(),
  village: z4.string().trim().optional(),
  post_code: z4.number().int().optional(),
  post_office: z4.string().trim().optional(),
  thana: z4.string().trim().min(2, "Thana is required."),
  district: z4.string().trim().min(2, "District is required."),
  country: z4.string().trim().default("Bangladesh"),
});

export const createSpouseInformationZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  full_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Spouse full name is required."
          : "Invalid spouse full name.",
    })
    .trim()
    .min(2, "Spouse name is required"),

  contact_no: z4.string().trim().optional(),
  father_name: z4.string().trim().optional(),
  father_contact_no: z4.string().trim().optional(),
  mother_name: z4.string().trim().optional(),
  mother_contact_no: z4.string().trim().optional(),
  occupation: z4.string().trim().optional(),
  job_title: z4.string().trim().optional(),
  monthly_income: z4.string().trim().optional(),
  present_address: spouseAddressZodSchema.optional(),
  permanent_address: spouseAddressZodSchema.optional(),
});

export type TCreateSpouseInformationZodSchema = z4.infer<
  typeof createSpouseInformationZodSchema
>;


// ============================================================
// DELETE SPOUSE INFORMATION ZOD SCHEMA
// ============================================================
export const deleteSpouseInformationZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),
});
export type TDeleteSpouseInformationZodSchema = z4.infer<
  typeof deleteSpouseInformationZodSchema
>;

// ============================================================
// PATCH SPOUSE FULL NAME ZOD SCHEMA
// ============================================================
export const updateSpouseNameZodSchema = z4.object({
  user_id: z4.string().trim(),

  full_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Spouse name is required."
          : "Invalid spouse name.",
    })
    .trim()
    .min(2, "Spouse name is required."),
});

export type TUpdateSpouseNameZodSchema = z4.infer<
  typeof updateSpouseNameZodSchema
>;

// ============================================================
// PATCH SPOUSE CONTACT NO ZOD SCHEMA
// ============================================================
export const updateSpouseContactNoZodSchema = z4.object({
  user_id: z4.string().trim(),

  contact_no: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Contact no is required."
          : "Invalid contact no.",
    })
    .trim()
    .nullable(),
});

export type TUpdateSpouseContactNoZodSchema = z4.infer<
  typeof updateSpouseContactNoZodSchema
>;

// ============================================================
// PATCH SPOUSE FATHER NAME ZOD SCHEMA
// ============================================================
export const updateSpouseFatherNameZodSchema = z4.object({
  user_id: z4.string().trim(),
  father_name: z4
    .string({
      error: (issue) => {
        issue.input === undefined
          ? "Father name is required."
          : "Invalid father name.";
      },
    })
    .trim()
    .nullable(),
});

export type TUpdateSpouseFatherNameZodSchema = z4.infer<
  typeof updateSpouseFatherNameZodSchema
>;

// ============================================================
// PATCH SPOUSE FATHER CONTACT NO ZOD SCHEMA
// ============================================================
export const updateSpouseFatherContactNoZodSchema = z4.object({
  user_id: z4.string().trim(),
  father_contact_no: z4
    .string({
      error: (issue) => {
        issue.input === undefined
          ? "Father contact no is required."
          : "Invalid father contact no.";
      },
    })
    .trim()
    .nullable(),
});

export type TUpdateSpouseFatherContactNoZodSchema = z4.infer<
  typeof updateSpouseFatherContactNoZodSchema
>;

// ============================================================
// PATCH SPOUSE MOTHER NAME ZOD SCHEMA
// ============================================================
export const updateSpouseMotherNameZodSchema = z4.object({
  user_id: z4.string().trim(),
  mother_name: z4
    .string({
      error: (issue) => {
        issue.input === undefined
          ? "Mother name is required."
          : "Invalid mother name.";
      },
    })
    .trim()
    .nullable(),
});

export type TUpdateSpouseMotherNameZodSchema = z4.infer<
  typeof updateSpouseMotherNameZodSchema
>;

// ============================================================
// PATCH SPOUSE MOTHER CONTACT NO ZOD SCHEMA
// ============================================================
export const updateSpouseMotherContactNoZodSchema = z4.object({
  user_id: z4.string().trim(),
  mother_contact_no: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Mother contact no is required."
          : "Invalid mother contact no.",
    })
    .trim()
    .nullable(),
});

export type TUpdateSpouseMotherContactNoZodSchema = z4.infer<
  typeof updateSpouseMotherContactNoZodSchema
>;

// ============================================================
// PATCH SPOUSE OCCUPATION ZOD SCHEMA
// ============================================================
export const updateSpouseOccupationZodSchema = z4.object({
  user_id: z4.string().trim(),
  occupation: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Occupation is required."
          : "Invalid occupation.",
    })
    .trim()
    .nullable(),
});

export type TUpdateSpouseOccupationZodSchema = z4.infer<
  typeof updateSpouseOccupationZodSchema
>;

// ============================================================
// PATCH SPOUSE JOB TITLE ZOD SCHEMA
// ============================================================
export const updateSpouseJobTitleZodSchema = z4.object({
  user_id: z4.string().trim(),
  job_title: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Job title is required."
          : "Invalid job title.",
    })
    .trim()
    .nullable(),
});

export type TUpdateSpouseJobTitleZodSchema = z4.infer<
  typeof updateSpouseJobTitleZodSchema
>;

// ============================================================
// PATCH SPOUSE MONTHLY INCOME ZOD SCHEMA
// ============================================================
export const updateSpouseMonthlyIncomeZodSchema = z4.object({
  user_id: z4.string().trim(),
  monthly_income: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Monthly income is required."
          : "Invalid monthly income.",
    })
    .trim()
    .nullable(),
});

export type TUpdateSpouseMonthlyIncomeZodSchema = z4.infer<
  typeof updateSpouseMonthlyIncomeZodSchema
>;

