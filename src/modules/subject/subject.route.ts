import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { subjectController } from "./subject.controller.js";
import { subjectZodSchema } from "./subject.zodValidation.js";

const router = Router();

router.post(
  "/create_subject",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(subjectZodSchema.createSubjectZodSchema),
  subjectController.createSubject,
);

router.patch(
  "/update_subject/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(subjectZodSchema.updateSubjectParamsZodSchema),
  validateZodSchema(subjectZodSchema.updateSubjectZodSchema),
  subjectController.updateSubject,
);

router.patch(
  "/update_single_subject_field/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(subjectZodSchema.updateSubjectParamsZodSchema),
  validateZodSchema(subjectZodSchema.updateSubjectSingleFieldZodSchema),
  subjectController.updateSubjectSingleField,
);

router.delete(
  "/delete_subject/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(subjectZodSchema.deleteSubjectParamsZodSchema),
  subjectController.deleteSubject,
);

router.get(
  "/get_subjects",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  subjectController.getAllSubjects,
);

router.get(
  "/get_subject/:id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(subjectZodSchema.getSingleSubjectParamsZodSchema),
  subjectController.getSingleSubject,
);

export const subjectRouter: Router = router;
