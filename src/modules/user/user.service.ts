import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { userHelperFunction } from "./user.helper.function.js";
import { clearCacheRoles, findRoleExistence } from "../../helperFunctions/cachedData/cache_roles.js";
import {
  checkRolePositionPair,
  clearCachePositions,
  findPositionExistence,
} from "../../helperFunctions/cachedData/cache_positions.js";
import { prisma } from "../../lib/prisma.js";
import crypto from "crypto";
import { redisClient } from "../../lib/redis.js";
import path from "path";
import ejs from "ejs";
import bcrypt from "bcryptjs";
import { transporter } from "../../lib/nodemailer.js";
import { envVars } from "../../config/index.js";
import {
  TChangePasswordPayload,
  TChangeUserPositionZodSchema,
  TPromoteUserRolePositionZodSchema,
  TForgetPasswordPayload,
  TUserCreatePayload,
} from "./user.zod.validation.js";

// CREATE USER
const createUser = async (
  payload: TUserCreatePayload,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  // 1. Extract + normalize
  const { full_name, mobile_number, email, position_name, role_name, ...rest } =
    payload;

  const cleanRole = role_name.trim().toUpperCase();
  const cleanPosition = position_name.trim().toUpperCase();

  // 2. Validate role
  const roleExists = await findRoleExistence(cleanRole);

  if (!roleExists) {
    throw new AppError(
      `Provided Role: ${cleanRole} is not a valid role.`,
      StatusCodes.NOT_FOUND,
    );
  }

  // 3. Validate role-position relationship
  const positionExists = await checkRolePositionPair({
    role_name: cleanRole,
    position_name: cleanPosition,
  });

  // 4. Check duplicate
  const userExist = await userHelperFunction.userExistence({
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

  // 5. Generate username
  const userCount = await userHelperFunction.userCount({
    role_name: cleanRole,
    mobile_number,
  });

  const user_name =
    userCount === 0 ? mobile_number : `${mobile_number}-${userCount + 1}`;

  // 6. Create DB records atomically
  const newUser = await prisma.$transaction(async (transaction) => {
    const createdUser = await transaction.user.create({
      data: {
        full_name,
        mobile_number,
        email,
        ...rest,
        user_name,

        role: {
          connect: { id: roleExists.id },
        },

        position: {
          connect: { id: positionExists.id },
        },

        created_by: {
          connect: { id: loggedInUser.user_id },
        },

        management_staff_profile: {
          create: {
            full_name,
            mobile_number,
            email,

            current_position: {
              connect: { id: positionExists.id },
            },

            current_role: {
              connect: { id: roleExists.id },
            },

            created_by: {
              connect: { id: loggedInUser.user_id },
            },
          },
        },
      },

      omit: {
        user_password: true,
      },
    });

    await transaction.user.update({
      where: {
        id: loggedInUser.user_id,
      },

      data: {
        audit_logs: {
          create: [
            {
              entity_id: createdUser.id,
              entity_name: "User",
              old_value: Prisma.JsonNull,

              new_value: {
                full_name,
                mobile_number,
                email,
                role_name: cleanRole,
                position_name: cleanPosition,
              },

              action: "CREATE",
            },
          ],
        },
      },
    });

    return createdUser;
  });

  // 7. Generate OTP after DB success
  const expirationSeconds = 5 * 60;
  const otpKey = `new_user_welcome_otp:${email}`;
  const otpValue = crypto.randomInt(100000, 1000000).toString();

  // 8. Store OTP
  await redisClient.set(otpKey, otpValue, {
    expiration: {
      type: "EX",
      value: expirationSeconds,
    },
  });

  // 9. Render email
  const templatePath = path.join(
    process.cwd(),
    "src/templates/create_user_email_verify.ejs",
  );

  const html = await ejs.renderFile(templatePath, {
    name: full_name,
    OTP: otpValue,
    expirationMinutes: expirationSeconds / 60,
    year: new Date().getFullYear(),
  });

  // 10. Send email
  try {
    await transporter.sendMail({
      from: `"${envVars.EMAIL_SENDER_NAME}" <${envVars.EMAIL_SENDER}>`,
      to: email,
      subject: "Welcome To SONAMONIDER PATHSHALA. Verify Your Email Address",
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
const changePassword = async (
  payload: TChangePasswordPayload,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { full_name, mobile_number, current_password, new_password } = payload;
  const user = await prisma.user.findUnique({
    where: {
      user_full_name_mobile_unique: {
        full_name,
        mobile_number,
      },
    },
    select: {
      id: true,
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
                entity_name: "User",
                old_value: Prisma.JsonNull,
                new_value: { password_changed: true },
                action: "UPDATE",
              },
            ],
          },
        },
      });
    },
    {
      timeout: 15000,
    },
  );
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
      subject: "SONAMONIDER PATHSHALA Password Changed Successfully",
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

// FORGET PASSWORD
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
      subject: "SONAMONIDER PATHSHALA Password Reset Verification Code",
      html,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send email.";
    throw new AppError(message, StatusCodes.BAD_REQUEST);
  }
};

// PROMOTE USER ROLE POSITION
const promoteUserRolePosition = async (
  payload: TPromoteUserRolePositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { full_name, mobile_number, position_name, role_name } = payload;
  const cleanPosition = position_name.trim().toUpperCase();
  const cleanRole = role_name.trim().toUpperCase();

    // 1. Verify that the requested master role exists
  const existingRole = await prisma.userRole.findUnique({
    where: { role_name: cleanRole },
    select: { id: true },
  });

  if (!existingRole) {
    throw new AppError(
      `Your provided role : ${cleanRole} does not exist.`,
      StatusCodes.NOT_FOUND,
    );
  }

  // 2. Verify that the role-position pair is valid using your helper function
  const positionExists = await checkRolePositionPair({
    role_name: cleanRole,
    position_name: cleanPosition,
  });

  // 3. Fetch the target user and their management profile to check current values
  const targetStaff = await prisma.user.findUnique({
    where: {
      user_full_name_mobile_unique: {
        full_name,
        mobile_number,
      },
    },
    select: {
      id: true,
      role: { select: { role_name: true } },
      position: { select: { position_name: true } },
      management_staff_profile: {
        select: {
          id: true,
          current_role: { select: { role_name: true } },
          current_position: { select: { position_name: true } },
        },
      },
    },
  });

  if (!targetStaff) {
    throw new AppError(
      "The requested user does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  // 4. Compare existing user role position with the provided role position
  if(targetStaff.role?.role_name === cleanRole && targetStaff.position?.position_name === cleanPosition){
    throw new AppError("User already occupy the provided role and position", StatusCodes.CONFLICT)
  }
  // 5. Execute the database changes within a safe transaction block
  return prisma.$transaction(
    async (transaction) => {
      if (!targetStaff.management_staff_profile) {
        throw new AppError(
          "The requested user's management staff profile does not exist.",
          StatusCodes.NOT_FOUND,
        );
      }

       // Direct updates on the user and profile references (No PromotionHistory entries created)
      const updatedUser = await transaction.user.update({
        where: { id: targetStaff.id },

        data: {
          updated_by: {
            connect: { id: loggedInUser.user_id },
          },
          role: {
            connect: { id: existingRole.id },
          },
          position: {
            connect: { id: positionExists.id },
          },

          management_staff_profile: {
            update: {
              current_role: {
                connect: { id: existingRole.id },
              },
              roles: {
                connect: { id: existingRole.id },
              },
              positions: {
                connect: { id: positionExists.id },
              },
              current_position: {
                connect: { id: positionExists.id },
              },
              updated_by: {
                connect: { id: loggedInUser.user_id },
              },
            },
          },
        },
        omit: { user_password: true },
      });

      // Write precise Audit Logs mapping back to the Admin who made the change
      await transaction.user.update({
        where: { id: loggedInUser.user_id },
        data: {
          audit_logs: {
            create: [
              {
                entity_id: targetStaff.id,
                entity_name: "User",
                old_value: {
                  role: targetStaff.role?.role_name ?? null,
                  position: targetStaff.position?.position_name ?? null,
                },
                new_value: {
                  role: cleanRole,
                  position: cleanPosition,
                },
                action: "UPDATE",
              },
              {
                entity_id: targetStaff.management_staff_profile?.id,
                entity_name: "ManagementStaff",
                old_value: {
                  current_role:
                    targetStaff.management_staff_profile.current_role ?? null,
                  current_position:
                    targetStaff.management_staff_profile.current_position ??
                    null,
                },
                new_value: {
                  current_role: cleanRole,
                  current_position: cleanPosition,
                },
                action: "UPDATE",
              },
            ],
          },
        },
      });

       // 5. Invalidate the memory caches after a successful transaction complete
      clearCacheRoles();
      clearCachePositions();
      return updatedUser;
    },
    {
      timeout: 8000,
    },
  );
};

// CHANGE USER POSITION
const changeUserPosition = async (
  payload: TChangeUserPositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { full_name, mobile_number, position_name } = payload;
  const cleanPosition = position_name.trim().toUpperCase();

  const positionExists = await findPositionExistence(cleanPosition);

  if (!positionExists) {
    throw new AppError(
      `Provided Position: ${position_name} is not a valid position`,
      StatusCodes.NOT_FOUND,
    );
  }

  const targetStaff = await prisma.user.findUnique({
    where: {
      user_full_name_mobile_unique: {
        full_name,
        mobile_number,
      },
    },
    select: {
      id: true,
      position: { select: { position_name: true } },
      role: { select: { role_name: true } },
      management_staff_profile: {
        select: {
          id: true,
          current_position: { select: { position_name: true } },
          current_role: { select: { role_name: true } },
          positions: { select: { position_name: true } },
          roles: { select: { role_name: true } },
        },
      },
    },
  });

  if (!targetStaff || !targetStaff.role || !targetStaff.role.role_name) {
    throw new AppError(
      "The requested user does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  if (!targetStaff.management_staff_profile) {
    throw new AppError(
      "The requested user's management staff profile does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const currentRoleName = targetStaff.role.role_name;

  await checkRolePositionPair({
    role_name: currentRoleName,
    position_name: cleanPosition,
  });
  const previousPositions = targetStaff.management_staff_profile.positions.map(
    (position) => position.position_name,
  );

  return prisma.$transaction(async (transaction) => {

  if (!targetStaff.management_staff_profile) {
    throw new AppError(
      "The requested user's management staff profile does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }
    const changedStaff = await transaction.user.update({
      where: { id: targetStaff.id },
      data: {
        updated_by: {
          connect: { id: loggedInUser.user_id },
        },
        position: {
          connect: { id: positionExists.id },
        },
        management_staff_profile: {
          update: {
            positions: {
              connect: { id: positionExists.id },
            },
            current_position: {
              connect: { id: positionExists.id },
            },
            updated_by: {
              connect: { id: loggedInUser.user_id },
            },
          },
        },
      },
      omit: { user_password: true },
    });

    await transaction.user.update({
      where: { id: loggedInUser.user_id },
      data: {
        audit_logs: {
          create: [
            {
              entity_id: targetStaff.management_staff_profile.id,
              entity_name: "ManagementStaff",
              old_value: {
                current_position:
                  targetStaff.management_staff_profile.current_position?.position_name ?? null,
                positions: previousPositions,
              },
              new_value: {
                current_position: cleanPosition,
                positions: [...previousPositions, cleanPosition],
              },
              action: "UPDATE",
            },
            {
              entity_id: targetStaff.id,
              entity_name: "User",
              old_value: {
                position: targetStaff.position?.position_name ?? null,
              },
              new_value: { position: cleanPosition },
              action: "UPDATE",
            },
          ],
        },
      },
    });

    return changedStaff;
  });
};
export const userServices = {
  createUser,
  changePassword,
  forgetPassword,
  promoteUserRolePosition,
  changeUserPosition,
};
