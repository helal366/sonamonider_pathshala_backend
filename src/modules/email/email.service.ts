import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import ejs from "ejs";
import path from "path";
import bcrypt from "bcryptjs";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { envVars } from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";
import { redisClient } from "../../lib/redis.js";
import { transporter } from "../../lib/nodemailer.js";
import type {
  TResendOtpForgetPasswordPayload,
  TResendOtpEmailPayload,
  TVerifyForgetPasswordPayload,
  TVerifyEmailPayload,
} from "./email.zod.validation.js";
import {
  createTemporaryPassword,
  sendVerificationResultEmail,
} from "./email.helper.function.js";

// RESEND OTP EMAIL VERIFY
const resendOtpEmailVerify = async ({ email }: TResendOtpEmailPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      email: true,
      full_name: true,
      is_email_verified: true,
    },
  });

  if (!user) {
    throw new AppError(
      "No user found with this email address.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (user.is_email_verified) {
    throw new AppError(
      "This email address is already verified.",
      StatusCodes.CONFLICT,
    );
  }

  const expirationSeconds = 5 * 60;
  const otpValue = crypto.randomInt(100000, 1000000).toString();
  const otpKey = `new_user_welcome_otp:${normalizedEmail}`;
  const templatePath = path.join(
    process.cwd(),
    "src/templates/resend_otp_email_verify.ejs",
  );
  const html = await ejs.renderFile(templatePath, {
    name: user.full_name,
    OTP: otpValue,
    expirationMinutes: expirationSeconds / 60,
    year: new Date().getFullYear(),
  });

  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${envVars.EMAIL_SENDER_NAME}" <${envVars.EMAIL_SENDER}>`,
      to: normalizedEmail,
      subject: "Your New SONAMONIDER PATHSHALA Verification Code",
      html,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email.";
    throw new AppError(message, StatusCodes.BAD_REQUEST);
  }
};

// VERIFY EMAIL WHILE REGISTRATION OR USER CREATION
const verifyEmail = async ({ email, otp }: TVerifyEmailPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      full_name: true,
      mobile_number: true,
      email: true,
      is_email_verified: true,
    },
  });

  if (!user) {
    throw new AppError(
      "No user found with this email address.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (user.is_email_verified) {
    throw new AppError(
      "This email address is already verified.",
      StatusCodes.CONFLICT,
    );
  }

  const otpKey = `new_user_welcome_otp:${normalizedEmail}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp || storedOtp !== otp) {
    await sendVerificationResultEmail({
      to: normalizedEmail,
      templateName: "reject_email_verify.ejs",
      subject: "SONAMONIDER PATHSHALA Email Verification Failed",
      templateData: {
        name: user.full_name,
      },
    });
    throw new AppError(
      "Invalid or expired verification code.",
      StatusCodes.UNAUTHORIZED,
    );
  }

  const temporaryPassword = createTemporaryPassword();
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

  await prisma.user.update({
    where: {
      user_full_name_mobile_unique: {
        full_name: user.full_name,
        mobile_number: user.mobile_number,
      },
    },
    data: {
      is_email_verified: true,
      user_password: hashedPassword,
    },
  });

  await redisClient.del(otpKey);
  await sendVerificationResultEmail({
    to: normalizedEmail,
    templateName: "success_email_verify.ejs",
    subject: "SONAMONIDER PATHSHALA Email Verified Successfully",
    templateData: {
      name: user.full_name,
      password: temporaryPassword,
    },
  });
};

// SEND FORGET PASSWORD OTP
const sendForgetPasswordOtp = async ({
  email,
}: TResendOtpForgetPasswordPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      full_name: true,
      email: true,
      is_email_verified: true,
    },
  });

  if (!user || !user.email) {
    throw new AppError(
      "No user found with this email address.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (!user.is_email_verified) {
    throw new AppError(
      "Please verify your email address before resetting the password.",
      StatusCodes.FORBIDDEN,
    );
  }

  const expirationSeconds = 5 * 60;
  const otpValue = crypto.randomInt(100000, 1000000).toString();
  const otpKey = `forget_password_otp:${normalizedEmail}`;
  const templatePath = path.join(
    process.cwd(),
    "src/templates/forget_password_otp.ejs",
  );
  const html = await ejs.renderFile(templatePath, {
    name: user.full_name,
    OTP: otpValue,
    expirationMinutes: expirationSeconds / 60,
    year: new Date().getFullYear(),
  });

  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });

  try {
    await transporter.sendMail({
      from: `"${envVars.EMAIL_SENDER_NAME}" <${envVars.EMAIL_SENDER}>`,
      to: normalizedEmail,
      subject: "SONAMONIDER PATHSHALA Password Reset Verification Code",
      html,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email.";
    throw new AppError(message, StatusCodes.BAD_REQUEST);
  }
};

// FORGET PASSWORD VERIFY EMAIL
const verifyForgetPassword = async ({
  email,
  otp,
}: TVerifyForgetPasswordPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      full_name: true,
      mobile_number: true,
      email: true,
      is_email_verified: true,
    },
  });

  if (!user || !user.email) {
    throw new AppError(
      "No user found with this email address.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (!user.is_email_verified) {
    throw new AppError(
      "Please verify your email address before resetting the password.",
      StatusCodes.FORBIDDEN,
    );
  }

  const otpKey = `forget_password_otp:${normalizedEmail}`;
  const storedOtp = await redisClient.get(otpKey);

  if (!storedOtp || storedOtp !== otp) {
    await sendVerificationResultEmail({
      to: normalizedEmail,
      templateName: "forget_password_reject.ejs",
      subject: "SONAMONIDER PATHSHALA Password Reset Failed",
      templateData: { name: user.full_name },
    });
    throw new AppError(
      "Invalid or expired password reset verification code.",
      StatusCodes.UNAUTHORIZED,
    );
  }

  const newPassword = createTemporaryPassword();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: {
      user_full_name_mobile_unique: {
        full_name: user.full_name,
        mobile_number: user.mobile_number,
      },
    },
    data: {
      user_password: hashedPassword,
    },
  });

  await redisClient.del(otpKey);
  await sendVerificationResultEmail({
    to: normalizedEmail,
    templateName: "forget_password_success.ejs",
    subject: "SONAMONIDER PATHSHALA Password Reset Successful",
    templateData: {
      name: user.full_name,
      password: newPassword,
    },
  });
};

// RESEND OTP FORGET PASSWORD
const resendOtpForgetPassword = async ({
  email,
}: TResendOtpForgetPasswordPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      full_name: true,
      is_email_verified: true,
    },
  });

  if (!user) {
    throw new AppError(
      "No user found with this email address.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (!user.is_email_verified) {
    throw new AppError(
      "Please verify your email address before resetting the password.",
      StatusCodes.FORBIDDEN,
    );
  }

  await sendForgetPasswordOtp({
    email: normalizedEmail,
  });
};

export const emailServices = {
  resendOtpEmailVerify,
  verifyEmail,
  sendForgetPasswordOtp,
  verifyForgetPassword,
  resendOtpForgetPassword,
};
