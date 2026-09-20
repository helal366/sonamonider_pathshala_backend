import { Router } from "express";
import { userController } from "./user.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import {
  changePasswordZodSchema,
  forgetPasswordZodSchema,
  userCreateZodSchema,
} from "./user.zod.validation.js";
import { userAuth } from "../../middlewares/userAuth.js";

const router = Router();
router.post(
  "/create_user",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(userCreateZodSchema),
  userController.createUser,
);
router.patch(
  "/change_password",
  userAuth(),
  validateZodSchema(changePasswordZodSchema),
  userController.changePassword,
);
router.post(
  "/forget_password",
  validateZodSchema(forgetPasswordZodSchema),
  userController.forgetPassword,
);
export const userRouter: Router = router;
