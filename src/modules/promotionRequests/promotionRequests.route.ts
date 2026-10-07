import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { validateZodSchema } from "../../middlewares/validateZodSchema";
import { promotionRequestsZodSchema } from "./promotionRequests.zod.validation";
import { promotionRequestController } from "./promotionRequests.controller";

const router = Router();
router.post(
    "/create_promotion_request",
    userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
    validateZodSchema(promotionRequestsZodSchema.createPromotionRequestZodSchema),
    promotionRequestController.createPromotionRequest
)
export const promotionRequestRouter:Router = router;