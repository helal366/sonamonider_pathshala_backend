import { Router } from "express";
import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";
import { managementStaffPatchController } from "./managementStaff.patch.controller.js";
import {
  changeManagementStaffPositionZodSchema,
  changeManagementStaffRoleZodSchema,
} from "./managementStaff.patch.zod.validation.js";

const router = Router();

router.patch(
  "/change_role",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(changeManagementStaffRoleZodSchema),
  managementStaffPatchController.changeManagementStaffRole,
);

router.patch(
  "/change_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(changeManagementStaffPositionZodSchema),
  managementStaffPatchController.changeManagementStaffPosition,
);

export const managementStaffPatchRouter: Router = router;
