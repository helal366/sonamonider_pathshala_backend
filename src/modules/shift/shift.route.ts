import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";
import { shiftController } from "./shift.controller";

const router = Router();

// =============================================
// CREATE SHIFT ROUTE
// =============================================
router.post(
    "/create",
    userAuth("SUPER_ADMIN"),
    shiftController.createShift
)

// =============================================
// DELETE SHIFT ROUTE
// =============================================
router.delete(
    "/delete/:id",
    userAuth("SUPER_ADMIN"),
    shiftController.deleteShift
)
export const shiftRouter:Router = router;