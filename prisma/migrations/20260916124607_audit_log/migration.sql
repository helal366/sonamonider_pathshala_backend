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

-- CreateIndex
CREATE INDEX "audit_log_changed_by_id_created_at_idx" ON "audit_log"("changed_by_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_log_entity_name_entity_id_created_at_idx" ON "audit_log"("entity_name", "entity_id", "created_at");

-- AddForeignKey
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_changed_by_id_fkey" FOREIGN KEY ("changed_by_id") REFERENCES "management_staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
