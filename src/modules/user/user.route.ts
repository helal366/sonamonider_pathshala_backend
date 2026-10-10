import { Router } from "express";
import { userController } from "./user.controller.js";
import { validateZodParams, validateZodSchema } from "../../middlewares/validateZodSchema.js";
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

// ============================================================
// GET ALL USERS ROUTE
// ============================================================
router.get(
  "/",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  userController.getAllUsers
)

// ============================================================
// GET ACTIVE USERS ROUTE
// ============================================================
router.get(
  "/active_users",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  userController.getActiveUsers
);

// ============================================================
// GET INACTIVE USERS ROUTE
// ============================================================
router.get(
  "/inactive_users",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  userController.getInactiveUsers
);

// ============================================================
// GET SOFT DELETED USERS ROUTE
// ============================================================
router.get(
  "/soft_deleted_users",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  userController.getSoftDeletedUsers
);

// ============================================================
// GET SINGLE USER ROUTE
// ============================================================
router.get(
  "/:id",
  userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
  validateZodParams(userZodSchema.getSingleUserZodSchema),
  userController.getSingleUser
)
export const userRouter: Router = router;
