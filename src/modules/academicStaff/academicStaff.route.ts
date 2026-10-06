import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { academicStaffZodSchema } from "./academicStaff.zod.validation";
import { academicStaffController } from "./academicStaff.controller";


// ===============================================
// ASSIGN GRAGE GROUP TEACHER SERVICE LAYER
// ===============================================
const router = Router();
router.patch(
    "/assign_grade_group_teacher",
    userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
    validateZodSchema(academicStaffZodSchema.assignGradeGroupTeacherZodSchema),
    academicStaffController.assignGradeGroupTeacher
);
router.patch(
    "/update_grade_group_teacher",
    userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
    validateZodSchema(academicStaffZodSchema.assignGradeGroupTeacherZodSchema),
    academicStaffController.updateGradeGroupTeacher
)
export const academicStaffRouter:Router = router