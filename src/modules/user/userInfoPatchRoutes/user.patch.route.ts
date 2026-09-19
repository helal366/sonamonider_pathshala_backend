import { Router } from "express";
import { userAuth } from "../../../middlewares/userAuth.js";
import { validateZodSchema } from "../../../middlewares/validate.zod.schema.js";
import { userPatchController } from "./user.patch.controller.js";
import { changeUserPositionZodSchema } from "./user.patch.zod.validation.js";

const router = Router();

router.patch(
  "/change_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(changeUserPositionZodSchema),
  userPatchController.changeUserPosition,
);

export const userPatchRouter: Router = router;
