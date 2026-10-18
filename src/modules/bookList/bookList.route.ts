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
    "/delete_book_list/:id",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    validateZodParams(bookListZodSchema.deleteBookListParamsZodSchema),
    bookListController.deleteBookList
);

// =====================================================================
// UPDATE BOOK LIST SINGLE FIELD ROUTE
// =====================================================================
router.patch(
    "/update_single_field/:id",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    validateZodParams(bookListZodSchema.updateBookListSingleFieldParamsZodSchema),
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
)
export const bookListRouter: Router = router;