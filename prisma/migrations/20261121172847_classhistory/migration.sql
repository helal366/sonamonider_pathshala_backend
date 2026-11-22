/*
  Warnings:

  - A unique constraint covering the columns `[roll_number,class_id,academic_year_id,shift,version,section,department]` on the table `class_history` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "class_history_roll_number_class_id_shift_academic_year_key";

-- CreateIndex
CREATE UNIQUE INDEX "class_history_roll_number_class_id_shift_academic_year_key" ON "class_history"("roll_number", "class_id", "academic_year_id", "shift", "version", "section", "department");
