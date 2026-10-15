import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js"; // Your custom params validator
import { quranicSubjectController } from "./quranicSubject.controller.js";
import { quranicSubjectZodSchema } from "./quranicSubject.zodValidation.js";

const router = Router();

// ===================================================
// CREATE QURANIC SUBJECT ROUTE
// ===================================================
router.post(
  "/create_quranic_subject",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(quranicSubjectZodSchema.createQuranicSubjectZodSchema),
  quranicSubjectController.createQuranicSubject,
);

// ====================================================
// UPDATE QURANIC SUBJECT ROUTE
// ====================================================
router.patch(
  "/update_quranic_subject/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(quranicSubjectZodSchema.updateQuranicSubjectParamsZodSchema),
  validateZodSchema(quranicSubjectZodSchema.updateQuranicSubjectZodSchema),
  quranicSubjectController.updateQuranicSubject,
);

// ====================================================
// UPDATE QURANIC SUBJECT SINGLE FIELD ROUTE
// ====================================================
router.patch(
  "/update_quranic_single_subject_field/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(
    quranicSubjectZodSchema.updateQuranicSubjectSingleFieldParamsZodSchema,
  ),
  validateZodSchema(
    quranicSubjectZodSchema.updateQuranicSubjectSingleFieldZodSchema,
  ),
  quranicSubjectController.updateQuranicSubjectSingleField,
);

// =====================================================
// DELETE QURANIC SUBJECT ROUTE
// =====================================================
router.delete(
  "/delete_quranic_subject/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(quranicSubjectZodSchema.deleteQuranicSubjectParamsZodSchema),
  quranicSubjectController.deleteQuranicSubject,
);

// ======================================================
// GET ALL QURANIC SUBJECTS ROUTE
// ======================================================
router.get(
  "/get_quranic_subjects",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  quranicSubjectController.getAllQuranicSubjects,
);

// ========================================================
// GET SINGLE QURANIC SUBJECT BY PATH PARAM ID ROUTE
// ========================================================
router.get(
  "/get_quranic_subject/:id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(quranicSubjectZodSchema.getSingleQuranicSubjectZodSchema), // Uses your optimized params middleware helper
  quranicSubjectController.getSingleQuranicSubject,
);

export const quranicSubjectRouter: Router = router;
