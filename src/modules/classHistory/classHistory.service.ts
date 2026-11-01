import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";

const classHistoryInclude = {
  student: {
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
  class: { select: { id: true, class_name: true } },
  academic_year: { select: { id: true, academic_year_name: true } },
  quranic_subject: { select: { id: true, quranic_subject_name: true } },
  class_history_quranic_periods: {
    include: {
      quranic_period: {
        select: { id: true, quranic_period_name: true, start_time: true, end_time: true },
      },
    },
  },
} satisfies Prisma.ClassHistoryInclude;

const orderBy = [{ academic_year: { academic_year_name: "desc" } }, { start_date: "desc" }, { id: "asc" }] satisfies Prisma.ClassHistoryOrderByWithRelationInput[];

const getAllClassHistories = async () =>
  prisma.classHistory.findMany({
    include: classHistoryInclude,
    orderBy,
  });

const getClassHistoryById = async (id: string) => {
  const history = await prisma.classHistory.findUnique({
    where: { id },
    include: classHistoryInclude,
  });

  if (!history) {
    throw new AppError("Class history not found.", StatusCodes.NOT_FOUND);
  }

  return history;
};

const getClassHistoriesByStudentId = async (studentId: string) => {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    select: { id: true },
  });
  if (!student) {
    throw new AppError("Student not found.", StatusCodes.NOT_FOUND);
  }

  return prisma.classHistory.findMany({
    where: { student_id: studentId },
    include: classHistoryInclude,
    orderBy,
  });
};

const getClassHistoriesByClassId = async (classId: string) => {
  const foundClass = await prisma.class.findUnique({
    where: { id: classId },
    select: { id: true },
  });
  if (!foundClass) {
    throw new AppError("Class not found.", StatusCodes.NOT_FOUND);
  }

  return prisma.classHistory.findMany({
    where: { class_id: classId },
    include: classHistoryInclude,
    orderBy,
  });
};

const getClassHistoriesByAcademicYearId = async (academicYearId: string) => {
  const academicYear = await prisma.academicYear.findUnique({
    where: { id: academicYearId },
    select: { id: true },
  });
  if (!academicYear) {
    throw new AppError("Academic year not found.", StatusCodes.NOT_FOUND);
  }

  return prisma.classHistory.findMany({
    where: { academic_year_id: academicYearId },
    include: classHistoryInclude,
    orderBy,
  });
};

export const classHistoryServices = {
  getAllClassHistories,
  getClassHistoryById,
  getClassHistoriesByStudentId,
  getClassHistoriesByClassId,
  getClassHistoriesByAcademicYearId,
};
