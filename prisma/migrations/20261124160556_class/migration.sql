-- CreateTable
CREATE TABLE "class_history_general_periods" (
    "id" TEXT NOT NULL,
    "class_history_id" TEXT NOT NULL,
    "general_period_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_history_general_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class_history_general_subjects" (
    "id" TEXT NOT NULL,
    "class_history_id" TEXT NOT NULL,
    "general_subject_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_history_general_subjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "class_history_general_periods_class_history_id_idx" ON "class_history_general_periods"("class_history_id");

-- CreateIndex
CREATE INDEX "class_history_general_periods_general_period_id_idx" ON "class_history_general_periods"("general_period_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_history_general_periods_class_history_id_general_peri_key" ON "class_history_general_periods"("class_history_id", "general_period_id");

-- CreateIndex
CREATE INDEX "class_history_general_subjects_class_history_id_idx" ON "class_history_general_subjects"("class_history_id");

-- CreateIndex
CREATE INDEX "class_history_general_subjects_general_subject_id_idx" ON "class_history_general_subjects"("general_subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "class_history_general_subjects_class_history_id_general_sub_key" ON "class_history_general_subjects"("class_history_id", "general_subject_id");

-- AddForeignKey
ALTER TABLE "class_history_general_periods" ADD CONSTRAINT "class_history_general_periods_class_history_id_fkey" FOREIGN KEY ("class_history_id") REFERENCES "class_history"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history_general_periods" ADD CONSTRAINT "class_history_general_periods_general_period_id_fkey" FOREIGN KEY ("general_period_id") REFERENCES "general_periods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history_general_subjects" ADD CONSTRAINT "class_history_general_subjects_class_history_id_fkey" FOREIGN KEY ("class_history_id") REFERENCES "class_history"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class_history_general_subjects" ADD CONSTRAINT "class_history_general_subjects_general_subject_id_fkey" FOREIGN KEY ("general_subject_id") REFERENCES "general_subjects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
