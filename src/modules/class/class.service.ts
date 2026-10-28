import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  TAssignGradeGroupTeacherZodSchema,
  TCreateClassZodSchema,
  TDisconnectGradeGroupTeacherZodSchema,
} from "./class.zodValidation";
import { IUpdateClassField } from "./class.interface";
import { academicStaffServices } from "../academicStaff/academicStaff.service";

// =============================================
// CREATE CLASS NAME SERVICE LAYER
// =============================================
const createClassName = async (
  payload: TCreateClassZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { class_name } = payload;
  const cleanClassName = class_name.trim().toUpperCase();
  return await prisma.$transaction(async (tx) => {
    const existingClass = await tx.class.findUnique({
      where: { class_name: cleanClassName },
    });
    if (existingClass) {
      throw new AppError(
        `Provided class ${class_name} already exists `,
        StatusCodes.CONFLICT,
      );
    }
    const createdNewClass = await tx.class.create({
      data: {
        class_name: cleanClassName,
        created_by: {
          connect: { id: loggedInUser.user_id },
        },
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: createdNewClass.id,
        entity_name: "class",
        action: "CREATE",
        changed_by: { connect: { id: loggedInUser.user_id } },
        old_value: Prisma.JsonNull,
        new_value: createdNewClass as unknown as Prisma.InputJsonValue,
      },
    });
    return createdNewClass;
  });
};

// =============================================
// DELETE CLASS NAME SERVICE LAYER
// =============================================
const deleteClassName = async (
  class_id: string,
  loggedInUser: TLoggedInUser,
) => {
  return await prisma.$transaction(async (tx) => {
    const existingClass = await tx.class.findUnique({
      where: { id: class_id },
    });
    if (!existingClass) {
      throw new AppError(`Provided class not found.`, StatusCodes.NOT_FOUND);
    }
    const routineCount = await tx.classRoutine.count({
      where: { class: { some: { id: class_id } } },
    });
    if (routineCount > 0) {
      throw new AppError(
        "Cannot delete a class that is assigned to class routines.",
        StatusCodes.CONFLICT,
      );
    }

    const deleteClassData = await tx.class.delete({ where: { id: class_id } });
    await tx.auditLog.create({
      data: {
        entity_id: class_id,
        entity_name: "class",
        changed_by: { connect: { id: loggedInUser.user_id } },
        action: "DELETE",
        old_value: existingClass as unknown as Prisma.InputJsonValue,
        new_value: Prisma.JsonNull,
      },
    });
    return deleteClassData;
  });
};

// =============================================
// UPDATE CLASS FIELD SERVICE LAYER
// =============================================
const updateClassField = async (
  updatePayload: IUpdateClassField,
  loggedInUser: TLoggedInUser,
) => {
  const { class_id, field, value } = updatePayload;
  return await prisma.$transaction(async (tx) => {
    const existingClass = await tx.class.findUnique({
      where: { id: class_id },
    });
    if (!existingClass) {
      throw new AppError(`Provided class not found.`, StatusCodes.NOT_FOUND);
    }

    const updated = await tx.class.update({
      where: { id: class_id },
      data: {
        [field]: value,
        updated_by: { connect: { id: loggedInUser.user_id } },
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: class_id,
        entity_name: "class",
        action: "UPDATE",
        changed_by: { connect: { id: loggedInUser.user_id } },
        old_value: {
          [field]: existingClass[field as keyof typeof existingClass],
        } as Prisma.InputJsonValue,
        new_value: { [field]: value } as Prisma.InputJsonValue,
      },
    });
    return updated;
  });
};

// =============================================
// GET ALL CLASS NAME SERVICE LAYER
// =============================================
const getAllClassNames = async () => {
  return await prisma.class.findMany({
    select: {
      id: true,
      class_name: true,
    },
  });
};

// =============================================
// ASSIGN GRADE GROUP TEACHER SERVICE LAYER
// =============================================
const assignGradeGroupTeacher = async (
  payload: TAssignGradeGroupTeacherZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  return academicStaffServices.assignGradeGroupTeacher(payload, loggedInUser);
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
    return updated;
  });
};
export const classServices = {
  createClassName,
  deleteClassName,
  updateClassField,
  getAllClassNames,
  assignGradeGroupTeacher,
  disconnectGradeGroupTeacher,
};
