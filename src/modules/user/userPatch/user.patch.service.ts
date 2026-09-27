import { ActiveStatus, BloodGroup, Gender, Prisma, Religion } from "#db-client";
import path from "path";
import ejs from "ejs";
import { envVars } from "../../../config/index.js";
import { AppError } from "../../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../../lib/prisma.js";
import bcrypt from "bcryptjs";
import { transporter } from "../../../lib/nodemailer.js";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../../commonInterfaces/interfaces.js";
import { UserPatchField, UserPatchValue } from "./user.patch.interface.js";

// ============================================================
// UPDATE USER FIELD
// ============================================================
const updateUserField = async (
  user_id: string,
  field: UserPatchField,
  value: UserPatchValue,
  loggedInUser: TLoggedInUser,
) => {
  return prisma.$transaction(async (transaction) => {
    // CHECK TARGET USER
    const targetUser = await transaction.user.findUnique({
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
        is_mobile_verified: true,

        email: true,
        is_email_verified: true,

        user_name: true,
        user_password: true,

        active_status: true,
        is_deleted: true,
      },
    });

    if (!targetUser) {
      throw new AppError("User not found.", StatusCodes.NOT_FOUND);
    }

    // UPDATE USER FIELD
    const updated = await transaction.user.update({
      where: { id: user_id },
      data: {
        [field]: value,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    // CREATE AUDIT LOG
    await transaction.auditLog.create({
      data: {
        entity_id: user_id,
        entity_name: "User",
        old_value: {
          user_id,
          [field]: targetUser[field as keyof typeof targetUser],
        },
        new_value: {
          user_id,
          [field]: value,
        },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
      },
    });

    return updated;
  });
};
// ============================================================
// UPDATE FULL NAME
// ============================================================
export const updateUserFullNameService = async (
  userId: string,
  fullName: string,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "full_name", fullName, loggedInUser);

// ============================================================
// UPDATE GENDER
// ============================================================

export const updateUserGenderService = async (
  userId: string,
  gender: Gender,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "gender", gender, loggedInUser);

// ============================================================
// UPDATE BLOOD GROUP
// ============================================================

export const updateUserBloodGroupService = async (
  userId: string,
  bloodGroup: BloodGroup,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "blood_group", bloodGroup, loggedInUser);

// ============================================================
// UPDATE DATE OF BIRTH
// ============================================================

export const updateUserDateOfBirthService = async (
  userId: string,
  dateOfBirth: Date,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "date_of_birth", dateOfBirth, loggedInUser);

// ============================================================
// UPDATE HEIGHT
// ============================================================

export const updateUserHeightService = async (
  userId: string,
  heightInCm: number,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "height_in_cm", heightInCm, loggedInUser);

// ============================================================
// UPDATE WEIGHT
// ============================================================

export const updateUserWeightService = async (
  userId: string,
  weightInKg: number,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "weight_in_kg", weightInKg, loggedInUser);

// ============================================================
// UPDATE RELIGION
// ============================================================

export const updateUserReligionService = async (
  userId: string,
  religion: Religion,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "religion", religion, loggedInUser);

// ============================================================
// UPDATE NATIONALITY
// ============================================================

export const updateUserNationalityService = async (
  userId: string,
  nationality: string,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "nationality", nationality, loggedInUser);

// ============================================================
// UPDATE BIRTH CERTIFICATE NUMBER
// ============================================================

export const updateUserBirthCertificateNumberService = async (
  userId: string,
  birthCertificateNumber: string,
  loggedInUser: TLoggedInUser,
) =>
  updateUserField(
    userId,
    "birth_certificate_number",
    birthCertificateNumber,
    loggedInUser,
  );

// ============================================================
// UPDATE NID NUMBER
// ============================================================

export const updateUserNidNumberService = async (
  userId: string,
  nidNumber: string,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "nid_number", nidNumber, loggedInUser);

// ============================================================
// UPDATE PHOTO URL
// ============================================================

export const updateUserPhotoUrlService = async (
  userId: string,
  photoUrl: string,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "photo_url", photoUrl, loggedInUser);

// ============================================================
// UPDATE MOBILE NUMBER
// ============================================================
export const updateUserMobileNumberService = async (
  userId: string,
  mobileNumber: string,
  loggedInUser: TLoggedInUser,
) => updateUserField(userId, "mobile_number", mobileNumber, loggedInUser);

// ============================================================
// UPDATE EMAIL NUMBER
// ============================================================

export const updateUserEmailService = async (
  userId: string,
  email: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true },
    });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    // CHECK EMAIL ALREADY EXISTS
    const existingUser = await transaction.user.findFirst({
      where: { email, NOT: { id: userId } },
      select: { id: true },
    });

    if (existingUser) {
      throw new AppError("Email is already in use.", 409);
    }
    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: { email, updated_by: { connect: { id: loggedInUser.user_id } } },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: { email: user.email },
        new_value: { email: updatedUser.email },
        changed_by: { connect: { id: loggedInUser.user_id } },
      },
    });
    return updatedUser;
  });
};

// ============================================================
// UPDATE MOBILE VERIFIED STATUS
// ============================================================
export const updateUserMobileVerifiedService = async (
  userId: string,
  isMobileVerified: boolean,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: { id: userId },
      select: { id: true, is_mobile_verified: true },
    });
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        is_mobile_verified: isMobileVerified,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: { is_mobile_verified: user.is_mobile_verified },
        new_value: { is_mobile_verified: updatedUser.is_mobile_verified },
        changed_by: { connect: { id: loggedInUser.user_id } },
      },
    });
    return updatedUser;
  });
};

// ============================================================
// UPDATE EMAIL VERIFIED STATUS
// ============================================================
export const updateEmialVerifiedService = async (
  userId: string,
  isEmailVerified: boolean,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: { id: userId },
      select: { id: true, is_email_verified: true },
    });
    if (!user) {
      throw new AppError("User not found.", 404);
    }
    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        is_email_verified: isEmailVerified,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: { is_email_verified: user.is_email_verified },
        new_value: { is_email_verified: updatedUser.is_email_verified },
        changed_by: { connect: { id: loggedInUser.user_id } },
      },
    });
    return updatedUser;
  });
};

// ============================================================
// UPDATE USER ACTIVE STATUS SERVICE
// ============================================================
export const updateUserActiveStatusService = async (
  userId: string,
  activeStatus: ActiveStatus,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    // FIND USER
    const user = await transaction.user.findUnique({
      where: { id: userId },
      select: { id: true, active_status: true },
    });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    // UPDATE ACTIVE STATUS
    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        active_status: activeStatus,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    // CREATE AUDIT LOG
    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: { active_status: user.active_status },
        new_value: { active_status: updatedUser.active_status },
        changed_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    return updatedUser;
  });
};

// ============================================================
// UPDATE USER DELETED STATUS
// ============================================================
export const updateUserDeletedStatusService = async (
  userId: string,
  isDeleted: boolean,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    // FIND USER
    const user = await transaction.user.findUnique({
      where: { id: userId },
      select: { id: true, is_deleted: true },
    });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    // UPDATE DELETED STATUS
    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        is_deleted: isDeleted,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    // CREATE AUDIT LOG
    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: { is_deleted: user.is_deleted },
        new_value: { is_deleted: updatedUser.is_deleted },
        changed_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    return updatedUser;
  });
};

// ============================================================
// UPDATE USER NAME SERVICE
// ============================================================
export const updateUserNameService = async (
  userId: string,
  userName: string,
  loggedInUser: TLoggedInUser,
) => {
  return await prisma.$transaction(async (transaction) => {
    // FIND USER
    const user = await transaction.user.findUnique({
      where: { id: userId },
      select: { id: true, user_name: true, full_name: true, email: true },
    });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    // UPDATE USER NAME
    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        user_name: userName,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    // CREATE AUDIT LOG
    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: { user_name: user.user_name },
        new_value: { user_name: updatedUser.user_name },
        changed_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    if (user.email) {
      const templatePath = path.join(
        process.cwd(),
        "src/templates/update_user_name_by_superadmin.ejs",
      );

      const html = await ejs.renderFile(templatePath, {
        name: user.full_name,
        updated_user_name: updatedUser.user_name,
        updated_by: envVars.SUPER_ADMIN_NAME,
        updated_by_position: loggedInUser.position_name, //  "PRINCIPAL"
        year: new Date().getFullYear(),
      });
      try {
        await transporter.sendMail({
          from: `"${envVars.EMAIL_SENDER_NAME}" <${envVars.EMAIL_SENDER}>`,
          to: user.email,
          subject: "Your SONAMONIDER PATHSHALA User Name is Updated.",
          html,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to send email.";
        throw new AppError(message, StatusCodes.BAD_REQUEST);
      }
    }

    return updatedUser;
  });
};

// ============================================================
// UPDATE USER PASSWORD SERVICE
// ============================================================
export const updateUserPasswordService = async (
  userId: string,
  userPassword: string,
  loggedInUser: TLoggedInUser,
) => {
  return await prisma.$transaction(async (transaction) => {
    // FIND USER
    const user = await transaction.user.findUnique({
      where: { id: userId },
      select: { id: true, full_name: true, email: true },
    });
    if (!user) {
      throw new AppError("User not found.", 404);
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(
      userPassword,
      Number(envVars.BCRYPT_SALT_ROUND),
    );

    // UPDATE USER PASSWORD
    await transaction.user.update({
      where: { id: userId },
      data: {
        user_password: hashedPassword,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    // CREATE AUDIT LOG
    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: { user_password: "[REDACTED]" },
        new_value: { user_password: "[REDACTED]" },
        changed_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    // SEND EMAIL
    if (user.email) {
      const templatePath = path.join(
        process.cwd(),
        "src/templates/update_user_name_by_superadmin.ejs",
      );

      const html = await ejs.renderFile(templatePath, {
        name: user.full_name,
        updated_user_password: userPassword,
        updated_by: envVars.SUPER_ADMIN_NAME,
        updated_by_position: loggedInUser.position_name, //  "PRINCIPAL"
        year: new Date().getFullYear(),
      });
      try {
        await transporter.sendMail({
          from: `"${envVars.EMAIL_SENDER_NAME}" <${envVars.EMAIL_SENDER}>`,
          to: user.email,
          subject: "Your SONAMONIDER PATHSHALA User Name is Updated.",
          html,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to send email.";
        throw new AppError(message, StatusCodes.BAD_REQUEST);
      }
    }
    // DO NOT RETURN THE PASSWORD OR PASSWORD HASH
    return { id: user.id, message: "User password updated successfully." };
  });
};
