import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  TAddResponsibleTeacherZodSchema,
  TDisconnectResponsibleTeacherZodSchema,
  TOldStudentAdmissionZodSchema,
  TStudentDeactivateZodSchema,
  TStudentReadmissionZodSchema,
} from "./student.zodValidation";
import { ActiveStatus, Prisma, Role } from "#db-client";
import { userHelperFunction } from "../user/user.helperFunction";
import { sendVerificationResultEmail } from "../email/email.helper.function";

// ========================================================
// STUDENT READMISSION SERVICE LAYER
// ========================================================
const studentReadmission = async (
  payload: TStudentReadmissionZodSchema,
  loggedInUser: TLoggedInUser,
  student_id: string,
) => {
  const {
    target_class_id,
    target_shift_name,
    target_year_name,
    roll_number,
    quranic_class_name,
    quranic_class_period_ids,
  } = payload;
  const cleanShiftName = target_shift_name;
  const cleanYearName = target_year_name.trim();
  // 1. Resolve exact target bounds from cache/master tables
  const targetYear = await prisma.academicYear.findUnique({
    where: { academic_year_name: cleanYearName },
  });
  if (!targetYear) {
    throw new AppError(
      `Academic Year '${cleanYearName}' not found. Create New Academic year for student readmission.`,
      StatusCodes.NOT_FOUND,
    );
  }

  const targetClass = await prisma.class.findUnique({
    where: { id: target_class_id },
  });
  if (!targetClass || !targetClass.is_active_class) {
    throw new AppError(
      "Target class does not exist or is currently inactive.",
      StatusCodes.BAD_REQUEST,
    );
  }

  return prisma.$transaction(
    async (transaction) => {
      const auditRecords: Prisma.AuditLogCreateManyInput[] = [];

      // Prevent duplicate enrolled
      const alreadyEnrolled = await transaction.classHistory.findFirst({
        where: {
          student_id,
          academic_year_id: targetYear.id,
        },
      });

      if (alreadyEnrolled) {
        throw new AppError(
          `Student is already admitted for academic year '${cleanYearName}'.`,
          StatusCodes.CONFLICT,
        );
      }

      // 2. Fetch the target Student Profile with their current active timeline block
      const lastYear = (Number(target_year_name) - 1).toString();
      const lastYearEndDate = new Date(`${lastYear}-12-31T23:59:59.999Z`);
      // const academicEndDate = new Date(`${cleanYearName}-12-31T23:59:59.999Z`);
      const studentProfile = await transaction.student.findUnique({
        where: { id: student_id },
        include: {
          class_history: {
            where: {
              end_date: lastYearEndDate,
              academic_year: {
                academic_year_name: lastYear,
              },
            },
            take: 1,
          },
          user_primary_data: {
            select: {
              is_deleted: true,
              active_status: true,
            },
          },
        },
      });

      if (!studentProfile) {
        throw new AppError(
          "Student profile record not found.",
          StatusCodes.NOT_FOUND,
        );
      }

      if (studentProfile.class_history.length === 0) {
        throw new AppError(
          `Student was not enrolled for the previous academic year '${lastYear}' and cannot be readmitted.`,
          StatusCodes.CONFLICT,
        );
      }

      // Check activity
      if (studentProfile.user_primary_data.is_deleted) {
        throw new AppError(
          `Student profile is deleted. Contact to SUPER ADMIN.`,
          StatusCodes.UNAUTHORIZED,
        );
      }
      if (studentProfile.user_primary_data.active_status === "INACTIVE") {
        const updatedUser = await transaction.user.update({
          where: { id: studentProfile.user_id },
          data: {
            active_status: "ACTIVE",
            updated_by_id: loggedInUser.user_id,
          },
        });
        await transaction.auditLog.create({
          data: {
            entity_id: studentProfile.user_id,
            entity_name: "user",
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
            old_value: {
              active_status: studentProfile.user_primary_data.active_status,
            },
            new_value: {
              active_status: updatedUser.active_status,
            },
          },
        });
      }
      // Validate and normalize all class-history inputs before changing the student.
      const studentsRequirementPayload = {
        transaction,
        active_class_id: payload.target_class_id,
        year_name: payload.target_year_name,
        shift_name: cleanShiftName, //payload.target_shift_name,
        roll_number: roll_number,
        section: payload.section,
        version: payload.version,
        quranic_class_name: quranic_class_name,
        quranic_class_period_ids: quranic_class_period_ids,
      };
      const {
        activeClassID,
        academicStartDate,
        academicEndDate,
        academicYear,
        existingShift,
        rollNumber,
        section,
        version,
        existingQuranicClass,
        quranicClassPeriodIDs,
      } = await userHelperFunction.checkStudentCreationRequirements(
        studentsRequirementPayload,
      );

      const updatedStudent = await transaction.student.update({
        where: { id: student_id },
        data: {
          active_class_id: target_class_id,
          updated_by_id: loggedInUser.user_id,
        },
      });

      auditRecords.push({
        entity_id: student_id,
        entity_name: "student",
        action: "UPDATE",
        changed_by_id: loggedInUser.user_id,
        old_value: { active_class_id: studentProfile.active_class_id },
        new_value: { active_class_id: target_class_id },
      });

      const freshClassHistory = await transaction.classHistory.create({
        data: {
          student: { connect: { id: student_id } },
          class: { connect: { id: activeClassID } },
          academic_year: { connect: { id: academicYear.id } },
          shift: existingShift,
          roll_number: rollNumber,
          start_date: academicStartDate,
          end_date: academicEndDate,
          section,
          version,
          quranic_subject: { connect: { id: existingQuranicClass.id } },
          class_history_quranic_periods: {
            create: quranicClassPeriodIDs.map((id: string) => ({
              quranic_period: { connect: { id } },
            })),
          },
          created_by: { connect: { id: loggedInUser.user_id } },
        },
      });

      // Construct clean, filtered audit payload using camelCase structure rules
      auditRecords.push({
        entity_id: freshClassHistory.id,
        entity_name: "classHistory",
        old_value: Prisma.JsonNull,
        new_value: {
          student_id,
          class_id: activeClassID,
          academic_year_id: academicYear.id,
          start_date: academicStartDate.toISOString(),
          end_date: academicEndDate.toISOString(),
          roll_number: rollNumber,
          shift: existingShift,
          section,
          version,
          quranic_class_id: existingQuranicClass.id,
          quranic_class_period_ids: quranicClassPeriodIDs,
        },
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
      });

      // 7. STEP D: BULK ATOMIC COMMIT OF TRACKED AUDIT ENTRIES
      await transaction.auditLog.createMany({ data: auditRecords });

      return updatedStudent;
    },
    { timeout: 25000 },
  );
};

// ========================================================
// STUDENT DEACTIVATE SERVICE LAYER
// ========================================================
const deactivateNotReadmittedStudents = async (
  loggedInUser: TLoggedInUser,
  payload: TStudentDeactivateZodSchema,
) => {
  const { targetYear } = payload;
  const academicYear = await prisma.academicYear.findUnique({
    where: {academic_year_name: targetYear}
  });
  if(!academicYear){
    throw new AppError(`Provided target academic year not found.`, StatusCodes.NOT_FOUND)
  }
  const currentYear = targetYear;
  const previousYear = (Number(targetYear) - 1).toString();

  return prisma.$transaction(
    async (transaction) => {
      const eligibleUsers = await transaction.user.findMany({
        where: {
          current_role: Role.STUDENT,
          active_status: ActiveStatus.ACTIVE,
          is_deleted: false,
          student_profile: {
            is: {
              class_history: {
                some: {
                  academic_year: { academic_year_name: previousYear },
                },
                none: {
                  academic_year: { academic_year_name: currentYear },
                },
              },
            },
          },
        },
        select: { id: true },
      });

      if (eligibleUsers.length === 0) {
        throw new AppError(
          `No active, non-deleted students found for deactivation from academic year '${previousYear}' to '${currentYear}'.`,
          StatusCodes.NOT_FOUND,
        );
      }

      const deactivatedUsers = await transaction.user.updateManyAndReturn({
        where: {
          current_role: Role.STUDENT,
          active_status: ActiveStatus.ACTIVE,
          is_deleted: false,
          student_profile: {
            is: {
              class_history: {
                some: {
                  academic_year: { academic_year_name: previousYear },
                },
                none: {
                  academic_year: { academic_year_name: currentYear },
                },
              },
            },
          },
        },
        data: {
          active_status: ActiveStatus.INACTIVE,
          updated_by_id: loggedInUser.user_id,
        },
        select: {
          id: true,
          full_name: true,
          mobile_number: true,
          student_profile: {
            select: {
              id: true,
              active_class: {
                select: { class_name: true },
              },
            },
          },
        },
      });

      if (deactivatedUsers.length > 0) {
        await transaction.auditLog.createMany({
          data: deactivatedUsers.map(({ id }) => ({
            entity_id: id,
            entity_name: "user",
            old_value: { active_status: ActiveStatus.ACTIVE },
            new_value: { active_status: ActiveStatus.INACTIVE },
            action: "UPDATE",
            changed_by_id: loggedInUser.user_id,
          })),
        });
      }

      return {
        deactivated_count: deactivatedUsers.length,
        students: deactivatedUsers,
        current_academic_year: currentYear,
        required_previous_academic_year: previousYear,
      };
    },
    { timeout: 25000 },
  );
};

// ========================================================
// OLD STUDENT ADMISSION CONTROLLER
// ========================================================
const oldStudentAdmission = async (
  loggedInUser: TLoggedInUser,
  payload: TOldStudentAdmissionZodSchema,
  student_id: string,
) => {
  const {
    target_class_id,
    target_shift_name,
    target_year_name,
    roll_number,
    quranic_class_name,
    quranic_class_period_ids,
  } = payload;
  const targetYear = target_year_name;
  const cleanShiftName = target_shift_name;
  // Find target year
  const academicYear = await prisma.academicYear.findUnique({
    where: { academic_year_name: targetYear },
  });
  // Check existance target year
  if (!academicYear) {
    throw new AppError(
      `Provided academic year not found.`,
      StatusCodes.NOT_FOUND,
    );
  }
  // Find student
  const student = await prisma.student.findUnique({
    where: { id: student_id },
    include: {
      class_history: {
        include: {
          academic_year: {
            select: {
              academic_year_name: true,
            },
          },
        },
      },
      user_primary_data: {
        select: {
          is_deleted: true,
          active_status: true,
        },
      },
    },
  });
  // Check Existance
  if (!student) {
    throw new AppError(`Student not found.`, StatusCodes.NOT_FOUND);
  }
  // Check is deleted
  if (student.user_primary_data.is_deleted) {
    throw new AppError(
      `Student activity unthorized. Please contact Super Admin.`,
      StatusCodes.UNAUTHORIZED,
    );
  }
  // Check class history length zero or not.
  if (student.class_history.length === 0) {
    throw new AppError(
      `Student has no previous class history.`,
      StatusCodes.BAD_REQUEST,
    );
  }

  // Check target year class history
  const targetYearClassHistory = student.class_history.some(
    (ch) => ch.academic_year.academic_year_name === targetYear,
  );
  if (targetYearClassHistory) {
    throw new AppError(
      `Student already admitted for the academic year ${targetYear}`,
      StatusCodes.CONFLICT,
    );
  }

  // Check class history for one year previous of target year
  const lastYearClassHistory = student.class_history.some(
    (ch) =>
      ch.academic_year.academic_year_name ===
      (Number(targetYear) - 1).toString(),
  );
  if (lastYearClassHistory) {
    throw new AppError(
      `Student has class history for academic year ${Number(targetYear) - 1}`,
      StatusCodes.BAD_REQUEST,
    );
  }

  return prisma.$transaction(async (transaction) => {
    const auditRecords: Prisma.AuditLogCreateManyInput[] = [];
    const studentsRequirementPayload = {
      transaction,
      active_class_id: payload.target_class_id,
      year_name: payload.target_year_name,
      shift_name: cleanShiftName, //payload.target_shift_name,
      roll_number: roll_number,
      section: payload.section,
      version: payload.version,
      quranic_class_name: quranic_class_name,
      quranic_class_period_ids: quranic_class_period_ids,
    };

    const {
      activeClassID,
      academicStartDate,
      academicEndDate,
      academicYear,
      existingShift,
      rollNumber,
      section,
      version,
      existingQuranicClass,
      quranicClassPeriodIDs,
    } = await userHelperFunction.checkStudentCreationRequirements(
      studentsRequirementPayload,
    );

    if (student.user_primary_data.active_status === "INACTIVE") {
      const updatedUser = await transaction.user.update({
        where: { id: student.user_id },
        data: {
          active_status: "ACTIVE",
          updated_by_id: loggedInUser.user_id,
        },
      });
      await transaction.auditLog.create({
        data: {
          entity_id: student.user_id,
          entity_name: "user",
          action: "UPDATE",
          changed_by_id: loggedInUser.user_id,
          old_value: {
            active_status: student.user_primary_data.active_status,
          },
          new_value: {
            active_status: updatedUser.active_status,
          },
        },
      });
    }

    const updatedStudent = await transaction.student.update({
      where: { id: student_id },
      data: {
        active_class_id: target_class_id,
        updated_by_id: loggedInUser.user_id,
      },
    });

    auditRecords.push({
      entity_id: student_id,
      entity_name: "student",
      action: "UPDATE",
      changed_by_id: loggedInUser.user_id,
      old_value: { active_class_id: student.active_class_id },
      new_value: { active_class_id: target_class_id },
    });

    const freshClassHistory = await transaction.classHistory.create({
        data: {
          student: { connect: { id: student_id } },
          class: { connect: { id: activeClassID } },
          academic_year: { connect: { id: academicYear.id } },
          shift: existingShift,
          roll_number: rollNumber,
          start_date: academicStartDate,
          end_date: academicEndDate,
          section,
          version,
          quranic_subject: { connect: { id: existingQuranicClass.id } },
          class_history_quranic_periods: {
            create: quranicClassPeriodIDs.map((id: string) => ({
              quranic_period: { connect: { id } },
            })),
          },
          created_by: { connect: { id: loggedInUser.user_id } },
        },
      });
      auditRecords.push({
        entity_id: freshClassHistory.id,
        entity_name: "classHistory",
        old_value: Prisma.JsonNull,
        new_value: {
          student_id,
          class_id: activeClassID,
          academic_year_id: academicYear.id,
          start_date: academicStartDate.toISOString(),
          end_date: academicEndDate.toISOString(),
          roll_number: rollNumber,
          shift: existingShift,
          section,
          version,
          quranic_class_id: existingQuranicClass.id,
          quranic_class_period_ids: quranicClassPeriodIDs,
        },
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
      });

      // 7. STEP D: BULK ATOMIC COMMIT OF TRACKED AUDIT ENTRIES
      await transaction.auditLog.createMany({ data: auditRecords });

      return updatedStudent;
  });
};

// ========================================================
// ADD RESPONSIBLE TEACHER SERVICE LAYER
// ========================================================
const addResponsibleTeacher = async (
  payload: TAddResponsibleTeacherZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { student_id, teacher_full_name, teacher_mobile_number } = payload;
  const { assignedResponsibleTeacher, studentEmail, teacherEmail } =
    await prisma.$transaction(async (transaction) => {
      const existingTeacher = await transaction.academicStaff.findFirst({
        where: {
          user_primary_data: {
            full_name: teacher_full_name,
            mobile_number: teacher_mobile_number,
          },
        },
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

      const existingStudent = await transaction.student.findUnique({
        where: { id: student_id },
        select: {
          id: true,
          responsible_teacher_id: true,
          responsible_teacher: {
            include: {
              user_primary_data: {
                select: {
                  full_name: true,
                  mobile_number: true,
                },
              },
            },
          },
          user_primary_data: {
            select: {
              full_name: true,
              mobile_number: true,
              email: true,
              active_status: true,
              is_deleted: true,
            },
          },
          active_class: {
            select: {
              class_name: true,
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
          `Responsible teacher is already assigned. Responsible teacher is: ${existingStudent.responsible_teacher?.user_primary_data.full_name} with a mobile number ${existingStudent.responsible_teacher?.user_primary_data.mobile_number}`,
          StatusCodes.CONFLICT,
        );
      }

      const assignedResponsibleTeacher = await transaction.student.update({
        where: { id: student_id },
        data: {
          responsible_teacher: { connect: { id: existingTeacher.id } },
          updated_by: { connect: { id: loggedInUser.user_id } },
        },
      });

      await transaction.auditLog.create({
        data: {
          entity_id: student_id,
          entity_name: "student",
          changed_by: { connect: { id: loggedInUser.user_id } },
          action: "UPDATE",
          old_value: Prisma.JsonNull,
          new_value: {
            responsible_teacher_id: existingTeacher.id,
            responsible_teacher: {
              full_name: existingTeacher.user_primary_data.full_name,
              mobile_number: existingTeacher.user_primary_data.mobile_number,
            },
          },
        },
      });
      return {
        assignedResponsibleTeacher,
        studentEmail: {
          to: existingStudent.user_primary_data.email,
          templateName:
            "student_responsible_teacher_assigned_email.ejs" as const,
          subject:
            "Your Responsible Teacher – SONAMONIDER PATHSHALA & HIGH SCHOOL",
          templateData: {
            studentName: existingStudent.user_primary_data.full_name,
            teacherName: existingTeacher.user_primary_data.full_name,
            teacherMobile: existingTeacher.user_primary_data.mobile_number,
            className: existingStudent.active_class.class_name,
            year: new Date().getFullYear(),
          },
        },
        teacherEmail: {
          to: existingTeacher.user_primary_data.email,
          templateName:
            "teacher_responsible_student_assigned_email.ejs" as const,
          subject:
            "New Student in Your Responsibility – SONAMONIDER PATHSHALA & HIGH SCHOOL",
          templateData: {
            teacherName: existingTeacher.user_primary_data.full_name,
            studentName: existingStudent.user_primary_data.full_name,
            studentMobile: existingStudent.user_primary_data.mobile_number,
            className: existingStudent.active_class.class_name,
            year: new Date().getFullYear(),
          },
        },
      };
    });

  const sendNotificationEmail = async (email: {
    to: string;
    templateName: string;
    subject: string;
    templateData: Record<string, string | number>;
  }): Promise<boolean> => {
    try {
      await sendVerificationResultEmail(email);
      return true;
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      return false;
    }
  };

  const [studentEmailSent, teacherEmailSent] = await Promise.all([
    sendNotificationEmail(studentEmail),
    sendNotificationEmail(teacherEmail),
  ]);

  return {
    ...assignedResponsibleTeacher,
    student_email_sent: studentEmailSent,
    teacher_email_sent: teacherEmailSent,
  };
};

// ========================================================
// DISCONNECT RESPONSIBLE TEACHER SERVICE LAYER
// ========================================================
const disconnectResponsibleTeacher = async (
  payload: TDisconnectResponsibleTeacherZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { student_id } = payload;
  const { updatedStudent, studentEmail, teacherEmail } =
    await prisma.$transaction(async (transaction) => {
      const existingStudent = await transaction.student.findUnique({
        where: { id: student_id },
        select: {
          id: true,
          responsible_teacher_id: true,
          user_primary_data: {
            select: {
              full_name: true,
              mobile_number: true,
              email: true,
            },
          },
          active_class: {
            select: {
              class_name: true,
            },
          },
          responsible_teacher: {
            select: {
              id: true,
              user_primary_data: {
                select: {
                  full_name: true,
                  mobile_number: true,
                  email: true,
                },
              },
            },
          },
        },
      });

      if (!existingStudent) {
        throw new AppError("Student not found.", StatusCodes.NOT_FOUND);
      }

      if (!existingStudent.responsible_teacher) {
        throw new AppError(
          "No responsible teacher is currently assigned to this student.",
          StatusCodes.BAD_REQUEST,
        );
      }

      const currentTeacher = existingStudent.responsible_teacher;
      const updatedStudent = await transaction.student.update({
        where: { id: student_id },
        data: {
          responsible_teacher: { disconnect: true },
          updated_by: { connect: { id: loggedInUser.user_id } },
        },
      });

      await transaction.auditLog.create({
        data: {
          entity_id: student_id,
          entity_name: "student",
          changed_by: { connect: { id: loggedInUser.user_id } },
          action: "UPDATE",
          old_value: {
            responsible_teacher_id: currentTeacher.id,
            responsible_teacher: {
              full_name: currentTeacher.user_primary_data.full_name,
              mobile_number: currentTeacher.user_primary_data.mobile_number,
            },
          },
          new_value: Prisma.JsonNull,
        },
      });

      return {
        updatedStudent,
        studentEmail: {
          to: existingStudent.user_primary_data.email,
          templateName:
            "student_responsible_teacher_disconnected_email.ejs" as const,
          subject:
            "Responsible Teacher Assignment Removed – SONAMONIDER PATHSHALA & HIGH SCHOOL",
          templateData: {
            studentName: existingStudent.user_primary_data.full_name,
            teacherName: currentTeacher.user_primary_data.full_name,
            className: existingStudent.active_class.class_name,
            year: new Date().getFullYear(),
          },
        },
        teacherEmail: {
          to: currentTeacher.user_primary_data.email,
          templateName:
            "teacher_responsible_student_disconnected_email.ejs" as const,
          subject:
            "Student Responsibility Assignment Removed – SONAMONIDER PATHSHALA & HIGH SCHOOL",
          templateData: {
            teacherName: currentTeacher.user_primary_data.full_name,
            studentName: existingStudent.user_primary_data.full_name,
            className: existingStudent.active_class.class_name,
            year: new Date().getFullYear(),
          },
        },
      };
    });

  const sendNotificationEmail = async (email: {
    to: string;
    templateName: string;
    subject: string;
    templateData: Record<string, string | number>;
  }): Promise<boolean> => {
    try {
      await sendVerificationResultEmail(email);
      return true;
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }
      return false;
    }
  };

  const [studentEmailSent, teacherEmailSent] = await Promise.all([
    sendNotificationEmail(studentEmail),
    sendNotificationEmail(teacherEmail),
  ]);

  return {
    ...updatedStudent,
    student_email_sent: studentEmailSent,
    teacher_email_sent: teacherEmailSent,
  };
};

export const studentServices = {
  studentReadmission,
  deactivateNotReadmittedStudents,
  oldStudentAdmission,
  addResponsibleTeacher,
  disconnectResponsibleTeacher,
};
