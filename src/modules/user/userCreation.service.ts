import { StatusCodes } from "http-status-codes";
import { findPositionExistence } from "../../helperFunctions/cachedData/cache_positions";

import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { userHelperFunction } from "./user.helperFunction";
import { TCleanRolesUserCreation } from "./user.interface";
import { TUserCreateZodSchema } from "./user.zodValidation";
import { prisma } from "../../lib/prisma";
import { Department, Prisma, Role } from "#db-client";
import { issueOtpAndSendEmail } from "../email/email.helper.function";
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
    gender,
  } = payload;

  const cleanRole = role_name.trim().toUpperCase() as TCleanRolesUserCreation;
  const cleanPosition = position_name.trim().toUpperCase();
  const effectiveJoiningDate = new Date(`${joining_date}T00:00:00.000Z`);

  // 1. Check the role and position are authorized to create or not.
  // Called helper function
  userHelperFunction.userCreationRolePostionCheck(cleanRole, cleanPosition);

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

  // 6. Create DB records atomically.
  const otpKey = `new_user_welcome_otp:${email}`;
  const newUser = await prisma.$transaction(
    async (transaction) => {
      // MAKE STUDENT REQUIREMENTS
      let studentRequirements = undefined;
      if (cleanRole === Role.STUDENT) {
        // CHECK SECTION
        if (!payload.section) {
          throw new AppError("Section is required.", StatusCodes.NOT_FOUND);
        }

        // CHECK VERSION
        if (!payload.version) {
          throw new AppError("Version is required.", StatusCodes.NOT_FOUND);
        }
        studentRequirements =
          await userHelperFunction.checkStudentCreationRequirements({
            transaction,
            active_class_id: payload.active_class_id,
            academic_year_name: payload.academic_year_name,
            shift_name: payload.shift_name,
            roll_number: payload.roll_number,
            section: payload.section,
            version: payload.version,
            department: payload.department ?? Department.GENERAL,
            quranic_subject_name: payload.quranic_subject_name,
            quranic_period_ids: payload.quranic_period_ids,
            arabic_subject_names: payload.arabic_subject_names,
            arabic_period_ids: payload.arabic_period_ids,
          });
      }

      // CALLING THE HELPER FUNCTION HERE
      const { profileData, targetEntityName } =
        userHelperFunction.buildDynamicProfileData({
          cleanRole,
          positionId: positionExists.id,
          loggedInUserId: loggedInUser.user_id,
          active_class_id: studentRequirements?.activeClassID,
        });
      // A) Create the User and nested ManagementStaff profile
      const createdUser = await transaction.user.create({
        data: {
          full_name,
          mobile_number,
          email,
          user_name,
          gender,
          joining_date: effectiveJoiningDate,
          ...(payload.blood_group !== undefined && {
            blood_group: payload.blood_group,
          }),
          ...(payload.date_of_birth !== undefined && {
            date_of_birth: payload.date_of_birth,
          }),
          ...(payload.height_in_cm !== undefined && {
            height_in_cm: payload.height_in_cm,
          }),
          ...(payload.weight_in_kg !== undefined && {
            weight_in_kg: payload.weight_in_kg,
          }),
          ...(payload.religion !== undefined && {
            religion: payload.religion,
          }),
          ...(payload.nationality !== undefined && {
            nationality: payload.nationality,
          }),
          ...(payload.birth_certificate_number !== undefined && {
            birth_certificate_number: payload.birth_certificate_number,
          }),
          ...(payload.nid_number !== undefined && {
            nid_number: payload.nid_number,
          }),
          ...profileData,
          current_role: cleanRole,

          current_position: {
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
        positionId: positionExists.id,
        loggedInUserId: loggedInUser.user_id,
      };
      // Initialized array sets for scalable audit insertions
      const auditRecords: Prisma.AuditLogCreateManyInput[] =
        userHelperFunction.buildInitialAuditRecords(buildAuditRecordsPayload);

      // Seed Promotion History blocks (Only valid for Staff profiles)
      if (cleanRole === Role.MANAGEMENT || cleanRole === Role.ACADEMIC) {
        await transaction.promotionHistory.create({
          data: {
            management_staff_id:
              cleanRole === Role.MANAGEMENT ? subProfileId : undefined,
            academic_staff_id:
              cleanRole === Role.ACADEMIC ? subProfileId : undefined,
            current_position_id: positionExists.id,
            current_role: cleanRole,
            start_date: effectiveJoiningDate,
            created_by_id: loggedInUser.user_id,
          },
        });
      }
      // ======================
      // STUDENT CREATION
      // ======================
      if (cleanRole === Role.STUDENT && subProfileId) {
        if (!studentRequirements) {
          throw new AppError(
            `Student requirements not found.`,
            StatusCodes.NOT_FOUND,
          );
        }
        // CHECK SECTION
        if (!payload.section) {
          throw new AppError("Section is required.", StatusCodes.NOT_FOUND);
        }

        // CHECK VERSION
        if (!payload.version) {
          throw new AppError("Version is required.", StatusCodes.NOT_FOUND);
        }
        const standardStudentFeeRates =
          await userHelperFunction.getStandardStudentFeeRatesForClass({
            transaction,
            class_id: studentRequirements.activeClassID,
            section: studentRequirements.section,
            version: studentRequirements.version,
            department: studentRequirements.department,
          });

        const classHistory = await transaction.classHistory.create({
          data: {
            student: { connect: { id: subProfileId } },
            class: { connect: { id: studentRequirements.activeClassID } },
            academic_year: {
              connect: { id: studentRequirements.academicYear.id },
            },
            shift: studentRequirements.existingShift,
            roll_number: studentRequirements.rollNumber,
            start_date: studentRequirements.academicStartDate,
            end_date: studentRequirements.academicEndDate,
            quranic_subject: {
              connect: { id: studentRequirements.existingQuranicSubject.id },
            },
            section: studentRequirements.section,
            version: studentRequirements.version,
            department: studentRequirements.department,
            class_history_quranic_periods: {
              create: studentRequirements.quranicPeriodIDs.map(
                (id: string) => ({
                  quranic_period: { connect: { id } },
                }),
              ),
            },
            ...(payload.arabic_subject_names?.length
              ? {
                  class_history_arabic_subjects: {
                    create: payload.arabic_subject_names.map((subject) => ({
                      arabic_subject: {
                        connect: { arabic_subject_name: subject },
                      },
                    })),
                  },
                }
              : {}),
            ...(payload.arabic_period_ids?.length
              ? {
                  class_history_arabic_period_ids: {
                    create: payload.arabic_period_ids.map((id) => ({
                      arabic_period: { connect: { id } },
                    })),
                  },
                }
              : {}),
            student_fee_assessments: {
              create: standardStudentFeeRates.map((standardFeeRate) => ({
                fee_type: standardFeeRate.fee_type,
                billing_frequency: standardFeeRate.billing_frequency,
                amount: standardFeeRate.amount,
                discount_amount: 0,
                amount_to_pay: standardFeeRate.amount,
                created_by_id: loggedInUser.user_id,
              })),
            },
            created_by: { connect: { id: loggedInUser.user_id } },
          },
          include: {
            student_fee_assessments: true,
          },
        });

        for (const feeAssessment of classHistory.student_fee_assessments) {
          auditRecords.push({
            entity_id: feeAssessment.id,
            entity_name: "studentFeeAssessment",
            old_value: Prisma.JsonNull,
            new_value: {
              class_history_id: classHistory.id,
              fee_type: feeAssessment.fee_type,
              billing_frequency: feeAssessment.billing_frequency,
              amount: feeAssessment.amount.toString(),
              discount_amount: feeAssessment.discount_amount.toString(),
              amount_to_pay: feeAssessment.amount_to_pay.toString(),
            },
            action: "CREATE",
            changed_by_id: loggedInUser.user_id,
          });
        }

        auditRecords.push({
          entity_id: classHistory.id,
          entity_name: "classHistory",
          old_value: Prisma.JsonNull,
          new_value: {
            student_id: subProfileId,
            class_id: studentRequirements.activeClassID,
            academic_year_id: studentRequirements.academicYear.id,
            start_date: studentRequirements.academicStartDate.toISOString(),
            end_date: studentRequirements.academicEndDate.toISOString(),
            roll_number: studentRequirements.rollNumber,
            shift: studentRequirements.existingShift,
            section: studentRequirements.section,
            version: studentRequirements.version,
            department: studentRequirements.department,
            quranic_class_id: studentRequirements.existingQuranicSubject.id,
            quranic_period_ids: studentRequirements.quranicPeriodIDs,
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
          role: cleanRole,
          position_id: positionExists.id,
          start_date: effectiveJoiningDate.toISOString(),
          end_date: null,
        },
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
      });

      // Bulk resolve tracking inputs
      await transaction.auditLog.createMany({ data: auditRecords });
      return createdUser;
    },
    { timeout: 30000 },
  );

  let emailSent = true;
  try {
    const expirationSeconds = 5 * 60;
    const otpValue = crypto.randomInt(100000, 1000000).toString();
    await issueOtpAndSendEmail({
      key: otpKey,
      otp: otpValue,
      expirationSeconds,
      to: email,
      templateName: "create_user_email_verify.ejs",
      subject:
        "Welcome To SONAMONIDER PATHSHALA & HIGH SCHOOL. Verify Your Email Address",
      templateData: {
        name: full_name,
        user_name,
        OTP: otpValue,
        year: new Date().getFullYear(),
      },
    });
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }
    emailSent = false;
  }

  return { user: newUser, email_sent: emailSent };
};

export const createUserServices = {
  createUser,
};
