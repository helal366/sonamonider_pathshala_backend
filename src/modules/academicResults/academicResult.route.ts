import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validate.zod.schema";
import { academicResultZodSchema } from "./academicResult.zod.validation";
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
router.post(
  "/delete",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(academicResultZodSchema.deleteAcademicResultZodSchema),
  academicResultController.deleteAcademicResult,
);

// ==========================================
// UPDATE ACADEMIC RESULT FIELD ROUTE
// ==========================================
router.patch(
    "/update_field",
    userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
    validateZodSchema(academicResultZodSchema.updateAcademicResultFieldZodSchema),
    academicResultController.updateAcademicResultField
);

// ==========================================
// GET ALL ACADEMIC RESULTS ROUTE
// ==========================================
router.get(
    "/",
    userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
    academicResultController.getAllAcademicResults
);

// ==========================================
// GET SINGLE ACADEMIC RESULT BY ID ROUTE
// ==========================================
router.get(
    "/:academic_result_id",
    userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
    validateZodSchema(academicResultZodSchema.getSingleAcademicResultZodSchema),
    academicResultController.getSingleAcademicResult,
);

// ===============================================
// GET ACADEMIC RESULT BY STAFF ID ROUTE
// ===============================================
router.get(
    "/:staff_id",
    userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
    validateZodSchema(academicResultZodSchema.getAcademicResultByStaffIdZodSchema),
    academicResultController.getAcademicResultByStaffId,
)
export const academicResultRouter: Router = router;
