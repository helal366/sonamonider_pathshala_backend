import { Router } from "express";
import { userAuth } from "../../middlewares/userAuth.js";
import { validateZodSchema } from "../../middlewares/validate.zod.schema.js";
import { managementStaffPatchController } from "./managementStaff.controller.js";


const router = Router();



export const managementStaffPatchRouter: Router = router;
