import { Router } from "express";
import { Role } from "#db-client";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { halfYearlyExamMarkController } from "./halfYearlyExamMark.controller.js";
import { halfYearlyExamMarkZodSchema as schema } from "./halfYearlyExamMark.zodValidation.js";

const router = Router();
const authorizedRoles = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.TEACHER_ADMIN,
] as const;

router.post(
  "/",
  userAuth(...authorizedRoles),
  validateZodSchema(schema.createHalfYearlyExamMarkZodSchema),
  halfYearlyExamMarkController.create,
);
router.delete(
  "/:half_yearly_exam_mark_id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.halfYearlyExamMarkIdParamsZodSchema),
  halfYearlyExamMarkController.remove,
);
router.patch(
  "/:half_yearly_exam_mark_id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.halfYearlyExamMarkIdParamsZodSchema),
  validateZodSchema(schema.updateHalfYearlyExamMarkZodSchema),
  halfYearlyExamMarkController.update,
);
router.patch(
  "/update_field/:half_yearly_exam_mark_id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.halfYearlyExamMarkIdParamsZodSchema),
  validateZodSchema(schema.updateHalfYearlyExamMarkFieldZodSchema),
  halfYearlyExamMarkController.updateField,
);
router.get(
  "/",
  userAuth(...authorizedRoles),
  halfYearlyExamMarkController.getAll,
);
router.get(
  "/:half_yearly_exam_mark_id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.halfYearlyExamMarkIdParamsZodSchema),
  halfYearlyExamMarkController.getById,
);

export const halfYearlyExamMarkRouter: Router = router;
