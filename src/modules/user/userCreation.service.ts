import { StatusCodes } from "http-status-codes";
import { findPositionExistence } from "../../helperFunctions/cachedData/cache_positions";
import { findRoleExistence } from "../../helperFunctions/cachedData/cache_roles";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { userHelperFunction } from "./user.helper.function";
import { TCleanRole } from "./user.interface";
import { TUserCreateZodSchema } from "./user.zod.validation";
import { prisma } from "../../lib/prisma";
import { Prisma } from "#db-client";
import { issueOtpAndSendEmail } from "../email/email.helper.function";
import { redisClient } from "../../lib/redis";
import crypto from "crypto";

// CREATE USER SERVICE LAYER
const createUser = async (
  payload: TUserCreateZodSchema,
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

  const cleanRole = role_name.trim().toUpperCase() as TCleanRole;
  const cleanPosition = position_name.trim().toUpperCase();
  const effectiveJoiningDate = new Date(joining_date);

  // 1. Check the role and position are authorized to create or not.
  // Called helper function
  userHelperFunction.userCreationRolePostionCheck(cleanRole, cleanPosition);

  //  2. Validate role
  const roleExists = await findRoleExistence(cleanRole);

  // 3. Validate role-position relationship
  const positionExists = await findPositionExistence(cleanPosition);

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
    userCount === 0 ? mobile_number : `${mobile_number}-${userCount}`;

  // 6. Create DB records and deliver the verification email atomically.
  const otpKey = `new_user_welcome_otp:${email}`;
  let otpIssued = false;
  const newUser = await prisma
    .$transaction(
      async (transaction) => {
        // CHECK THE CLASS IS ACTIVE OR NOT
        const classCheck = await transaction.class.findUnique({
          where: { id: payload.active_class_id },
          select: {
            is_active_class: true
          }
        });
        if (!classCheck) {
          throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
        };
        if(!classCheck.is_active_class){
          throw new AppError(`The class is not active.`, StatusCodes.BAD_REQUEST)
        }
        // CALLING THE HELPER FUNCTION HERE
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
        const subProfileId = userHelperFunction.findSubProfileId({
          cleanRole,
          createdUser,
          targetEntityName,
        });

        const buildAuditRecordsPayload = {
          userId: createdUser.id,
          subProfileId,
          targetEntityName,
          full_name,
          mobile_number,
          email,
          cleanRole,
          cleanPosition,
          roleId: roleExists.id,
          positionId: positionExists.id,
          loggedInUserId: loggedInUser.user_id,
        };
        // Initialized array sets for scalable audit insertions
        const auditRecords: Prisma.AuditLogCreateManyInput[] =
          userHelperFunction.buildInitialAuditRecords(buildAuditRecordsPayload);

        // Seed Promotion History blocks (Only valid for Staff profiles)
        if (cleanRole === "MANAGEMENT" || cleanRole === "ACADEMIC") {
          await transaction.promotionHistory.create({
            data: {
              management_staff_id:
                cleanRole === "MANAGEMENT" ? subProfileId : undefined,
              academic_staff_id:
                cleanRole === "ACADEMIC" ? subProfileId : undefined,
              position_id: positionExists.id,
              role_id: roleExists.id,
              start_date: effectiveJoiningDate,
              created_by_id: loggedInUser.user_id
            },
          });
        }

        // 🌟 ADD THIS: SEED CLASS TIMELINE HISTORY FOR NEW STUDENTS
        if (cleanRole === "STUDENT" && subProfileId) {
          const academicYearName = await transaction.academicYear.findUnique({
            where: { academic_year_name: payload.year_name },
            select: { id: true },
          });

          if (!academicYearName) {
            throw new AppError(
              `Provided Academic Year ${payload.year_name} not found`,
              StatusCodes.NOT_FOUND,
            );
          }
          const cleanShiftName = payload.shift_name?.trim().toUpperCase();
          const existingShift = await transaction.shift.findUnique({
            where: { shift_name: cleanShiftName },
            select: { id: true, shift_name: true },
          });
          if (!existingShift) {
            throw new AppError(
              `Provided shift ${cleanShiftName} is not found.`,
              StatusCodes.NOT_FOUND,
            );
          }
          if (!payload.roll_number) {
            throw new AppError(
              "Roll number is required.",
              StatusCodes.NOT_FOUND,
            );
          }
          const classHistory = await transaction.classHistory.create({
            data: {
              student: { connect: { id: subProfileId } },
              class: { connect: { id: payload.active_class_id! } },
              academic_year: { connect: { id: academicYearName.id } },
              shift: { connect: { id: existingShift?.id } },
              roll_number: payload.roll_number,
              start_date: new Date(),
              created_by: { connect: { id: loggedInUser.user_id } },
            },
          });

          auditRecords.push({
            entity_id: classHistory.id,
            entity_name: "ClassHistory",
            old_value: Prisma.JsonNull,
            new_value: {
              class_id: payload.active_class_id,
              start_date: new Date().toISOString(),
              action: "INITIAL_ENROLLMENT",
            },
            action: "CREATE",
            changed_by_id: loggedInUser.user_id,
          });
        }
        // Add additional tracking metadata audit line item
        auditRecords.push({
          entity_id: subProfileId,
          entity_name: "PromotionHistory",
          old_value: Prisma.JsonNull,
          new_value: {
            role_id: roleExists.id,
            position_id: positionExists.id,
            start_date: effectiveJoiningDate.toISOString(),
            end_date: null,
          },
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

export const createUserServices = {
    createUser
}