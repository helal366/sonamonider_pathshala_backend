import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema";
import { academicYearZodSchema } from "./academicYear.zodValidation";
import { academicYearController } from "./academicYear.controller";
import { Role } from "#db-client";

const router = Router();

// ==========================================
// CREATE ACADEMIC YEAR ROUTE
// ==========================================
router.post(
  "/create",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(academicYearZodSchema.createAcademicYearZodSchema),
  academicYearController.createAcademicYear,
);

// ==========================================
// DELETE ACADEMIC YEAR ROUTE
// ==========================================
router.delete(
  "/delete/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(academicYearZodSchema.academicYearIdParamsZodSchema),
  academicYearController.deleteAcademicYear,
);

// ==========================================
// UPDATE ACADEMIC YEAR FIELD ROUTE
// ==========================================
router.patch(
  "/update_field/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(academicYearZodSchema.academicYearIdParamsZodSchema),
  validateZodSchema(academicYearZodSchema.updateAcademicYearFieldZodSchema),
  academicYearController.updateAcademicYearField,
);

// ==========================================
// GET ALL ACADEMIC YEAR ROUTE
// ==========================================
router.get(
  "/",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  academicYearController.getAllAcademicYearName,
);

// ==========================================
// GET SINGLE ACADEMIC YEAR ROUTE
// ==========================================
router.get(
  "/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(academicYearZodSchema.getSingleAcademicYearZodSchema),
  academicYearController.getSingleAcademicYearWithHistory,
);
export const academicYearRouter: Router = router;
