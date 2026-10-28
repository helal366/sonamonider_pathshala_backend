/*
  Warnings:

  - You are about to drop the column `grade_group_teacher_id` on the `classes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[grade_group_teacher_class_id]` on the table `academic_staffs` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "classes" DROP CONSTRAINT "classes_grade_group_teacher_id_fkey";

-- DropIndex
DROP INDEX "classes_grade_group_teacher_id_key";

-- AlterTable
ALTER TABLE "academic_staffs" ADD COLUMN     "grade_group_teacher_class_id" TEXT;

-- Preserve existing teacher assignments in the new relation direction
UPDATE "academic_staffs" AS staff
SET "grade_group_teacher_class_id" = classes."id"
FROM "classes"
WHERE classes."grade_group_teacher_id" = staff."id";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "grade_group_teacher_id";

-- CreateIndex
CREATE UNIQUE INDEX "academic_staffs_grade_group_teacher_class_id_key" ON "academic_staffs"("grade_group_teacher_class_id");

-- AddForeignKey
ALTER TABLE "academic_staffs" ADD CONSTRAINT "academic_staffs_grade_group_teacher_class_id_fkey" FOREIGN KEY ("grade_group_teacher_class_id") REFERENCES "classes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
