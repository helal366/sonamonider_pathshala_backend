import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth";

const router = Router();
router.patch(
    "/readmission",
    userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
);

router.patch(
    "/add_responsible_teacher",
    userAuth("SUPER_ADMIN", "ADMIN", "TEACHER_ADMIN"),
)
export const studentRouter:Router = router;