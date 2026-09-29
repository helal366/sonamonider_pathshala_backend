import z4 from "zod/v4";
import {
  ADDRESS_UPDATE_FIELDS,
  AddressOwnerType,
  AddressType,
} from "./address.interface";

// ============================================================
// CREATE ADDRESS ZOD SCHEMA
// ============================================================

export const createAddressZodSchema = z4.object({
  required_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Required ID is required."
          : "Invalid required ID.",
    })
    .trim()
    .min(1, "Required ID is required."),

  flat_no: z4.string().trim().optional(),
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
  thana: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "Thana is required." : "Invalid thana.",
    })
    .trim()
    .min(2, "Thana is required."),

  district: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "District is required."
          : "Invalid district.",
    })
    .trim()
    .min(2, "District is required."),

  country: z4.string().trim().default("Bangladesh"),

  owner_type: z4.enum(AddressOwnerType, "Invalid address owner type."),
  address_type: z4.enum(AddressType, "Invalid address type."),
});

export type TCreateAddressZodSchema = z4.infer<typeof createAddressZodSchema>;

// ============================================================
// DELETE COMPLETE ADDRESS ZOD SCHEMA
// ============================================================

export const deleteAddressZodSchema = z4.object({
  required_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Required ID is required."
          : "Invalid required ID.",
    })
    .trim()
    .min(1, "Required ID is required."),

  owner_type: z4.enum(AddressOwnerType, "Invalid address owner type."),
  address_type: z4.enum(AddressType, "Invalid address type."),
});

export type TDeleteAddressZodSchema = z4.infer<typeof deleteAddressZodSchema>;

// ============================================================
// UPDATE SINGLE ADDRESS FIELD ZOD SCHEMA
// ============================================================

export const updateAddressFieldZodSchema = z4.object({
  required_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Required ID is required."
          : "Invalid required ID.",
    })
    .trim()
    .min(1, "Required ID is required."),

  field: z4.enum(ADDRESS_UPDATE_FIELDS, "Invalid field name"),
  value: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "Value is required." : "Invalid value.",
    })
    .trim()
    .min(1, "Value cannot be empty.")
    .nullable(),

  owner_type: z4.enum(AddressOwnerType, "Invalid address owner type."),
  address_type: z4.enum(AddressType, "Invalid address type."),

  //   value: z4.union([
  //     z4.string().trim(),
  //     z4.number().int(),
  //   ]),
});

export type TUpdateAddressFieldZodSchema = z4.infer<
  typeof updateAddressFieldZodSchema
>;

export const addressZodSchema = {
  createAddressZodSchema,
  deleteAddressZodSchema,
  updateAddressFieldZodSchema,
};
