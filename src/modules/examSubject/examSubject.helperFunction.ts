import { ExamSubject, Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { TUpdateExamSubjectSingleFieldZodSchema } from "./examSubject.zodValidation";

export const checkDuplicateExamSubject = async (
  payload: TUpdateExamSubjectSingleFieldZodSchema,
  examSubject: ExamSubject,
  transaction: Prisma.TransactionClient,
) => {
  const { field, value } = payload;

  //   field is class id
  const duplicateExamSubject = await transaction.examSubject.findFirst({
    where: {
      id: {
        not: examSubject.id,
      },
      class_id: field === "class_id" ? value : examSubject.class_id,
      section: field === "section" ? value : examSubject.section,
      version: field === "version" ? value : examSubject.version,
      department: field === "department" ? value : examSubject.department,
      exam_subject_name:
        field === "exam_subject_name" ? value : examSubject.exam_subject_name,
    },
  });
  if(duplicateExamSubject){
    throw new AppError(`This update will create a duplicate exam subject.`, StatusCodes.CONFLICT)
  }
};
