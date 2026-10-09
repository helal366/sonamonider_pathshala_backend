import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { studentController } from "./student.controller";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { studentZodSchema } from "./student.zodValidation";

// =============================================
// STUDENT READMISSION ROUTE
// =============================================
const router = Router();
// =========================================================
// STUDENT READMISSION ROUTE
// =========================================================
router.post(
  "/student_readmission",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(studentZodSchema.studentReadmissionZodSchema),
  studentController.studentReadmission,
);

// =============================================
// ADD RESPONSIBLE TEACHER ROUTE
// =============================================
router.patch(
  "/add_responsible_teacher",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(studentZodSchema.addResponsibleTeacherZodSchema),
  studentController.addResponsibleTeacher,
);
export const studentRouter: Router = router;
