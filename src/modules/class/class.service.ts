import { Prisma } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TCreateClassZodSchema } from "./class.zod.validation";
import { IUpdateClassField } from "./class.interface";

// =============================================
// CREATE CLASS NAME SERVICE LAYER
// =============================================
const createClassName = async (
  payload: TCreateClassZodSchema,
  loggedInUser: TLoggedInUser,
) => {
  const { class_name } = payload;
  return await prisma.$transaction(async (tx) => {
    const createdNewClass = await tx.class.create({
      data: {
        class_name,
        created_by: {
          connect: { id: loggedInUser.user_id },
        },
      },
    });

    await tx.auditLog.create({
      data: {
        entity_id: createdNewClass.id,
        entity_name: "Class",
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
    const deleteClassData = await tx.class.delete({ where: { id: class_id } });
    await tx.auditLog.create({
      data: {
        entity_id: class_id,
        entity_name: "Class",
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
    updatePayload:IUpdateClassField,
  loggedInUser:TLoggedInUser
) => {
    const {class_id, field, value} = updatePayload
    return await prisma.$transaction(async(tx)=>{
        const existingClass = await tx.class.findUnique({
          where: { id: class_id },
        });
        if (!existingClass) {
          throw new AppError(`Provided class not found.`, StatusCodes.NOT_FOUND);
        }

        const updated = await tx.class.update({
            where:{id: class_id},
            data: {
                [field]:value,
                updated_by: {connect:{id: loggedInUser.user_id}}
            }
        });

        await tx.auditLog.create({
            data: {
                entity_id: class_id,
                entity_name: "Class",
                action: "UPDATE",
                changed_by:{connect:{id: loggedInUser.user_id}},
                old_value: {
                    [field]: existingClass[field as keyof typeof existingClass]
                } as Prisma.InputJsonValue,
                new_value: { [field]: value } as Prisma.InputJsonValue
            }
        })
        return updated;
    })
};

// =============================================
// GET ALL CLASS NAME SERVICE LAYER
// =============================================
const getAllClassNames=async()=>{
  return await prisma.class.findMany({
    select:{
      id:true,
      class_name: true
    }
  })
}
export const classServices = {
  createClassName,
  deleteClassName,
  updateClassField,
  getAllClassNames,
};
