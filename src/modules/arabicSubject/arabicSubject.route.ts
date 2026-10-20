import { Router } from "express";
import { Role } from "#db-client";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { arabicSubjectController } from "./arabicSubject.controller.js";
import { arabicSubjectZodSchema } from "./arabicSubject.zodValidation.js";

const router = Router();

// ==========================================================
// CREATE ARABIC SUBJECT ROUTE
// ==========================================================
router.post(
  "/create_arabic_subject",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(arabicSubjectZodSchema.createArabicSubjectZodSchema),
  arabicSubjectController.createArabicSubject,
);

// ==========================================================
// UPDATE ARABIC SUBJECT ROUTE
// ==========================================================
router.patch(
  "/update_arabic_subject/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(
    arabicSubjectZodSchema.updateArabicSubjectParamsZodSchema,
  ),
  validateZodSchema(arabicSubjectZodSchema.updateArabicSubjectZodSchema),
  arabicSubjectController.updateArabicSubject,
);

// ==========================================================
// UPDATE ARABIC SUBJECT SINGLE FIELD ROUTE
// ==========================================================
router.patch(
  "/update_arabic_single_subject_field/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(
    arabicSubjectZodSchema.updateArabicSubjectSingleFieldParamsZodSchema,
  ),
  validateZodSchema(
    arabicSubjectZodSchema.updateArabicSubjectSingleFieldZodSchema,
  ),
  arabicSubjectController.updateArabicSubjectSingleField,
);

// ==========================================================
// DELETE ARABIC SUBJECT ROUTE
// ==========================================================
router.delete(
  "/delete_arabic_subject/:id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(
    arabicSubjectZodSchema.deleteArabicSubjectParamsZodSchema,
  ),
  arabicSubjectController.deleteArabicSubject,
);

// ==========================================================
// GET ALL ARABIC SUBJECTS ROUTE
// ==========================================================
router.get(
  "/get_arabic_subjects",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  arabicSubjectController.getAllArabicSubjects,
);

// ==========================================================
// GET SINGLE ARABIC SUBJECT ROUTE
// ==========================================================
router.get(
  "/get_arabic_subject/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(
    arabicSubjectZodSchema.getSingleArabicSubjectParamsZodSchema,
  ),
  arabicSubjectController.getSingleArabicSubject,
);

// ==========================================================
// EXPORT ARABIC SUBJECT ROUTER
// ==========================================================
export const arabicSubjectRouter: Router = router;