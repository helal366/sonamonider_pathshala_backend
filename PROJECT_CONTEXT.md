# Project Context

This note captures decisions and implementation context from the October 2026 class-routine work session. Read it before continuing related work.

## Domain models and decisions

- `Period` and `QuranicPeriod` are separate period catalogs. Both store `start_time` and `end_time` as formatted strings such as `8:00 AM`.
- `Subject` and `QuranicSubject` are separate subject catalogs.
- `ClassRoutine` represents a class's teacher assignment to exactly one regular `Period` or `QuranicPeriod`, and can link multiple regular `Subject` records.
- Routine time is read from its related period record; the routine does not duplicate start/end time fields. This avoids time values drifting out of sync when a period is edited.
- One teacher must not have overlapping routine periods. The ClassRoutine and period update services check intervals using half-open overlap semantics, so back-to-back periods are allowed. This is service-level protection, not a database exclusion constraint; direct database writes can bypass it.
- The requested Prisma table mapping is currently `@@map("class_rotine")` (spelled `rotine`) in `prisma/schema/classRoutine.prisma`.

## API modules

Mounted in `src/app.ts`:

- `/api/v1/smps/period`
- `/api/v1/smps/subject`
- `/api/v1/smps/quranic_class_period`
- `/api/v1/smps/quranic_subject`
- `/api/v1/smps/class_routine`

The modules provide create, full update, single-field update, delete, list, and get-by-ID operations where applicable. Mutations are Super Admin-only; catalog and routine GET routes allow Super Admin, Admin, and Teacher Admin. Mutations write audit logs transactionally. Period deletion is blocked when used by a routine; subject deletion is blocked when linked to a routine. Quranic period deletion also checks routine and class-history references.

## Validation and schedule behavior

- Quranic period create/update validation accepts 12-hour AM/PM time strings and requires end time to be later than start time.
- ClassRoutine request validation requires exactly one of `period_id` or `quranic_period_id`, and rejects duplicate subject IDs.
- ClassRoutine create/update checks that referenced class, teacher, period, and subjects exist.
- ClassRoutine create/update and period time changes check teacher time overlap across both regular and Quranic periods.
- Period names are unique (`Period.period_name` and `QuranicPeriod.quranic_period_name`). If one display name needs different time definitions, this uniqueness/design needs reconsideration.

## Verification completed

After adding the Period, Subject, and ClassRoutine modules, these checks passed:

- `pnpm run typecheck`
- `pnpm exec prisma validate`
- `git diff --check`
- Targeted ClassRoutine Zod checks for valid input, missing/both period IDs, and duplicate subjects

## Worktree status

At the end of this session, the schema and module changes were still uncommitted. Preserve them; inspect `git status` before making further changes.
