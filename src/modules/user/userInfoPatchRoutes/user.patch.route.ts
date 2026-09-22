import { Router } from "express";
import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";
import { userPatchController } from "./user.patch.controller.js";
import { changeUserPositionZodSchema, changeUserRoleZodSchema } from "./user.patch.zod.validation.js";

const router = Router();

router.patch(
  "/change_user_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(changeUserPositionZodSchema),
  userPatchController.changeUserPosition,
);

router.patch(
  "/change_user_role",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(changeUserRoleZodSchema),
  userPatchController.changeUserRole
)
export const userPatchRouter: Router = router;
