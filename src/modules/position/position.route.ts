import { Router } from "express";
import { positionController } from "./position.controller";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { createPositionZodSchema } from "./position.zod.validation.js";
import { userAuth } from "../../middlewares/userAuth";

const router = Router();
router.post(
  "/create_position",
  // userAuth("SUPER_ADMIN"),
  validateZodSchema(createPositionZodSchema),
  positionController.createPosition,
);
export const positionRouter: Router = router;
