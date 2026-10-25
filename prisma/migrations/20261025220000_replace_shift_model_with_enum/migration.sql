BEGIN;

DO $$
DECLARE
  unsupported_shifts TEXT;
BEGIN
  SELECT string_agg(DISTINCT shift_name, ', ')
  INTO unsupported_shifts
  FROM shifts
  WHERE upper(btrim(shift_name)) NOT IN ('MORNING', 'DAY', 'BOYS', 'GIRLS');

  IF unsupported_shifts IS NOT NULL THEN
    RAISE EXCEPTION
      'Cannot migrate shifts with unsupported names: %. Map these records to MORNING, DAY, BOYS, or GIRLS before retrying.',
      unsupported_shifts;
  END IF;
END $$;

CREATE TYPE "Shift" AS ENUM ('MORNING', 'DAY', 'BOYS', 'GIRLS');

ALTER TABLE "class_history" ADD COLUMN "shift" "Shift";
ALTER TABLE "class_routines" ADD COLUMN "shift" "Shift";

UPDATE "class_history" AS history
SET "shift" = upper(btrim(shifts."shift_name"))::"Shift"
FROM "shifts" AS shifts
WHERE history."shift_id" = shifts."id";

UPDATE "class_routines" AS routines
SET "shift" = upper(btrim(shifts."shift_name"))::"Shift"
FROM "shifts" AS shifts
WHERE routines."shift_id" = shifts."id";

ALTER TABLE "class_history" ALTER COLUMN "shift" SET NOT NULL;

ALTER TABLE "class_history" DROP CONSTRAINT "class_history_shift_id_fkey";
ALTER TABLE "class_routines" DROP CONSTRAINT "class_routines_shift_id_fkey";
DROP INDEX "class_history_roll_number_class_id_shift_id_academic_year_i_key";

ALTER TABLE "class_history" DROP COLUMN "shift_id";
ALTER TABLE "class_routines" DROP COLUMN "shift_id";
DROP TABLE "shifts";

CREATE UNIQUE INDEX "class_history_roll_number_class_id_shift_academic_year_key"
ON "class_history"("roll_number", "class_id", "shift", "academic_year_id");

COMMIT;
