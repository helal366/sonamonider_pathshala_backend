-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'TEACHER_ADMIN', 'ACADEMIC', 'MANAGEMENT', 'STUDENT', 'GOVERNING_BODY');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE');

-- CreateEnum
CREATE TYPE "Religion" AS ENUM ('ISLAM', 'HINDU', 'CHRISTIAN', 'BUDDO', 'OTHER');

-- CreateEnum
CREATE TYPE "Quranic_Section" AS ENUM ('NURANI', 'NAZERA', 'HIFZ');

-- CreateEnum
CREATE TYPE "WeekDays" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- CreateEnum
CREATE TYPE "Months" AS ENUM ('JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER');

-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateEnum
CREATE TYPE "EducationDegree" AS ENUM ('SSC', 'HSC', 'BSC', 'B_COM', 'B_ARTS', 'MSC', 'M_COM', 'M_ARTS', 'PHD', 'ALIM', 'DAKHIL', 'KAMIL', 'FAZIL', 'OTHERS');

-- CreateEnum
CREATE TYPE "PromotionRequestStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "StudentFeeType" AS ENUM ('MONTHLY_TUITION', 'SESSION_ADMISSION', 'MONTHLY_ACADEMIC_EVALUATION', 'EXAM', 'INTENSIVE_CARE', 'REGISTRATION_FORM_FILL_UP', 'ACADEMIC_MATERIAL_UNIFORM', 'EXTRA_CURRICULAR_ACTIVITY', 'LABORATORY_LIBRARY', 'WINTER_FESTIVAL', 'SUMMER_FESTIVAL', 'BOOK_EXERCISE_BOOK', 'QURAN_HIFZ_MONTHLY', 'CERTIFICATION', 'RESIDENTIAL_DAYCARE_ESTABLISHMENT');

-- CreateEnum
CREATE TYPE "BillingFrequency" AS ENUM ('MONTHLY', 'HALF_YEARLY', 'YEARLY', 'ONE_TIME');

-- CreateEnum
CREATE TYPE "StaffPaymentType" AS ENUM ('MONTHLY_SALARY', 'EID_UL_FITR_BONUS', 'EID_UL_ADHA_BONUS', 'PERFORMANCE_BONUS');

-- CreateEnum
CREATE TYPE "SalaryChangeType" AS ENUM ('INITIAL', 'INCREMENT', 'ADJUSTMENT');

-- CreateTable
CREATE TABLE "academic_result" (
    "id" TEXT NOT NULL,
    "ssc_result" TEXT,
    "dakhil_result" TEXT,
    "hsc_result" TEXT,
    "alim_result" TEXT,
    "hons_result" TEXT,
    "fazil_result" TEXT,
    "masters_result" TEXT,
    "kamil" TEXT,
    "management_staff_id" TEXT,
    "academic_staff_id" TEXT,
    "governing_body_id" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "academic_result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_staffs" (
    "id" TEXT NOT NULL,
    "current_position_id" TEXT,
    "current_role_id" TEXT,
    "current_role" "Role",
    "subject_as_subject_teacher" TEXT,
    "teaching_experience_year" INTEGER,
    "teaching_experience_month" INTEGER,
    "alternative_contact_no" TEXT[],
    "extra_curricular_activities" TEXT[],
    "user_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "academic_staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcademicYear" (
    "id" TEXT NOT NULL,
    "academic_year_name" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "AcademicYear_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "audit_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "entity_name" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "action" "AuditAction" NOT NULL,
    "changed_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("audit_id")
);

-- CreateTable
CREATE TABLE "classes" (
    "id" TEXT NOT NULL,
    "class_name" TEXT NOT NULL,
    "is_active_class" BOOLEAN NOT NULL DEFAULT true,
    "grade_group_teacher_id" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_history" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3),
    "academic_year_id" TEXT NOT NULL,
    "roll_number" INTEGER NOT NULL,
    "quranic_subject_id" TEXT NOT NULL,
    "arabic_literature" BOOLEAN NOT NULL DEFAULT false,
    "class_id" TEXT NOT NULL,
    "shift_id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "class_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_history_quranic_periods" (
    "id" TEXT NOT NULL,
    "class_history_id" TEXT NOT NULL,
    "quranic_period_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_history_quranic_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_rotine" (
    "id" TEXT NOT NULL,
    "class_id" TEXT NOT NULL,
    "period_id" TEXT,
    "quranic_period_id" TEXT,
    "teacher_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "class_rotine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "father_details" (
    "id" TEXT NOT NULL,
    "father_name" TEXT NOT NULL,
    "nid_no" TEXT,
    "occupation" TEXT,
    "job_title" TEXT,
    "educational_qualification" "EducationDegree",
    "monthly_income" TEXT,
    "mobile_no_1" TEXT,
    "mobile_no_2" TEXT,
    "mobile_no_3" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "father_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "governing_bodies" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "current_position_id" TEXT,
    "current_role" "Role",
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "governing_bodies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "management_staffs" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "working_experience_year" INTEGER,
    "working_experience_month" INTEGER,
    "alternative_contact_no" TEXT[],
    "user_id" TEXT NOT NULL,
    "current_position_id" TEXT,
    "current_role" "Role",
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "management_staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mother_details" (
    "id" TEXT NOT NULL,
    "mother_name" TEXT NOT NULL,
    "nid_no" TEXT,
    "occupation" TEXT,
    "job_title" TEXT,
    "educational_qualification" "EducationDegree",
    "monthly_income" TEXT,
    "mobile_no_1" TEXT,
    "mobile_no_2" TEXT,
    "mobile_no_3" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "mother_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "periods" (
    "id" TEXT NOT NULL,
    "period_name" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permanent_addresses" (
    "id" TEXT NOT NULL,
    "flat_no" TEXT,
    "house_no" TEXT,
    "house_name" TEXT,
    "plot_no" TEXT,
    "road_no" TEXT,
    "neighbourhood" TEXT,
    "region" TEXT,
    "village" TEXT,
    "post_code" TEXT,
    "post_office" TEXT,
    "thana" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Bangladesh',
    "user_id" TEXT,
    "spouse_id" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "permanent_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "present_addresses" (
    "id" TEXT NOT NULL,
    "flat_no" TEXT,
    "house_no" TEXT,
    "house_name" TEXT,
    "plot_no" TEXT,
    "road_no" TEXT,
    "neighbourhood" TEXT,
    "region" TEXT,
    "village" TEXT,
    "post_code" TEXT,
    "post_office" TEXT,
    "thana" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Bangladesh',
    "user_id" TEXT,
    "spouse_id" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "present_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_histories" (
    "id" TEXT NOT NULL,
    "management_staff_id" TEXT,
    "academic_staff_id" TEXT,
    "position_id" TEXT NOT NULL,
    "student_id" TEXT,
    "governing_body_id" TEXT,
    "role" "Role" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "promotion_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "promotion_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "old_role" "Role" NOT NULL,
    "new_role" "Role" NOT NULL,
    "old_position_id" TEXT NOT NULL,
    "new_position_id" TEXT NOT NULL,
    "management_staff_id" TEXT,
    "academic_staff_id" TEXT,
    "student_id" TEXT,
    "governing_body_id" TEXT,
    "promotion_request_status" "PromotionRequestStatus" NOT NULL DEFAULT 'PENDING',
    "rejection_reason" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "promotion_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quranic_periods" (
    "id" TEXT NOT NULL,
    "quranic_period_name" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "quranic_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quranic_subjects" (
    "id" TEXT NOT NULL,
    "quranic_subject_name" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "quranic_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shifts" (
    "id" TEXT NOT NULL,
    "shift_name" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "shifts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spouse_infromation" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "contact_no" TEXT,
    "father_name" TEXT,
    "father_contact_no" TEXT,
    "mother_name" TEXT,
    "mother_contact_no" TEXT,
    "occupation" TEXT,
    "job_title" TEXT,
    "monthly_income" TEXT,
    "user_id" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "spouse_infromation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_salary_rates" (
    "id" TEXT NOT NULL,
    "academic_staff_id" TEXT,
    "management_staff_id" TEXT,
    "monthly_salary" DECIMAL(10,2) NOT NULL,
    "eid_bonus" DECIMAL(10,2) NOT NULL,
    "change_type" "SalaryChangeType" NOT NULL DEFAULT 'INITIAL',
    "effective_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "note" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "staff_salary_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_payments" (
    "id" TEXT NOT NULL,
    "academic_staff_id" TEXT,
    "management_staff_id" TEXT,
    "payment_type" "StaffPaymentType" NOT NULL,
    "payment_period_key" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receipt_number" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "staff_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "active_class_id" TEXT NOT NULL,
    "current_position_id" TEXT,
    "current_role_id" TEXT,
    "current_role" "Role",
    "responsible_teacher_id" TEXT,
    "user_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fee_rates" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "fee_type" "StudentFeeType" NOT NULL,
    "billing_frequency" "BillingFrequency" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "effective_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "effective_to" TIMESTAMP(3),
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "student_fee_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_fee_payments" (
    "id" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "academic_year_id" TEXT NOT NULL,
    "fee_type" "StudentFeeType" NOT NULL,
    "billing_frequency" "BillingFrequency" NOT NULL,
    "billing_period_key" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "paid_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "receipt_number" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "student_fee_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "subject_name" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "blood_group" "BloodGroup",
    "date_of_birth" TIMESTAMP(3),
    "height_in_cm" DOUBLE PRECISION,
    "weight_in_kg" DOUBLE PRECISION,
    "religion" "Religion",
    "nationality" TEXT NOT NULL DEFAULT 'Bangladeshi',
    "birth_certificate_number" TEXT,
    "nid_number" TEXT,
    "photo_url" TEXT,
    "mobile_number" TEXT NOT NULL,
    "is_mobile_verified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "user_name" TEXT,
    "user_password" TEXT,
    "active_status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "current_role" "Role",
    "current_position_id" TEXT,
    "created_roles" "Role"[],
    "updated_roles" "Role"[],
    "father_details_id" TEXT,
    "mother_details_id" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_positions" (
    "id" TEXT NOT NULL,
    "position_name" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_class_routine_subjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_class_routine_subjects_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_result_management_staff_id_key" ON "academic_result"("management_staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_result_academic_staff_id_key" ON "academic_result"("academic_staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_result_governing_body_id_key" ON "academic_result"("governing_body_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_staffs_user_id_key" ON "academic_staffs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AcademicYear_academic_year_name_key" ON "AcademicYear"("academic_year_name");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_changed_by_id_created_at_idx" ON "audit_logs"("changed_by_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_name_entity_id_created_at_idx" ON "audit_logs"("entity_name", "entity_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "classes_class_name_key" ON "classes"("class_name");

-- CreateIndex
CREATE UNIQUE INDEX "classes_grade_group_teacher_id_key" ON "classes"("grade_group_teacher_id");

-- CreateIndex
CREATE INDEX "class_history_start_date_idx" ON "class_history"("start_date");

-- CreateIndex
CREATE INDEX "class_history_end_date_idx" ON "class_history"("end_date");

-- CreateIndex
CREATE INDEX "class_history_student_id_end_date_idx" ON "class_history"("student_id", "end_date");

-- CreateIndex
CREATE UNIQUE INDEX "class_history_roll_number_class_id_shift_id_academic_year_i_key" ON "class_history"("roll_number", "class_id", "shift_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "class_history_quranic_periods_class_history_id_idx" ON "class_history_quranic_periods"("class_history_id");

-- CreateIndex
CREATE INDEX "class_history_quranic_periods_quranic_period_id_idx" ON "class_history_quranic_periods"("quranic_period_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_history_quranic_periods_class_history_id_quranic_peri_key" ON "class_history_quranic_periods"("class_history_id", "quranic_period_id");

-- CreateIndex
CREATE UNIQUE INDEX "governing_bodies_email_key" ON "governing_bodies"("email");

-- CreateIndex
CREATE UNIQUE INDEX "governing_bodies_user_id_key" ON "governing_bodies"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "governing_bodies_full_name_mobile_number_key" ON "governing_bodies"("full_name", "mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "management_staffs_email_key" ON "management_staffs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "management_staffs_user_id_key" ON "management_staffs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "management_staffs_full_name_mobile_number_key" ON "management_staffs"("full_name", "mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "periods_period_name_key" ON "periods"("period_name");

-- CreateIndex
CREATE UNIQUE INDEX "permanent_addresses_user_id_key" ON "permanent_addresses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "permanent_addresses_spouse_id_key" ON "permanent_addresses"("spouse_id");

-- CreateIndex
CREATE UNIQUE INDEX "present_addresses_user_id_key" ON "present_addresses"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "present_addresses_spouse_id_key" ON "present_addresses"("spouse_id");

-- CreateIndex
CREATE INDEX "promotion_histories_management_staff_id_idx" ON "promotion_histories"("management_staff_id");

-- CreateIndex
CREATE INDEX "promotion_histories_academic_staff_id_idx" ON "promotion_histories"("academic_staff_id");

-- CreateIndex
CREATE INDEX "promotion_histories_position_id_idx" ON "promotion_histories"("position_id");

-- CreateIndex
CREATE UNIQUE INDEX "quranic_periods_quranic_period_name_key" ON "quranic_periods"("quranic_period_name");

-- CreateIndex
CREATE UNIQUE INDEX "quranic_subjects_quranic_subject_name_key" ON "quranic_subjects"("quranic_subject_name");

-- CreateIndex
CREATE UNIQUE INDEX "shifts_shift_name_key" ON "shifts"("shift_name");

-- CreateIndex
CREATE UNIQUE INDEX "spouse_infromation_user_id_key" ON "spouse_infromation"("user_id");

-- CreateIndex
CREATE INDEX "spouse_infromation_full_name_idx" ON "spouse_infromation"("full_name");

-- CreateIndex
CREATE INDEX "spouse_infromation_contact_no_idx" ON "spouse_infromation"("contact_no");

-- CreateIndex
CREATE INDEX "spouse_infromation_created_by_id_idx" ON "spouse_infromation"("created_by_id");

-- CreateIndex
CREATE INDEX "spouse_infromation_updated_by_id_idx" ON "spouse_infromation"("updated_by_id");

-- CreateIndex
CREATE INDEX "staff_salary_rates_academic_staff_id_effective_from_idx" ON "staff_salary_rates"("academic_staff_id", "effective_from");

-- CreateIndex
CREATE INDEX "staff_salary_rates_management_staff_id_effective_from_idx" ON "staff_salary_rates"("management_staff_id", "effective_from");

-- CreateIndex
CREATE UNIQUE INDEX "staff_salary_rates_academic_staff_id_effective_from_key" ON "staff_salary_rates"("academic_staff_id", "effective_from");

-- CreateIndex
CREATE UNIQUE INDEX "staff_salary_rates_management_staff_id_effective_from_key" ON "staff_salary_rates"("management_staff_id", "effective_from");

-- CreateIndex
CREATE UNIQUE INDEX "staff_payments_receipt_number_key" ON "staff_payments"("receipt_number");

-- CreateIndex
CREATE INDEX "staff_payments_academic_staff_id_paid_at_idx" ON "staff_payments"("academic_staff_id", "paid_at");

-- CreateIndex
CREATE INDEX "staff_payments_management_staff_id_paid_at_idx" ON "staff_payments"("management_staff_id", "paid_at");

-- CreateIndex
CREATE UNIQUE INDEX "staff_payments_academic_staff_id_payment_type_payment_perio_key" ON "staff_payments"("academic_staff_id", "payment_type", "payment_period_key");

-- CreateIndex
CREATE UNIQUE INDEX "staff_payments_management_staff_id_payment_type_payment_per_key" ON "staff_payments"("management_staff_id", "payment_type", "payment_period_key");

-- CreateIndex
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_full_name_mobile_number_key" ON "students"("full_name", "mobile_number");

-- CreateIndex
CREATE INDEX "student_fee_rates_student_id_fee_type_effective_from_idx" ON "student_fee_rates"("student_id", "fee_type", "effective_from");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_rates_student_id_fee_type_billing_frequency_eff_key" ON "student_fee_rates"("student_id", "fee_type", "billing_frequency", "effective_from");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_payments_receipt_number_key" ON "student_fee_payments"("receipt_number");

-- CreateIndex
CREATE INDEX "student_fee_payments_student_id_paid_at_idx" ON "student_fee_payments"("student_id", "paid_at");

-- CreateIndex
CREATE UNIQUE INDEX "student_fee_payments_student_id_fee_type_billing_frequency__key" ON "student_fee_payments"("student_id", "fee_type", "billing_frequency", "academic_year_id", "billing_period_key");

-- CreateIndex
CREATE UNIQUE INDEX "subjects_subject_name_key" ON "subjects"("subject_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_full_name_mobile_number_key" ON "users"("full_name", "mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_positions_position_name_key" ON "user_positions"("position_name");

-- CreateIndex
CREATE INDEX "_class_routine_subjects_B_index" ON "_class_routine_subjects"("B");

-- AddForeignKey
ALTER TABLE "academic_result" ADD CONSTRAINT "academic_result_management_staff_id_fkey" FOREIGN KEY ("management_staff_id") REFERENCES "management_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_result" ADD CONSTRAINT "academic_result_academic_staff_id_fkey" FOREIGN KEY ("academic_staff_id") REFERENCES "academic_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_result" ADD CONSTRAINT "academic_result_governing_body_id_fkey" FOREIGN KEY ("governing_body_id") REFERENCES "governing_bodies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_result" ADD CONSTRAINT "academic_result_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_result" ADD CONSTRAINT "academic_result_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_current_position_id_fkey" FOREIGN KEY ("current_position_id") REFERENCES "user_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicYear" ADD CONSTRAINT "AcademicYear_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademicYear" ADD CONSTRAINT "AcademicYear_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_grade_group_teacher_id_fkey" FOREIGN KEY ("grade_group_teacher_id") REFERENCES "academic_staffs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history" ADD CONSTRAINT "class_history_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history" ADD CONSTRAINT "class_history_quranic_subject_id_fkey" FOREIGN KEY ("quranic_subject_id") REFERENCES "quranic_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history" ADD CONSTRAINT "class_history_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history" ADD CONSTRAINT "class_history_shift_id_fkey" FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history" ADD CONSTRAINT "class_history_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history" ADD CONSTRAINT "class_history_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history" ADD CONSTRAINT "class_history_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history_quranic_periods" ADD CONSTRAINT "class_history_quranic_periods_class_history_id_fkey" FOREIGN KEY ("class_history_id") REFERENCES "class_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history_quranic_periods" ADD CONSTRAINT "class_history_quranic_periods_quranic_period_id_fkey" FOREIGN KEY ("quranic_period_id") REFERENCES "quranic_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_rotine" ADD CONSTRAINT "class_rotine_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_rotine" ADD CONSTRAINT "class_rotine_period_id_fkey" FOREIGN KEY ("period_id") REFERENCES "periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_rotine" ADD CONSTRAINT "class_rotine_quranic_period_id_fkey" FOREIGN KEY ("quranic_period_id") REFERENCES "quranic_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_rotine" ADD CONSTRAINT "class_rotine_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "academic_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_rotine" ADD CONSTRAINT "class_rotine_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_rotine" ADD CONSTRAINT "class_rotine_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "father_details" ADD CONSTRAINT "father_details_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "father_details" ADD CONSTRAINT "father_details_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "governing_bodies" ADD CONSTRAINT "governing_bodies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "governing_bodies" ADD CONSTRAINT "governing_bodies_current_position_id_fkey" FOREIGN KEY ("current_position_id") REFERENCES "user_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "governing_bodies" ADD CONSTRAINT "governing_bodies_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "governing_bodies" ADD CONSTRAINT "governing_bodies_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_staffs" ADD CONSTRAINT "management_staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_staffs" ADD CONSTRAINT "management_staffs_current_position_id_fkey" FOREIGN KEY ("current_position_id") REFERENCES "user_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_staffs" ADD CONSTRAINT "management_staffs_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_staffs" ADD CONSTRAINT "management_staffs_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mother_details" ADD CONSTRAINT "mother_details_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mother_details" ADD CONSTRAINT "mother_details_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periods" ADD CONSTRAINT "periods_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "periods" ADD CONSTRAINT "periods_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permanent_addresses" ADD CONSTRAINT "permanent_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permanent_addresses" ADD CONSTRAINT "permanent_addresses_spouse_id_fkey" FOREIGN KEY ("spouse_id") REFERENCES "spouse_infromation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permanent_addresses" ADD CONSTRAINT "permanent_addresses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permanent_addresses" ADD CONSTRAINT "permanent_addresses_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "present_addresses" ADD CONSTRAINT "present_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "present_addresses" ADD CONSTRAINT "present_addresses_spouse_id_fkey" FOREIGN KEY ("spouse_id") REFERENCES "spouse_infromation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "present_addresses" ADD CONSTRAINT "present_addresses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "present_addresses" ADD CONSTRAINT "present_addresses_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_histories" ADD CONSTRAINT "promotion_histories_management_staff_id_fkey" FOREIGN KEY ("management_staff_id") REFERENCES "management_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_histories" ADD CONSTRAINT "promotion_histories_academic_staff_id_fkey" FOREIGN KEY ("academic_staff_id") REFERENCES "academic_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_histories" ADD CONSTRAINT "promotion_histories_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "user_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_histories" ADD CONSTRAINT "promotion_histories_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_histories" ADD CONSTRAINT "promotion_histories_governing_body_id_fkey" FOREIGN KEY ("governing_body_id") REFERENCES "governing_bodies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_histories" ADD CONSTRAINT "promotion_histories_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_histories" ADD CONSTRAINT "promotion_histories_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_requests" ADD CONSTRAINT "promotion_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_requests" ADD CONSTRAINT "promotion_requests_old_position_id_fkey" FOREIGN KEY ("old_position_id") REFERENCES "user_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_requests" ADD CONSTRAINT "promotion_requests_new_position_id_fkey" FOREIGN KEY ("new_position_id") REFERENCES "user_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_requests" ADD CONSTRAINT "promotion_requests_management_staff_id_fkey" FOREIGN KEY ("management_staff_id") REFERENCES "management_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_requests" ADD CONSTRAINT "promotion_requests_academic_staff_id_fkey" FOREIGN KEY ("academic_staff_id") REFERENCES "academic_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_requests" ADD CONSTRAINT "promotion_requests_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_requests" ADD CONSTRAINT "promotion_requests_governing_body_id_fkey" FOREIGN KEY ("governing_body_id") REFERENCES "governing_bodies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_requests" ADD CONSTRAINT "promotion_requests_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "promotion_requests" ADD CONSTRAINT "promotion_requests_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quranic_periods" ADD CONSTRAINT "quranic_periods_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quranic_periods" ADD CONSTRAINT "quranic_periods_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quranic_subjects" ADD CONSTRAINT "quranic_subjects_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quranic_subjects" ADD CONSTRAINT "quranic_subjects_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_infromation" ADD CONSTRAINT "spouse_infromation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_infromation" ADD CONSTRAINT "spouse_infromation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_infromation" ADD CONSTRAINT "spouse_infromation_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_salary_rates" ADD CONSTRAINT "staff_salary_rates_academic_staff_id_fkey" FOREIGN KEY ("academic_staff_id") REFERENCES "academic_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_salary_rates" ADD CONSTRAINT "staff_salary_rates_management_staff_id_fkey" FOREIGN KEY ("management_staff_id") REFERENCES "management_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_salary_rates" ADD CONSTRAINT "staff_salary_rates_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_salary_rates" ADD CONSTRAINT "staff_salary_rates_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_payments" ADD CONSTRAINT "staff_payments_academic_staff_id_fkey" FOREIGN KEY ("academic_staff_id") REFERENCES "academic_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_payments" ADD CONSTRAINT "staff_payments_management_staff_id_fkey" FOREIGN KEY ("management_staff_id") REFERENCES "management_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_payments" ADD CONSTRAINT "staff_payments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_payments" ADD CONSTRAINT "staff_payments_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_active_class_id_fkey" FOREIGN KEY ("active_class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_current_position_id_fkey" FOREIGN KEY ("current_position_id") REFERENCES "user_positions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_responsible_teacher_id_fkey" FOREIGN KEY ("responsible_teacher_id") REFERENCES "academic_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_rates" ADD CONSTRAINT "student_fee_rates_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_rates" ADD CONSTRAINT "student_fee_rates_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_rates" ADD CONSTRAINT "student_fee_rates_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_payments" ADD CONSTRAINT "student_fee_payments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_payments" ADD CONSTRAINT "student_fee_payments_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "AcademicYear"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_payments" ADD CONSTRAINT "student_fee_payments_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_fee_payments" ADD CONSTRAINT "student_fee_payments_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subjects" ADD CONSTRAINT "subjects_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_position_id_fkey" FOREIGN KEY ("current_position_id") REFERENCES "user_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_father_details_id_fkey" FOREIGN KEY ("father_details_id") REFERENCES "father_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_mother_details_id_fkey" FOREIGN KEY ("mother_details_id") REFERENCES "mother_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_positions" ADD CONSTRAINT "user_positions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_positions" ADD CONSTRAINT "user_positions_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_class_routine_subjects" ADD CONSTRAINT "_class_routine_subjects_A_fkey" FOREIGN KEY ("A") REFERENCES "class_rotine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_class_routine_subjects" ADD CONSTRAINT "_class_routine_subjects_B_fkey" FOREIGN KEY ("B") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
