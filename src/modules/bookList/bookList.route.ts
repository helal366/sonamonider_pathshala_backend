import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "#db-client";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema";
import { bookListZodSchema } from "./bookList.zodValidation";
import { bookListController } from "./bookList.controller";

const router = Router();

// =====================================================================
// CREATE BOOK LIST ROUTE
// =====================================================================
router.post(
    "/create_book_list",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    validateZodSchema(bookListZodSchema.createBookListZodSchema),
    bookListController.createBookList
);

// =====================================================================
// DELETE BOOK LIST ROUTE
// =====================================================================
router.patch(
    "/delete_book_list/:book_list_id",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    validateZodParams(bookListZodSchema.bookListIdParamsZodSchema),
    bookListController.deleteBookList
);

// =====================================================================
// UPDATE BOOK LIST SINGLE FIELD ROUTE
// =====================================================================
router.patch(
    "/update_single_field/:book_list_id",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    validateZodParams(bookListZodSchema.bookListIdParamsZodSchema),
    validateZodSchema(bookListZodSchema.updateBookListSingleFieldZodSchema),
    bookListController.updateBookListSingleField
);

// =====================================================================
// GET ALL BOOK LIST ROUTE
// =====================================================================
router.get(
    "/",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    bookListController.getAllBookList
);

// =====================================================================
// GET BOOK LIST BY CLASS ID ROUTE
// =====================================================================
router.get(
    "/book_list_by_class/:class_id",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    validateZodParams(bookListZodSchema.getBookListsByClassIdParamsZodSchema),
    bookListController.getBookListByClass
);

// =====================================================================
// GET SINGLE BOOK LIST ROUTE
// =====================================================================
router.get(
    "/single_book_list/:book_list_id",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    validateZodParams(bookListZodSchema.bookListIdParamsZodSchema),
    bookListController.getSingleBookList
);

// =====================================================================
// GET BOOK LIST BY PUBLISHER ROUTE
// =====================================================================
router.get(
    "/book_list_by_publusher/:publisher",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    validateZodParams(bookListZodSchema.getBookListByPublisherParamsZodSchema),
    bookListController.getBookListPublisher
)
export const bookListRouter: Router = router;