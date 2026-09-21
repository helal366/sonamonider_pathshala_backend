import { Router } from "express";
import { fatherDetailsController } from "./fatherDetails.controller";
import { validateZodSchema } from "../../middlewares/validate.zod.schema";
import { connectFatherDetailsZodSchema, createFatherDetailsZodSchema } from "./fatherDetails.zod.validation";
import { userAuth } from "../../middlewares/userAuth";

const router = Router();
router.post(
  "/create_father_details",
  userAuth(),
  validateZodSchema(createFatherDetailsZodSchema),
  fatherDetailsController.createFatherDetails,
);

router.post(
    "/connect_father_details",
    userAuth(),
    validateZodSchema(connectFatherDetailsZodSchema),
    fatherDetailsController.connectFatherDetails
)
export const fatherDetailsRouter:Router = router;
