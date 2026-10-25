import { Router } from "express";
import { Role } from "#db-client";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema.js";
import { annualExamMarkController } from "./annualExamMark.controller.js";
import { annualExamMarkZodSchema as schema } from "./annualExamMark.zodValidation.js";

const router = Router();
const authorizedRoles = [Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN] as const;

router.post("/", userAuth(...authorizedRoles), validateZodSchema(schema.createAnnualExamMarkZodSchema), annualExamMarkController.create);
router.delete("/:id", userAuth(...authorizedRoles), validateZodParams(schema.annualExamMarkIdParamsZodSchema), annualExamMarkController.remove);
router.put("/:id", userAuth(...authorizedRoles), validateZodParams(schema.annualExamMarkIdParamsZodSchema), validateZodSchema(schema.updateAnnualExamMarkZodSchema), annualExamMarkController.update);
router.patch("/update_field/:id", userAuth(...authorizedRoles), validateZodParams(schema.annualExamMarkIdParamsZodSchema), validateZodSchema(schema.updateAnnualExamMarkFieldZodSchema), annualExamMarkController.updateField);
router.get("/", userAuth(...authorizedRoles), annualExamMarkController.getAll);
router.get("/:id", userAuth(...authorizedRoles), validateZodParams(schema.annualExamMarkIdParamsZodSchema), annualExamMarkController.getById);

export const annualExamMarkRouter: Router = router;
