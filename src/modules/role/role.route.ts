import { Router } from "express";
import { roleController } from "./role.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { createRoleZodSchema } from "./role.zod.validation.js";

const router = Router();
router.post(
  "/create_role",
  // userAuth("SUPER_ADMIN"),
  validateZodSchema(createRoleZodSchema),
  roleController.createRole,
);

export const roleRouter: Router = router;
