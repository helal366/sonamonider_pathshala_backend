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
  const { class_name, book_name, publisher, section, version } = payload;

  return await prisma.$transaction(async (transaction) => {
    // Find class by name
    const classExists = await transaction.class.findUnique({
      where: { class_name },
    });
    // Check class existance
    if (!classExists) {
      throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
    }

    // Find for duplicate entry
    const bookExists = await transaction.booklist.findFirst({
      where: {
        class_id: classExists.id,
        book_name,
        publisher,
        section,
        version,
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
        class_id: classExists.id,
        book_name,
        publisher,
        section,
        version,
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
          class_id: classExists.id,
          class_name,
          book_name,
          publisher,
          section,
          version,
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
      include: { class: { select: { class_name: true } } },
    });
    // Check existance
    if (!bookList) {
      throw new AppError(`The book list is not found.`, StatusCodes.NOT_FOUND);
    }

    let classId = bookList.class_id;
    let bookName = bookList.book_name;
    let publisher = bookList.publisher;
    let section = bookList.section;
    let version = bookList.version;
    let updateData: Prisma.BooklistUpdateInput;
    let oldValue: Prisma.InputJsonObject;
    let newValue: Prisma.InputJsonObject;

    switch (field) {
      case "book_name":
        if (bookList.book_name === value) {
          throw new AppError(`Field value already exists`, StatusCodes.CONFLICT);
        }
        bookName = value;
        updateData = { book_name: value };
        oldValue = { book_name: bookList.book_name };
        newValue = { book_name: value };
        break;
      case "publisher":
        if (bookList.publisher === value) {
          throw new AppError(`Field value already exists`, StatusCodes.CONFLICT);
        }
        publisher = value;
        updateData = { publisher: value };
        oldValue = { publisher: bookList.publisher };
        newValue = { publisher: value };
        break;
      case "class_name": {
        const targetClass = await transaction.class.findUnique({
          where: { class_name: value },
        });
        if (!targetClass) {
          throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
        }
        if (bookList.class_id === targetClass.id) {
          throw new AppError(`Field value already exists`, StatusCodes.CONFLICT);
        }
        classId = targetClass.id;
        updateData = { class: { connect: { id: targetClass.id } } };
        oldValue = { class_name: bookList.class.class_name };
        newValue = { class_name: targetClass.class_name };
        break;
      }
      case "section":
        if (bookList.section === value) {
          throw new AppError(`Field value already exists`, StatusCodes.CONFLICT);
        }
        section = value;
        updateData = { section: value };
        oldValue = { section: bookList.section };
        newValue = { section: value };
        break;
      case "version":
        if (bookList.version === value) {
          throw new AppError(`Field value already exists`, StatusCodes.CONFLICT);
        }
        version = value;
        updateData = { version: value };
        oldValue = { version: bookList.version };
        newValue = { version: value };
        break;
    }

    // Find duplicate of the provided field value
    const duplicateFind = await transaction.booklist.findFirst({
      where: {
        id: { not: bookListId },
        class_id: classId,
        book_name: bookName,
        publisher,
        section,
        version,
      },
    });
    if (duplicateFind) {
      throw new AppError(
        `The book already exists with the same class, publisher, section, and version.`,
        StatusCodes.CONFLICT,
      );
    }
    // Update book list single field value
    const updated = await transaction.booklist.update({
      where: { id: bookListId },
      data: updateData,
    });
    // Create audit log
    await transaction.auditLog.create({
      data: {
        entity_id: bookListId,
        entity_name: "bookList",
        changed_by_id: LoggedInUser.user_id,
        action: "UPDATE",
        old_value: oldValue,
        new_value: newValue,
      },
    });
    return updated;
  });
};

// =====================================================================
// GET ALL BOOK LIST SERVICE LAYER
// =====================================================================
const getAllBookList = async () => {
  return await prisma.booklist.findMany({
    include: {
      class: { select: { class_name: true } },
      created_by: { select: { full_name: true, mobile_number: true } },
    },
  });
};

// =====================================================================
// GET BOOK LIST BY CLASS ID SERVICE LAYER
// =====================================================================
const getBookListByClass = async (class_id: string) => {
  return prisma.$transaction(async (transaction) => {
    // Find the class by class_id
    const theClass = await transaction.class.findUnique({
      where: { id: class_id },
    });
    // Check the class is exists or not
    if (!theClass) {
      throw new AppError(`Class not found.`, StatusCodes.NOT_FOUND);
    }

    // Get book list by class
    return transaction.booklist.findMany({ where: { class_id } });
  });
};

// =====================================================================
// GET SINGLE BOOK LIST SERVICE LAYER
// =====================================================================
const getSingleBookList = async (bookListId: string) => {
  return prisma.$transaction(async (transaction) => {
    // Find the book list
    const bookList = await transaction.booklist.findUnique({
      where: { id: bookListId },
      include: {
        class: {
          select: {
            class_name: true,
          },
        },
      },
    });
    
    // Check the existance
    if (!bookList) {
      throw new AppError(`The book list not found.`, StatusCodes.NOT_FOUND);
    };

    // Return 
    return bookList
  });
};

// =====================================================================
// GET BOOK LIST BY PUBLISHER SERVICE LAYER
// =====================================================================
const getBookListPublisher = async(publisher: string)=>{
  return await prisma.booklist.findMany({where: {publisher}})
}
export const bookListServices = {
  createBookList,
  deleteBookList,
  updateBookListSingleField,
  getAllBookList,
  getBookListByClass,
  getSingleBookList,
  getBookListPublisher
};
