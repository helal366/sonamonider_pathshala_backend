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
    "staff_id" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "academic_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_log" (
    "audit_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "entity_name" TEXT NOT NULL,
    "old_value" JSONB,
    "new_value" JSONB,
    "action" "AuditAction" NOT NULL,
    "changed_by_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_log_pkey" PRIMARY KEY ("audit_id")
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
CREATE TABLE "management_staffs" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "teaching_working_experience_year" INTEGER,
    "teaching_working_experience_month" INTEGER,
    "alternative_contact_no" TEXT[],
    "user_id" TEXT NOT NULL,
    "current_position_id" TEXT,
    "current_role_id" TEXT,
    "is_currenly_active_staff" BOOLEAN NOT NULL DEFAULT true,
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
    "house_no" TEXT,
    "house_name" TEXT,
    "plot_no" TEXT,
    "road_no" TEXT,
    "neighbourhood" TEXT,
    "region" TEXT,
    "village" TEXT,
    "post_code" INTEGER,
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
    "house_no" TEXT,
    "house_name" TEXT,
    "plot_no" TEXT,
    "road_no" TEXT,
    "neighbourhood" TEXT,
    "region" TEXT,
    "village" TEXT,
    "post_code" INTEGER,
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
CREATE TABLE "spouse_infromation" (
    "spouse_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "contact_no" TEXT,
    "father_name" TEXT,
    "father_contact_no" TEXT,
    "mother_name" TEXT,
    "mother_contact_no" TEXT,
    "occupation" TEXT,
    "job_title" TEXT,
    "monthly_income" INTEGER,
    "staff_id" TEXT,
    "created_by_id" TEXT,
    "updated_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "spouse_infromation_pkey" PRIMARY KEY ("spouse_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "is_mobile_verified" BOOLEAN NOT NULL DEFAULT false,
    "email" TEXT,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
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

-- CreateTable
CREATE TABLE "_managements_positions" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_managements_positions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_roles_managements" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_roles_managements_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "academic_results_staff_id_key" ON "academic_results"("staff_id");

-- CreateIndex
CREATE INDEX "audit_log_changed_by_id_created_at_idx" ON "audit_log"("changed_by_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_log_entity_name_entity_id_created_at_idx" ON "audit_log"("entity_name", "entity_id", "created_at");

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
CREATE UNIQUE INDEX "spouse_infromation_staff_id_key" ON "spouse_infromation"("staff_id");

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

-- CreateIndex
CREATE INDEX "_managements_positions_B_index" ON "_managements_positions"("B");

-- CreateIndex
CREATE INDEX "_roles_managements_B_index" ON "_roles_managements"("B");

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "management_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_results" ADD CONSTRAINT "academic_results_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "father_details" ADD CONSTRAINT "father_details_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "father_details" ADD CONSTRAINT "father_details_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "mother_details" ADD CONSTRAINT "mother_details_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mother_details" ADD CONSTRAINT "mother_details_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permanent_addresses" ADD CONSTRAINT "permanent_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permanent_addresses" ADD CONSTRAINT "permanent_addresses_spouse_id_fkey" FOREIGN KEY ("spouse_id") REFERENCES "spouse_infromation"("spouse_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permanent_addresses" ADD CONSTRAINT "permanent_addresses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permanent_addresses" ADD CONSTRAINT "permanent_addresses_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "present_addresses" ADD CONSTRAINT "present_addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "present_addresses" ADD CONSTRAINT "present_addresses_spouse_id_fkey" FOREIGN KEY ("spouse_id") REFERENCES "spouse_infromation"("spouse_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "present_addresses" ADD CONSTRAINT "present_addresses_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "present_addresses" ADD CONSTRAINT "present_addresses_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_infromation" ADD CONSTRAINT "spouse_infromation_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "management_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_infromation" ADD CONSTRAINT "spouse_infromation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouse_infromation" ADD CONSTRAINT "spouse_infromation_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "user_roles"("role_name") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "user_positions" ADD CONSTRAINT "user_positions_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_positions" ADD CONSTRAINT "user_positions_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_managements_positions" ADD CONSTRAINT "_managements_positions_A_fkey" FOREIGN KEY ("A") REFERENCES "management_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_managements_positions" ADD CONSTRAINT "_managements_positions_B_fkey" FOREIGN KEY ("B") REFERENCES "user_positions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roles_managements" ADD CONSTRAINT "_roles_managements_A_fkey" FOREIGN KEY ("A") REFERENCES "management_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_roles_managements" ADD CONSTRAINT "_roles_managements_B_fkey" FOREIGN KEY ("B") REFERENCES "user_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
