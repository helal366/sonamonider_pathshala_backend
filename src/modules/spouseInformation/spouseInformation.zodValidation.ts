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
  post_code: z4.string().trim().optional(),
  post_office: z4.string().trim().optional(),
  thana: z4.string().trim().min(2, "Thana is required."),
  district: z4.string().trim().min(2, "District is required."),
  country: z4.string().trim().default("Bangladesh"),
});

const createSpouseInformationZodSchema = z4.object({
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
const deleteSpouseInformationZodSchema = z4.object({
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
// UPDATE SPOUSE INFORMATION FIELD ROUTE
// ============================================================
const updateSpouseInformationFieldZodSchema = z4.discriminatedUnion("field", [
  z4.object({
    user_id: z4.string().trim().min(1, "User ID is required."),
    field: z4.literal("full_name"),
    value: z4.string().trim().min(2, "Spouse name is required."),
  }),
  ...(
    [
      "contact_no",
      "father_name",
      "father_contact_no",
      "mother_name",
      "mother_contact_no",
      "occupation",
      "job_title",
      "monthly_income",
    ] as const
  ).map((field) =>
    z4.object({
      user_id: z4.string().trim().min(1, "User ID is required."),
      field: z4.literal(field),
      value: z4.string().trim().nullable(),
    }),
  ),
]);

export type TUpdateSpouseInformationFieldPayload = z4.infer<
  typeof updateSpouseInformationFieldZodSchema
>;

export const spouseInformationZodSchema = {
  createSpouseInformationZodSchema,
  deleteSpouseInformationZodSchema,
  updateSpouseInformationFieldZodSchema,
};
