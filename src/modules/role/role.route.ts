import { Router } from "express";
import { roleController } from "./role.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { createRoleZodSchema, updateRoleZodSchema } from "./role.zod.validation.js";
import { userAuth } from "../../middlewares/userAuth.js";

const router = Router();
router.post(
  "/create_role",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(createRoleZodSchema),
  roleController.createRole,
);

router.patch(
  "/update_role",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updateRoleZodSchema),
  roleController.updateRole
)
export const roleRouter: Router = router;
