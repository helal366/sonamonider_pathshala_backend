import { StatusCodes } from "http-status-codes";
import { findPositionExistence } from "../../helperFunctions/cachedData/cache_positions";
import { findRoleExistence } from "../../helperFunctions/cachedData/cache_roles";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { userHelperFunction } from "./user.helper.function";
import { TCleanRolesUserCreation } from "./user.interface";
import { TUserCreateZodSchema } from "./user.zodValidation";
import { prisma } from "../../lib/prisma";
import { Prisma } from "#db-client";
import { issueOtpAndSendEmail } from "../email/email.helper.function";
import { redisClient } from "../../lib/redis";
import crypto from "crypto";
// ======================================
// CREATE USER SERVICE LAYER
// ======================================
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

  const cleanRole = role_name.trim().toUpperCase() as TCleanRolesUserCreation;
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
              created_by_id: loggedInUser.user_id,
            },
          });
        }
        // ======================
        // STUDENT CREATION
        // ======================
        if (cleanRole === "STUDENT" && subProfileId) {
          // MAKE STUDENT REQUIREMENTS PAYLOAD
          const studentsRequirementPayload = {
            transaction,
            active_class_id: payload.active_class_id,
            year_name: payload.year_name,
            shift_name: payload.shift_name,
            roll_number: payload.roll_number,
            quranic_class_name: payload.quranic_class_name,
            quranic_class_period_ids: payload.quranic_class_period_ids,
          };
          // CHECK ALL REQUIREMENTS
          const {
            activeClassID,
            academicStartDate,
            academicEndDate,
            academicYear,
            existingShift,
            rollNumber,
            existingQuranicClass,
            quranicClassPeriodIDs,
          } = await userHelperFunction.checkStudentCreationRequirements(
            studentsRequirementPayload,
          );

          const classHistory = await transaction.classHistory.create({
            data: {
              student: { connect: { id: subProfileId } },
              class: { connect: { id: activeClassID } },
              academic_year: { connect: { id: academicYear.id } },
              shift: { connect: { id: existingShift?.id } },
              roll_number: rollNumber,
              start_date: academicStartDate,
              end_date: academicEndDate,
              quranic_class: { connect: { id: existingQuranicClass.id } },
              class_history_quranic_periods: {
                create: 
                  quranicClassPeriodIDs.map((id:string)=>({
                    quranic_class_period: {connect: {id}}
                  }))                
              },
              created_by: { connect: { id: loggedInUser.user_id } },
            },
          });

          auditRecords.push({
            entity_id: classHistory.id,
            entity_name: "classHistory",
            old_value: Prisma.JsonNull,
            new_value: {
              class_id: activeClassID,
              start_date: academicStartDate.toISOString(),
              end_date: academicEndDate.toISOString(),
              quranic_class_id: existingQuranicClass.id,
              quranic_class_period_ids: quranicClassPeriodIDs
            },
            action: "CREATE",
            changed_by_id: loggedInUser.user_id,
          });
        }
        // Add additional tracking metadata audit line item
        auditRecords.push({
          entity_id: subProfileId,
          entity_name: "promotionHistory",
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
            user_name,
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
  createUser,
};
