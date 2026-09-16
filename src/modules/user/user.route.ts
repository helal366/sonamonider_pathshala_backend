import { Router } from "express";
import { userController } from "./user.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import {
  changePasswordZodSchema,
  forgetPasswordZodSchema,
  userCreateZodSchema,
} from "./user.zod.validation.js";

const router = Router();
router.post(
  "/create_user",
  validateZodSchema(userCreateZodSchema),
  userController.createuser,
);
router.patch(
  "/change_password",
  validateZodSchema(changePasswordZodSchema),
  userController.changePassword,
);
router.post(
  "/forget_password",
  validateZodSchema(forgetPasswordZodSchema),
  userController.forgetPassword,
);
export const userRouter: Router = router;
