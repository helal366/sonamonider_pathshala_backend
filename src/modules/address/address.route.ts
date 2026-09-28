import express, { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { addressZodSchema } from "./address.zod.validation.js";
import { userAddressPatchController } from "./address.controller.js";

const router:Router = express.Router();


router.post(
  "/address/create_address_field",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(addressZodSchema.createAddressZodSchema),
  userAddressPatchController.createAddress,
);

router.patch(
  "/address/update_address_field",
  userAuth("SUPER_ADMIN", "TEACHER_ADMIN", "ADMIN"),
  validateZodSchema(addressZodSchema.updateAddressFieldZodSchema),
  userAddressPatchController.updateUserAddressField,
);

export const userAddressRouter =  router;