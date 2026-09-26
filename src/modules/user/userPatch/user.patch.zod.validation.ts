import { BloodGroup, Gender, Religion } from "#db-client";
import z4 from "zod/v4";

// ============================================================
// UPDATE FULL NAME
// ============================================================

export const updateUserFullNameZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  full_name: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Full name is required."
        : "Invalid full name.",
  })
    .trim()
    .min(2, "Full name must be at least 2 characters."),
});

export type TUpdateUserFullNameZodSchema =
  z4.infer<typeof updateUserFullNameZodSchema>;


// ============================================================
// UPDATE GENDER
// ============================================================

export const updateUserGenderZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  gender: z4.enum(Gender, {
    error: "Invalid gender.",
  }),
});

export type TUpdateUserGenderZodSchema =
  z4.infer<typeof updateUserGenderZodSchema>;


// ============================================================
// UPDATE BLOOD GROUP
// ============================================================

export const updateUserBloodGroupZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  blood_group: z4.enum(BloodGroup, {
    error: "Invalid blood group.",
  }),
});

export type TUpdateUserBloodGroupZodSchema =
  z4.infer<typeof updateUserBloodGroupZodSchema>;


// ============================================================
// UPDATE DATE OF BIRTH
// ============================================================

export const updateUserDateOfBirthZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  date_of_birth: z4.coerce.date({
    error: (issue) =>
      issue.input === undefined
        ? "Date of birth is required."
        : "Invalid date of birth.",
  }),
});

export type TUpdateUserDateOfBirthZodSchema =
  z4.infer<typeof updateUserDateOfBirthZodSchema>;


// ============================================================
// UPDATE HEIGHT
// ============================================================

export const updateUserHeightZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  height_in_cm: z4.number({
    error: (issue) =>
      issue.input === undefined
        ? "Height is required."
        : "Height must be a number.",
  }).positive("Height must be greater than 0."),
});

export type TUpdateUserHeightZodSchema =
  z4.infer<typeof updateUserHeightZodSchema>;


// ============================================================
// UPDATE WEIGHT
// ============================================================

export const updateUserWeightZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  weight_in_kg: z4.number({
    error: (issue) =>
      issue.input === undefined
        ? "Weight is required."
        : "Weight must be a number.",
  }).positive("Weight must be greater than 0."),
});

export type TUpdateUserWeightZodSchema =
  z4.infer<typeof updateUserWeightZodSchema>;


// ============================================================
// UPDATE RELIGION
// ============================================================

export const updateUserReligionZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  religion: z4.enum(Religion, {
    error: "Invalid religion.",
  }),
});

export type TUpdateUserReligionZodSchema =
  z4.infer<typeof updateUserReligionZodSchema>;


// ============================================================
// UPDATE NATIONALITY
// ============================================================

export const updateUserNationalityZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  nationality: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Nationality is required."
        : "Invalid nationality.",
  })
    .trim()
    .min(2, "Nationality must be at least 2 characters."),
});

export type TUpdateUserNationalityZodSchema =
  z4.infer<typeof updateUserNationalityZodSchema>;


// ============================================================
// UPDATE BIRTH CERTIFICATE NUMBER
// ============================================================

export const updateUserBirthCertificateNumberZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  birth_certificate_number: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Birth certificate number is required."
        : "Invalid birth certificate number.",
  }).trim(),
});

export type TUpdateUserBirthCertificateNumberZodSchema =
  z4.infer<typeof updateUserBirthCertificateNumberZodSchema>;


// ============================================================
// UPDATE NID NUMBER
// ============================================================

export const updateUserNidNumberZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid NID number.",
  }).trim(),

  nid_number: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "NID number is required."
        : "Invalid NID number.",
  }).trim(),
});

export type TUpdateUserNidNumberZodSchema =
  z4.infer<typeof updateUserNidNumberZodSchema>;


// ============================================================
// UPDATE PHOTO URL
// ============================================================

export const updateUserPhotoUrlZodSchema = z4.object({
  user_id: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "User ID is required."
        : "Invalid user ID.",
  }).trim(),

  photo_url: z4.string({
    error: (issue) =>
      issue.input === undefined
        ? "Photo URL is required."
        : "Invalid photo URL.",
  })
    .trim()
    .url("Invalid photo URL."),
});

export type TUpdateUserPhotoUrlZodSchema =
  z4.infer<typeof updateUserPhotoUrlZodSchema>;