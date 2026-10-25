import { Router } from "express";
import { Role } from "#db-client";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { moralMannersEvaluationMarkController } from "./moralMannersEvaluationMark.controller.js";
import { moralMannersEvaluationMarkZodSchema as schema } from "./moralMannersEvaluationMark.zodValidation.js";

const router = Router();
const authorizedRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN] as const;

router.post(
  "/",
  userAuth(...authorizedRoles),
  validateZodSchema(schema.createMoralMannersEvaluationMarkZodSchema),
  moralMannersEvaluationMarkController.create,
);
router.delete(
  "/:id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.moralMannersEvaluationMarkIdParamsZodSchema),
  moralMannersEvaluationMarkController.remove,
);
router.put(
  "/:id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.moralMannersEvaluationMarkIdParamsZodSchema),
  validateZodSchema(schema.updateMoralMannersEvaluationMarkZodSchema),
  moralMannersEvaluationMarkController.update,
);
router.patch(
  "/update_field/:id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.moralMannersEvaluationMarkIdParamsZodSchema),
  validateZodSchema(schema.updateMoralMannersEvaluationMarkFieldZodSchema),
  moralMannersEvaluationMarkController.updateField,
);
router.get(
  "/",
  userAuth(...authorizedRoles),
  moralMannersEvaluationMarkController.getAll,
);
router.get(
  "/:id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.moralMannersEvaluationMarkIdParamsZodSchema),
  moralMannersEvaluationMarkController.getById,
);

export const moralMannersEvaluationMarkRouter: Router = router;
