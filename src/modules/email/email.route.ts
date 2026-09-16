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
  "/resend_otp_email_verify",
  validateZodSchema(resendOtpEmailZodSchema),
  emailController.resendOtpEmailVerify,
);
router.post(
  "/verify_email",
  validateZodSchema(verifyEmailZodSchema),
  emailController.verifyEmail,
);
router.post(
  "/verify_forget_password",
  validateZodSchema(verifyForgetPasswordZodSchema),
  emailController.verifyForgetPassword,
);
router.post(
  "/resend_otp_forget_password",
  validateZodSchema(resendOtpForgetPasswordZodSchema),
  emailController.resendOtpForgetPassword,
);
export const emailRouter: Router = router;
