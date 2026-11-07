import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { Role } from "#db-client";

const router = Router();
// ======================================================
// CREATE STUDENT RESULT ROUTE
// ======================================================
router.post(
    "/create_student_result",
    userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
    
)

export const studentResultRouter:Router = router