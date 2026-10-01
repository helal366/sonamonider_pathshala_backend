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
  return existingData
};

export const academicResultHelper = {
  createPayload
}