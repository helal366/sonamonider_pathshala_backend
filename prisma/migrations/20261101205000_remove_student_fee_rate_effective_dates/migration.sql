DROP INDEX "student_fee_rates_student_id_fee_type_billing_frequency_eff_key";
DROP INDEX "student_fee_rates_student_id_fee_type_effective_from_idx";

ALTER TABLE "student_fee_rates"
DROP COLUMN "effective_from",
DROP COLUMN "effective_to";

CREATE UNIQUE INDEX "student_fee_rates_student_id_fee_type_billing_frequency_key"
ON "student_fee_rates"("student_id", "fee_type", "billing_frequency");
