import { Router } from "express";
import { roleController } from "./role.controller.js";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema.js";
import {
  roleZodSchema,
} from "./role.zodValidation.js";
import { userAuth } from "../../middlewares/userAuth.js";

const router = Router();
// =====================================================
// CREATE ROLE ROUTE
// =====================================================
router.post(
  "/create_role",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(roleZodSchema.createRoleZodSchema),
  roleController.createRole,
);

// =====================================================
// UPDATE ROLE ROUTE
// =====================================================
router.patch(
  "/update_role",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(roleZodSchema.updateRoleZodSchema),
  roleController.updateRole,
);

// ====================================================
// DELETE ROLE ROUTE
// ====================================================
router.delete(
  "/delete_role/:id",
  userAuth("SUPER_ADMIN"),
  validateZodParams(roleZodSchema.deleteRoleParamsZodSchema),
  roleController.deleteRole,
);

// ====================================================
// GET ALL ROLE NAMES
// ====================================================
router.get(
  "/",
  userAuth("SUPER_ADMIN"), // Enforce Super Admin security layer
  roleController.getAllRoleNames,
);

// ====================================================
// GET SINGLE ROLE BY ID
// ====================================================
router.get(
  "/:id",
  userAuth("SUPER_ADMIN"), 
  validateZodParams(roleZodSchema.getSingleRoleParamsZodSchema),
  roleController.getSingleRole,
);

export const roleRouter: Router = router;
