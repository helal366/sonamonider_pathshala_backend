import { ActiveStatus, BloodGroup, Gender, Religion } from "#db-client";
import z4 from "zod/v4";

// ============================================================
// UPDATE FULL NAME
// ============================================================

export const updateUserFullNameZodSchema = z4.object({
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
          ? "Full name is required."
          : "Invalid full name.",
    })
    .trim()
    .min(2, "Full name must be at least 2 characters."),
});

export type TUpdateUserFullNameZodSchema = z4.infer<
  typeof updateUserFullNameZodSchema
>;

// ============================================================
// UPDATE GENDER
// ============================================================

export const updateUserGenderZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  gender: z4.enum(Gender, {
    error: "Invalid gender.",
  }),
});

export type TUpdateUserGenderZodSchema = z4.infer<
  typeof updateUserGenderZodSchema
>;

// ============================================================
// UPDATE BLOOD GROUP
// ============================================================

export const updateUserBloodGroupZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  blood_group: z4.enum(BloodGroup, {
    error: "Invalid blood group.",
  }),
});

export type TUpdateUserBloodGroupZodSchema = z4.infer<
  typeof updateUserBloodGroupZodSchema
>;

// ============================================================
// UPDATE DATE OF BIRTH
// ============================================================

export const updateUserDateOfBirthZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  date_of_birth: z4.coerce.date({
    error: (issue) =>
      issue.input === undefined
        ? "Date of birth is required."
        : "Invalid date of birth.",
  }),
});

export type TUpdateUserDateOfBirthZodSchema = z4.infer<
  typeof updateUserDateOfBirthZodSchema
>;

// ============================================================
// UPDATE HEIGHT
// ============================================================

export const updateUserHeightZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  height_in_cm: z4
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Height is required."
          : "Height must be a number.",
    })
    .positive("Height must be greater than 0."),
});

export type TUpdateUserHeightZodSchema = z4.infer<
  typeof updateUserHeightZodSchema
>;

// ============================================================
// UPDATE WEIGHT
// ============================================================

export const updateUserWeightZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  weight_in_kg: z4
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Weight is required."
          : "Weight must be a number.",
    })
    .positive("Weight must be greater than 0."),
});

export type TUpdateUserWeightZodSchema = z4.infer<
  typeof updateUserWeightZodSchema
>;

// ============================================================
// UPDATE RELIGION
// ============================================================

export const updateUserReligionZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  religion: z4.enum(Religion, {
    error: "Invalid religion.",
  }),
});

export type TUpdateUserReligionZodSchema = z4.infer<
  typeof updateUserReligionZodSchema
>;

// ============================================================
// UPDATE NATIONALITY
// ============================================================

export const updateUserNationalityZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  nationality: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Nationality is required."
          : "Invalid nationality.",
    })
    .trim()
    .min(2, "Nationality must be at least 2 characters."),
});

export type TUpdateUserNationalityZodSchema = z4.infer<
  typeof updateUserNationalityZodSchema
>;

// ============================================================
// UPDATE BIRTH CERTIFICATE NUMBER
// ============================================================

export const updateUserBirthCertificateNumberZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  birth_certificate_number: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Birth certificate number is required."
          : "Invalid birth certificate number.",
    })
    .trim(),
});

export type TUpdateUserBirthCertificateNumberZodSchema = z4.infer<
  typeof updateUserBirthCertificateNumberZodSchema
>;

// ============================================================
// UPDATE NID NUMBER
// ============================================================

export const updateUserNidNumberZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid NID number.",
    })
    .trim(),

  nid_number: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "NID number is required."
          : "Invalid NID number.",
    })
    .trim(),
});

export type TUpdateUserNidNumberZodSchema = z4.infer<
  typeof updateUserNidNumberZodSchema
>;

// ============================================================
// UPDATE PHOTO URL
// ============================================================

export const updateUserPhotoUrlZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),

  photo_url: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Photo URL is required."
          : "Invalid photo URL.",
    })
    .trim()
    .url("Invalid photo URL."),
});

export type TUpdateUserPhotoUrlZodSchema = z4.infer<
  typeof updateUserPhotoUrlZodSchema
>;

// ============================================================
// UPDATE MOBILE NUMBER
// ============================================================

export const updateUserMobileNumberZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) => {
        issue.input === undefined ? "User ID is required." : "Invalid user ID.";
      },
    })
    .trim(),

  mobile_number: z4
    .string({
      error: (issue) => {
        issue.input === undefined
          ? "Mobile number is required."
          : "Invalid mobile number ID";
      },
    })
    .trim(),
});

export type TUpdateUserMobileNumberZodSchema = z4.infer<
  typeof updateUserMobileNumberZodSchema
>;

// ============================================================
// UPDATE MOBILE NUMBER
// ============================================================

export const updateUserEmailZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) => {
        issue.input === undefined ? "User ID is required." : "Invalid user ID.";
      },
    })
    .trim(),

  email: z4
    .email({
      error: (issue) => {
        issue.input === undefined ? "Email is required." : "Invalid email";
      },
    })
    .trim(),
});

export type TUpdateUserEmailZodSchema = z4.infer<
  typeof updateUserEmailZodSchema
>;

// ============================================================
// UPDATE MOBILE VERIFIED STATUS
// ============================================================
export const updateUserMobileVerifiedZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) => {
        issue.input === undefined ? "User ID is required." : "Invalid user ID.";
      },
    })
    .trim(),

  is_mobile_verified: z4.boolean({
    error: (issue) => {
      issue.input === undefined
        ? "Email verified status is required."
        : "Email verified status must be a boolean.";
    },
  }),
});

export type TUpdateUserMobileVerifiedZodSchema = z4.infer<
  typeof updateUserMobileVerifiedZodSchema
>;

// ============================================================
// UPDATE EMAIL VERIFIED STATUS
// ============================================================
export const updateEmialVerifiedZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) => {
        issue.input === undefined ? "User ID is required." : "Invalid user ID.";
      },
    })
    .trim(),

  is_email_verified: z4.boolean({
    error: (issue) =>
      issue.input === undefined
        ? "Email verified status is required."
        : "Email verified status must be a boolean.",
  }),
});

export type TUpdateEmialVerifiedZodSchema = z4.infer<
  typeof updateEmialVerifiedZodSchema
>;

// ============================================================
// UPDATE EMAIL VERIFIED STATUS
// ============================================================
export const updateUserActiveStatusZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),
  active_status: z4.enum(ActiveStatus, {
    error: (issue) =>
      issue.input === undefined
        ? "Active status is required."
        : "Invalid active status.",
  }),
});

export type TUpdateUserActiveStatusZodSchema = z4.infer<
  typeof updateUserActiveStatusZodSchema
>;

// ============================================================
// UPDATE USER DELETED STATUS ROUTE
// ============================================================
export const updateUserDeletedStatusZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined ? "User ID is required." : "Invalid user ID.",
    })
    .trim(),
  is_deleted: z4.boolean({
    error: (issue) =>
      issue.input === undefined
        ? "Deleted status is required."
        : "Deleted status must be a boolean.",
  }),
});

export type TUpdateUserDeletedStatusZodSchema = z4.infer<
  typeof updateUserDeletedStatusZodSchema
>;

// ============================================================
// UPDATE USER NAME ROUTE
// ============================================================
export const updateUserNameZodSchema = z4.object({
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
    .trim(),
});
export type TUpdateUserNameZodSchema = z4.infer<typeof updateUserNameZodSchema>;

// ============================================================
// UPDATE USER PASSWORD
// ============================================================
export const updateUserPasswordZodSchema = z4.object({
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


