import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema";
import { academicResultZodSchema } from "./academicResult.zodValidation";
import { academicResultController } from "./academicResult.controller";
import { Role } from "#db-client";

const router = Router();

// ==========================================
// CREATE ACADEMIC RESULT ROUTE
// ==========================================
router.post(
  "/create",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(academicResultZodSchema.createAcademicResultZodSchema),
  academicResultController.createAcademicResult,
);

// ==========================================
// DELETE ACADEMIC RESULT ROUTE
// ==========================================
router.delete(
  "/delete/:academic_result_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(academicResultZodSchema.academicResultIdParamsZodSchema),
  academicResultController.deleteAcademicResult,
);

// ==========================================
// UPDATE ACADEMIC RESULT FIELD ROUTE
// ==========================================
router.patch(
  "/update_field/:academic_result_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(academicResultZodSchema.academicResultIdParamsZodSchema),
  validateZodSchema(academicResultZodSchema.updateAcademicResultFieldZodSchema),
  academicResultController.updateAcademicResultField,
);

// ==========================================
// GET ALL ACADEMIC RESULTS ROUTE
// ==========================================
router.get(
  "/",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  academicResultController.getAllAcademicResults,
);

// ==========================================
// GET SINGLE ACADEMIC RESULT BY ID ROUTE
// ==========================================
router.get(
  "/:academic_result_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(academicResultZodSchema.academicResultIdParamsZodSchema),
  academicResultController.getSingleAcademicResult,
);

// ===============================================
// GET ACADEMIC RESULT BY STAFF ID ROUTE
// ===============================================
router.get(
  "/by_staff/:staff_id/:staff_role_name",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(
    academicResultZodSchema.getAcademicResultByStaffIdZodSchema,
  ),
  academicResultController.getAcademicResultByStaffId,
);
export const academicResultRouter: Router = router;
