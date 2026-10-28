import z4 from "zod/v4";

// CHANGE PASSWORD
export const changePasswordZodSchema = z4
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
      .min(6, "New password must be at least 6 characters."),
    confirm_password: z4
      .string({
        error: (issue) =>
          issue.input === undefined
            ? "Confirm password is required."
            : "Invalid confirm password format.",
      })
      .min(6, "Confirm password must be at least 6 characters."),
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
export type TChangePasswordPayload = z4.infer<
  typeof changePasswordZodSchema
>;

// FORGET PASSWORD
export const forgetPasswordZodSchema = z4.object({
  email: z4
    .string("Email is required.")
    .trim()
    .check(z4.email("Invalid email format.")),
});
export type TForgetPasswordPayload = z4.infer<typeof forgetPasswordZodSchema>;


// VERIFY EMAIL 
export const verifyEmailZodSchema = z4.object({
  email: z4
    .string("Email is required.")
    .trim()
    .check(z4.email("Invalid email format.")),
  otp: z4
    .string("OTP is required.")
    .trim()
    .regex(/^\d{6}$/, "OTP must be a six-digit number."),
});

export type TVerifyEmailPayload = z4.infer<typeof verifyEmailZodSchema>;


// RESEND OTP TO USER EMAIL
export const resendOtpEmailZodSchema = z4.object({
  email: z4
    .string("Email is required.")
    .trim()
    .check(z4.email("Invalid email format.")),
});

export type TResendOtpEmailPayload = z4.infer<typeof resendOtpEmailZodSchema>;



// VERIFY EMAIL TO RECOVER FORGET PASSWORD
export const verifyForgetPasswordZodSchema = z4.object({
  email: z4
    .string("Email is required.")
    .trim()
    .check(z4.email("Invalid email format.")),
  otp: z4
    .string("OTP is required.")
    .trim()
    .regex(/^\d{6}$/, "OTP must be a six-digit number."),
});

export type TVerifyForgetPasswordPayload = z4.infer<
  typeof verifyForgetPasswordZodSchema
>;

// RESEND OTP TO RECOVER FORGET PASSWORD
export const resendOtpForgetPasswordZodSchema = z4.object({
  email: z4
    .string("Email is required.")
    .trim()
    .check(z4.email("Invalid email format.")),
});

export type TResendOtpForgetPasswordPayload = z4.infer<
  typeof resendOtpForgetPasswordZodSchema
>;
