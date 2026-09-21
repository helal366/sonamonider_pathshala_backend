import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { html } from "./utils/html.js";
import { userRouter } from "./modules/user/user.route.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { roleRouter } from "./modules/role/role.route.js";
import { positionRouter } from "./modules/position/position.route.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { emailRouter } from "./modules/email/email.route.js";
import { userPatchRouter } from "./modules/user/userInfoPatchRoutes/user.patch.route.js";
import { managementStaffPatchRouter } from "./modules/managementStaff/managementStaff.route.js";
import { fatherDetailsRouter } from "./modules/fatherDetails/fatherDetails.route.js";
import { motherDetailsRouter } from "./modules/motherDetails/motherDetails.route.js";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/smps/auth", authRouter);
app.use("/api/v1/smps/email", emailRouter);
app.use("/api/v1/smps/user", userRouter);
app.use("/api/v1/smps/user_patch", userPatchRouter);
app.use("/api/v1/smps/management_staff_patch", managementStaffPatchRouter);
app.use("/api/v1/smps/position", positionRouter);
app.use("/api/v1/smps/role", roleRouter);
app.use("/api/v1/smps/father_details", fatherDetailsRouter);
app.use("/api/v1/smps/mother_details", motherDetailsRouter);

// basic route
app.get("/", (req: Request, res: Response) => {
  res.send(html);
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
