import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "#db-client";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { bookListZodSchema } from "./bookList.zodValidation";
import { bookListController } from "./bookList.controller";

const router = Router();
router.post(
    "/create_book_list",
    userAuth(Role.SUPER_ADMIN, Role.TEACHER_ADMIN, Role.ADMIN),
    validateZodSchema(bookListZodSchema.createBookListZodSchema),
    bookListController.createBookList
)
export const bookListRouter: Router = router;