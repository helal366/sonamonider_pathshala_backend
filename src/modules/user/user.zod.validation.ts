import { BloodGroup, Gender, Religion } from "#db-client";
import z4 from "zod/v4";
import {
  ACTIVE_STATUS_ENUM,
  BLOOD_GROUP_ENUM,
  DATE_FIELDS,
  FLOAT_FIELDS,
  GENDER_ENUM,
  RELIGION_ENUM,
  STRING_FIELDS,
} from "./user.interface";

// CREATE USER ZOD SCHEMA
export const userCreateZodSchema = z4.object({
  full_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Full name is required."
          : "Invalid name format",
    })
    .trim()
    .min(1, "Full name is required."),
  mobile_number: z4
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
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number."),
  gender: z4.enum(Gender, "Invalid gender."),
  blood_group: z4.enum(BloodGroup, "Invalid blood group.").optional(),
  date_of_birth: z4
    .string("Input is expected to be a string but received null")
    .pipe(z4.coerce.date("Invalid format."))
    .optional(),
  height_in_cm: z4.number("Invalid number.").optional(),
  weight_in_kg: z4.number("Invalid number.").optional(),
  religion: z4.enum(Religion, "Invalid religion").optional(),
  nationality: z4.string().optional(),
  birth_certificate_number: z4
    .string("Invalid birth certificate number format")
    .optional(),
  nid_number: z4.string("Invalid nid number format").optional(),
  email: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required."
          : "Invalid email format",
    })
    .check(z4.email("Invalid email format")),
  position_name: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User position is required."
        : "Invalid user position format",
  }),
  role_name: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User role is required."
        : "Invalid user role format",
  }),
  joining_date: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Promotion effective date is required."
          : "Invalid date format. Expected an ISO string.",
    })
    .check(z4.iso.datetime("Invalid date format. Expected an ISO string.")),
});

export type TUserCreatePayload = z4.infer<typeof userCreateZodSchema>;

// CHANGE PASSWORD ZOD SCHEMA
export const changePasswordZodSchema = z4
  .object({
    full_name: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Full name is required."
            : "Invalid name format",
      })
      .trim()
      .min(1, "Full name is required."),
    mobile_number: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Mobile number is required."
            : "Invalid mobile number format.",
      })
      .trim()
      .length(11, "Mobile number must be 11 digit and start with 01")
      .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number."),
    current_password: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Current password is required."
            : "Invalid current password format.",
      })
      .min(6, "Current password is required."),
    new_password: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "New password is required."
            : "Invalid new password format.",
      })
      .min(6, "New password must be at least 8 characters."),
    confirm_password: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Confirm password is required."
            : "Invalid confirm password format.",
      })
      .min(6, "Confirm password must be at least 8 characters."),
  })
  .check(({ value, issues }) => {
    if (value.new_password !== value.confirm_password) {
      issues.push({
        code: "custom",
        input: value.confirm_password,
        message: "New password and confirm password must match.",
        path: ["confirm_password"],
      });
    }
  });

export type TChangePasswordPayload = z4.infer<typeof changePasswordZodSchema>;

// FORGET PASSWORD  ZOD SCHEMA
export const forgetPasswordZodSchema = z4.object({
  email: z4
    .string("Email is required.")
    .trim()
    .check(z4.email("Invalid email format.")),
});

export type TForgetPasswordPayload = z4.infer<typeof forgetPasswordZodSchema>;

// PROMOTE USER ROLE AND POSITION ZOD SCHEMA
export const promoteUserRolePositionZodSchema = z4.object({
  full_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Full name is required."
          : "Invalid full name format.",
    })
    .trim(),
  mobile_number: z4
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
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number."),
  position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Position name is required."
          : "Invalid position name format.",
    })
    .trim()
    .toUpperCase(),
  role_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Role name is required."
          : "Invalid role name format.",
    })
    .trim()
    .toUpperCase(),

  promoted_date: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Promotion effective date is required."
          : "Invalid date format. Expected an ISO string.",
    })
    .check(z4.iso.datetime("Invalid date format. Expected an ISO string.")),
});
export type TPromoteUserRolePositionZodSchema = z4.infer<
  typeof promoteUserRolePositionZodSchema
>;

// UPDATE USER POSITION ZOD SCHEMA
export const changeUserPositionZodSchema = z4.object({
  full_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Full name is required."
          : "Invalid full name format.",
    })
    .trim(),

  mobile_number: z4
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
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number."),

  position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Position name is required."
          : "Invalid position name format.",
    })
    .trim()
    .toUpperCase(),
});
export type TChangeUserPositionZodSchema = z4.infer<
  typeof changeUserPositionZodSchema
>;


// ==============================================
// UPDATE SINGLE USER FIELD ADMIN ZOD SCHEMA
// ==============================================
const adminFieldsUnion = z4.discriminatedUnion("field", [
  //1. Rule for standard string text fields
  z4.object({
    user_id: z4.string().trim(),
    field: z4.enum(STRING_FIELDS),
    value: z4.string().trim().nullable(),
  }),

  //2. Rule for float/decimal fields (height_in_cm, weight_in_kg)
  z4.object({
    user_id: z4.string().trim(),
    field: z4.enum(FLOAT_FIELDS),
    value: z4.preprocess(
      (val) =>
        val === "" || val === null || val === undefined ? null : Number(val),
      z4.number().nullable(),
    ),
  }),

  //3. Rule for date fields (date_of_birth)
  z4.object({
    user_id: z4.string().trim(),
    field: z4.enum(DATE_FIELDS),
    value: z4.preprocess(
      (val) => (typeof val === "string" && val ? new Date(val) : val),
      z4
        .date()
        .nullable()
        .refine((date) => !date || !isNaN(date.getTime()), {
          message: "Invalid date format.",
        }),
    ),
  }),

  // 4. Gender Enum (Non-nullable in Prisma)
  z4.object({
    user_id: z4.string().trim(),
    field: z4.literal("gender"),
    value: z4.enum(GENDER_ENUM, { message: "Invalid Gender value." }),
  }),

  // 5. Blood Group Enum (Nullable)
  z4.object({
    user_id: z4.string().trim().toUpperCase(),
    field: z4.literal("blood_group"),
    value: z4.enum(BLOOD_GROUP_ENUM, "Invalid Blood group.").nullable(),
  }),

  // 6. Religion Enum (Nullable)
  z4.object({
    user_id: z4.string().trim(),
    field: z4.literal("religion"),
    value: z4
      .enum(RELIGION_ENUM, { message: "Invalid Religion value." })
      .nullable(),
  }),
]);

export const updateSingleUserFieldAdminZodSchema = z4
  .object({})
  .and(adminFieldsUnion);
export type TUpdateSingleUserFieldAdminZodSchema = z4.infer<
  typeof updateSingleUserFieldAdminZodSchema
>;


// ===================================================
// UPDATE SINGLE USER FIELD SUPER ADMIN ZOD SCHEMA
// ===================================================
const superAdminFieldsUnion = z4.discriminatedUnion("field", [
  // 1. Rule for Boolean Status Flags (is_mobile_verified, is_email_verified, is_deleted)
  z4.object({
    user_id: z4.string().trim(),
    field: z4.enum(["is_mobile_verified", "is_email_verified", "is_deleted"]),
    // Preprocess handles raw booleans or form/string conversions safely
    value: z4.preprocess(
      (val) => (val === "" || val === null || val === undefined ? null : val),
      z4.coerce.boolean()
    ),
  }),

  // 2. Rule for system Active Status Enum
  z4.object({
    user_id: z4.string().trim(),
    field: z4.literal("active_status"),
    value: z4.enum(ACTIVE_STATUS_ENUM, { message: "Invalid Active Status value." }),
  }),
]);

// FIX: Wrapped with z4.object({}).and() to resolve the router middleware type signature error
export const updateSingleUserFieldSuperAdminZodSchema = z4.object({}).and(superAdminFieldsUnion);
export type TUpdateSingleUserFieldSuperAdminZodSchema = z4.infer<typeof updateSingleUserFieldSuperAdminZodSchema>;
