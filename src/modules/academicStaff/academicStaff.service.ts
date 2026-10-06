import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TAssignGradeGroupTeacherZodSchema } from "./academicStaff.zod.validation";
import { Prisma } from "#db-client";


// ===============================================
// UPDATE GRAGE GROUP TEACHER SERVICE LAYER
// ===============================================
const updateGradeGroupTeacher = async (
  payload: TAssignGradeGroupTeacherZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { class_id, academicStaff_id } = payload;
  return await prisma.$transaction(async (tx) => {
    const existingClass = await tx.class.findUnique({
      where: { id: class_id },
      select: {
        class_name: true,
        grade_group_teacher: true,
      },
    });

    if (!existingClass) {
      throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
    };

    const existingAcademicStaff = await tx.academicStaff.findUnique({
      where: { id: academicStaff_id },
      select: {
        full_name: true,
        mobile_number: true,
        grade_group_class_id: true,
        grade_group_teacher_class: true,
        current_position: {
          select: {
            position_name: true,
          },
        },
        user_primary_data: {
          select: {
            active_status: true,
            is_deleted: true,
          },
        },
      },
    });
    const isAcademicStaffActive =
      existingAcademicStaff?.user_primary_data.active_status === "ACTIVE";
    const isAcademicStaffDeleted =
      existingAcademicStaff?.user_primary_data.is_deleted;
    if (
      !existingAcademicStaff ||
      !isAcademicStaffActive ||
      isAcademicStaffDeleted
    ) {
      throw new AppError(
        `Teacher not available. Check activity.`,
        StatusCodes.NOT_FOUND,
      );
    }

    if (
      existingAcademicStaff.current_position?.position_name ===
      "TEACHER_ASSISTANT"
    ) {
      throw new AppError(
        `TEACHER_ASSISTANT can not assign as Grade or Group teacher.`,
        StatusCodes.BAD_REQUEST,
      );
    };

    const assigned = await tx.academicStaff.update({
      where: { id: academicStaff_id },
      data: {
        grade_group_teacher_class: { connect: { id: class_id } },
      },
      select:{
        id: true,
        grade_group_class_id: true,
        grade_group_teacher_class: {
            select: {
                class_name: true
            }
        }
      }
    });

    await tx.auditLog.create({
      data: {
        entity_id: academicStaff_id,
        entity_name: "AcademicStaff",
        changed_by: { connect: { id: loggedInUser.user_id } },
        action: "UPDATE",
        old_value: {
          grade_group_class_id: class_id,
          grade_group_teacher_class: {
            class_name: existingClass.class_name,
          },
        },
        new_value: {
          grade_group_class_id: class_id,
          grade_group_teacher_class: {
            class_name: existingClass.class_name,
          },
        },
      },
    });

    return assigned;
  });
};
export const academicStaffServices = {
  updateGradeGroupTeacher,
};
