import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  TAssignGradeGroupTeacherZodSchema,
  TDisconnectGradeGroupTeacherZodSchema,
  TUpdateAcademicStaffFieldZodSchema,
  TUpdateSubjectForSubjectTeacherZodSchema,
} from "./academicStaff.zodValidation";
import { Prisma } from "#db-client";
import { sendVerificationResultEmail } from "../email/email.helper.function";

// ================================================
// UPDATE SUBJECT FOR SUBJECT TEAHER SERVICE LAYER
// ================================================
const updateSubjectForSubjectTeacher = async (
  payload: TUpdateSubjectForSubjectTeacherZodSchema,
  loggedInUser: TLoggedInUser,
  academicStaff_id: string,
) => {
  const { current_subject, new_subject } = payload;
  return await prisma.$transaction(async (tx) => {
    // FIND ACADEMIC STAFF
    const teacher = await tx.academicStaff.findUnique({
      where: { id: academicStaff_id },
      select: {
        user_primary_data: {
          select: { active_status: true, is_deleted: true },
        },
        subject_as_subject_teacher: true,
        current_position: {
          select: {
            position_name: true,
          },
        },
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

    // PREVENT TEACHER_ASSISTANT TO ASSIGN A SUBJECT AS SUBJECT TEACHER
    if (teacher.current_position?.position_name === "TEACHER_ASSISTANT") {
      throw new AppError(
        `Provided teacher is in position : TEACHER_ASSISTANT`,
        StatusCodes.BAD_REQUEST,
      );
    }

    // CHECK THE SUBJECT IS ALREADY ASSIGNED TO ANY OTHER TEACHER
    // IT CAN BE CHECKED IF THE RULE ALLOW

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
        entity_name: "academicStaff",
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
  academicStaff_id: string,
) => {
  const { field, value } = payload;
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
        entity_name: "academicStaff",
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

// =============================================
// ASSIGN GRADE GROUP TEACHER SERVICE LAYER
// =============================================
const assignGradeGroupTeacher = async (
  payload: TAssignGradeGroupTeacherZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { class_id, academicStaff_id } = payload;
  const { assigned, email } = await prisma.$transaction(async (tx) => {
    // FIND CLASS
    const existingClass = await tx.class.findUnique({
      where: { id: class_id },
      select: {
        class_name: true,
        grade_group_teacher: {
          include: {
            user_primary_data: {
              select: {
                full_name: true,
                mobile_number: true,
              },
            },
          },
        },
      },
    });

    // CHECK CLASS EXISTANCE
    if (!existingClass) {
      throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
    }
    // CHECK GRADE OR GROUP TEACHER ASSIGNED TO THE CLASS OR NOT.
    if (existingClass.grade_group_teacher) {
      throw new AppError(
        `Grade/Group Teacher already assigned to ${existingClass.class_name}. Teacher name: ${existingClass.grade_group_teacher?.user_primary_data.full_name}, Teacher mobile number: (${existingClass.grade_group_teacher?.user_primary_data.mobile_number})`,
        StatusCodes.CONFLICT,
      );
    }

    // FIND ACADEMIC STAFF
    const existingAcademicStaff = await tx.academicStaff.findUnique({
      where: { id: academicStaff_id },
      select: {
        grade_group_teacher_class: {
          select: {
            id: true,
            class_name: true,
          },
        },
        current_position: {
          select: {
            position_name: true,
          },
        },
        user_primary_data: {
          select: {
            full_name: true,
            mobile_number: true,
            active_status: true,
            is_deleted: true,
            email: true,
          },
        },
      },
    });

    // CHECK ACADEMIC STAFF EXISTANCE
    if (!existingAcademicStaff) {
      throw new AppError(`Teacher not found.`, StatusCodes.NOT_FOUND);
    }
    // CHECK ACADEMIC STAFF ACTIVITY
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

    // CHECK THE ACADEMIC STAFF IS TEACHER ASSISTANT OR NOT
    if (
      existingAcademicStaff.current_position?.position_name ===
      "TEACHER_ASSISTANT"
    ) {
      throw new AppError(
        `TEACHER_ASSISTANT can not assign as Grade or Group teacher.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    // CHECK THE TEACHER IS ALREADY ASSIGNNED AS GRADE OR GROUP TEACHER
    const assignedClass =
      existingAcademicStaff.grade_group_teacher_class?.class_name;
    if (existingAcademicStaff.grade_group_teacher_class) {
      throw new AppError(
        `Teacher is already assigned as Grade/Group Teacher of ${assignedClass} class.`,
        StatusCodes.CONFLICT,
      );
    }

    // ASSIGN AS GRADE OR GROUP TEACHER
    const assigned = await tx.class.update({
      where: { id: class_id },
      data: {
        grade_group_teacher: { connect: { id: academicStaff_id } },
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    // CREATE AUDIT LOG
    await tx.auditLog.createMany({
      data: [
        {
          entity_id: class_id,
          entity_name: "class",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: Prisma.JsonNull,
          new_value: {
            grade_group_teacher_id: academicStaff_id,
            grade_group_teacher: {
              full_name: existingAcademicStaff.user_primary_data.full_name,
              mobile_number:
                existingAcademicStaff.user_primary_data.mobile_number,
            },
          },
        },
        {
          entity_id: academicStaff_id,
          entity_name: "academicStaff",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: Prisma.JsonNull,
          new_value: {
            grade_group_teacher_class: {
              id: class_id,
              class_name: existingClass.class_name,
            },
          },
        },
      ],
    });

    const className = existingClass.class_name;
    return {
      assigned,
      email: {
        to: existingAcademicStaff.user_primary_data.email,
        templateName: "assign_grade_group_teacher_email.ejs",
        subject: `${className.toLowerCase().includes("grade") ? "Grade Teacher" : "Group Teacher"} Assignment Notification – SONAMONIDER PATHSHALA`,
        templateData: {
          name: existingAcademicStaff.user_primary_data.full_name,
          className,
          year: new Date().getFullYear(),
        },
      },
    };
  }, { timeout: 30000 });

  let emailSent = true;
  try {
    await sendVerificationResultEmail(email);
  } catch (error) {
    if (!(error instanceof Error)) {
      throw error;
    }
    emailSent = false;
  }

  return { ...assigned, email_sent: emailSent };
};

// =============================================
// DISCONNECT GRADE GROUP TEACHER SERVICE LAYER
// =============================================
const disconnectGradeGroupTeacher = async (
  payload: TDisconnectGradeGroupTeacherZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { class_id, academicStaff_id } = payload;
  return await prisma.$transaction(async (tx) => {
    // FIND CLASS
    const existingClass = await tx.class.findUnique({
      where: { id: class_id },
      select: {
        class_name: true,
        grade_group_teacher_id: true,
        grade_group_teacher: {
          select: {
            id: true,
            user_primary_data: {
              select: {
                full_name: true,
                mobile_number: true,
              },
            },
          },
        },
      },
    });

    if (!existingClass) {
      throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
    }
    // CHECK IF CLASS HAS A GRADE/GROUP TEACHER
    if (!existingClass.grade_group_teacher_id) {
      throw new AppError(
        `No Grade or Group teacher is currently assigned to this class.`,
        StatusCodes.BAD_REQUEST,
      );
    }
    //CHECK WHETHER PROVIDED ACADEMIC STAFF IS THE CURRENT GRADE/GROUP TEACHER
    if (existingClass.grade_group_teacher_id !== academicStaff_id) {
      throw new AppError(
        `The provided teacher is not in assign as Grade or Group teacher of this class.`,
        StatusCodes.BAD_REQUEST,
      );
    }
    // FIND ACADEMIC STAFF
    const currentGradeGroupTeacher = await tx.academicStaff.findUnique({
      where: { id: academicStaff_id },
      select: {
        id: true,
        user_primary_data: {
          select: {
            full_name: true,
            mobile_number: true,
            email: true,
            active_status: true,
            is_deleted: true,
          },
        },
        grade_group_teacher_class: {
          select: { id: true, class_name: true },
        },
      },
    });
    if (!currentGradeGroupTeacher) {
      throw new AppError(
        `Provided current Grade or Group teacher not found.`,
        StatusCodes.NOT_FOUND,
      );
    }

    // CHECK ACTIVITY
    const teacherActivity =
      currentGradeGroupTeacher.user_primary_data.active_status === "ACTIVE";
    const teacherIsDeleted =
      currentGradeGroupTeacher.user_primary_data.is_deleted;
    if (!teacherActivity || teacherIsDeleted) {
      throw new AppError(
        `The teacher is unauthorized. Check activity.`,
        StatusCodes.UNAUTHORIZED,
      );
    }
    // UPDATE CLASS
    const updated = await tx.class.update({
      where: { id: class_id },
      data: {
        grade_group_teacher_id: null,
        updated_by_id: loggedInUser.user_id,
      },
    });

    // CREATE AUDIT LOG
    await tx.auditLog.createMany({
      data: [
        {
          entity_id: class_id,
          entity_name: "class",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: {
            grade_group_teacher_id: academicStaff_id,
            grade_group_teacher: {
              full_name: currentGradeGroupTeacher.user_primary_data.full_name,
              mobile_number:
                currentGradeGroupTeacher.user_primary_data.mobile_number,
            },
          },
          new_value: Prisma.JsonNull,
        },
        {
          entity_id: academicStaff_id,
          entity_name: "academicStaff",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: {
            grade_group_teacher_class: {
              id: class_id,
              class_name: existingClass.class_name,
            },
          },
          new_value: Prisma.JsonNull,
        },
      ],
    });

    await sendVerificationResultEmail({
      to: currentGradeGroupTeacher.user_primary_data.email,
      templateName: "disconnect_grade_group_teacher_email.ejs",
      subject: `${existingClass.class_name.toLowerCase().includes("grade") ? "Grade Teacher" : "Group Teacher"} Assignment Removal Notification – SONAMONIDER PATHSHALA`,
      templateData: {
        name: currentGradeGroupTeacher.user_primary_data.full_name,
        className: existingClass.class_name,
        year: new Date().getFullYear(),
      },
    });
    return updated;
  });
};
export const academicStaffServices = {
  updateSubjectForSubjectTeacher,
  updateAcademicStaffField,
  assignGradeGroupTeacher,
  disconnectGradeGroupTeacher,
};
