import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema";
import { academicResultZodSchema } from "./academicResult.zodValidation";
import { academicResultController } from "./academicResult.controller";

const router = Router();

// ==========================================
// CREATE ACADEMIC RESULT ROUTE
// ==========================================
router.post(
  "/create",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(academicResultZodSchema.createAcademicResultZodSchema),
  academicResultController.createAcademicResult,
);

// ==========================================
// DELETE ACADEMIC RESULT ROUTE
// ==========================================
router.delete(
  "/delete/:id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(academicResultZodSchema.deleteAcademicResultZodSchema),
  academicResultController.deleteAcademicResult,
);

// ==========================================
// UPDATE ACADEMIC RESULT FIELD ROUTE
// ==========================================
router.patch(
  "/update_field/:id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(academicResultZodSchema.deleteAcademicResultZodSchema),
  validateZodSchema(academicResultZodSchema.updateAcademicResultFieldZodSchema),
  academicResultController.updateAcademicResultField,
);

// ==========================================
// GET ALL ACADEMIC RESULTS ROUTE
// ==========================================
router.get(
  "/",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  academicResultController.getAllAcademicResults,
);

// ==========================================
// GET SINGLE ACADEMIC RESULT BY ID ROUTE
// ==========================================
router.get(
  "/:id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(academicResultZodSchema.getSingleAcademicResultZodSchema),
  academicResultController.getSingleAcademicResult,
);

// ===============================================
// GET ACADEMIC RESULT BY STAFF ID ROUTE
// ===============================================
router.get(
  "/by_staff/:staff_id/:staff_role_name",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(
    academicResultZodSchema.getAcademicResultByStaffIdZodSchema,
  ),
  academicResultController.getAcademicResultByStaffId,
);
export const academicResultRouter: Router = router;
