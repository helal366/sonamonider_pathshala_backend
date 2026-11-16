import { Router } from "express";
import { Role } from "#db-client";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { monthlyExamMarkController } from "./monthlyExamMark.controller.js";
import { monthlyExamMarkZodSchema as schema } from "./monthlyExamMark.zodValidation.js";

const router = Router();
const authorizedRoles = [
  Role.SUPER_ADMIN,
  Role.ADMIN,
  Role.TEACHER_ADMIN,
] as const;

router.post(
  "/",
  userAuth(...authorizedRoles),
  validateZodSchema(schema.createMonthlyExamMarkZodSchema),
  monthlyExamMarkController.create,
);
router.delete(
  "/:monthly_exam_mark_id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.monthlyExamMarkIdParamsZodSchema),
  monthlyExamMarkController.remove,
);
router.patch(
  "/:monthly_exam_mark_id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.monthlyExamMarkIdParamsZodSchema),
  validateZodSchema(schema.updateMonthlyExamMarkZodSchema),
  monthlyExamMarkController.update,
);
router.patch(
  "/update_field/:monthly_exam_mark_id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.monthlyExamMarkIdParamsZodSchema),
  validateZodSchema(schema.updateMonthlyExamMarkFieldZodSchema),
  monthlyExamMarkController.updateField,
);
router.get("/", userAuth(...authorizedRoles), monthlyExamMarkController.getAll);
router.get(
  "/:monthly_exam_mark_id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.monthlyExamMarkIdParamsZodSchema),
  monthlyExamMarkController.getById,
);

export const monthlyExamMarkRouter: Router = router;
