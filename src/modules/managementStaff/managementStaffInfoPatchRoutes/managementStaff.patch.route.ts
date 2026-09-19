import { Router } from "express";
import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";
import { managementStaffPatchController } from "./managementStaff.patch.controller.js";
import { changeManagementStaffRoleZodSchema } from "./managementStaff.patch.zod.validation.js";

const router = Router();

router.patch(
  "/change_role",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(changeManagementStaffRoleZodSchema),
  managementStaffPatchController.changeManagementStaffRole,
);

export const managementStaffPatchRouter: Router = router;
