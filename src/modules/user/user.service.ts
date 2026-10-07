import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/index.js";
import { findPositionExistence } from "../../helperFunctions/cachedData/cache_positions.js";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { emailServices } from "../email/email.service.js";
import { sendVerificationResultEmail } from "../email/email.helper.function.js";
import {
  TChangePasswordPayload,
  TChangeUserPositionZodSchema,
  TForgetPasswordPayload,
  TUpdateSingleUserFieldAdminZodSchema,
  TUpdateSingleUserFieldSuperAdminZodSchema,
  TUpdateUserNameZodSchema,
  TUpdateUserPasswordZodSchema,
} from "./user.zod.validation.js";

// ==========================================
// CHANGE PASSWORD SERVICE LAYER
// ==========================================
const changePassword = async (
  payload: TChangePasswordPayload,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { current_password, new_password } = payload;
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
  const userEmail = user.email;

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
        to: userEmail,
        templateName: "change_password_success.ejs",
        subject: "SONAMONIDER PATHSHALA Password Changed Successfully",
        templateData: {
          name: user.full_name,
        },
      });
    },
    {
      timeout: 30000,
    },
  );
  return { email_sent: true };
};

// ==========================================
// FORGET PASSWORD SERVICE LAYER
// ==========================================
const forgetPassword = async ({ email }: TForgetPasswordPayload) => {
  await emailServices.sendForgetPasswordOtp({ email });
};

// ===========================================
// CHANGE USER POSITION SERVICE LAYER
// ===========================================
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
      current_position: { select: { position_name: true } },
      current_role: { select: { role_name: true } },
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

  if (
    !targetStaff ||
    !targetStaff.current_role ||
    !targetStaff.current_role.role_name
  ) {
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

  const currentRoleName = targetStaff.current_role.role_name;

  await findPositionExistence(cleanPosition);

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
              entity_name: "managementStaff",
              old_value: {
                current_position:
                  targetStaff.management_staff_profile.current_position
                    ?.position_name ?? null,
              },
              new_value: {
                current_position: cleanPosition,
              },
              action: "UPDATE",
            },
            {
              entity_id: targetStaff.id,
              entity_name: "user",
              old_value: {
                position: targetStaff.current_position?.position_name ?? null,
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

// ================================================
// UPDATE SINGLE USER FIELD ADMIN SERVICE LAYER
// ================================================
const updateSingleUserFieldAdmin = async (
  payload: TUpdateSingleUserFieldAdminZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { user_id, field, value } = payload;

  // PROTECT REQUIRED FIELD FROM NULL
  if ((field === "full_name" || field === "gender") && !value) {
    throw new AppError(
      `${field.toUpperCase()}  is required.`,
      StatusCodes.NOT_FOUND,
    );
  }

  // CHECK USER EXISTANCE
  const user = await prisma.user.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      full_name: true,
      gender: true,
      blood_group: true,
      date_of_birth: true,
      height_in_cm: true,
      weight_in_kg: true,
      religion: true,
      nationality: true,
      birth_certificate_number: true,
      nid_number: true,
      photo_url: true,
      mobile_number: true,
      email: true,
      management_staff_profile: { select: { id: true } },
    },
  });

  if (!user) {
    throw new AppError("User not found.", StatusCodes.NOT_FOUND);
  }

  const typedField = field as keyof typeof user;
  if (user.management_staff_profile && field === "email" && value === null) {
    throw new AppError(
      "A management staff profile must have an email address.",
      StatusCodes.BAD_REQUEST,
    );
  }
  const normalizedValue =
    field === "email" && typeof value === "string"
      ? value.trim().toLowerCase()
      : value;

  const updatedUser = await prisma.$transaction(async (transaction) => {
    const updated = await transaction.user.update({
      where: { id: user_id },
      data: {
        [field]: normalizedValue,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
      omit: { user_password: true },
    });

    if (user.management_staff_profile) {
      const profileId = user.management_staff_profile.id;
      if (field === "full_name") {
        await transaction.managementStaff.update({
          where: { id: profileId },
          data: {
            full_name: normalizedValue as string,
            updated_by: { connect: { id: loggedInUser.user_id } },
          },
        });
      } else if (field === "mobile_number") {
        await transaction.managementStaff.update({
          where: { id: profileId },
          data: {
            mobile_number: normalizedValue as string,
            updated_by: { connect: { id: loggedInUser.user_id } },
          },
        });
      } else if (field === "email") {
        await transaction.managementStaff.update({
          where: { id: profileId },
          data: {
            email: normalizedValue as string,
            updated_by: { connect: { id: loggedInUser.user_id } },
          },
        });
      }
      if (
        field === "full_name" ||
        field === "mobile_number" ||
        field === "email"
      ) {
        await transaction.auditLog.create({
          data: {
            entity_id: profileId,
            entity_name: "managementStaff",
            action: "UPDATE",
            changed_by: { connect: { id: loggedInUser.user_id } },
            old_value: { [field]: user[typedField] },
            new_value: { [field]: normalizedValue },
          },
        });
      }
    }

    await transaction.auditLog.create({
      data: {
        entity_id: user_id,
        entity_name: "user",
        action: "UPDATE",
        changed_by: { connect: { id: loggedInUser.user_id } },
        old_value: { [field]: user[typedField] },
        new_value: { [field]: normalizedValue },
      },
    });

    return updated;
  });

  return updatedUser;
};

// ==========================================================
// UPDATE SINGLE USER FIELD SUPER ADMIN SERVICE LAYER
// ==========================================================
const updateSingleUserFieldSuperAdmin = async (
  payload: TUpdateSingleUserFieldSuperAdminZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { user_id, field, value } = payload;
  // CHECK USER EXISTANCE
  const user = await prisma.user.findUnique({
    where: { id: user_id },
    select: {
      id: true,
      is_mobile_verified: true,
      is_email_verified: true,
      is_deleted: true,
      active_status: true,
    },
  });
  if (!user) {
    throw new AppError("User not found.", StatusCodes.NOT_FOUND);
  }

  // UPDATE USER
  const updatedUser = await prisma.user.update({
    where: { id: user_id },
    data: {
      [field]: value,
      updated_by: {
        connect: {
          id: loggedInUser.user_id,
        },
      },
    },
    omit: { user_password: true },
  });

  // CREATE AUDIT LOG
  const typedField = field as keyof typeof user;
  await prisma.auditLog.create({
    data: {
      entity_id: user_id,
      entity_name: "user",
      action: "UPDATE",
      changed_by: {
        connect: { id: loggedInUser.user_id },
      },
      old_value: {
        [field]: user[typedField],
      },
      new_value: {
        [field]: value,
      },
    },
  });

  return updatedUser;
};

// ==========================================================
// UPDATE USER NAME SERVICE LAYER
// ==========================================================
const updateUserName = async (
  payload: TUpdateUserNameZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { user_id, user_name } = payload;
  const updatedUser = await prisma.$transaction(
    async (transaction) => {
      // FIND USER
      const user = await transaction.user.findUnique({
        where: { id: user_id },
        select: { id: true, user_name: true, full_name: true, email: true },
      });
      if (!user) {
        throw new AppError("User not found.", 404);
      }
      if (!user.email) {
        throw new AppError(
          "A user email address is required to update the username.",
          StatusCodes.BAD_REQUEST,
        );
      }

      // UPDATE USER NAME
      const updatedUser = await transaction.user.update({
        where: { id: user_id },
        data: {
          user_name: user_name,
          updated_by: { connect: { id: loggedInUser.user_id } },
        },
        omit: { user_password: true },
      });

      // CREATE AUDIT LOG
      await transaction.auditLog.create({
        data: {
          entity_id: user_id,
          entity_name: "user",
          action: "UPDATE",
          old_value: { user_name: user.user_name },
          new_value: { user_name },
          changed_by: { connect: { id: loggedInUser.user_id } },
        },
      });

      await sendVerificationResultEmail({
        to: user.email,
        templateName: "update_user_name_by_superadmin.ejs",
        subject: "Your SONAMONIDER PATHSHALA User Name is Updated.",
        templateData: {
          name: user.full_name,
          updated_user_name: updatedUser.user_name ?? "",
          updated_by: envVars.SUPER_ADMIN_NAME,
          updated_by_position: loggedInUser.position_name,
        },
      });

      return {
        id: updatedUser.id,
        user_name: updatedUser.user_name,
      };
    },
    { timeout: 30000 },
  );

  return { ...updatedUser, email_sent: true };
};

// ==========================================================
// UPDATE USER PASSWORD SERVICE LAYER
// ==========================================================
const updateUserPassword = async (
  payload: TUpdateUserPasswordZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { user_id, user_password } = payload;
  const updatedUser = await prisma.$transaction(
    async (transaction) => {
      // FIND USER
      const user = await transaction.user.findUnique({
        where: { id: user_id },
        select: { id: true, full_name: true, email: true },
      });
      if (!user) {
        throw new AppError("User not found.", 404);
      }
      if (!user.email) {
        throw new AppError(
          "A user email address is required to update the password.",
          StatusCodes.BAD_REQUEST,
        );
      }

      // HASH PASSWORD
      const hashedPassword = await bcrypt.hash(
        user_password,
        Number(envVars.BCRYPT_SALT_ROUND),
      );

      // UPDATE USER PASSWORD
      await transaction.user.update({
        where: { id: user_id },
        data: {
          user_password: hashedPassword,
          updated_by: { connect: { id: loggedInUser.user_id } },
        },
      });

      // CREATE AUDIT LOG
      await transaction.auditLog.create({
        data: {
          entity_id: user_id,
          entity_name: "user",
          action: "UPDATE",
          old_value: { user_password: "[REDACTED]" },
          new_value: { user_password: "[CHANGED]" },
          changed_by: { connect: { id: loggedInUser.user_id } },
        },
      });

      await sendVerificationResultEmail({
        to: user.email,
        templateName: "update_user_password_by_super_admin.ejs",
        subject: "Your SONAMONIDER PATHSHALA Password Was Updated.",
        templateData: {
          name: user.full_name,
          updated_user_password: user_password,
          updated_by: envVars.SUPER_ADMIN_NAME,
          updated_by_position: loggedInUser.position_name,
        },
      });

      return { id: user.id, full_name: user.full_name, email: user.email };
    },
    { timeout: 30000 },
  );

  return {
    id: updatedUser.id,
    message: "User password updated successfully.",
    email_sent: true,
  };
};


export const userServices = {
  changePassword,
  forgetPassword,
  changeUserPosition,
  updateSingleUserFieldAdmin,
  updateSingleUserFieldSuperAdmin,
  updateUserName,
  updateUserPassword,
};
