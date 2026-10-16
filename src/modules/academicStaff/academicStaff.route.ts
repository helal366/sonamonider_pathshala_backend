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
router.patch(
  "/update_subject/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(academicStaffZodSchema.academicStaffParamsZodSchema),
  validateZodSchema(
    academicStaffZodSchema.updateSubjectForSubjectTeacherZodSchema,
  ),
  academicStaffController.updateSubjectForSubjectTeacher,
);

router.patch(
  "/update_field/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(academicStaffZodSchema.academicStaffParamsZodSchema),
  validateZodSchema(academicStaffZodSchema.updateAcademicStaffFieldZodSchema),
  academicStaffController.updateAcademicStaffField,
);
export const academicStaffRouter: Router = router;
