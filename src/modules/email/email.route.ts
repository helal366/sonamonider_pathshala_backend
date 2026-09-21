import { Router } from "express";
import { emailController } from "./email.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import {
  resendOtpEmailZodSchema,
  resendOtpForgetPasswordZodSchema,
  verifyForgetPasswordZodSchema,
  verifyEmailZodSchema,
} from "./email.zod.validation.js";

const router = Router();
router.post(
  "/verify_email",
  validateZodSchema(verifyEmailZodSchema),
  emailController.verifyEmail,
);
router.post(
  "/resend_otp_email_verify",
  validateZodSchema(resendOtpEmailZodSchema),
  emailController.resendOtpEmailVerify,
);
router.post(
  "/send_otp_forget_password",
  validateZodSchema(resendOtpForgetPasswordZodSchema),
  emailController.sendForgetPasswordOtp,
);
router.post(
  "/resend_otp_forget_password",
  validateZodSchema(resendOtpForgetPasswordZodSchema),
  emailController.resendOtpForgetPassword,
);
router.post(
  "/verify_email_forget_password",
  validateZodSchema(verifyForgetPasswordZodSchema),
  emailController.verifyEmailForgetPassword,
);

export const emailRouter: Router = router;
