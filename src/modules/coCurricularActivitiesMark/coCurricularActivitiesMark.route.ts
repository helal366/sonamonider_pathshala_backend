import { Router } from "express";
import { Role } from "#db-client";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { coCurricularActivitiesMarkController } from "./coCurricularActivitiesMark.controller.js";
import { coCurricularActivitiesMarkZodSchema as schema } from "./coCurricularActivitiesMark.zodValidation.js";

const router = Router();
const authorizedRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN] as const;

router.post(
  "/",
  userAuth(...authorizedRoles),
  validateZodSchema(schema.createCoCurricularActivitiesMarkZodSchema),
  coCurricularActivitiesMarkController.create,
);
router.delete(
  "/:id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.coCurricularActivitiesMarkIdParamsZodSchema),
  coCurricularActivitiesMarkController.remove,
);
router.put(
  "/:id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.coCurricularActivitiesMarkIdParamsZodSchema),
  validateZodSchema(schema.updateCoCurricularActivitiesMarkZodSchema),
  coCurricularActivitiesMarkController.update,
);
router.patch(
  "/update_field/:id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.coCurricularActivitiesMarkIdParamsZodSchema),
  validateZodSchema(schema.updateCoCurricularActivitiesMarkFieldZodSchema),
  coCurricularActivitiesMarkController.updateField,
);
router.get(
  "/",
  userAuth(...authorizedRoles),
  coCurricularActivitiesMarkController.getAll,
);
router.get(
  "/:id",
  userAuth(...authorizedRoles),
  validateZodParams(schema.coCurricularActivitiesMarkIdParamsZodSchema),
  coCurricularActivitiesMarkController.getById,
);

export const coCurricularActivitiesMarkRouter: Router = router;
