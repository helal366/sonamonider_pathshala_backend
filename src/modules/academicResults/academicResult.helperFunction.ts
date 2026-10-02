import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { TCreateAcademicResultZodSchema } from "./academicResult.zod.validation";

const createPayload = (payload: TCreateAcademicResultZodSchema) => {
  const {
    ssc_result,
    dakhil_result,
    hsc_result,
    alim_result,
    hons_result,
    fazil_result,
    masters_result,
    kamil,
  } = payload;

  let existingData: Record<string, any> = {};

  if (ssc_result) existingData.ssc_result = ssc_result;
  if (dakhil_result) existingData.dakhil_result = dakhil_result;
  if (hsc_result) existingData.hsc_result = hsc_result;
  if (alim_result) existingData.alim_result = alim_result;
  if (hons_result) existingData.hons_result = hons_result;
  if (fazil_result) existingData.fazil_result = fazil_result;
  if (masters_result) existingData.masters_result = masters_result;
  if (kamil) existingData.kamil = kamil;
  return existingData;
};

const findStaffTable = (role_name: string) => {
  // const managementRoles = [
  //   "MANAGEMENT",
  //   "SUPER_ADMIN",
  //   "ADMIN",
  //   "TEACHER_ADMIN",
  // ];
  // if(managementRoles.includes(role_name)){
  //   return "managementStaff"
  // }else if(role_name === "ACADEMIC"){
  //   return "academicStaff";
  // }else if(role_name){
  //   return "governingBody";
  // }
  let prismaTableName:
    | "managementStaff"
    | "academicStaff"
    | "governingBody"
    | undefined;

  const isManagement =
    role_name === "MANAGEMENT" ||
    role_name === "SUPER_ADMIN" ||
    role_name === "ADMIN" ||
    role_name === "TEACHER_ADMIN";
  if (isManagement) {
    prismaTableName = "managementStaff";
  } else if (role_name === "ACADEMIC") {
    prismaTableName = "academicStaff";
  } else if (role_name === "GOVERNING_BODY") {
    prismaTableName = "governingBody";
  }

  if (!prismaTableName) {
    throw new AppError(
      "Invalid role name. Table not found",
      StatusCodes.BAD_REQUEST,
    );
  }
  return prismaTableName;
};
export const academicResultHelper = {
  createPayload,
  findStaffTable,
};
