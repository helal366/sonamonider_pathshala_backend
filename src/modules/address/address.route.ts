import express, { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import {
  validateZodParams,
  validateZodSchema,
} from "../../middlewares/validateZodSchema.js";
import { addressZodSchema } from "./address.zodValidation.js";
import { userAddressController } from "./address.controller.js";

const router: Router = express.Router();

// ==========================================
// CREATE ADDRESS ROUTE
// ==========================================
router.post(
  "/address/create_address",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(addressZodSchema.createAddressZodSchema),
  userAddressController.createAddress,
);

router.delete(
  "/address/delete_address/:id",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodParams(addressZodSchema.addressOwnerIdParamsZodSchema),
  validateZodSchema(addressZodSchema.deleteAddressZodSchema),
  userAddressController.deleteAddress,
);
router.patch(
  "/address/update_address_field/:id",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodParams(addressZodSchema.addressOwnerIdParamsZodSchema),
  validateZodSchema(addressZodSchema.updateAddressFieldZodSchema),
  userAddressController.updateUserAddressField,
);

export const userAddressRouter = router;
