import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { TPromoteUserRolePositionZodSchema } from "./user.zod.validation";
import { clearCacheRoles, findRoleExistence } from "../../helperFunctions/cachedData/cache_roles";
import { clearCachePositions, findPositionExistence } from "../../helperFunctions/cachedData/cache_positions";
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

      let updatedPromotedHistory;
      if (currentActiveHistoryId) {
        updatedPromotedHistory =await transaction.promotionHistory.update({
          where: {
            id: currentActiveHistoryId,
          },
          data: {
            end_date: effectivePromotedDate,
            updated_by_id: loggedInUser.user_id
          },
        });
      }

      // Prepare conditional dynamic query payloads for updating/creating target profiles
      const userUpdateData: Prisma.UserUpdateInput = {
        updated_by: { connect: { id: loggedInUser.user_id } },
        current_role: { connect: { id: existingRole.id } },
        current_position: { connect: { id: positionExists.id } },
      };

      const auditRecords: Prisma.AuditLogCreateManyInput[] = [
        {
          entity_id: targetStaff.id,
          entity_name: "User",
          old_value: {
            role: currentRoleName || null,
            position: targetStaff.current_position?.position_name || null,
          },
          new_value: { role: cleanRole, position: cleanPosition },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        },
        {
          entity_id: currentActiveHistoryId!,
          entity_name: "PromotionHistory",
          old_value: {
            end_date: null,
          },
          new_value: {end_date: effectivePromotedDate },
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
        }
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
      await transaction.promotionHistory.create({
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
        entity_id: targetProfileId,
        entity_name: "PromotionHistory",
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
        entity_name: isManagementTrack ? "ManagementStaff" : "AcademicStaff",
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
export const userPromotionServices = {
    promoteUserRolePosition
}