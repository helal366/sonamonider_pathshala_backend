import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TActionPromotionRequestZodSchema } from "./promotionRequest.zod.validation";
import { Prisma } from "#db-client";

const MANAGEMENT_ROLE_TRACK = ["MANAGEMENT", "ADMIN"];
const ACADEMIC_ROLE_TRACK = ["ACADEMIC", "TEACHER_ADMIN"];
const actionPromotionRequest = async (
  payload: TActionPromotionRequestZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const {
    promotion_request_id,
    action_status,
    rejection_reason,
    effective_date,
  } = payload;
  const effectiveDate = effective_date ? new Date(effective_date) : new Date();
  return prisma.$transaction(async (tx) => {
    // Fetch promotion request and check existance
    const promotionRequest = await tx.promotionRequest.findUnique({
      where: { id: promotion_request_id },
      include: {
        user: {
          select: {
            full_name: true,
            mobile_number: true,
          },
        },
        old_role: { select: { role_name: true } },
        new_role: { select: { role_name: true } },
        old_position: { select: { position_name: true } },
        new_position: { select: { position_name: true } },
      },
    });
    if (!promotionRequest) {
      throw new AppError("Promotion request not found.", StatusCodes.NOT_FOUND);
    }

    if (promotionRequest.promotion_request_status !== "PENDING") {
      throw new AppError(
        `This request has already been processed as ${promotionRequest.promotion_request_status}.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    // PREVENT STUDENT AND GOVERNING BODY ROLE TO PROMOTE;
    if (
      promotionRequest.old_role.role_name === "STUDENT" ||
      promotionRequest.old_role.role_name === "GOVERNING_BODY"
    ) {
      throw new AppError(
        `STUDENT and GOVERNING_BODY are not promotable.`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    const {
      user_id,
      management_staff_id,
      academic_staff_id,
      student_id,
      governing_body_id,
      new_role_id,
      new_position_id,
      old_role_id,
      old_position_id,
    } = promotionRequest;
    // Find and check existance of target user
    const targetUser = await tx.user.findUnique({
      where: { id: user_id },
      select: {
        academic_staff_profile: { select: { id: true } },
        management_staff_profile: {select: {id: true}},
        full_name: true,
        mobile_number: true,
        email: true
      },
    });
    if (!targetUser) {
      throw new AppError(`User not found.`, StatusCodes.NOT_FOUND);
    };


    const auditRecords: Prisma.AuditLogCreateManyInput[] = [];
    // Handle Rejection
    if (action_status === "REJECTED") {
      // Update rejection
      const updated = await tx.promotionRequest.update({
        where: { id: promotion_request_id },
        data: {
          promotion_request_status: "REJECTED",
          rejection_reason,
          updated_by_id: loggedInUser.user_id,
        },
      });

      // Create audit log
      await tx.auditLog.create({
        data: {
          entity_id: promotion_request_id,
          entity_name: "promotionRequest",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: {
            promotion_request_status: "PENDING",
            rejection_reason: null,
          },
          new_value: { promotion_request_status: "REJECTED", rejection_reason },
        },
      });
      return updated;
    }

    // Handle Approval

    // Update Approval at Promotin Request
    const updatedPromotionRequest = await tx.promotionRequest.update({
      where: { id: promotion_request_id },
      data: {
        promotion_request_status: "APPROVED",
        updated_by_id: loggedInUser.user_id,
      },
    });
    // Push to audit record
    auditRecords.push({
      entity_id: promotion_request_id,
      entity_name: "promotionRequest",
      changed_by_id: loggedInUser.user_id,
      action: "UPDATE",
      old_value: { promotion_request_status: "PENDING" },
      new_value: { promotion_request_status: "APPROVED" },
    });

    // Prepare for pipelines
    const oldRoleName = promotionRequest.old_role.role_name;
    const newRoleName = promotionRequest.new_role.role_name;

    const isSourceManagement = MANAGEMENT_ROLE_TRACK.includes(oldRoleName);
    const isSourceAcademic = ACADEMIC_ROLE_TRACK.includes(oldRoleName);
    const isSourceStudent = oldRoleName === "STUDENT";
    const isSourceGoverningBody = oldRoleName === "GOVERNING_BODY";

    const isTargetManagement = MANAGEMENT_ROLE_TRACK.includes(newRoleName);
    const isTargetAcademic = ACADEMIC_ROLE_TRACK.includes(newRoleName);
    const isTargetStudent = newRoleName === "STUDENT";
    const isTargetGoverningBody = newRoleName === "GOVERNING_BODY";

    const isUnusual =
      (isSourceStudent === true && isTargetStudent === true) ||
      (isSourceGoverningBody === true && isTargetGoverningBody === true);
    if (isUnusual) {
      throw new AppError(
        "The current and proposed roles cannot be identical for STUDENT or GOVERNING_BODY tracks.",
        StatusCodes.BAD_REQUEST,
      );
    }
    const isSamePipeline =
      (isSourceManagement === true && isTargetManagement === true) ||
      (isSourceAcademic === true && isTargetAcademic === true);

    const isCrossPipeline =
      (isSourceManagement && isTargetAcademic) ||
      (isSourceAcademic && isTargetManagement);

    let subProfileId: string | undefined = "";
    let targetEntityName: string | undefined = "";
    let activeHistoryId: string | undefined = "";

    // Build common execution payload;
    // SAME PIPELINE PROMOTION
    if (isSamePipeline) {
      if (management_staff_id) {
        subProfileId = management_staff_id;
        targetEntityName = "managementStaff";
        const history = await tx.promotionHistory.findFirst({
          where: { management_staff_id, end_date: null },
        });
        activeHistoryId = history?.id;

        // Check active history id existance
        if (!activeHistoryId) {
          throw new AppError(
            "No active promotion timeline milestone tracking record found.",
            StatusCodes.NOT_FOUND,
          );
        }
        // Update active history
        const updatedHIstory = await tx.promotionHistory.update({
          where: { id: activeHistoryId },
          data: {
            end_date: effectiveDate,
            updated_by_id: loggedInUser.user_id
          },
        });

        // Push to audit record
        auditRecords.push({
          entity_id: activeHistoryId,
          entity_name: "promotionHistory",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: {
            end_date: null,
          },
          new_value: {
            end_date: effectiveDate.toISOString(),
          },
        });

        // Create new promotion history
        const newHistory = await tx.promotionHistory.create({
          data: {
            management_staff_id,
            position_id: new_position_id,
            role_id: new_role_id,
            start_date: effectiveDate,
            created_by_id: loggedInUser.user_id,
          },
        });

        // Push to audit record
        auditRecords.push({
          entity_id: newHistory.id,
          entity_name: "promotionHistory",
          changed_by_id: loggedInUser.user_id,
          action: "CREATE",
          old_value: Prisma.JsonNull,
          new_value: {
            management_staff_id,
            position_id: new_position_id,
            role_id: new_role_id,
            start_date: effectiveDate.toISOString(),
          },
        });
        // Update management staff profile : update promoted role position
        const updatedManagementStaff = await tx.managementStaff.update({
          where: { id: management_staff_id },
          data: {
            current_position_id: new_position_id,
            current_role_id: new_role_id,
            updated_by_id: loggedInUser.user_id
          },
        });
        // Push to audit record
        auditRecords.push({
          entity_id: management_staff_id,
          entity_name: "managementStaff",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: {
            current_position_id: old_position_id,
            current_role_id: old_role_id,
          },
          new_value: {
            current_position_id: new_position_id,
            current_role_id: new_role_id,
          },
        });

        // Update user profile : update promoted role position
        const updatedUser = await tx.user.update({
          where: { id: user_id },
          data: {
            role_id: new_role_id,
            position_id: new_position_id,
            updated_by_id: loggedInUser.user_id
          },
        });

        // Push to audit records
        auditRecords.push({
          entity_id: user_id,
          entity_name: "user",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: {
            role_id: old_role_id,
            position_id: old_position_id,
          },
          new_value: {
            role_id: new_role_id,
            position_id: new_position_id,
          },
        });
      } else if (academic_staff_id) {
        subProfileId = academic_staff_id;
        targetEntityName = "academicStaff";

        // Find active history
        const history = await tx.promotionHistory.findFirst({
          where: { academic_staff_id, end_date: null },
        });
        activeHistoryId = history?.id;

        // Check active history id existance
        if (!activeHistoryId) {
          throw new AppError(
            "No active promotion timeline milestone tracking record found.",
            StatusCodes.NOT_FOUND,
          );
        }

        // Update active history
        const updatedHistory = await tx.promotionHistory.update({
          where: { id: activeHistoryId },
          data: { 
            end_date: effectiveDate,
            updated_by_id: loggedInUser.user_id
          },
        });
        // Push to audit record
        auditRecords.push({
          entity_id: activeHistoryId,
          entity_name: "promotionHistory",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: { end_date: null },
          new_value: { end_date: effectiveDate.toISOString() },
        });

        // Create new promotion history
        const newHistory = await tx.promotionHistory.create({
          data: {
            academic_staff_id,
            position_id: new_position_id,
            role_id: new_role_id,
            start_date: effectiveDate,
            created_by_id: loggedInUser.user_id,
          },
        });

        // Push to audit record
        auditRecords.push({
          entity_id: newHistory.id,
          entity_name: "promotionHistory",
          changed_by_id: loggedInUser.user_id,
          action: "CREATE",
          old_value: Prisma.JsonNull,
          new_value: {
            academic_staff_id,
            position_id: new_position_id,
            role_id: new_role_id,
            start_date: effectiveDate.toISOString(),
          },
        });

        // Update Academic Staff profile : update promoted role position
        await tx.academicStaff.update({
          where: { id: academic_staff_id },
          data: {
            current_position_id: new_position_id,
            current_role_id: new_role_id,
            updated_by_id: loggedInUser.user_id
          },
        });

        // Push to audit record
        auditRecords.push({
          entity_id: academic_staff_id,
          entity_name: "academicStaff",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: {
            current_position_id: old_position_id,
            current_role_id: old_role_id,
          },
          new_value: {
            current_position_id: new_position_id,
            current_role_id: new_role_id,
          },
        });

        // Update  User profile : update promoted role position
        await tx.user.update({
          where: { id: user_id },
          data: {
            role_id: new_role_id,
            position_id: new_position_id,
            updated_by_id: loggedInUser.user_id
          },
        });

        // Push to audit record
        auditRecords.push({
          entity_id: user_id,
          entity_name: "user",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: { role_id: old_role_id, position_id: old_position_id },
          new_value: { role_id: new_role_id, position_id: new_position_id },
        });
      }

      // Create audit log
      await tx.auditLog.createMany({ data: auditRecords });
    } 

    // CROSS PIPELINE PROMOTION
     if (isCrossPipeline) {
      // Source management and target academic
      if (isSourceManagement && isTargetAcademic) {
        if (!management_staff_id) {
          throw new AppError(
            `Source management should have management staff ID`,
            StatusCodes.CONFLICT,
          );
        }

        // find management staff
        const mngStaff = await tx.managementStaff.findUnique({
          where: { id: management_staff_id },
          select: {
            is_currently_active_staff: true,
          },
        });
        // Update management staff profile
        const updatedMngStaff = await tx.managementStaff.update({
          where: { id: management_staff_id },
          data: {
            is_currently_active_staff: false,
            updated_by_id: loggedInUser.user_id
          },
        });

        // Push to audit log
        auditRecords.push({
          entity_id: management_staff_id,
          entity_name: "managementStaff",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: {
            is_currently_active_staff: mngStaff?.is_currently_active_staff,
          },
          new_value: {
            is_currently_active_staff:
              updatedMngStaff?.is_currently_active_staff,
          },
        });

        // Find promotion history
        const existPromotionHistory = await tx.promotionHistory.findFirst({
          where: { management_staff_id, end_date: null },
        });

        // Update promotion history
        if (existPromotionHistory) {
          const updatedPrmtHistory = await tx.promotionHistory.update({
            where: { id: existPromotionHistory.id },
            data: { 
              end_date: effectiveDate,
              updated_by_id: loggedInUser.user_id
            },
          });
          // Audit log
          auditRecords.push({
            entity_id: updatedPrmtHistory.id,
            entity_name: "promotionHistory",
            changed_by_id: loggedInUser.user_id,
            action: "UPDATE",
            old_value: {
              end_date: null,
            },
            new_value: {
              end_date: updatedPrmtHistory.end_date?.toISOString(),
            },
          });
        }
        // Check academic staff existance
        let targetAcademicStaffId;
        if (targetUser.academic_staff_profile) {
           targetAcademicStaffId = targetUser.academic_staff_profile.id;
          // Find existing academic staff profile
          const existingAcademicStaff = await tx.academicStaff.findUnique({
            where: {id: targetAcademicStaffId},
            select: {
              is_currently_active_staff: true,
              current_role_id: true,
              current_position_id: true,
            }
          })
          // Update academic staff profile
          const updatedAcadStaff = await tx.academicStaff.update({
            where: { id: targetAcademicStaffId },
            data: {
              is_currently_active_staff: true,
              current_role_id: new_role_id,
              current_position_id: new_position_id,
              updated_by_id: loggedInUser.user_id
            },
          });
          // Audit log
          auditRecords.push({
            entity_id: targetAcademicStaffId,
            entity_name: "academicStaff",
            changed_by_id: loggedInUser.user_id,
            action: "UPDATE",
            old_value: {
              is_currently_active_staff: existingAcademicStaff?.is_currently_active_staff,
              current_role_id: existingAcademicStaff?.current_role_id,
              current_position_id: existingAcademicStaff?.current_position_id,
            },
            new_value: {
              is_currently_active_staff: updatedAcadStaff?.is_currently_active_staff,
              current_role_id: updatedAcadStaff?.current_role_id,
              current_position_id: updatedAcadStaff?.current_position_id,
            },
          });
        }else{
          // Create academic staff
          const createdAcadStaff = await tx.academicStaff.create({
            data: {
              full_name: targetUser.full_name,
              mobile_number: targetUser.mobile_number,
              email: targetUser.email,
              is_currently_active_staff: true,
              user_id,
              current_role_id: new_role_id,
              current_position_id: new_position_id,
              created_by_id: loggedInUser.user_id
            }
          });
          // Assign target academic staff id
          targetAcademicStaffId = createdAcadStaff.id
          // Audit logg
          auditRecords.push({
            entity_id: createdAcadStaff.id,
            entity_name: "academicStaff",
            changed_by_id: loggedInUser.user_id,
            action: "CREATE",
            old_value: Prisma.JsonNull,
            new_value: {
              full_name: createdAcadStaff.full_name,
              mobile_number: createdAcadStaff.mobile_number,
              email: createdAcadStaff.email,
              is_currently_active_staff: createdAcadStaff.is_currently_active_staff,
              user_id: createdAcadStaff.user_id,
              current_role_id: createdAcadStaff.current_role_id,
              current_position_id: createdAcadStaff.current_position_id
            },
          });
        };

        // Update root user 
         await tx.user.update({
          where: { id: user_id },
          data: {
            role_id: new_role_id,
            position_id: new_position_id,
            updated_by_id:loggedInUser.user_id
          },
        });

        auditRecords.push({
          entity_id: user_id,
          entity_name: "user",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: { role_id: old_role_id, position_id: old_position_id },
          new_value: { role_id: new_role_id, position_id: new_position_id },
        });

        // Create new promotion history 
        const newPromotionHistory = await tx.promotionHistory.create({
          data: {
            academic_staff_id: targetAcademicStaffId,
            role_id: new_role_id,
            position_id: new_position_id,
            start_date: effectiveDate,
            created_by_id: loggedInUser.user_id
          }
        });

        auditRecords.push({
          entity_id: newPromotionHistory.id,
            entity_name: "promotionHistory",
            changed_by_id: loggedInUser.user_id,
            action: "CREATE",
            old_value: Prisma.JsonNull,
            new_value:{
              academic_staff_id: newPromotionHistory.academic_staff_id,
            role_id: newPromotionHistory.role_id,
            position_id: newPromotionHistory.position_id,
            start_date: newPromotionHistory.start_date.toISOString(),
            }
        })
      }
           // Source academic and target management
      if (isSourceAcademic && isTargetManagement) {
        if (!academic_staff_id) {
          throw new AppError(
            `Source academic profile should have an academic staff ID`,
            StatusCodes.CONFLICT,
          );
        }

        // 1. Find the current active academic staff profile snapshot
        const acadStaff = await tx.academicStaff.findUnique({
          where: { id: academic_staff_id },
          select: {
            is_currently_active_staff: true,
          },
        });

        // 2. Soft-deactivate the source academic staff profile record
        const updatedAcadStaff = await tx.academicStaff.update({
          where: { id: academic_staff_id },
          data: {
            is_currently_active_staff: false,
            updated_by_id: loggedInUser.user_id,
          },
        });

        // 3. Track the academic staff deactivation state modification
        auditRecords.push({
          entity_id: academic_staff_id,
          entity_name: "academicStaff",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: {
            is_currently_active_staff: acadStaff?.is_currently_active_staff,
          },
          new_value: {
            is_currently_active_staff: updatedAcadStaff?.is_currently_active_staff,
          },
        });

        // 4. Find the current open promotion timeline history log row
        const existPromotionHistory = await tx.promotionHistory.findFirst({
          where: { academic_staff_id, end_date: null },
        });

        // 5. Terminate the active history timeline record if it exists
        if (existPromotionHistory) {
          const updatedPrmtHistory = await tx.promotionHistory.update({
            where: { id: existPromotionHistory.id },
            data: { 
              end_date: effectiveDate,
              updated_by_id: loggedInUser.user_id,
            },
          });

          // Audit log the timeline closure statement
          auditRecords.push({
            entity_id: updatedPrmtHistory.id,
            entity_name: "promotionHistory",
            changed_by_id: loggedInUser.user_id,
            action: "UPDATE",
            old_value: {
              end_date: null,
            },
            new_value: {
              end_date: updatedPrmtHistory.end_date?.toISOString(),
            },
          });
        }

        // 6. Check for destination management profile table historical presence
        let targetManagementStaffId;
        if (targetUser.management_staff_profile) {
          targetManagementStaffId = targetUser.management_staff_profile.id;

          // Find the existing historical management staff data configuration
          const existingManagementStaff = await tx.managementStaff.findUnique({
            where: { id: targetManagementStaffId },
            select: {
              is_currently_active_staff: true,
              current_role_id: true,
              current_position_id: true,
            },
          });

          // Reactivate and update the historical management profile record
          const updatedMngStaff = await tx.managementStaff.update({
            where: { id: targetManagementStaffId },
            data: {
              is_currently_active_staff: true,
              current_role_id: new_role_id,
              current_position_id: new_position_id,
              updated_by_id: loggedInUser.user_id,
            },
          });

          // Push the update change matrix to the audit log array
          auditRecords.push({
            entity_id: targetManagementStaffId,
            entity_name: "managementStaff",
            changed_by_id: loggedInUser.user_id,
            action: "UPDATE",
            old_value: {
              is_currently_active_staff: existingManagementStaff?.is_currently_active_staff,
              current_role_id: existingManagementStaff?.current_role_id,
              current_position_id: existingManagementStaff?.current_position_id,
            },
            new_value: {
              is_currently_active_staff: updatedMngStaff?.is_currently_active_staff,
              current_role_id: updatedMngStaff?.current_role_id,
              current_position_id: updatedMngStaff?.current_position_id,
            },
          });
        } else {
          // Instantiate a brand-new management staff record since none exists historically
          const createdMngStaff = await tx.managementStaff.create({
            data: {
              full_name: targetUser.full_name,
              mobile_number: targetUser.mobile_number,
              email: targetUser.email, // Safe as email is now strictly required in your schema
              is_currently_active_staff: true,
              user_id,
              current_role_id: new_role_id,
              current_position_id: new_position_id,
              created_by_id: loggedInUser.user_id,
            },
          });

          // Assign the generated unique profile ID
          targetManagementStaffId = createdMngStaff.id;

          // Audit log the profile creation step
          auditRecords.push({
            entity_id: createdMngStaff.id,
            entity_name: "managementStaff",
            changed_by_id: loggedInUser.user_id,
            action: "CREATE",
            old_value: Prisma.JsonNull,
            new_value: {
              full_name: createdMngStaff.full_name,
              mobile_number: createdMngStaff.mobile_number,
              email: createdMngStaff.email,
              is_currently_active_staff: createdMngStaff.is_currently_active_staff,
              user_id: createdMngStaff.user_id,
              current_role_id: createdMngStaff.current_role_id,
              current_position_id: createdMngStaff.current_position_id,
            },
          });
        }

        // 7. Update the root user document record pointers to mirror current track shifts
        await tx.user.update({
          where: { id: user_id },
          data: {
            role_id: new_role_id,
            position_id: new_position_id,
            updated_by_id: loggedInUser.user_id,
          },
        });

        auditRecords.push({
          entity_id: user_id,
          entity_name: "user",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: { role_id: old_role_id, position_id: old_position_id },
          new_value: { role_id: new_role_id, position_id: new_position_id },
        });

        // 8. Create a fresh new open baseline promotion timeline tracking log row
        const newPromotionHistory = await tx.promotionHistory.create({
          data: {
            management_staff_id: targetManagementStaffId,
            role_id: new_role_id,
            position_id: new_position_id,
            start_date: effectiveDate,
            created_by_id: loggedInUser.user_id,
          },
        });

        // Push the clean, string-serialized milestone statement to audit log array
        auditRecords.push({
          entity_id: newPromotionHistory.id,
          entity_name: "promotionHistory",
          changed_by_id: loggedInUser.user_id,
          action: "CREATE",
          old_value: Prisma.JsonNull,
          new_value: {
            management_staff_id: newPromotionHistory.management_staff_id,
            role_id: newPromotionHistory.role_id,
            position_id: newPromotionHistory.position_id,
            start_date: newPromotionHistory.start_date.toISOString(), // Perfectly string-serialized
          },
        });
      }

      // Create audit log
      await tx.auditLog.createMany({ data: auditRecords });
    }
  });
};
export const promotionRequestActionServices = {
  actionPromotionRequest,
};
