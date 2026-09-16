import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { userHelperFunction } from "./user.helper.function";
import {
  TChangePasswordPayload,
  TForgetPasswordPayload,
  TUserCreatePayload,
} from "./user.zod.validation";
import { findRoleExistance } from "../../helperFunctions/cachedData/cache_roles";
import { checkRolePositionPair } from "../../helperFunctions/cachedData/cache_positions";
import { prisma } from "../../lib/prisma";
import crypto from "crypto";
import { redisClient } from "../../lib/redis";
import path from "path";
import ejs from "ejs";
import bcrypt from "bcryptjs";
import { transporter } from "../../lib/nodemailer";
import { envVars } from "../../config";

// CREATE USER
const createUser = async (payload: TUserCreatePayload) => {
  const { full_name, mobile_number, email, position_name, role_name, ...rest } =
    payload;

  // make role and position to upper case
  const cleanRole = role_name.trim().toUpperCase();
  const cleanPosition = position_name.trim().toUpperCase();

  // check role validity
  const roleExists = await findRoleExistance(cleanRole);
  if (!roleExists) {
    throw new AppError(
      `Provided Role: ${cleanRole} is not a valid role.`,
      StatusCodes.NOT_FOUND,
    );
  }

  // check that the position belongs to the requested role
  const positionExists = await checkRolePositionPair({
    role_name: cleanRole,
    position_name: cleanPosition,
  });

  // check user existance
  const userExist = await userHelperFunction.userExistance({
    role_name: cleanRole,
    full_name,
    mobile_number,
  });
  if (userExist) {
    throw new AppError(
      `User already exists with Name: ${full_name}, Mobile number: ${mobile_number} and Role: ${cleanRole}`,
      StatusCodes.CONFLICT,
    );
  }

  // create user name
  const userCount = await userHelperFunction.userCount({
    role_name: cleanRole,
    mobile_number,
  });
  let user_name = mobile_number;
  if (userCount !== 0) {
    user_name = `${mobile_number}-${userCount + 1}`;
  }

  // Generate OTP and structure configurations
  const expirationSeconds = 5 * 60;
  const otpKey = `new_user_welcome_otp:${email}`;
  const otpValue = crypto.randomInt(100000, 1000000).toString();

  // Compile EJS template outside or inside transaction safely
  const templatePath = path.join(
    process.cwd(),
    "src/templates/create_user_email_verify.ejs",
  );
  const templateData = {
    name: full_name,
    OTP: otpValue,
    expirationMinutes: expirationSeconds / 60,
    year: new Date().getFullYear(),
  };
  const html = await ejs.renderFile(templatePath, templateData);

  // create user and management staff
  const newUser = await prisma.user.create({
    data: {
      full_name,
      mobile_number,
      email,
      ...rest,
      user_name,
      role: {
        connect: { role_name: cleanRole },
      },
      position: {
        connect: { id: positionExists.id },
      },
      management_staff_profile: {
        create: {
          full_name,
          mobile_number,
          email,
          current_position: {
            connect: { id: positionExists.id }, //connection require unique constraints
          },
          current_role: {
            connect: { id: roleExists.id }, //connection require unique constraints
          },
        },
      },
    },
  });
  // redis client set otp
  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });

  // congrats to new created user by email and send otp to verify email.
  // set nodemailler transporter
  try {
    await transporter.sendMail({
      from: `"${envVars.EMAIL_SENDER_NAME}"  <${envVars.EMAIL_SENDER}>`,
      to: email,
      subject: `Welcome To Model Academy. Verify Your Email Address`,
      html,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email.";
    throw new AppError(message, StatusCodes.BAD_REQUEST);
  }

  return newUser;
};

// CHANGE PASSWORD
const changePassword = async ({
  full_name,
  mobile_number,
  current_password,
  new_password,
}: TChangePasswordPayload) => {
  const user = await prisma.user.findUnique({
    where: {
      user_full_name_mobile_unique: {
        full_name,
        mobile_number,
      },
    },
    select: {
      user_password: true,
      email: true,
      full_name: true,
    },
  });

  if (!user || !user.user_password || !user.email) {
    throw new AppError(
      "User account or password was not found.",
      StatusCodes.NOT_FOUND,
    );
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    current_password,
    user.user_password,
  );
  if (!isCurrentPasswordValid) {
    throw new AppError(
      "Current password is incorrect.",
      StatusCodes.UNAUTHORIZED,
    );
  }

  if (current_password === new_password) {
    throw new AppError(
      "New password must be different from the current password.",
      StatusCodes.BAD_REQUEST,
    );
  }

  const hashedPassword = await bcrypt.hash(
    new_password,
    Number(envVars.BCRYPT_SALT_ROUND),
  );

  await prisma.user.update({
    where: {
      user_full_name_mobile_unique: {
        full_name,
        mobile_number,
      },
    },
    data: {
      user_password: hashedPassword,
    },
  });

  const templatePath = path.join(
    process.cwd(),
    "src/templates/change_password_success.ejs",
  );
  const html = await ejs.renderFile(templatePath, {
    name: user.full_name,
    password: new_password,
    year: new Date().getFullYear(),
  });

  try {
    await transporter.sendMail({
      from: `"${envVars.EMAIL_SENDER_NAME}" <${envVars.EMAIL_SENDER}>`,
      to: user.email,
      subject: "Model Academy Password Changed Successfully",
      html,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to send password change email.";
    throw new AppError(message, StatusCodes.BAD_REQUEST);
  }
};

const forgetPassword = async ({ email }: TForgetPasswordPayload) => {
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
      subject: "Model Academy Password Reset Verification Code",
      html,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email.";
    throw new AppError(message, StatusCodes.BAD_REQUEST);
  }
};

export const userServices = {
  createUser,
  changePassword,
  forgetPassword,
};
