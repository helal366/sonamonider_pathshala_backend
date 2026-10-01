-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

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

-- CreateTable
CREATE TABLE "academic_results" (
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

    CONSTRAINT "academic_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_staffs" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "current_position_id" TEXT,
    "current_role_id" TEXT,
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
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "classes_pkey" PRIMARY KEY ("id")
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
    "current_role_id" TEXT,
    "is_currently_active_staff" BOOLEAN NOT NULL DEFAULT true,
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
    "role_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),

    CONSTRAINT "promotion_histories_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "active_class_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
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
    "email" TEXT,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "user_name" TEXT,
    "user_password" TEXT,
    "active_status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "role_id" TEXT,
    "position_id" TEXT,
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
    "role_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_positions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "id" TEXT NOT NULL,
    "role_name" TEXT NOT NULL,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_results_management_staff_id_key" ON "academic_results"("management_staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_results_academic_staff_id_key" ON "academic_results"("academic_staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_results_governing_body_id_key" ON "academic_results"("governing_body_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_staffs_email_key" ON "academic_staffs"("email");

-- CreateIndex
CREATE UNIQUE INDEX "academic_staffs_user_id_key" ON "academic_staffs"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_staffs_full_name_mobile_number_key" ON "academic_staffs"("full_name", "mobile_number");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "audit_logs_changed_by_id_created_at_idx" ON "audit_logs"("changed_by_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_entity_name_entity_id_created_at_idx" ON "audit_logs"("entity_name", "entity_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "classes_class_name_key" ON "classes"("class_name");

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
CREATE INDEX "promotion_histories_position_id_idx" ON "promotion_histories"("position_id");

-- CreateIndex
CREATE INDEX "promotion_histories_role_id_idx" ON "promotion_histories"("role_id");

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
CREATE UNIQUE INDEX "students_email_key" ON "students"("email");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_key" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_full_name_mobile_number_key" ON "students"("full_name", "mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_user_name_key" ON "users"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "users_full_name_mobile_number_key" ON "users"("full_name", "mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "user_positions_position_name_key" ON "user_positions"("position_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_roles_role_name_key" ON "user_roles"("role_name");

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_management_staff_id_fkey" FOREIGN KEY ("management_staff_id") REFERENCES "management_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_academic_staff_id_fkey" FOREIGN KEY ("academic_staff_id") REFERENCES "academic_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_governing_body_id_fkey" FOREIGN KEY ("governing_body_id") REFERENCES "governing_bodies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_current_position_id_fkey" FOREIGN KEY ("current_position_id") REFERENCES "user_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_current_role_id_fkey" FOREIGN KEY ("current_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "classes" ADD CONSTRAINT "classes_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "father_details" ADD CONSTRAINT "father_details_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "father_details" ADD CONSTRAINT "father_details_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "governing_bodies" ADD CONSTRAINT "governing_bodies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "governing_bodies" ADD CONSTRAINT "governing_bodies_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "governing_bodies" ADD CONSTRAINT "governing_bodies_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_staffs" ADD CONSTRAINT "management_staffs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_staffs" ADD CONSTRAINT "management_staffs_current_position_id_fkey" FOREIGN KEY ("current_position_id") REFERENCES "user_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_staffs" ADD CONSTRAINT "management_staffs_current_role_id_fkey" FOREIGN KEY ("current_role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_staffs" ADD CONSTRAINT "management_staffs_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "management_staffs" ADD CONSTRAINT "management_staffs_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mother_details" ADD CONSTRAINT "mother_details_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mother_details" ADD CONSTRAINT "mother_details_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "promotion_histories" ADD CONSTRAINT "promotion_histories_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_infromation" ADD CONSTRAINT "spouse_infromation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_infromation" ADD CONSTRAINT "spouse_infromation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_infromation" ADD CONSTRAINT "spouse_infromation_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_active_class_id_fkey" FOREIGN KEY ("active_class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_position_id_fkey" FOREIGN KEY ("position_id") REFERENCES "user_positions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_father_details_id_fkey" FOREIGN KEY ("father_details_id") REFERENCES "father_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_mother_details_id_fkey" FOREIGN KEY ("mother_details_id") REFERENCES "mother_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_positions" ADD CONSTRAINT "user_positions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_positions" ADD CONSTRAINT "user_positions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_positions" ADD CONSTRAINT "user_positions_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
