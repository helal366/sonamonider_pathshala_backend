import z4 from "zod/v4";

// ============================================================
// CREATE ADDRESS
// ============================================================

export const createAddressZodSchema = z4.object({
  required_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Required ID is required."
        : "Invalid required ID.",
  }).trim(),

  house_no: z4.string().trim().optional(),
  house_name: z4.string().trim().optional(),
  plot_no: z4.string().trim().optional(),
  road_no: z4.string().trim().optional(),
  neighbourhood: z4.string().trim().optional(),
  region: z4.string().trim().optional(),
  village: z4.string().trim().optional(),
  post_code: z4.string().trim().optional(),
//   post_code: z4.number().int().optional(),
  post_office: z4.string().trim().optional(),
  thana: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Thana is required."
        : "Invalid thana.",
  })
    .trim()
    .min(2, "Thana is required."),

  district: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "District is required."
        : "Invalid district.",
  })
    .trim()
    .min(2, "District is required."),

  country: z4.string().trim().default("Bangladesh"),
});

export type TCreateAddressZodSchema =
  z4.infer<typeof createAddressZodSchema>;


// ============================================================
// DELETE COMPLETE ADDRESS
// ============================================================

export const deleteAddressZodSchema = z4.object({
  required_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Required ID is required."
        : "Invalid required ID.",
  }).trim(),
});

export type TDeleteAddressZodSchema =
  z4.infer<typeof deleteAddressZodSchema>;


// ============================================================
// UPDATE SINGLE ADDRESS FIELD
// ============================================================

export const updateAddressFieldZodSchema = z4.object({
  required_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Required ID is required."
        : "Invalid required ID.",
  }).trim(),

  value: z4.string().trim(),

//   value: z4.union([
//     z4.string().trim(),
//     z4.number().int(),
//   ]),
});

export type TUpdateAddressFieldZodSchema =
  z4.infer<typeof updateAddressFieldZodSchema>;


// ============================================================
// DELETE SINGLE ADDRESS FIELD
// ============================================================

export const deleteAddressFieldZodSchema = z4.object({
  required_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Required ID is required."
        : "Invalid required ID.",
  }).trim(),
});

export type TDeleteAddressFieldZodSchema =
  z4.infer<typeof deleteAddressFieldZodSchema>;
