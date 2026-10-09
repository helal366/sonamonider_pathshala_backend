import { Router } from "express";
import { userController } from "./user.controller.js";
import { validateZodSchema } from "../../middlewares/validateZodSchema.js";
import { userAuth } from "../../middlewares/userAuth.js";
import { userZodSchema } from "./user.zodValidation.js";

const router = Router();

//================================================
// CREATE USER ROUTE
//================================================
router.post(
  "/create_user",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(userZodSchema.userCreateZodSchema),
  userController.createUser,
);

//================================================
// CHANGE USER PASSWORD ROUTE
//================================================
router.patch(
  "/change_password",
  userAuth(),
  validateZodSchema(userZodSchema.changePasswordZodSchema),
  userController.changePassword,
);

//================================================
// FORGET PASSWORD ROUTE
//================================================
router.post(
  "/forget_password",
  validateZodSchema(userZodSchema.forgetPasswordZodSchema),
  userController.forgetPassword,
);

// ==========================================
// CHANGE POSITION ROUTE
// ==========================================
router.patch(
  "/change_position",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(userZodSchema.changeUserPositionZodSchema),
  userController.changeUserPosition,
);
// ==========================================
// UPDATE SINGLE USER FIELD ADMIN ROUTE
// ==========================================
router.patch(
  "/update_user_single_field_admin",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodSchema(userZodSchema.updateSingleUserFieldAdminZodSchema),
  userController.updateSingleUserFieldAdmin,
);

// ==========================================
// UPDATE SINGLE USER FIELD SUPER ADMIN ROUTE
// ==========================================
router.patch(
  "/update_user_single_field_super_admin",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(userZodSchema.updateSingleUserFieldAdminZodSchema),
  userController.updateSingleUserFieldSuperAdmin,
);
// ==========================================
// UPDATE USER NAME ROUTE
// ==========================================
router.patch(
  "/update_user_name",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(userZodSchema.updateUserNameZodSchema),
  userController.updateUserName,
);

// ============================================================
// UPDATE USER PASSWORD ROUTE
// ============================================================
router.patch(
  "/update_user_password",
  userAuth("SUPER_ADMIN"),
  validateZodSchema(userZodSchema.updateUserPasswordZodSchema),
  userController.updateUserPassword,
);

export const userRouter: Router = router;
