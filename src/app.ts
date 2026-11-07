import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { html } from "./utils/html.js";
import { userRouter } from "./modules/user/user.route.js";
import { globalErrorHandler } from "./middlewares/globalErrorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { positionRouter } from "./modules/position/position.route.js";
import { authRouter } from "./modules/auth/auth.route.js";
import { emailRouter } from "./modules/email/email.route.js";
import { managementStaffPatchRouter } from "./modules/managementStaff/managementStaff.route.js";
import { fatherDetailsRouter } from "./modules/fatherDetails/fatherDetails.route.js";
import { motherDetailsRouter } from "./modules/motherDetails/motherDetails.route.js";
import { spouseInformationRouter } from "./modules/spouseInformation/spouseInformation.route.js";
import { userAddressRouter } from "./modules/address/address.route.js";
import { academicResultRouter } from "./modules/academicResults/academicResult.route.js";
import { classRouter } from "./modules/class/class.route.js";
import { classHistoryRouter } from "./modules/classHistory/classHistory.route.js";
import { studentRouter } from "./modules/student/student.route.js";
import { academicYearRouter } from "./modules/academicYear/academicYear.route.js";
import { academicStaffRouter } from "./modules/academicStaff/academicStaff.route.js";
import { promotionRequestRouter } from "./modules/promotionRequest/promotionRequest.route.js";
import { promotionHistoryRouter } from "./modules/promotionHistory/promotionHistory.route.js";
import { quranicSubjectRouter } from "./modules/quranicSubject/quranicSubject.route.js";
import { quranicPeriodRouter } from "./modules/quranicPeriod/quranicPeriod.route.js";
import { subjectRouter } from "./modules/generalSubject/generalSubject.route.js";
import { periodRouter } from "./modules/generalPeriod/generalPeriod.route.js";
import { classRoutineRouter } from "./modules/classRoutine/classRoutine.route.js";
import { studentFeeRouter } from "./modules/studentFee/studentFee.route.js";
import { standardStudentFeeRateRouter } from "./modules/standardStudentFeeRate/standardStudentFeeRate.route.js";
import { staffPaymentRouter } from "./modules/staffPayment/staffPayment.route.js";
import { bookListRouter } from "./modules/bookList/bookList.route.js";
import { arabicPeriodRouter } from "./modules/arabicPeriod/arabicPeriod.route.js";
import { arabicSubjectRouter } from "./modules/arabicSubject/arabicSubject.route.js";
import { coCurricularActivitiesMarkRouter } from "./modules/coCurricularActivitiesMark/coCurricularActivitiesMark.route.js";
import { moralMannersEvaluationMarkRouter } from "./modules/moralMannersEvaluationMark/moralMannersEvaluationMark.route.js";
import { monthlyExamMarkRouter } from "./modules/monthlyExamMark/monthlyExamMark.route.js";
import { halfYearlyExamMarkRouter } from "./modules/halfYearlyExamMark/halfYearlyExamMark.route.js";
import { annualExamMarkRouter } from "./modules/annualExamMark/annualExamMark.route.js";
import { prisma } from "./lib/prisma.js";
import { examSubjectRouter } from "./modules/examSubject/examSubject.route.js";
import { studentResultRouter } from "./modules/studentResult/studentResult.route.js";

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/smps/auth", authRouter);
app.use("/api/v1/smps/email", emailRouter);
app.use("/api/v1/smps/user", userRouter);
app.use("/api/v1/smps/user", userAddressRouter);
app.use("/api/v1/smps/management_staff_patch", managementStaffPatchRouter);
app.use("/api/v1/smps/position", positionRouter);
app.use("/api/v1/smps/father_details", fatherDetailsRouter);
app.use("/api/v1/smps/mother_details", motherDetailsRouter);
app.use("/api/v1/smps/spouse_information", spouseInformationRouter);
app.use("/api/v1/smps/academic_result", academicResultRouter);
app.use("/api/v1/smps/class", classRouter);
app.use("/api/v1/smps/class_history", classHistoryRouter);
app.use("/api/v1/smps/student", studentRouter);
app.use("/api/v1/smps/academic_year", academicYearRouter);
app.use("/api/v1/smps/academic_staff", academicStaffRouter);
app.use("/api/v1/smps/promotion_request", promotionRequestRouter);
app.use("/api/v1/smps/promotion_history", promotionHistoryRouter);
app.use("/api/v1/smps/quranic_subject", quranicSubjectRouter);
app.use("/api/v1/smps/quranic_class_period", quranicPeriodRouter);
app.use("/api/v1/smps/subject", subjectRouter);
app.use("/api/v1/smps/period", periodRouter);
app.use("/api/v1/smps/class_routine", classRoutineRouter);
app.use("/api/v1/smps/student_fee", studentFeeRouter);
app.use(
  "/api/v1/smps/assigned_student_fee_rate",
  standardStudentFeeRateRouter,
);
app.use("/api/v1/smps/staff_payment", staffPaymentRouter);
app.use("/api/v1/smps/book_list", bookListRouter);
app.use("/api/v1/smps/arabic_period", arabicPeriodRouter);
app.use("/api/v1/smps/arabic_subject", arabicSubjectRouter);
app.use(
  "/api/v1/smps/co_curricular_activities_mark",
  coCurricularActivitiesMarkRouter,
);
app.use(
  "/api/v1/smps/moral_manners_evaluation_mark",
  moralMannersEvaluationMarkRouter,
);
app.use("/api/v1/smps/monthly_exam_mark", monthlyExamMarkRouter);
app.use("/api/v1/smps/half_yearly_exam_mark", halfYearlyExamMarkRouter);
app.use("/api/v1/smps/annual_exam_mark", annualExamMarkRouter);
app.use("/api/v1/smps/exam_subject", examSubjectRouter);
app.use("/api/v1/smps/exam_result", studentResultRouter);

// basic route
app.get("/favicon.ico", (_req: Request, res: Response) => {
  res.status(204).end();
});
// health
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});
// Database health check
app.get("/health/db", async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      success: true,
      message: "Database connection is healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Database health check failed:", error);

    return res.status(503).json({
      success: false,
      message: "Database connection failed",
      database: "disconnected",
      timestamp: new Date().toISOString(),
    });
  }
});
// 
app.get("/", (req: Request, res: Response) => {
  res.send(html);
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
