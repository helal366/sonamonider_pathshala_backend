import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { sslCommerzInit } from "../../utils/sslCommerz/sslCommerz_init";
import { TCreateTuitionFeePaymentZodSchema } from "./tuitionFeePayment.zodSchema";
import { prisma } from "../../lib/prisma";

// =========================================================
// Create Tuition Fee Payment Service Layer
// =========================================================
const createTuitionFeePayment = async (
  payload: TCreateTuitionFeePaymentZodSchema,
  user_id: string,
) => {
  const user = await prisma.user.findUnique({
    where: {id: user_id},
    select: {
      id: true,
      student_profile: {
        select:{
          id: true
        }
      }
    }
  });
  if(!user){
    throw new AppError(`User not found.`, StatusCodes.NOT_FOUND)
  }
  if(!user.student_profile){
    throw new AppError(`Student profile not found.`, StatusCodes.NOT_FOUND)
  }

  const initPayload = {
    student_id:user.student_profile.id,
    ...payload,
  };
  const { apiResponse, transactionId } = await sslCommerzInit(initPayload);
  // return { apiResponse, tran_id: transactionId };

    if (apiResponse?.status === "SUCCESS" && apiResponse?.sessionkey) {
      return { apiResponse, tran_id: transactionId };
    } else {
      const errMsg: string = apiResponse?.failedreason as string || "Failed to initiate gateway session"
      throw new AppError(
        errMsg,
        StatusCodes.BAD_GATEWAY,
      );
    }
};

export const tuitionFeePaymentServices = {
  createTuitionFeePayment,
};
