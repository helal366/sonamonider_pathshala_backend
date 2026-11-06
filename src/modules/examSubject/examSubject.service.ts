import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  TCreateExamSubjectZodSchema,
  TUpdateExamSubjectZodSchema,
} from "./examSubject.zodValidation";
import { Prisma } from "#db-client";

const throwDuplicateExamSubjectConflict = (error: unknown): never => {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    throw new AppError(`Exam subject already exists.`, StatusCodes.CONFLICT);
  }
  throw error;
};

// ===================================================================
// CREATE EXAM SUBJECT SERVICE LAYER
// ===================================================================
const createExamSubject = async (
  loggedInUser: TLoggedInUser,
  payload: TCreateExamSubjectZodSchema,
) => {
  const { class_id, section, version, department, exam_subject_name} = payload;
  //   Find class and check existance
  const findClass = await prisma.class.findUnique({
    where: { id: class_id },
  });
  if (!findClass) {
    throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
  }
  if (!findClass.is_active_class) {
    throw new AppError(
      `Provided class is unauthorized. Please contact to Super admin.`,
      StatusCodes.BAD_REQUEST,
    );
  }
  //   Find exam subject and check duplicate
  const findExamSubject = await prisma.examSubject.findFirst({
    where: {
      class_id,
      section,
      version,
      department: department ?? "GENERAL",
      exam_subject_name,
    },
  });
  if (findExamSubject) {
    throw new AppError(`Exam subject already exists.`, StatusCodes.CONFLICT);
  }
  try {
    return await prisma.$transaction(async (transaction) => {
      const created = await transaction.examSubject.create({
        data: {
          class_id,
          section,
          version,
          department: department ?? "GENERAL",
          exam_subject_name,
          created_by_id: loggedInUser.user_id,
        },
      });

      await transaction.auditLog.create({
        data: {
          entity_id: created.id,
          entity_name: "examSubject",
          changed_by: { connect: { id: loggedInUser.user_id } },
          action: "CREATE",
          old_value: Prisma.JsonNull,
          new_value: {
            class_id,
            section,
            version,
            department: department ?? "GENERAL",
            exam_subject_name,
            is_active: created.is_active,
          },
        },
      });
      return created;
    });
  } catch (error) {
    throwDuplicateExamSubjectConflict(error);
  }
};

// ===================================================================
// DELETE EXAM SUBJECT SERVICE LAYER
// ===================================================================
const deleteExamSubject = async (
  loggedInUser: TLoggedInUser,
  exam_subject_id: string,
) => {
  return prisma.$transaction(async (transaction) => {
    const examSubject = await transaction.examSubject.findUnique({
      where: { id: exam_subject_id },
      include: {
        _count: {
          select: {
            half_yearly_exam_marks: true,
            annual_exam_marks: true,
          },
        },
      },
    });
    if (!examSubject) {
      throw new AppError(`Exam subject not found.`, StatusCodes.NOT_FOUND);
    }
    const totalCount =
      examSubject._count.half_yearly_exam_marks +
      examSubject._count.annual_exam_marks;
    if (totalCount > 0) {
      throw new AppError(
        `Cannot delete this subject. It contains active exam mark entries. Please clear the marks first.`,
        StatusCodes.CONFLICT,
      );
    }
    const deleted = await transaction.examSubject.delete({
      where: { id: exam_subject_id },
    });
    await transaction.auditLog.create({
      data: {
        entity_id: exam_subject_id,
        entity_name: "examSubject",
        changed_by: { connect: { id: loggedInUser.user_id } },
        action: "DELETE",
        old_value: deleted as Prisma.InputJsonValue,
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });
};

// ===================================================================
// UPDATE EXAM SUBJECT SERVICE LAYER
// ===================================================================
const updateExamSubject = async (
  loggedInUser: TLoggedInUser,
  payload: TUpdateExamSubjectZodSchema,
  exam_subject_id: string,
) => {
  const { class_id, section, version, department, exam_subject_name, is_active } = payload;
  try {
    return await prisma.$transaction(async (transaction) => {
      const examSubject = await transaction.examSubject.findUnique({
        where: { id: exam_subject_id },
      });
      if (!examSubject) {
        throw new AppError(`Exam subject not found.`, StatusCodes.NOT_FOUND);
      }

      if (is_active === false && examSubject.is_active === false) {
        throw new AppError(
          `Provided exam subject is unauthorized. Please contact with Super admin.`,
          StatusCodes.UNAUTHORIZED,
        );
      }

      const classExists = await transaction.class.findUnique({
        where: { id: class_id },
      });
      if (!classExists) {
        throw new AppError(`Provided class not found.`, StatusCodes.NOT_FOUND);
      }
      if (!classExists.is_active_class) {
        throw new AppError(
          `Provided class is unauthorized. Please contact to Super admin.`,
          StatusCodes.BAD_REQUEST,
        );
      }

      if (
        class_id === examSubject.class_id &&
        section === examSubject.section &&
        version === examSubject.version &&
        department === examSubject.department &&
        exam_subject_name === examSubject.exam_subject_name &&
        is_active === examSubject.is_active
      ) {
        throw new AppError(
          `No field have changed. Nothing updatable.`,
          StatusCodes.BAD_REQUEST,
        );
      }

      const fields = {
        class_id,
        section,
        version,
        department,
        exam_subject_name,
      };
      const checkDuplicate = await transaction.examSubject.findFirst({
        where: {
          ...fields,
          id: {
            not: exam_subject_id,
          },
        },
      });
      if (checkDuplicate) {
        throw new AppError(
          `Another exam subject already exists with same section and version and department.`,
          StatusCodes.CONFLICT,
        );
      }

      const updated = await transaction.examSubject.update({
        where: { id: exam_subject_id },
        data: {
          ...fields,
          is_active,
          updated_by_id: loggedInUser.user_id,
        },
      });
      await transaction.auditLog.create({
        data: {
          entity_id: exam_subject_id,
          entity_name: "examSubject",
          changed_by_id: loggedInUser.user_id,
          action: "UPDATE",
          old_value: examSubject as Prisma.InputJsonValue,
          new_value: updated as Prisma.InputJsonValue,
        },
      });
      return updated;
    });
  } catch (error) {
    throwDuplicateExamSubjectConflict(error);
  }
};
export const examSubjectServices = {
  createExamSubject,
  deleteExamSubject,
  updateExamSubject,
};
