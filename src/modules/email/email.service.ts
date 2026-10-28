import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import { redisClient } from "../../lib/redis.js";
import type {
  TChangePasswordPayload,
  TForgetPasswordPayload,
  TResendOtpForgetPasswordPayload,
  TResendOtpEmailPayload,
  TVerifyForgetPasswordPayload,
  TVerifyEmailPayload,
} from "./email.zodValidation.js";
import {
  createTemporaryPassword,
  issueOtpAndSendEmail,
  sendVerificationResultEmail,
} from "./email.helper.function.js";
import { envVars } from "../../config/index.js";

const changePassword = async (
  payload: TChangePasswordPayload,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { current_password, new_password, confirm_password } = payload;
  const cleanCurrentPassword = current_password.trim();
  const cleanNewPassword = new_password.trim();
  const cleanConfirmPassword = confirm_password.trim();
  const user = await prisma.user.findUnique({
    where: { id: loggedInUser.user_id },
    select: {
      id: true,
      user_password: true,
      email: true,
      full_name: true,
    },
  });

  if (!user || !user.user_password) {
    throw new AppError(
      "User account or password was not found.",
      StatusCodes.NOT_FOUND,
    );
  }
  if (!user.email) {
    throw new AppError(
      "An email address is required to change the password.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    cleanCurrentPassword,
    user.user_password,
  );
  if (!isCurrentPasswordValid) {
    throw new AppError(
      "Current password is incorrect.",
      StatusCodes.UNAUTHORIZED,
    );
  }

  if (cleanCurrentPassword === cleanNewPassword) {
    throw new AppError(
      "New password must be different from the current password.",
      StatusCodes.BAD_REQUEST,
    );
  }

  if (cleanNewPassword !== cleanConfirmPassword) {
    throw new AppError(
      "New password and Confirm password mismatch.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const hashedPassword = await bcrypt.hash(
    cleanNewPassword,
    Number(envVars.BCRYPT_SALT_ROUND),
  );
  await prisma.$transaction(
    async (tx) => {
      await tx.user.update({
        where: { id: user.id },
        data: {
          user_password: hashedPassword,
          updated_by: {
            connect: { id: loggedInUser.user_id },
          },
        },
      });

      await tx.user.update({
        where: { id: loggedInUser.user_id },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: user.id,
                entity_name: "user",
                old_value: Prisma.JsonNull,
                new_value: { password_changed: true },
                action: "UPDATE",
              },
            ],
          },
        },
      });

      await sendVerificationResultEmail({
        to: user.email,
        templateName: "change_password_success.ejs",
        subject: "SONAMONIDER PATHSHALA Password Changed Successfully",
        templateData: {
          name: user.full_name,
          password: cleanNewPassword,
          year: new Date().getFullYear(),
        },
      });
    },
    {
      timeout: 30000,
    },
  );
  return { email_sent: true };
};

const forgetPassword = async ({ email }: TForgetPasswordPayload) => {
  await sendForgetPasswordOtp({ email });
};

// ============================================================
// VERIFY EMAIL WHILE REGISTRATION OR USER CREATION
// ============================================================
const verifyEmail = async ({ email, otp }: TVerifyEmailPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      full_name: true,
      email: true,
      user_name: true,
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

  console.log(Number(envVars.BCRYPT_SALT_ROUND));
  const temporaryPassword = createTemporaryPassword();
  const hashedPassword = await bcrypt.hash(temporaryPassword, Number(envVars.BCRYPT_SALT_ROUND));

  await prisma.$transaction(
    async (transaction) => {
      await transaction.user.update({
        where: { id: user.id },
        data: {
          is_email_verified: true,
          user_password: hashedPassword,
          updated_by: {
            connect: { id: user.id },
          },
        },
      });

      await transaction.user.update({
        where: { id: user.id },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: user.id,
                entity_name: "user",
                old_value: {
                  is_email_verified: false,
                  password_set: false,
                },
                new_value: {
                  is_email_verified: true,
                  password_set: true,
                },
                action: "UPDATE",
              },
            ],
          },
        },
      });

      await sendVerificationResultEmail({
        to: normalizedEmail,
        templateName: "success_email_verify.ejs",
        subject: "SONAMONIDER PATHSHALA Email Verified Successfully",
        templateData: {
          name: user.full_name,
          user_name: user.user_name ?? "",
          password: temporaryPassword,
        },
      });
    },
    { timeout: 30000 },
  );

  await redisClient.del(otpKey);
};
// ============================================================
// RESEND OTP EMAIL VERIFY
// ============================================================
const resendOtpEmailVerify = async ({ email }: TResendOtpEmailPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      email: true,
      full_name: true,
      user_name: true,
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
  await issueOtpAndSendEmail({
    key: otpKey,
    otp: otpValue,
    expirationSeconds,
    to: normalizedEmail,
    templateName: "resend_otp_email_verify.ejs",
    subject: "Your New SONAMONIDER PATHSHALA Verification Code",
    templateData: {
      name: user.full_name,
      user_name: user.user_name ?? "",
      OTP: otpValue,
      year: new Date().getFullYear(),
    },
  });
};

// ============================================================
// SEND FORGET PASSWORD OTP
// ============================================================
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
  await issueOtpAndSendEmail({
    key: otpKey,
    otp: otpValue,
    expirationSeconds,
    to: normalizedEmail,
    templateName: "forget_password_otp.ejs",
    subject: "SONAMONIDER PATHSHALA Password Reset Verification Code",
    templateData: {
      name: user.full_name,
      OTP: otpValue,
      year: new Date().getFullYear(),
    },
  });
};

// FORGET PASSWORD VERIFY EMAIL
const verifyEmailForgetPassword = async ({
  email,
  otp,
}: TVerifyForgetPasswordPayload) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
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

  await prisma.$transaction(
    async (transaction) => {
      await transaction.user.update({
        where: { id: user.id },
        data: {
          user_password: hashedPassword,
          updated_by: {
            connect: { id: user.id },
          },
        },
      });

      await transaction.user.update({
        where: { id: user.id },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: user.id,
                entity_name: "user",
                old_value: Prisma.JsonNull,
                new_value: { password_reset: true },
                action: "UPDATE",
              },
            ],
          },
        },
      });

      await sendVerificationResultEmail({
        to: normalizedEmail,
        templateName: "forget_password_success.ejs",
        subject: "SONAMONIDER PATHSHALA Password Reset Successful",
        templateData: {
          name: user.full_name,
          password: newPassword,
        },
      });
    },
    { timeout: 30000 },
  );

  await redisClient.del(otpKey);
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
  changePassword,
  forgetPassword,
  resendOtpEmailVerify,
  verifyEmail,
  sendForgetPasswordOtp,
  verifyEmailForgetPassword,
  resendOtpForgetPassword,
};
