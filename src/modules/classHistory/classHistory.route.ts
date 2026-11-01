import { Role } from "#db-client";
import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodParams } from "../../middlewares/validateZodSchema.js";
import { classHistoryController } from "./classHistory.controller.js";
import { classHistoryZodSchema } from "./classHistory.zodValidation.js";

const router = Router();
const classHistoryRoles = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.TEACHER_ADMIN,
  Role.MANAGEMENT,
];

router.get(
  "/get_by_student_id/:student_id",
  userAuth(...classHistoryRoles),
  validateZodParams(classHistoryZodSchema.studentIdParamsZodSchema),
  classHistoryController.getClassHistoriesByStudentId,
);

router.get(
  "/get_by_class_id/:class_id",
  userAuth(...classHistoryRoles),
  validateZodParams(classHistoryZodSchema.classIdParamsZodSchema),
  classHistoryController.getClassHistoriesByClassId,
);

router.get(
  "/get_by_academic_year_id/:academic_year_id",
  userAuth(...classHistoryRoles),
  validateZodParams(classHistoryZodSchema.academicYearIdParamsZodSchema),
  classHistoryController.getClassHistoriesByAcademicYearId,
);

router.get(
  "/",
  userAuth(...classHistoryRoles),
  classHistoryController.getAllClassHistories,
);

router.get(
  "/:id",
  userAuth(...classHistoryRoles),
  validateZodParams(classHistoryZodSchema.classHistoryIdParamsZodSchema),
  classHistoryController.getClassHistoryById,
);

export const classHistoryRouter: Router = router;
