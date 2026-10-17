-- Preserve existing single-class and single-teacher assignments as join rows.
CREATE TABLE "_class_routine_classes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_class_routine_classes_AB_pkey" PRIMARY KEY ("A", "B")
);

INSERT INTO "_class_routine_classes" ("A", "B")
SELECT "class_id", "id"
FROM "class_rotine";

CREATE INDEX "_class_routine_classes_B_index"
ON "_class_routine_classes"("B");

CREATE TABLE "_class_routine_teachers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_class_routine_teachers_AB_pkey" PRIMARY KEY ("A", "B")
);

INSERT INTO "_class_routine_teachers" ("A", "B")
SELECT "teacher_id", "id"
FROM "class_rotine";

CREATE INDEX "_class_routine_teachers_B_index"
ON "_class_routine_teachers"("B");

CREATE TABLE "_class_routine_quranic_subjects" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_class_routine_quranic_subjects_AB_pkey" PRIMARY KEY ("A", "B")
);

CREATE INDEX "_class_routine_quranic_subjects_B_index"
ON "_class_routine_quranic_subjects"("B");

ALTER TABLE "class_rotine"
ADD COLUMN "shift_id" TEXT;

ALTER TABLE "class_rotine"
DROP CONSTRAINT "class_rotine_class_id_fkey",
DROP CONSTRAINT "class_rotine_teacher_id_fkey",
DROP COLUMN "class_id",
DROP COLUMN "teacher_id";

ALTER TABLE "_class_routine_classes"
ADD CONSTRAINT "_class_routine_classes_A_fkey"
FOREIGN KEY ("A") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "_class_routine_classes_B_fkey"
FOREIGN KEY ("B") REFERENCES "class_rotine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_class_routine_teachers"
ADD CONSTRAINT "_class_routine_teachers_A_fkey"
FOREIGN KEY ("A") REFERENCES "academic_staffs"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "_class_routine_teachers_B_fkey"
FOREIGN KEY ("B") REFERENCES "class_rotine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "_class_routine_quranic_subjects"
ADD CONSTRAINT "_class_routine_quranic_subjects_A_fkey"
FOREIGN KEY ("A") REFERENCES "class_rotine"("id") ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT "_class_routine_quranic_subjects_B_fkey"
FOREIGN KEY ("B") REFERENCES "quranic_subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "class_rotine"
ADD CONSTRAINT "class_rotine_shift_id_fkey"
FOREIGN KEY ("shift_id") REFERENCES "shifts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

UPDATE "quranic_periods"
SET "end_time" = '12:00 PM'
WHERE "quranic_period_name" = 'ARABIC_LITERATURE_BOYS'
  AND "end_time" = '12:00 AM';

UPDATE "quranic_periods"
SET "end_time" = '12:15 PM'
WHERE "quranic_period_name" = 'ARABIC_LITERATURE_HIGH'
  AND "end_time" = '12:15 AM';
