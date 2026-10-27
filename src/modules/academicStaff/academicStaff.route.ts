import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema";
import { academicStaffZodSchema } from "./academicStaff.zodValidation";
import { academicStaffController } from "./academicStaff.controller";
import { Role } from "#db-client";

const router = Router();

// ================================================
// UPDATE SUBJECT FOR SUBJECT TEAHER ROUTE
// ================================================
router.patch(
  "/update_subject/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(academicStaffZodSchema.academicStaffParamsZodSchema),
  validateZodSchema(
    academicStaffZodSchema.updateSubjectForSubjectTeacherZodSchema,
  ),
  academicStaffController.updateSubjectForSubjectTeacher,
);

// ================================================
// UPDATE ACADEMIC STAFF FIELD ROUTE
// ================================================
router.patch(
  "/update_field/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(academicStaffZodSchema.academicStaffParamsZodSchema),
  validateZodSchema(academicStaffZodSchema.updateAcademicStaffFieldZodSchema),
  academicStaffController.updateAcademicStaffField,
);

// =============================================
// ASSIGN GRADE GROUP TEACHER ROUTE
// =============================================
router.patch(
  "/assign_grade_group_teacher",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(academicStaffZodSchema.assignGradeGroupTeacherZodSchema),
  academicStaffController.assignGradeGroupTeacher,
);

// =============================================
// DISCONNECT GRADE GROUP TEACHER ROUTE
// =============================================
router.patch(
  "/disconnect_grade_group_teacher",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(academicStaffZodSchema.disconnectGradeGroupTeacherZodSchema),
  academicStaffController.disconnectGradeGroupTeacher,
);
export const academicStaffRouter: Router = router;
