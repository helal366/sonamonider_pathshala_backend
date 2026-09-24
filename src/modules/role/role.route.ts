import { Router } from "express";
import { roleController } from "./role.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { createRoleZodSchema, deleteRoleZodSchema, getSingleRoleZodSchema, updateRoleZodSchema } from "./role.zod.validation.js";
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
);

// REGISTER ROUTE
router.delete(
  "/delete_role",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(deleteRoleZodSchema),
  roleController.deleteRole,
);

// GET ALL ROLE NAMES
router.get(
  "/get_roles",
  userAuth("SUPER_ADMIN"), // Enforce Super Admin security layer
  roleController.getAllRoleNames,
);

// GET SINGLE ROLE BY ID
router.get(
  "/get_role/:id",
  userAuth("SUPER_ADMIN"), // Enforce Super Admin security block
  validateZodSchema(getSingleRoleZodSchema),
  roleController.getSingleRole,
);
export const roleRouter: Router = router;
