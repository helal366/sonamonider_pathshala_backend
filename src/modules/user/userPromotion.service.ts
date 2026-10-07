import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import {
  TCrossPipelineTransferZodSchema,
  TPromoteUserRolePositionZodSchema,
} from "./user.zod.validation";
import {
  clearCacheRoles,
  findRoleExistence,
} from "../../helperFunctions/cachedData/cache_roles";
import {
  clearCachePositions,
  findPositionExistence,
} from "../../helperFunctions/cachedData/cache_positions";
import { prisma } from "../../lib/prisma";
import { Prisma } from "#db-client";
//=======================================
// PROMOTE USER SERVICE LAYER
//=======================================
const promoteUserRolePosition = async (
  payload: TPromoteUserRolePositionZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const { full_name, mobile_number, position_name, role_name, promoted_date } =
    payload;
  const cleanPosition = position_name.trim().toUpperCase();
  const cleanRole = role_name.trim().toUpperCase();
  const effectivePromotedDate = new Date(promoted_date);
  // NO PROMOTION FOR SUPER ADMIN
  if (cleanRole === "SUPER_ADMIN") {
    throw new AppError(
      `Super Admin is not promotable.`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // 1a. Enforce business rule: Only administrative and academic staff participate in promotions
  if (
    cleanRole !== "ADMIN" &&
    cleanRole !== "TEACHER_ADMIN" &&
    cleanRole !== "MANAGEMENT" &&
    cleanRole !== "ACADEMIC"
  ) {
    throw new AppError(
      `Users targeting the role ${cleanRole} cannot be processed via the promotion pipeline.`,
      StatusCodes.BAD_REQUEST,
    );
  }
  // 1b. Verify that the requested master role exists
  const existingRole = await findRoleExistence(cleanRole);

  // 2. Verify that the role-position pair is valid using your helper function
  const positionExists = await findPositionExistence(cleanPosition);

  // 3. Fetch the target user and their management profile to check current values
  const targetStaff = await prisma.user.findUnique({
    where: {
      user_full_name_mobile_unique: {
        full_name,
        mobile_number,
      },
    },
    include: {
      current_role: { select: { role_name: true } },
      current_position: { select: { position_name: true } },
      management_staff_profile: {
        include: {
          promotion_history: { where: { end_date: null }, take: 1 },
        },
      },
      academic_staff_profile: {
        include: {
          promotion_history: { where: { end_date: null }, take: 1 },
        },
      },
      student_profile: true,
      governing_body_profile: true,
    },
  });

  if (!targetStaff) {
    throw new AppError(
      "The requested user does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const currentRoleName = targetStaff.current_role?.role_name;
  const currentPositionName = targetStaff.current_position?.position_name;

  // 4. Compare existing user role position with the provided role position
  if (currentRoleName === cleanRole && currentPositionName === cleanPosition) {
    throw new AppError(
      "User already occupy the provided role and position",
      StatusCodes.CONFLICT,
    );
  }
  // 5. Execute the database changes within a safe transaction block
  const result = await prisma.$transaction(
    async (transaction) => {
      let currentActiveHistoryId: string | null = null;
      let currentProfileId: string | null = null;

      // Identify the user's CURRENT active profile details to terminate history
      if (
        (currentRoleName === "MANAGEMENT" ||
          currentRoleName === "ADMIN" ||
          currentRoleName === "TEACHER_ADMIN") &&
        targetStaff.management_staff_profile
      ) {
        currentProfileId = targetStaff.management_staff_profile.id;
        currentActiveHistoryId =
          targetStaff.management_staff_profile.promotion_history[0]?.id || null;
      } else if (
        currentRoleName === "ACADEMIC" &&
        targetStaff.academic_staff_profile
      ) {
        currentProfileId = targetStaff.academic_staff_profile.id;
        currentActiveHistoryId =
          targetStaff.academic_staff_profile.promotion_history[0]?.id || null;
      }

      if (!currentActiveHistoryId) {
        throw new AppError(
          "No promotion history found with end date null",
          StatusCodes.NOT_FOUND,
        );
      }

      const updatedPromotedHistory = await transaction.promotionHistory.update({
        where: {
          id: currentActiveHistoryId,
        },
        data: {
          end_date: effectivePromotedDate,
          updated_by_id: loggedInUser.user_id,
        },
      });

      // Prepare conditional dynamic query payloads for updating/creating target profiles
      const userUpdateData: Prisma.UserUpdateInput = {
        updated_by: { connect: { id: loggedInUser.user_id } },
        current_role: { connect: { id: existingRole.id } },
        current_position: { connect: { id: positionExists.id } },
      };

      const auditRecords: Prisma.AuditLogCreateManyInput[] = [
        {
          entity_id: targetStaff.id,
          entity_name: "user",
          old_value: {
            role: currentRoleName || null,
            position: targetStaff.current_position?.position_name || null,
          },
          new_value: { role: cleanRole, position: cleanPosition },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
        {
          entity_id: currentActiveHistoryId,
          entity_name: "promotionHistory",
          old_value: {
            end_date: null,
          },
          new_value: { end_date: effectivePromotedDate },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
      ];

      // Handle Promotion Mapping Target: MANAGEMENT / ADMIN / TEACHER_ADMIN
      const isManagementTrack =
        cleanRole === "MANAGEMENT" ||
        cleanRole === "ADMIN" ||
        cleanRole === "TEACHER_ADMIN";

      if (isManagementTrack) {
        if (!targetStaff.management_staff_profile) {
          throw new AppError(
            "Management staff profile not found.",
            StatusCodes.NOT_FOUND,
          );
        }
        userUpdateData.management_staff_profile = {
          update: {
            current_role: { connect: { id: existingRole.id } },
            current_position: { connect: { id: positionExists.id } },
            updated_by: { connect: { id: loggedInUser.user_id } },
          },
        };
      }

      // Handle Promotion Mapping Target: ACADEMIC
      else if (cleanRole === "ACADEMIC") {
        if (!targetStaff.academic_staff_profile) {
          throw new AppError(
            "Academic staff profile not found.",
            StatusCodes.NOT_FOUND,
          );
        }
        userUpdateData.academic_staff_profile = {
          update: {
            current_role: { connect: { id: existingRole.id } },
            current_position: { connect: { id: positionExists.id } },
            updated_by: { connect: { id: loggedInUser.user_id } },
          },
        };
      }

      // B) Commit primary field modifications to the database
      const updatedUser = await transaction.user.update({
        where: { id: targetStaff.id },
        data: userUpdateData,
        include: {
          management_staff_profile: true,
          academic_staff_profile: true,
        },
        omit: { user_password: true },
      });

      // Recalculate target profile ID post-update execution to ensure accuracy
      let targetProfileId = "";
      if (isManagementTrack)
        targetProfileId = updatedUser.management_staff_profile?.id || "";
      if (cleanRole === "ACADEMIC")
        targetProfileId = updatedUser.academic_staff_profile?.id || "";

      // C) Create the fresh new Promotion History tracking line item with the new joining date
      const newPromotionHistory = await transaction.promotionHistory.create({
        data: {
          management_staff_id: isManagementTrack ? targetProfileId : undefined,
          academic_staff_id:
            cleanRole === "ACADEMIC" ? targetProfileId : undefined,
          position_id: positionExists.id,
          role_id: existingRole.id,
          start_date: effectivePromotedDate, // 🚀 Sets the new joining timeline milestone
        },
      });

      // D) Append history milestones to audit trails
      auditRecords.push({
        entity_id: newPromotionHistory.id,
        entity_name: "promotionHistory",
        old_value: Prisma.JsonNull,
        new_value: {
          role_id: existingRole.id,
          position_id: positionExists.id,
          start_date: effectivePromotedDate.toISOString(),
        },
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
      });

      auditRecords.push({
        entity_id: targetProfileId,
        entity_name: isManagementTrack ? "managementStaff" : "academicStaff",
        old_value: currentProfileId
          ? { role: currentRoleName }
          : Prisma.JsonNull,
        new_value: { role_id: existingRole.id, position_id: positionExists.id },
        action: currentProfileId ? "UPDATE" : "CREATE",
        changed_by_id: loggedInUser.user_id,
      });

      await transaction.auditLog.createMany({ data: auditRecords });

      return updatedUser;
    },
    { timeout: 15000 },
  );

  // 7. Flush memory caches to sync state for subsequent app requests
  clearCacheRoles();
  clearCachePositions();
  return result;
};

// ========================================================
// CROSS PIPELINE TRACK TRANSFER SERVICE LAYER
// ========================================================
const transferUserCrossPipeline = async (
  payload: TCrossPipelineTransferZodSchema,
  loggedInUser: NonNullable<Express.Request["user"]>,
) => {
  const {
    full_name,
    mobile_number,
    target_position_name,
    target_role_name,
    transfer_effective_date,
  } = payload;

  const cleanPosition = target_position_name.trim().toUpperCase();
  const cleanRole = target_role_name.trim().toUpperCase();
  const effectiveDate = new Date(transfer_effective_date);

  // 1. Structural Restrictions Checklist
  const managementRoles = ["MANAGEMENT", "ADMIN", "TEACHER_ADMIN"];
  const academicRoles = ["ACADEMIC"];

  const isTargetManagement = managementRoles.includes(cleanRole);
  const isTargetAcademic = academicRoles.includes(cleanRole);

  if (!isTargetManagement && !isTargetAcademic) {
    throw new AppError(
      `Role ${cleanRole} is out of bounds for the staff cross-transfer pipeline.`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // 2. Fetch Master Record Pointers from Promise-Caches
  const targetRoleExists = await findRoleExistence(cleanRole);
  const targetPositionExists = await findPositionExistence(cleanPosition);

  // 3. Extract Root User alongside both Sub-Profile Relational Records
  const targetUser = await prisma.user.findUnique({
    where: {
      user_full_name_mobile_unique: { full_name, mobile_number },
    },
    include: {
      current_role: { select: { id: true, role_name: true } },
      current_position: { select: { id: true, position_name: true } },
      management_staff_profile: {
        include: { promotion_history: { where: { end_date: null }, take: 1 } },
      },
      academic_staff_profile: {
        include: { promotion_history: { where: { end_date: null }, take: 1 } },
      },
    },
  });

  if (!targetUser) {
    throw new AppError(
      "The requested user record does not exist.",
      StatusCodes.NOT_FOUND,
    );
  }

  const sourceRoleName = targetUser.current_role?.role_name || "";
  const isSourceManagement = managementRoles.includes(sourceRoleName);
  const isSourceAcademic = academicRoles.includes(sourceRoleName);

  // 4. Validate that this is a valid cross-pipeline move
  if (
    (isSourceManagement && isTargetManagement) ||
    (isSourceAcademic && isTargetAcademic)
  ) {
    throw new AppError(
      `User is already in the ${isSourceManagement ? "Management" : "Academic"} track. Use the regular promotion endpoint instead.`,
      StatusCodes.BAD_REQUEST,
    );
  }

  if (!isSourceManagement && !isSourceAcademic) {
    throw new AppError(
      "Only existing Management or Academic Staff can switch tracks.",
      StatusCodes.BAD_REQUEST,
    );
  }

  // 5. Execute Core Cross-Pipeline Changes safely inside an isolated transaction block
  const result = await prisma.$transaction(
    async (transaction) => {
      let sourceProfileId = "";
      let sourceActiveHistoryId: string | null = null;
      let targetProfileId = "";

      const auditRecords: Prisma.AuditLogCreateManyInput[] = [];

      // A) TERMINATE SOURCE PIPELINE HISTORY TRACKERS
      if (isSourceManagement && targetUser.management_staff_profile) {
        sourceProfileId = targetUser.management_staff_profile.id;
        sourceActiveHistoryId =
          targetUser.management_staff_profile.promotion_history[0]?.id || null;
      } else if (isSourceAcademic && targetUser.academic_staff_profile) {
        sourceProfileId = targetUser.academic_staff_profile.id;
        sourceActiveHistoryId =
          targetUser.academic_staff_profile.promotion_history[0]?.id || null;
      }

      if (!sourceActiveHistoryId) {
        throw new AppError(
          "Active promotion timeline milestone tracking record not found for source profile.",
          StatusCodes.NOT_FOUND,
        );
      }

      // Close out active source history row
      await transaction.promotionHistory.update({
        where: { id: sourceActiveHistoryId },
        data: {
          end_date: effectiveDate,
          updated_by_id: loggedInUser.user_id,
        },
      });

      auditRecords.push({
        entity_id: sourceActiveHistoryId,
        entity_name: "promotionHistory",
        old_value: { end_date: null },
        new_value: { end_date: effectiveDate.toISOString() },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
      });

      // B) PROVISION OR ACTIVATE TARGET SUB-PROFILE
      const userUpdateData: Prisma.UserUpdateInput = {
        current_role: { connect: { id: targetRoleExists.id } },
        current_position: { connect: { id: targetPositionExists.id } },
        updated_by: { connect: { id: loggedInUser.user_id } },
      };

      if (isTargetManagement) {
        // Switching Academic -> Management
        if (targetUser.management_staff_profile) {
          // If a management record already existed historically, update and reactive it
          const updatedMgmt = await transaction.managementStaff.update({
            where: { id: targetUser.management_staff_profile.id },
            data: {
              current_role_id: targetRoleExists.id,
              current_position_id: targetPositionExists.id,
              is_currently_active_staff: true,
              updated_by_id: loggedInUser.user_id,
            },
          });
          targetProfileId = updatedMgmt.id;

          auditRecords.push({
            entity_id: targetProfileId,
            entity_name: "managementStaff",
            old_value: {
              current_role_id:
                targetUser.management_staff_profile.current_role_id,
              current_position_id:
                targetUser.management_staff_profile.current_position_id,
              is_currently_active_staff:
                targetUser.management_staff_profile.is_currently_active_staff,
            },
            new_value: {
              current_role_id: targetRoleExists.id,
              current_position_id: targetPositionExists.id,
              is_currently_active_staff: updatedMgmt.is_currently_active_staff,
            },
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
          });
        } else {
          // Construct brand-new profile record if they never held this role class before
          const newMgmt = await transaction.managementStaff.create({
            data: {
              full_name,
              mobile_number,
              email: targetUser.email!,
              user_id: targetUser.id,
              current_role_id: targetRoleExists.id,
              current_position_id: targetPositionExists.id,
              created_by_id: loggedInUser.user_id,
            },
          });
          targetProfileId = newMgmt.id;

          auditRecords.push({
            entity_id: targetProfileId,
            entity_name: "managementStaff",
            old_value: Prisma.JsonNull,
            new_value: {
              full_name,
              mobile_number,
              email: targetUser.email!,
              user_id: targetUser.id,
              current_role_id: targetRoleExists.id,
              current_position_id: targetPositionExists.id,
            },
            action: "CREATE",
            changed_by_id: loggedInUser.user_id,
          });
        }

        if (targetUser.academic_staff_profile) {
          const updatedAcad = await transaction.academicStaff.update({
            where: { id: targetUser.academic_staff_profile.id },
            data: {
              is_currently_active_staff: false,
            },
          });
          auditRecords.push({
            entity_id: updatedAcad.id,
            entity_name: "academicStaff",
            old_value: {
              is_currently_active_staff:
                targetUser.academic_staff_profile.is_currently_active_staff,
            },
            new_value: {
              is_currently_active_staff: updatedAcad.is_currently_active_staff,
            },
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
          });
        }
      } else if (isTargetAcademic) {
        // Switching Management -> Academic
        if (targetUser.academic_staff_profile) {
          const updatedAcad = await transaction.academicStaff.update({
            where: { id: targetUser.academic_staff_profile.id },
            data: {
              current_role_id: targetRoleExists.id,
              current_position_id: targetPositionExists.id,
              is_currently_active_staff: true,
              updated_by_id: loggedInUser.user_id,
            },
          });
          targetProfileId = updatedAcad.id;

          auditRecords.push({
            entity_id: targetProfileId,
            entity_name: "academicStaff",
            old_value: {
              current_role_id:
                targetUser.academic_staff_profile.current_role_id,
              current_position_id:
                targetUser.academic_staff_profile.current_position_id,
              is_currently_active_staff:
                targetUser.academic_staff_profile.is_currently_active_staff,
            },
            new_value: {
              current_role_id: targetRoleExists.id,
              current_position_id: targetPositionExists.id,
              is_currently_active_staff: updatedAcad.is_currently_active_staff,
            },
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
          });
        } else {
          const newAcad = await transaction.academicStaff.create({
            data: {
              full_name,
              mobile_number,
              email: targetUser.email!,
              user_id: targetUser.id,
              current_role_id: targetRoleExists.id,
              current_position_id: targetPositionExists.id,
              created_by_id: loggedInUser.user_id,
            },
          });
          targetProfileId = newAcad.id;

          auditRecords.push({
            entity_id: targetProfileId,
            entity_name: "academicStaff",
            old_value: Prisma.JsonNull,
            new_value: {
              full_name,
              mobile_number,
              email: targetUser.email,
              role_id: targetRoleExists.id,
              position_id: targetPositionExists.id,
            },
            action: "CREATE",
            changed_by_id: loggedInUser.user_id,
          });
        }

        if (targetUser.management_staff_profile) {
          const updatedManagement = await transaction.managementStaff.update({
            where: { id: targetUser.management_staff_profile.id },
            data: {
              is_currently_active_staff: false,
            },
          });
          auditRecords.push({
            entity_id: updatedManagement.id,
            entity_name: "managementStaff",
            old_value: {
              is_currently_active_staff:
                targetUser.management_staff_profile.is_currently_active_staff,
            },
            new_value: {
              is_currently_active_staff:
                updatedManagement.is_currently_active_staff,
            },
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
          });
        }
      }

      // C) COMMIT UPDATED Pointers ON THE ROOT USER RECORD
      const updatedUser = await transaction.user.update({
        where: { id: targetUser.id },
        data: userUpdateData,
        omit: { user_password: true },
      });

      auditRecords.push({
        entity_id: targetUser.id,
        entity_name: "user",
        old_value: {
          current_role: sourceRoleName,
          current_position: targetUser.current_position?.position_name,
        },
        new_value: { current_role: cleanRole, current_position: cleanPosition },
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
      });

      // D) START AN INITIAL NEW PIPELINE TIMELINE HISTORY ROW
      const newHistory = await transaction.promotionHistory.create({
        data: {
          management_staff_id: isTargetManagement ? targetProfileId : undefined,
          academic_staff_id: isTargetAcademic ? targetProfileId : undefined,
          position_id: targetPositionExists.id,
          role_id: targetRoleExists.id,
          start_date: effectiveDate,
          created_by_id: loggedInUser.user_id,
        },
      });

      auditRecords.push({
        entity_id: newHistory.id,
        entity_name: "promotionHistory",
        old_value: Prisma.JsonNull,
        new_value: {
          role_id: targetRoleExists.id,
          position_id: targetPositionExists.id,
          start_date: effectiveDate.toISOString(),
        },
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
      });
      // E) INSERT ALL AUDIT ENTRIES AT ONCE
      await transaction.auditLog.createMany({ data: auditRecords });
      return updatedUser;
    },
    { timeout: 25000 },
  );
  // 6. Invalidate Global Caches to keep states synchronous
  clearCacheRoles();
  clearCachePositions();
  return result;
};
export const userPromotionServices = {
  promoteUserRolePosition,
  transferUserCrossPipeline,
};
