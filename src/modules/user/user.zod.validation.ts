import { BloodGroup, Gender, Religion } from "#db-client";
import z4 from "zod/v4";

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
});

export type TUserCreatePayload = z4.infer<typeof userCreateZodSchema>;


// CHANGE PASSWORD ZOD SCHEMA
export const changePasswordZodSchema = z4.object({
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


// CHANGE USER ROLE ZOD SCHEMA
export const changeUserRoleZodSchema = z4.object({
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
});
export type TChangeUserRoleZodSchema = z4.infer<
  typeof changeUserRoleZodSchema
>;


// CHANGE USER POSITION ZOD SCHEMA
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