import z4 from "zod/v4";

export const resendOtpEmailZodSchema = z4.object({
  email: z4
    .string("Email is required.")
    .trim()
    .check(z4.email("Invalid email format.")),
});

export type TResendOtpEmailPayload = z4.infer<typeof resendOtpEmailZodSchema>;

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

export const resendOtpForgetPasswordZodSchema = z4.object({
  email: z4
    .string("Email is required.")
    .trim()
    .check(z4.email("Invalid email format.")),
});

export type TResendOtpForgetPasswordPayload = z4.infer<
  typeof resendOtpForgetPasswordZodSchema
>;
