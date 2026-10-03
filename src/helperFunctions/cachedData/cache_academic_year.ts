import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { AppError } from "../globalError/globalErrorHelperFunction";

export interface ICacheAcademicYear {
  id: string;
  academic_year_name: string;
}
let cacheAcademicYear: Promise<ICacheAcademicYear[]> | null = null;
const getValidAcademicYears = async (): Promise<ICacheAcademicYear[]> => {
  if (!cacheAcademicYear) {
    cacheAcademicYear = (async () => {
      try {
        return await prisma.academicYear.findMany({
          select: { id: true, academic_year_name: true },
        });
      } catch (error) {
        cacheAcademicYear = null;
        throw error;
      }
    })();
  }
  return cacheAcademicYear;
};

const clearCacheAcademicYear = (): void => {
  cacheAcademicYear = null;
};

const findAcademicYearExistance = async (academic_year_name: string) => {
  const validAcademicYears = await getValidAcademicYears();
  const findAcademicYear = validAcademicYears.find(
    (year) => year.academic_year_name === academic_year_name,
  );

  if (!findAcademicYear) {
    throw new AppError(
      `Provided academic year ${academic_year_name} not found.`,
      StatusCodes.NOT_FOUND,
    );
  }
  return findAcademicYear;
};

const checkAcademicYearAvailability = async (academic_year_name: string) => {
  const validAcademicYears = await getValidAcademicYears();
  const findAcademicYear = validAcademicYears.find(
    (year) => year.academic_year_name === academic_year_name,
  );

  if (findAcademicYear) {
    throw new AppError(
      `Provided academic year ${academic_year_name} already exists.`,
      StatusCodes.NOT_FOUND,
    );
  }
  return findAcademicYear;
};
export const academicYearCache = {
  getValidAcademicYears,
  clearCacheAcademicYear,
  findAcademicYearExistance,
  checkAcademicYearAvailability
};
