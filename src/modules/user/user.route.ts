import { Router } from "express";
import { userController } from "./user.controller.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import {
  changePasswordZodSchema,
  changeUserPositionZodSchema,
  promoteUserRolePositionZodSchema,
  forgetPasswordZodSchema,
  userCreateZodSchema,
  updateSingleUserFieldAdminZodSchema,
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

router.patch(
  "/promote_user_role_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(promoteUserRolePositionZodSchema),
  userController.promoteUserRolePosition,
);

router.patch(
  "/change_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(changeUserPositionZodSchema),
  userController.changeUserPosition,
);
// ==========================================
// UPDATE SINGLE USER FIELD ADMIN ROUTE
// ==========================================
router.patch(
  "/update_single_user_field_admin",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(updateSingleUserFieldAdminZodSchema),
  userController.updateSingleUserFieldAdmin
)

// ==========================================
// UPDATE SINGLE USER FIELD SUPER ADMIN ROUTE
// ==========================================
router.patch(
  "/update_single_user_field_super_admin",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(updateSingleUserFieldAdminZodSchema),
  userController.updateSingleUserFieldSuperAdmin
)
export const userRouter: Router = router;
