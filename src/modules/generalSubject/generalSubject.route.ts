import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { subjectController } from "./generalSubject.controller.js";
import { subjectZodSchema } from "./generalSubject.zodValidation.js";
import { Role } from "#db-client";

const router = Router();

router.post(
  "/create_general_subject",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(subjectZodSchema.createGeneralSubjectZodSchema),
  subjectController.createSubject,
);

router.patch(
  "/update_general_subject/:general_subject_id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(subjectZodSchema.updateGeneralSubjectIdParamsZodSchema),
  validateZodSchema(subjectZodSchema.updateGeneralSubjectZodSchema),
  subjectController.updateSubject,
);

router.patch(
  "/update_single_general_subject_field/:general_subject_id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(subjectZodSchema.updateGeneralSubjectIdParamsZodSchema),
  validateZodSchema(subjectZodSchema.updateGeneralSubjectSingleFieldZodSchema),
  subjectController.updateSubjectSingleField,
);

router.delete(
  "/delete_general_subject/:general_subject_id",
  userAuth(Role.SUPER_ADMIN),
  validateZodParams(subjectZodSchema.deleteGeneralSubjectIdParamsZodSchema),
  subjectController.deleteSubject,
);

router.get(
  "/get_general_subjects",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  subjectController.getAllSubjects,
);

router.get(
  "/get_general_subject/:general_subject_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(subjectZodSchema.getSingleGeneralSubjectParamsZodSchema),
  subjectController.getSingleSubject,
);

export const generalSubjectRouter: Router = router;
