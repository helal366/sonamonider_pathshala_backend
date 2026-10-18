import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import {
  TCreateBookListZodSchema,
  TUpdateBookListSingleFieldZodSchema,
} from "./bookList.zodValidation";
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
// DELETE BOOK LIST SERVICE LAYER
// =====================================================================
const deleteBookList = async (
  LoggedInUser: TLoggedInUser,
  bookListId: string,
) => {
  return await prisma.$transaction(async (transaction) => {
    // Find book list
    const bookListExist = await transaction.booklist.findUnique({
      where: { id: bookListId },
    });
    // Check existance
    if (!bookListExist) {
      throw new AppError(`Book list not found.`, StatusCodes.NOT_FOUND);
    }
    // Delete the booklist
    const deleted = await transaction.booklist.delete({
      where: { id: bookListId },
    });
    // Create audit log
    await transaction.auditLog.create({
      data: {
        entity_id: bookListId,
        entity_name: "booklist",
        action: "DELETE",
        changed_by_id: LoggedInUser.user_id,
        old_value: bookListExist,
        new_value: Prisma.JsonNull,
      },
    });
    return deleted;
  });
};

// =====================================================================
// UPDATE BOOK LIST SINGLE FIELD SERVICE LAYER
// =====================================================================
const updateBookListSingleField = async (
  LoggedInUser: TLoggedInUser,
  payload: TUpdateBookListSingleFieldZodSchema,
  bookListId: string,
) => {
  const { field, value } = payload;
  return await prisma.$transaction(async (transaction) => {
    // Find book list with bookListId
    const bookList = await transaction.booklist.findUnique({
      where: { id: bookListId },
    });
    // Check existance
    if (!bookList) {
      throw new AppError(`The book list is not found.`, StatusCodes.NOT_FOUND);
    }
    // Check field value is new or not.
    if (bookList[field] === value) {
      throw new AppError(`Field value already exists`, StatusCodes.CONFLICT);
    }
    // Find duplicate of the provided field value
    const duplicateFind = await transaction.booklist.findFirst({
      where: {
        id: { not: bookListId },
        class_id: bookList.class_id,
        book_name: field === "book_name" ? value : bookList.book_name,
        publisher: field === "publisher" ? value : bookList.publisher,
      },
    });
    if (duplicateFind) {
      throw new AppError(
        `The book already exists with the same class and publisher.`,
        StatusCodes.CONFLICT,
      );
    }
    // Update book list single field value
    const updated = await transaction.booklist.update({
      where: { id: bookListId },
      data: {
        [field]: value,
      },
    });
    // Create audit log
    await transaction.auditLog.create({
      data: {
        entity_id: bookListId,
        entity_name: "bookList",
        changed_by_id: LoggedInUser.user_id,
        action: "UPDATE",
        old_value: {
          [field]: bookList[field],
        },
        new_value: {
          [field]: value,
        },
      },
    });
    return updated;
  });
};

// =====================================================================
// GET ALL BOOK LIST SERVICE LAYER
// =====================================================================
const getAllBookList = async()=>{
  return await prisma.booklist.findMany({
    include: {
      class:{select: {class_name: true}},
      created_by: {select: {full_name: true, mobile_number: true}}
    }
  })
};


// =====================================================================
// GET BOOK LIST BY CLASS ID SERVICE LAYER
// =====================================================================
const getBookListByClass = async(class_id:string)=>{
  return prisma.$transaction(async(transaction)=>{
    // Find the class by class_id
    const theClass =await transaction.class.findUnique({
      where: {id: class_id},
    });
    // Check the class is exists or not
    if(!theClass){
      throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND)
    };

    // Get book list by class
    return transaction.booklist.findMany({where: {class_id}})
  })
}
export const bookListServices = {
  createBookList,
  deleteBookList,
  updateBookListSingleField,
  getAllBookList,
  getBookListByClass
};
