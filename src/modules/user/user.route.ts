import { Router } from "express";
import { userController } from "./user.controller.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { userAuth } from "../../middlewares/userAuth.js";
import { userZodSchema } from "./user.zodValidation.js";
import { Role } from "#db-client";

const router = Router();

//================================================
// CREATE USER ROUTE
//================================================
router.post(
  "/create_user",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(userZodSchema.userCreateZodSchema),
  userController.createUser,
);

// ==========================================
// CHANGE POSITION ROUTE
// ==========================================
router.patch(
  "/change_position",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(userZodSchema.changeUserPositionZodSchema),
  userController.changeUserPosition,
);
// ==========================================
// UPDATE SINGLE USER FIELD ADMIN ROUTE
// ==========================================
router.patch(
  "/update_user_single_field_admin",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(userZodSchema.updateSingleUserFieldAdminZodSchema),
  userController.updateSingleUserFieldAdmin,
);

// ==========================================
// UPDATE SINGLE USER FIELD SUPER ADMIN ROUTE
// ==========================================
router.patch(
  "/update_user_single_field_super_admin",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(userZodSchema.updateSingleUserFieldAdminZodSchema),
  userController.updateSingleUserFieldSuperAdmin,
);
// ==========================================
// UPDATE USER NAME ROUTE
// ==========================================
router.patch(
  "/update_user_name",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(userZodSchema.updateUserNameZodSchema),
  userController.updateUserName,
);

// ============================================================
// UPDATE USER PASSWORD ROUTE
// ============================================================
router.patch(
  "/update_user_password",
  userAuth(Role.SUPER_ADMIN),
  validateZodSchema(userZodSchema.updateUserPasswordZodSchema),
  userController.updateUserPassword,
);

// ============================================================
// GET ALL USERS ROUTE
// ============================================================
router.get(
  "/",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  userController.getAllUsers,
);

// ============================================================
// GET ACTIVE USERS ROUTE
// ============================================================
router.get(
  "/active_users",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  userController.getActiveUsers,
);

// ============================================================
// GET INACTIVE USERS ROUTE
// ============================================================
router.get(
  "/inactive_users",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  userController.getInactiveUsers,
);

// ============================================================
// GET SOFT DELETED USERS ROUTE
// ============================================================
router.get(
  "/soft_deleted_users",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  userController.getSoftDeletedUsers,
);

// ============================================================
// GET SINGLE USER ROUTE
// ============================================================
router.get(
  "/:id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(userZodSchema.getSingleUserZodSchema),
  userController.getSingleUser,
);
export const userRouter: Router = router;
