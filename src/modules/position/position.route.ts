import { Router } from "express";
import { positionController } from "./position.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { createPositionZodSchema, updatePositionZodSchema } from "./position.zod.validation.js";
import { userAuth } from "../../middlewares/userAuth.js";

const router = Router();
router.post(
  "/create_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(createPositionZodSchema),
  positionController.createPosition,
);

router.patch(
  "/update_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updatePositionZodSchema),
  positionController.updatePosition,
);

export const positionRouter: Router = router;
