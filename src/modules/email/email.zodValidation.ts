import z4 from "zod/v4";


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
