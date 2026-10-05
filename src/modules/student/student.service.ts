import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TAddResponsibleTeacherZodSchema } from "./student.zod.validation";
import { Prisma } from "#db-client";
// =============================================
// STUDENT READMISSION SERVICE LAYER
// =============================================
const studentReadmission= async()=>{

}
// =============================================
// ADD RESPONSIBLE TEACHER SERVICE LAYER
// =============================================
const addResponsibleTeacher = async (
  payload: TAddResponsibleTeacherZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { student_id, teacher_full_name, teacher_mobile_number } = payload;
  return await prisma.$transaction(async (tx) => {
    const existingTeacher = await tx.academicStaff.findUnique({
      where: {
        academic_full_name_mobile_unique: {
          full_name: teacher_full_name,
          mobile_number: teacher_mobile_number,
        },
      },
      select: {
        id: true,
        full_name: true,
        mobile_number: true,
        user_primary_data: {
          select: {
            active_status: true,
            is_deleted: true,
          },
        },
      },
    });
    const isActiveTeacher =
      existingTeacher?.user_primary_data.active_status === "ACTIVE";
    const isTeacherDeleted = existingTeacher?.user_primary_data.is_deleted;
    if (!existingTeacher || !isActiveTeacher || isTeacherDeleted) {
      throw new AppError(
        `Teacher is not assignable. Check activity.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    const existingStudent = await tx.student.findUnique({
      where: { id: student_id },
      select: {
        id: true,
        full_name: true,
        mobile_number: true,
        responsible_teacher_id: true,
        responsible_teacher: {
          select: {
            full_name: true,
            mobile_number: true,
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
    const isActiveStudent =
      existingStudent?.user_primary_data.active_status === "ACTIVE";
    const isStudentDeleted = existingStudent?.user_primary_data.is_deleted;

    if (!existingStudent || !isActiveStudent || isStudentDeleted) {
      throw new AppError(
        `The student is not ready for responsible teacher. Check activity.`,
        StatusCodes.BAD_REQUEST,
      );
    }
    if (existingStudent.responsible_teacher_id) {
      throw new AppError(
        `Responsible teacher is already assigned. Responsible teacher is: ${existingStudent.responsible_teacher?.full_name} with a mobile number ${existingStudent.responsible_teacher?.mobile_number}`,
        StatusCodes.CONFLICT,
      );
    }

    const assignedResponsibleTeacher = await tx.student.update({
      where: { id: student_id },
      data: {
        responsible_teacher: { connect: { id: existingTeacher.id } },
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: student_id,
        entity_name: "Student",
        changed_by: { connect: { id: loggedInUser.user_id } },
        action: "UPDATE",
        old_value: Prisma.JsonNull,
        new_value: {
          responsible_teacher_id: existingTeacher.id,
          responsible_teacher: {
            full_name: existingTeacher.full_name,
            mobile_number: existingTeacher.mobile_number,
          },
        },
      },
    });
    return assignedResponsibleTeacher;
  });
};

export const studentServices = {
  studentReadmission,
  addResponsibleTeacher
}