import { Router } from "express";
import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";
import { userPatchController } from "./user.patch.controller.js";
import {
  changeUserPositionZodSchema,
  changeUserRoleZodSchema,
} from "./user.patch.zod.validation.js";

const router = Router();

router.patch(
  "/change_role",
  userAuth(),
  validateZodSchema(changeUserRoleZodSchema),
  userPatchController.changeUserRole,
);

router.patch(
  "/change_position",
  userAuth(),
  validateZodSchema(changeUserPositionZodSchema),
  userPatchController.changeUserPosition,
);

export const userPatchRouter: Router = router;
