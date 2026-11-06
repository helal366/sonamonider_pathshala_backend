import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TCreateExamSubjectZodSchema } from "./examSubject.zodValidation";
import { Prisma } from "#db-client";

// ===================================================================
// CREATE EXAM SUBJECT SERVICE LAYER
// ===================================================================
const createExamSubject = async (
  loggedInUser: TLoggedInUser,
  payload: TCreateExamSubjectZodSchema,
) => {
  const { class_id, section, version, department, exam_subject_name } = payload;
//   Find class and check existance
  const findClass = await prisma.class.findUnique({
    where: { id: class_id },
  });
  if (!findClass) {
    throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
  }
//   Find exam subject and check duplicate
const findExamSubject =await prisma.examSubject.findFirst({
    where: {
        class_id,
        section,
        version,
        department: department ?? "GENERAL",
        exam_subject_name
    }
});
if(findExamSubject){
    throw new AppError(`Exam subject already exists.`, StatusCodes.CONFLICT)
}
  const created = await prisma.examSubject.create({
    data: {
      class_id,
      section,
      version,
      department: department ?? "GENERAL",
      exam_subject_name,
      created_by_id: loggedInUser.user_id,
    },
  });
  await prisma.auditLog.create({
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
      },
    },
  });
  return created;
};

const deleteExamSubject = async(
    loggedInUser: TLoggedInUser,
    exam_subject_id: string
)=>{
    const examSubject = await prisma.examSubject.findUnique({
        where: {id: exam_subject_id},
        include: {
            _count: {
                select: {
                    half_yearly_exam_marks: true,
                    annual_exam_marks: true
                }
            }
        }
    });
    if(!examSubject){
        throw new AppError(`Exam subject not found.`, StatusCodes.NOT_FOUND)
    };
    const totalCount = 
        examSubject._count.half_yearly_exam_marks + 
        examSubject._count.annual_exam_marks;
    if(totalCount > 0){
        throw new AppError(
            `Cannot delete this subject. It contains active exam mark entries. Please clear the marks first.`, 
            StatusCodes.CONFLICT // 409 Conflict is ideal for data dependency blocks
        );
    }
    const deleted = await prisma.examSubject.delete({
        where: {id: exam_subject_id}
    });
    await prisma.auditLog.create({
        data: {
            entity_id: exam_subject_id,
            entity_name: "examSubject",
            changed_by: {connect: {id: loggedInUser.user_id}},
            action: "DELETE",
            old_value: deleted as Prisma.InputJsonValue,
            new_value: Prisma.JsonNull
        }
    })
    return deleted
}
export const examSubjectServices = {
  createExamSubject,
  deleteExamSubject
};
