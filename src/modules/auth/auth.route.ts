import { Router } from "express";
import { authController } from "./auth.controller";
import { validateZodSchema } from "../../middlewares/validate.zod.schema";
import { loginZodSchema, logoutZodSchema } from "./auth.zod.schema";

const router = Router();
router.post("/login", validateZodSchema(loginZodSchema), authController.login);
router.post(
  "/logout",
  validateZodSchema(logoutZodSchema),
  authController.logout,
);
export const authRouter: Router = router;
