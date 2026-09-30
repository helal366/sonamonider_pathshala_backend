import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { userHelperFunction } from "./user.helper.function.js";
import { prisma } from "../../lib/prisma.js";
import crypto from "crypto";
import { redisClient } from "../../lib/redis.js";
import bcrypt from "bcryptjs";
import { envVars } from "../../config/index.js";
import {
  clearCacheRoles,
  findRoleExistence,
} from "../../helperFunctions/cachedData/cache_roles.js";
import {
  checkRolePositionPair,
  clearCachePositions,
  findPositionExistence,
} from "../../helperFunctions/cachedData/cache_positions.js";
import {
  TChangePasswordPayload,
  TChangeUserPositionZodSchema,
  TPromoteUserRolePositionZodSchema,
  TForgetPasswordPayload,
  TUserCreatePayload,
  TUpdateSingleUserFieldAdminZodSchema,
  TUpdateSingleUserFieldSuperAdminZodSchema,
  TUpdateUserNameZodSchema,
  TUpdateUserPasswordZodSchema,
} from "./user.zod.validation.js";
import { TLoggedInUser } from "../../commonInterfaces/interfaces.js";
import { emailServices } from "../email/email.service.js";
import {
  issueOtpAndSendEmail,
  sendVerificationResultEmail,
} from "../email/email.helper.function.js";

const privilegedRoleRank: Record<string, number> = {
  TEACHER_ADMIN: 1,
  ADMIN: 2,
  SUPER_ADMIN: 3,
};

// CREATE USER SERVICE LAYER
const createUser = async (
  payload: TUserCreatePayload,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  //  Extract + normalize
  const {
    full_name,
    mobile_number,
    email,
    position_name,
    role_name,
    joining_date,
    ...rest
  } = payload;

  const cleanRole = role_name.trim().toUpperCase();
  const cleanPosition = position_name.trim().toUpperCase();
  const effectiveJoiningDate = new Date(joining_date);

  // 1. Check the role and position are authorized to create or not.
  // Called helper function
  userHelperFunction.userCreationRolePostionCheck(cleanRole, cleanPosition);

  //  2. Validate role
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

  // 6. Create DB records and deliver the verification email atomically.
  const otpKey = `new_user_welcome_otp:${email}`;
  let otpIssued = false;
  const newUser = await prisma
    .$transaction(
      async (transaction) => {
        // 💡 CALLING THE HELPER FUNCTION HERE
        const { profileData, targetEntityName } =
          userHelperFunction.buildDynamicProfileData({
            cleanRole,
            full_name,
            mobile_number,
            email,
            positionId: positionExists.id,
            roleId: roleExists.id,
            loggedInUserId: loggedInUser.user_id,
            active_class_id: payload.active_class_id,
          });
        // A) Create the User and nested ManagementStaff profile
        const createdUser = await transaction.user.create({
          data: {
            full_name,
            mobile_number,
            email,
            user_name,
            ...rest,
            ...profileData,
            role: {
              connect: { id: roleExists.id },
            },

            position: {
              connect: { id: positionExists.id },
            },

            created_by: {
              connect: { id: loggedInUser.user_id },
            },
          },
          include: {
            management_staff_profile: true,
            academic_staff_profile: true,
            student_profile: true,
            governing_body_profile: true,
          },
          omit: {
            user_password: true,
          },
        });

        // Extract specific entity profile ID for audit log linking rules
        let subProfileId = "";
        if (cleanRole === "MANAGEMENT")
          subProfileId = createdUser.management_staff_profile?.id || "";
        if (cleanRole === "ACADEMIC")
          subProfileId = createdUser.academic_staff_profile?.id || "";
        if (cleanRole === "STUDENT")
          subProfileId = createdUser.student_profile?.id || "";
        if (cleanRole === "GOVERNING_BODY")
          subProfileId = createdUser.governing_body_profile?.id || "";

        if (!subProfileId) {
          throw new AppError(
            `Failed to initialize associated ${targetEntityName} profile record during onboarding.`,
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        };

        // Initialized array sets for scalable audit insertions
        const auditRecords: Prisma.AuditLogCreateManyInput[] = [
        {
          entity_id: createdUser.id,
          entity_name: "User",
          old_value: Prisma.JsonNull,
          new_value: { full_name, mobile_number, email, role_name: cleanRole, position_name: cleanPosition },
          action: "CREATE",
          changed_by_id: loggedInUser.user_id,
        },
        {
          entity_id: subProfileId,
          entity_name: targetEntityName,
          old_value: Prisma.JsonNull,
          new_value: { full_name, mobile_number, email, role_id: roleExists.id, position_id: positionExists.id },
          action: "CREATE",
          changed_by_id: loggedInUser.user_id,
        },
      ];

      // Seed Promotion History blocks (Only valid for Staff profiles)
      if(cleanRole === "MANAGEMENT" || cleanRole === "ACADEMIC"){
        await transaction.promotionHistory.create({
          data: {
            management_staff_id: cleanRole === "MANAGEMENT" ? subProfileId : undefined,
            academic_staff_id: cleanRole === "ACADEMIC" ? subProfileId : undefined,
            position_id: positionExists.id,
            role_id: roleExists.id,
            start_date: effectiveJoiningDate,
          }
        })
      }

      // Add additional tracking metadata audit line item
        auditRecords.push({
          entity_id: subProfileId,
          entity_name: "PromotionHistory",
          old_value: Prisma.JsonNull,
          new_value: { role_id: roleExists.id, position_id: positionExists.id, start_date: effectiveJoiningDate.toISOString(), end_date: null },
          action: "CREATE",
          changed_by_id: loggedInUser.user_id,
        });
        if (!createdUser.management_staff_profile) {
          throw new AppError(
            "Failed to initialize management staff profile during onboarding.",
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }

        // Bulk resolve tracking inputs
      await transaction.auditLog.createMany({ data: auditRecords });
      
        // Async email notification verification rules distribution step
        const expirationSeconds = 5 * 60;
        const otpValue = crypto.randomInt(100000, 1000000).toString();
        await issueOtpAndSendEmail({
          key: otpKey,
          otp: otpValue,
          expirationSeconds,
          to: email,
          templateName: "create_user_email_verify.ejs",
          subject:
            "Welcome To SONAMONIDER PATHSHALA. Verify Your Email Address",
          templateData: {
            name: full_name,
            user_name: createdUser.user_name ?? user_name,
            OTP: otpValue,
            year: new Date().getFullYear(),
          },
        });
        otpIssued = true;

        return createdUser;
      },
      { timeout: 30000 },
    )
    .catch(async (error: unknown) => {
      if (otpIssued) {
        await redisClient.del(otpKey).catch(() => undefined);
      }
      throw error;
    });

  return { user: newUser, email_sent: true };
};

// CHANGE PASSWORD SERVICE LAYER
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
                entity_name: "User",
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

// FORGET PASSWORD SERVICE LAYER
const forgetPassword = async ({ email }: TForgetPasswordPayload) => {
  await emailServices.sendForgetPasswordOtp({ email });
};

// PROMOTE USER ROLE POSITION SERVICE LAYER
const promoteUserRolePosition = async (
  payload: TPromoteUserRolePositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { full_name, mobile_number, position_name, role_name, promoted_date } =
    payload;
  const cleanPosition = position_name.trim().toUpperCase();
  const cleanRole = role_name.trim().toUpperCase();
  const effectivePromotedDate = new Date(promoted_date);
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
      role_id: true,
      position_id: true,
      current_role: { select: { role_name: true } },
      current_position: { select: { position_name: true } },
      management_staff_profile: {
        select: {
          id: true,
          current_role_id: true,
          current_position_id: true,
          promotion_history: {
            where: { end_date: null },
            select: { id: true },
            take: 1,
          },
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
  if (
    targetStaff.current_role?.role_name === cleanRole &&
    targetStaff.current_position?.position_name === cleanPosition
  ) {
    throw new AppError(
      "User already occupy the provided role and position",
      StatusCodes.CONFLICT,
    );
  }
  // 5. Execute the database changes within a safe transaction block
  const result = await prisma.$transaction(
    async (transaction) => {
      if (!targetStaff.management_staff_profile) {
        throw new AppError(
          "The requested user's management staff profile does not exist.",
          StatusCodes.NOT_FOUND,
        );
      }
      if (targetStaff.management_staff_profile.promotion_history.length === 0) {
        throw new AppError(
          "Active promotion history not found.",
          StatusCodes.NOT_FOUND,
        );
      }

      const activeHistoryID =
        targetStaff.management_staff_profile.promotion_history[0]?.id;
      // A) Terminate previous historical entries if a prior valid history tracking line exists
      if (activeHistoryID) {
        await transaction.promotionHistory.update({
          where: {
            id: activeHistoryID,
          },
          data: {
            end_date: effectivePromotedDate,
          },
        });
      }

      // B) Open the fresh new career path tracking timeline entry
      await transaction.promotionHistory.create({
        data: {
          management_staff_id: targetStaff.management_staff_profile.id,
          position_id: positionExists.id,
          role_id: existingRole.id,
          start_date: effectivePromotedDate,
        },
      });
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

      // D) Enforce business changes logging inside the general system audit tracker
      await transaction.auditLog.createMany({
        data: [
          {
            entity_id: targetStaff.id,
            entity_name: "User",
            old_value: {
              role: targetStaff.current_role?.role_name ?? null,
              position: targetStaff.current_position?.position_name ?? null,
            },
            new_value: {
              role: cleanRole,
              position: cleanPosition,
            },
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
          },
          {
            entity_id: targetStaff.management_staff_profile.id,
            entity_name: "ManagementStaff",
            old_value: {
              role_id:
                targetStaff.management_staff_profile.current_role_id ?? null,
              position_id:
                targetStaff.management_staff_profile.current_position_id ??
                null,
            },
            new_value: {
              role_id: existingRole.id,
              position_id: positionExists.id,
            },
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
          },
        ],
      });
      return updatedUser;
    },
    {
      timeout: 10000,
    },
    // 5. Invalidate the memory caches after a successful transaction complete
  );
  clearCacheRoles();
  clearCachePositions();
  return result;
};

// CHANGE USER POSITION SERVICE LAYER
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

  await checkRolePositionPair({
    role_name: currentRoleName,
    position_name: cleanPosition,
  });

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
              entity_name: "User",
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

// UPDATE SINGLE USER FIELD ADMIN SERVICE LAYER
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
            entity_name: "ManagementStaff",
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
        entity_name: "User",
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

// UPDATE SINGLE USER FIELD SUPER ADMIN SERVICE LAYER
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
      entity_name: "User",
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
          entity_name: "User",
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
          entity_name: "User",
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
  createUser,
  changePassword,
  forgetPassword,
  promoteUserRolePosition,
  changeUserPosition,
  updateSingleUserFieldAdmin,
  updateSingleUserFieldSuperAdmin,
  updateUserName,
  updateUserPassword,
};
