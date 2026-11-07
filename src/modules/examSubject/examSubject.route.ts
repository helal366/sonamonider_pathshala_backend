import { Role } from "#db-client";
import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema";
import { examSubjectZodSchema } from "./examSubject.zodValidation";
import { examSubjectController } from "./examSubject.controller";

const router = Router();
// ===================================================================
// CREATE EXAM SUBJECT ROUTE
// ===================================================================
router.post(
    "/create_exam_subject",
    userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
    validateZodSchema(examSubjectZodSchema.createExamSubjectZodSchema),
    examSubjectController.createExamSubject
);

// ===================================================================
// DELETE EXAM SUBJECT ROUTE
// ===================================================================
router.delete(
    "/delete_exam_subject/:exam_subject_id",
    userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
    validateZodParams(examSubjectZodSchema.examSubjectIdParamsZodSchema),
    examSubjectController.deleteExamSubject
);

// ===================================================================
// UPDATE EXAM SUBJECT ROUTE
// ===================================================================
router.patch(
    "/update_exam_subject/:exam_subject_id",
    userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
    validateZodParams(examSubjectZodSchema.examSubjectIdParamsZodSchema),
    validateZodSchema(examSubjectZodSchema.updateExamSubjectZodSchema),
    examSubjectController.updateExamSubject
);

// ===================================================================
// UPDATE EXAM SUBJECT SINGLE FIELD ROUTE
// ===================================================================
router.patch(
    "/update_single_field/:exam_subject_id",
    userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
    validateZodParams(examSubjectZodSchema.examSubjectIdParamsZodSchema),
    validateZodSchema(examSubjectZodSchema.updateExamSubjectSingleFieldZodSchema),
    examSubjectController.updateSingleFieldExamSubject
);

// ===================================================================
// GET ALL EXAM SUBJECTS ROUTE
// ===================================================================
router.get(
    "/",
    userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
    examSubjectController.getAllExamSubjects
);

// ===================================================================
// GET EXAM SUBJECT BY ID ROUTE
// ===================================================================
router.get(
    "/:exam_subject_id",
    userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
    validateZodParams(examSubjectZodSchema.examSubjectIdParamsZodSchema),
    examSubjectController.getExamSubjectById
)
export const examSubjectRouter:Router = router;