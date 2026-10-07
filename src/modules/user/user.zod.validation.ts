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
  VALID_USER_ROLES,
} from "./user.interface.js";

// ===================================
// CREATE USER ZOD SCHEMA
// ===================================
const userCreateZodSchema = z4
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
      .trim()
      .toLowerCase()
      .check(z4.email("Invalid email format")),
    position_name: z4.string({
      error: (issue) =>
        issue.input === undefined
          ? "User position is required."
          : "Invalid user position format",
    }),
    role_name: z4.enum(VALID_USER_ROLES, {
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

    active_class_id: z4.string().trim().optional(),
    year_name: z4.string().trim().optional(),
    shift_name: z4.string().trim().optional(),
    roll_number: z4.coerce
      .number("Invalid roll number.")
      .int("Roll number must be an integer.")
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role_name?.trim().toUpperCase() === "STUDENT") {
      if (!data.active_class_id || data.active_class_id.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Class is required for students.",
          path: ["active_class_id"],
        });
      }

      if (!data.year_name || data.year_name.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Academic year name is required for students.",
          path: ["year_name"],
        });
      }

      if (!data.shift_name || data.shift_name.trim() === "") {
        ctx.addIssue({
          code: "custom",
          message: "Shift name is required for students.",
          path: ["shift_name"],
        });
      }

      if (data.roll_number === undefined) {
        ctx.addIssue({
          code: "custom",
          message: "Roll number is required for students.",
          path: ["roll_number"],
        });
      }
    }
  });
export type TUserCreateZodSchema = z4.infer<typeof userCreateZodSchema>;
// ========================================
// CHANGE PASSWORD ZOD SCHEMA
// ========================================
const changePasswordZodSchema = z4
  .object({
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
      .min(8, "New password must be at least 8 characters."),
    confirm_password: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Confirm password is required."
            : "Invalid confirm password format.",
      })
      .min(8, "Confirm password must be at least 8 characters."),
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

// =========================================
// FORGET PASSWORD  ZOD SCHEMA
// =========================================
const forgetPasswordZodSchema = z4.object({
  email: z4
    .string("Email is required.")
    .trim()
    .check(z4.email("Invalid email format.")),
});
export type TForgetPasswordPayload = z4.infer<typeof forgetPasswordZodSchema>;

// ================================================
// PROMOTE USER ROLE AND POSITION ZOD SCHEMA
// ================================================
const promoteUserSamePipelineZodSchema = z4.object({
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
  typeof promoteUserSamePipelineZodSchema
>;

// ===========================================
// UPDATE USER POSITION ZOD SCHEMA
// ===========================================
const changeUserPositionZodSchema = z4.object({
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
  z4
    .object({
      user_id: z4.string().trim(),
      field: z4.enum(STRING_FIELDS),
      value: z4.string().trim().nullable(),
    })
    .check(({ value: parsed, issues }) => {
      if (
        parsed.field === "email" &&
        parsed.value !== null &&
        !z4.email().safeParse(parsed.value).success
      ) {
        issues.push({
          code: "custom",
          input: parsed.value,
          message: "Invalid email format.",
          path: ["value"],
        });
      }
      if (
        parsed.field === "mobile_number" &&
        (parsed.value === null || !/^01\d{9}$/.test(parsed.value))
      ) {
        issues.push({
          code: "custom",
          input: parsed.value,
          message: "Invalid Bangladeshi mobile number.",
          path: ["value"],
        });
      }
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

const updateSingleUserFieldAdminZodSchema = z4.object({}).and(adminFieldsUnion);
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
    value: z4.preprocess(
      (val) => {
        if (typeof val !== "string") return val;
        const normalized = val.trim().toLowerCase();
        if (normalized === "true") return true;
        if (normalized === "false") return false;
        return val;
      },
      z4.boolean({ message: "Expected a boolean value." }),
    ),
  }),

  // 2. Rule for system Active Status Enum
  z4.object({
    user_id: z4.string().trim(),
    field: z4.literal("active_status"),
    value: z4.enum(ACTIVE_STATUS_ENUM, {
      message: "Invalid Active Status value.",
    }),
  }),
]);

// FIX: Wrapped with z4.object({}).and() to resolve the router middleware type signature error
const updateSingleUserFieldSuperAdminZodSchema = z4
  .object({})
  .and(superAdminFieldsUnion);
export type TUpdateSingleUserFieldSuperAdminZodSchema = z4.infer<
  typeof updateSingleUserFieldSuperAdminZodSchema
>;

// ============================================================
// UPDATE USER NAME ZOD SCHEMA
// ============================================================
const updateUserNameZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),
  user_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User name is required."
          : "Invalid user name.",
    })
    .trim()
    .min(1, "User name is required."),
});
export type TUpdateUserNameZodSchema = z4.infer<typeof updateUserNameZodSchema>;

// ============================================================
// UPDATE USER PASSWORD ZOD SCHEMA
// ============================================================
const updateUserPasswordZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),
  user_password: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User password is required."
          : "Invalid user password.",
    })
    .min(6, { error: "User password must be at least 6 characters long." }),
});
export type TUpdateUserPasswordZodSchema = z4.infer<
  typeof updateUserPasswordZodSchema
>;

// ================================================
// USER CROSS PIPELINE PROMOTION ZOD SCHEMA
// ================================================
export const userCrossPipelinePromotionZodSchema = z4.object({
  full_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "Full name is required." : "Invalid full name format.",
    })
    .trim(),
  mobile_number: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "Mobile number is required." : "Invalid mobile number format.",
    })
    .trim()
    .length(11, "Mobile number must be 11 digit Bangladeshi number start with 01")
    .regex(/^01\d{9}$/, "Invalid Bangladeshi mobile number."),
  target_position_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "Target position name is required." : "Invalid position format.",
    })
    .trim()
    .toUpperCase(),
  target_role_name: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "Target role name is required." : "Invalid role format.",
    })
    .trim()
    .toUpperCase(),
  transfer_effective_date: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "Effective date is required." : "Invalid ISO date string format.",
    })
    .check(z4.iso.datetime("Invalid date format. Expected an ISO string.")),
});

export type TCrossPipelineTransferZodSchema = z4.infer<typeof userCrossPipelinePromotionZodSchema>;

export const userZodSchema = {
  userCreateZodSchema,
  changePasswordZodSchema,
  forgetPasswordZodSchema,
  promoteUserSamePipelineZodSchema,
  changeUserPositionZodSchema,
  updateSingleUserFieldAdminZodSchema,
  updateSingleUserFieldSuperAdminZodSchema,
  updateUserNameZodSchema,
  updateUserPasswordZodSchema,
  userCrossPipelinePromotionZodSchema
};
