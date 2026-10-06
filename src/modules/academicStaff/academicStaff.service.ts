import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  TUpdateAcademicStaffFieldZodSchema,
  TUpdateSubjectForSubjectTeacherZodSchema,
} from "./academicStaff.zod.validation";

// ================================================
// UPDATE SUBJECT FOR SUBJECT TEAHER SERVICE LAYER
// ================================================
const updateSubjectForSubjectTeacher = async (
  payload: TUpdateSubjectForSubjectTeacherZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { academicStaff_id, current_subject, new_subject } = payload;
  return await prisma.$transaction(async (tx) => {
    // FIND ACADEMIC STAFF
    const teacher = await tx.academicStaff.findUnique({
      where: { id: academicStaff_id },
      select: {
        user_primary_data: {
          select: { active_status: true, is_deleted: true },
        },
        subject_as_subject_teacher: true,
      },
    });
    // CHECK ACADEMIC STAFF EXISTANCE
    if (!teacher) {
      throw new AppError(`Teacher not found.`, StatusCodes.NOT_FOUND);
    }

    // CHECK ACADEMIC STAFF ACTIVITY
    const teacherActivity =
      teacher.user_primary_data.active_status === "ACTIVE";
    const teacherIsDeleted = teacher.user_primary_data.is_deleted;
    if (!teacherActivity || teacherIsDeleted) {
      throw new AppError(`Teacher is unauthorized.`, StatusCodes.UNAUTHORIZED);
    }

    // CHECK THE PROVIDED CURRENT SUBJECT IS ASSIGNED TO TEACHER OR NOT
    if (teacher.subject_as_subject_teacher !== current_subject) {
      throw new AppError(
        `The provided current subject is not assigned to the provided teacher.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    // UPDATE NEW SUBJECT TO PROVIDED TEACHER
    const updated = await tx.academicStaff.update({
      where: { id: academicStaff_id },
      data: {
        subject_as_subject_teacher: new_subject,
      },
    });
    await tx.auditLog.create({
      data: {
        entity_id: academicStaff_id,
        entity_name: "AcademicStaff",
        changed_by_id: loggedInUser.user_id,
        action: "UPDATE",
        old_value: {
          subject_as_subject_teacher: current_subject,
        },
        new_value: {
          subject_as_subject_teacher: new_subject,
        },
      },
    });
    return updated;
  });
};

// ================================================
// UPDATE ACADEMIC STAFF FIELD SERVICE LAYER
// ================================================
const updateAcademicStaffField = async (
  payload: TUpdateAcademicStaffFieldZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { academicStaff_id, field, value } = payload;
  return prisma.$transaction(async (tx) => {
    // FIND ACADEMIC STAFF
    const academicStaff = await tx.academicStaff.findUnique({
      where: { id: academicStaff_id },
      select: {
        user_primary_data: {
          select: { active_status: true, is_deleted: true },
        },
        teaching_experience_year: true,
        teaching_experience_month: true,
        alternative_contact_no: true,
        extra_curricular_activities: true,
      },
    });

    // CHECK EXISTANCE
    if (!academicStaff) {
      throw new AppError(`Provided staff not found.`, StatusCodes.NOT_FOUND);
    }

    // CHECK ACTIVITY
    const staffActivity =
      academicStaff.user_primary_data.active_status === "ACTIVE";
    const staffIsDeleted = academicStaff.user_primary_data.is_deleted;
    if (!staffActivity || staffIsDeleted) {
      throw new AppError(
        `The staff is unauthorized. Check activity`,
        StatusCodes.UNAUTHORIZED,
      );
    }

    // CHECK ARRAY FIELDS
    let cleanValue: number | string[];
    if (field === "alternative_contact_no") {
      cleanValue = [...academicStaff.alternative_contact_no, value];
    } else if (field === "extra_curricular_activities") {
      cleanValue = [...academicStaff.extra_curricular_activities, value];
    } else {
      cleanValue = value;
    }
    // UPDATE ACADEMIC STAFF FIELD
    const updated = await tx.academicStaff.update({
      where: { id: academicStaff_id },
      data: {
        [field]: cleanValue,
      },
    });

    // CREATE AUDIT LOG
    await tx.auditLog.create({
      data: {
        entity_id: academicStaff_id,
        entity_name: "AcademicStaff",
        changed_by: { connect: { id: loggedInUser.user_id } },
        action: "UPDATE",
        old_value: {
          [field]: academicStaff[field as keyof typeof academicStaff],
        },
        new_value: {
          [field]: cleanValue,
        },
      },
    });
    return updated;
  });
};
export const academicStaffServices = {
  updateSubjectForSubjectTeacher,
  updateAcademicStaffField,
};
