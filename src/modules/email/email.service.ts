import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import ejs from "ejs";
import path from "path";
import bcrypt from "bcryptjs";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { envVars } from "../../config";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../lib/redis";
import { transporter } from "../../lib/nodemailer";
import type {
  TResendOtpForgetPasswordPayload,
  TResendOtpEmailPayload,
  TVerifyForgetPasswordPayload,
  TVerifyEmailPayload,
} from "./email.zod.validation";
import { createTemporaryPassword, sendVerificationResultEmail } from "./email.helper.function";

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
      subject: "Your New Model Academy Verification Code",
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
      subject: "Model Academy Email Verification Failed",
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
    subject: "Model Academy Email Verified Successfully",
    templateData: {
      name: user.full_name,
      password: temporaryPassword,
    },
  });
};

const sendForgetPasswordOtp = async ({
  email,
  name,
}: {
  email: string;
  name: string;
}) => {
  const expirationSeconds = 5 * 60;
  const otpValue = crypto.randomInt(100000, 1000000).toString();
  const otpKey = `forget_password_otp:${email}`;
  const templatePath = path.join(
    process.cwd(),
    "src/templates/forget_password_otp.ejs",
  );
  const html = await ejs.renderFile(templatePath, {
    name,
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
      to: email,
      subject: "Model Academy Password Reset Verification Code",
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
      subject: "Model Academy Password Reset Failed",
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
    subject: "Model Academy Password Reset Successful",
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
    name: user.full_name,
  });
};

export const emailServices = {
  resendOtpEmailVerify,
  verifyEmail,
  verifyForgetPassword,
  resendOtpForgetPassword,
};
