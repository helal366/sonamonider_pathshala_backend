import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { TCreateBookListZodSchema } from "./bookList.zodValidation";
import { Prisma } from "#db-client";


// =====================================================================
// CREATE BOOK LIST SERVICE LAYER
// =====================================================================
const createBookList = async (
  LoggedInUser: TLoggedInUser,
  payload: TCreateBookListZodSchema,
) => {
  const { class_id, book_name, publisher } = payload;

  return await prisma.$transaction(async (transaction) => {
    // Find class
    const classExists = await transaction.class.findUnique({
      where: { id: class_id },
    });
    // Check class existance
    if (!classExists) {
      throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
    }

    // Find for duplicate entry
    const bookExists = await transaction.booklist.findFirst({
      where: {
        class_id,
        book_name,
        publisher,
      },
    });
    // Check duplicate entry
    if (bookExists) {
      throw new AppError(
        `The book already exists with the same class and publisher.`,
        StatusCodes.BAD_REQUEST,
      );
    }

    // Create book list
    const created = await transaction.booklist.create({
      data: {
        class_id,
        book_name,
        publisher,
        created_by_id: LoggedInUser.user_id,
      },
    });

    // Audit log creat
    await transaction.auditLog.create({
      data: {
        entity_id: created.id,
        entity_name: "booklist",
        changed_by_id: LoggedInUser.user_id,
        action: "CREATE",
        old_value: Prisma.JsonNull,
        new_value: {
          class_id,
          book_name,
          publisher,
        },
      },
    });
    return created;
  });
};

// =====================================================================
// DELETE BOOK LIST CONTROLLER
// =====================================================================
const deleteBookList = async(
    LoggedInUser: TLoggedInUser,
    bookListId: string
)=>{
    return await prisma.$transaction(async(transaction)=>{
        // Find book list
        const bookListExist = await transaction.booklist.findUnique({
            where: {id: bookListId}
        });
        // Check existance 
        if(!bookListExist){
            throw new AppError(`Book list not found.`, StatusCodes.NOT_FOUND)
        }
        // Delete the booklist 
        const deleted = await transaction.booklist.delete({
            where: {id: bookListId}
        });
        // Create audit log
        await transaction.auditLog.create({
            data: {
                entity_id: bookListId,
                entity_name: "booklist",
                action: "DELETE",
                changed_by_id: LoggedInUser.user_id,
                old_value:  bookListExist,
                new_value: Prisma.JsonNull
            }
        })
        return deleted
    })
}
export const bookListServices = {
  createBookList,
  deleteBookList
};
