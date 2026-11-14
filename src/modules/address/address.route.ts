import express, { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { addressZodSchema } from "./address.zodValidation.js";
import { userAddressController } from "./address.controller.js";
import { Role } from "#db-client";

const router: Router = express.Router();

// ==========================================
// CREATE ADDRESS ROUTE
// ==========================================
router.post(
  "/address/create_address",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodSchema(addressZodSchema.createAddressZodSchema),
  userAddressController.createAddress,
);

// ============================================================
// DELETE COMPLETE ADDRESS ROUTE
// ============================================================
router.delete(
  "/address/delete_address/:user_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(addressZodSchema.addressOwnerIdParamsZodSchema),
  validateZodSchema(addressZodSchema.deleteAddressZodSchema),
  userAddressController.deleteAddress,
);

// ============================================================
// UPDATE SINGLE ADDRESS FIELD ROUTE
// ============================================================
router.patch(
  "/address/update_address_field/:user_id",
  userAuth(Role.SUPER_ADMIN, Role.ADMIN, Role.TEACHER_ADMIN),
  validateZodParams(addressZodSchema.addressOwnerIdParamsZodSchema),
  validateZodSchema(addressZodSchema.updateAddressFieldZodSchema),
  userAddressController.updateUserAddressField,
);

export const userAddressRouter = router;
