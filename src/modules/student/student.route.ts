import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { studentController } from "./student.controller";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema";
import { studentZodSchema } from "./student.zodValidation";
import { Role } from "#db-client";
const router = Router();

// ========================================================
// STUDENT READMISSION ROUTE
// ========================================================
router.post(
  "/student_readmission/:student_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(studentZodSchema.studentReadmissionParamsZodSchema),
  validateZodSchema(studentZodSchema.studentReadmissionZodSchema),
  studentController.studentReadmission,
);

// ========================================================
// STUDENT DEACTIVATE ROUTE
// ========================================================
// Deactivate all students whose enrollment period has ended.
router.post(
  "/deactivate_not_readmitted_students",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(studentZodSchema.studentDeactivateZodSchema),
  studentController.deactivateNotReadmittedStudents,
);

// ========================================================
// OLD STUDENT ADMISSION ROUTE
// ========================================================
router.patch(
  "/old_student_admission/:student_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(studentZodSchema.oldStudentAdmissionParamsZodSchema),
  validateZodSchema(studentZodSchema.oldStudentAdmissionZodSchema),
  studentController.oldStudentAdmission
)

// ========================================================
// ADD RESPONSIBLE TEACHER ROUTE
// ========================================================
router.patch(
  "/add_responsible_teacher",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(studentZodSchema.addResponsibleTeacherZodSchema),
  studentController.addResponsibleTeacher,
);

// ========================================================
// DISCONNECT RESPONSIBLE TEACHER ROUTE
// ========================================================
router.patch(
  "/disconnect_responsible_teacher",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(studentZodSchema.disconnectResponsibleTeacherZodSchema),
  studentController.disconnectResponsibleTeacher,
);
export const studentRouter: Router = router;
