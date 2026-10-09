import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  TAddResponsibleTeacherZodSchema,
  TStudentReadmissionZodSchema,
} from "./student.zodValidation";
import { Prisma } from "#db-client";

// =============================================
// STUDENT READMISSION SERVICE LAYER
// =============================================
const studentReadmission = async (
  payload: TStudentReadmissionZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const {
    student_id,
    target_class_id,
    target_shift_name,
    target_year_name,
    roll_number,
    quranic_class_id,
    quranic_class_period_id,
  } = payload;
  const cleanShiftName = target_shift_name.trim().toUpperCase();
  const cleanYearName = target_year_name.trim();
  // 1. Resolve exact target bounds from cache/master tables
  const targetYear = await prisma.academicYear.findUnique({
    where: { academic_year_name: cleanYearName },
  });
  if (!targetYear) {
    throw new AppError(
      `Academic Year '${cleanYearName}' not found.`,
      StatusCodes.NOT_FOUND,
    );
  }

  const targetShift = await prisma.shift.findUnique({
    where: { shift_name: cleanShiftName },
  });
  if (!targetShift) {
    throw new AppError(
      `Shift '${cleanShiftName}' not found.`,
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

  // Calculate strict calendar dates using our utility helper
  const targetStartDate = new Date(`${cleanYearName}-01-01T00:00:00.000Z`);
  const targetEndDate = new Date(`${cleanYearName}-12-31T23:59:59.999Z`);
  return prisma.$transaction(
    async (tx) => {
      const auditRecords: Prisma.AuditLogCreateManyInput[] = [];

      // Prevent duplicate enrolled
      const alreadyEnrolled = await tx.classHistory.findFirst({
        where: {
          student_id,
          academic_year_id: targetYear.id,
        },
      });

      if (alreadyEnrolled) {
        throw new AppError(
          `Student is already admitted/enrolled for academic year '${cleanYearName}'.`,
          StatusCodes.CONFLICT,
        );
      }

      // 2. Fetch the target Student Profile with their current active timeline block
      const lastYear = (Number(target_year_name) - 1).toString();
      const lastYearEndDate = new Date(`${lastYear}-12-31T23:59:59.999Z`);
      const studentProfile = await tx.student.findUnique({
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
        },
      });

      if (!studentProfile) {
        throw new AppError(
          "Student profile record not found.",
          StatusCodes.NOT_FOUND,
        );
      }

      // 3. Enforce bulletproof multi-admission database guardrails
      const rollConflictCheck = await tx.classHistory.findFirst({
        where: {
          roll_number,
          class_id: target_class_id,
          shift_id: targetShift.id,
          academic_year_id: targetYear.id,
        },
      });

      if (rollConflictCheck) {
        throw new AppError(
          `Roll number ${roll_number} is already occupied in this class, shift, and academic year.`,
          StatusCodes.CONFLICT,
        );
      }

      // 4. STEP A: UPDATE TARGET CLASS POINTER ON THE ROOT STUDENT PROFILE
      const updatedStudent = await tx.student.update({
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

      // 5. STEP B: SPAWN FRESH NEW YEAR CLASS HISTORY TRACKING ROW
      const freshClassHistory = await tx.classHistory.create({
        data: {
          student_id,
          class_id: target_class_id,
          shift_id: targetShift.id,
          academic_year_id: targetYear.id,
          roll_number,
          start_date: targetStartDate, // Set cleanly to 1st January
          end_date: targetEndDate, // Set cleanly to 31st December
          quranic_class_id: quranic_class_id || undefined,
          quranic_class_period_id: quranic_class_period_id || undefined,
          created_by_id: loggedInUser.user_id,
        },
      });

      // Construct clean, filtered audit payload using camelCase structure rules
      const rawNewValue = {
        id: freshClassHistory.id,
        student_id,
        class_id: target_class_id,
        shift_id: targetShift.id,
        academic_year_id: targetYear.id,
        roll_number,
        start_date: targetStartDate.toISOString(),
        end_date: targetEndDate.toISOString(),
        quranic_class_id: quranic_class_id || null,
        quranic_class_period_id: quranic_class_period_id || null,
      };

      const cleanNewValue = Object.fromEntries(
        Object.entries(rawNewValue).filter(
          ([_, v]) => v !== null && v !== undefined,
        ),
      );
      auditRecords.push({
        entity_id: freshClassHistory.id,
        entity_name: "classHistory",
        action: "CREATE",
        changed_by_id: loggedInUser.user_id,
        old_value: Prisma.JsonNull,
        new_value: cleanNewValue,
      });

      // 7. STEP D: BULK ATOMIC COMMIT OF TRACKED AUDIT ENTRIES
      await tx.auditLog.createMany({ data: auditRecords });

      return updatedStudent;
    },
    { timeout: 25000 },
  );
};
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
        entity_name: "student",
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
  addResponsibleTeacher,
};
