import z4 from "zod/v4";

// ============================================================
// DELETE BLOOD GROUP
// ============================================================

export const deleteUserBloodGroupZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid user ID.",
    })
    .trim(),
});

export type TDeleteUserBloodGroupZodSchema =
  z4.infer<typeof deleteUserBloodGroupZodSchema>;


// ============================================================
// DELETE DATE OF BIRTH
// ============================================================

export const deleteUserDateOfBirthZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid user ID.",
    })
    .trim(),
});

export type TDeleteUserDateOfBirthZodSchema =
  z4.infer<typeof deleteUserDateOfBirthZodSchema>;


// ============================================================
// DELETE HEIGHT
// ============================================================

export const deleteUserHeightZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid user ID.",
    })
    .trim(),
});

export type TDeleteUserHeightZodSchema =
  z4.infer<typeof deleteUserHeightZodSchema>;


// ============================================================
// DELETE WEIGHT
// ============================================================

export const deleteUserWeightZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid user ID.",
    })
    .trim(),
});

export type TDeleteUserWeightZodSchema =
  z4.infer<typeof deleteUserWeightZodSchema>;


// ============================================================
// DELETE RELIGION
// ============================================================

export const deleteUserReligionZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid user ID.",
    })
    .trim(),
});

export type TDeleteUserReligionZodSchema =
  z4.infer<typeof deleteUserReligionZodSchema>;


// ============================================================
// DELETE BIRTH CERTIFICATE NUMBER
// ============================================================

export const deleteUserBirthCertificateNumberZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid user ID.",
    })
    .trim(),
});

export type TDeleteUserBirthCertificateNumberZodSchema =
  z4.infer<typeof deleteUserBirthCertificateNumberZodSchema>;


// ============================================================
// DELETE NID NUMBER
// ============================================================

export const deleteUserNidNumberZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid user ID.",
    })
    .trim(),
});

export type TDeleteUserNidNumberZodSchema =
  z4.infer<typeof deleteUserNidNumberZodSchema>;


// ============================================================
// DELETE PHOTO URL
// ============================================================

export const deleteUserPhotoUrlZodSchema = z4.object({
  user_id: z4
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "User ID is required."
          : "Invalid user ID.",
    })
    .trim(),
});

export type TDeleteUserPhotoUrlZodSchema =
  z4.infer<typeof deleteUserPhotoUrlZodSchema>;
