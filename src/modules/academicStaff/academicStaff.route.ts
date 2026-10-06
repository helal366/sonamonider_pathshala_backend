import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { academicStaffZodSchema } from "./academicStaff.zod.validation";
import { academicStaffController } from "./academicStaff.controller";

const router = Router();
router.patch(
    "/update_subject",
    userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
    validateZodSchema(academicStaffZodSchema.updateSubjectForSubjectTeacherZodSchema),
    academicStaffController.updateSubjectForSubjectTeacher
)
export const academicStaffRouter:Router = router;