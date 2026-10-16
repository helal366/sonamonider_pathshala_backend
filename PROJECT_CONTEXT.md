# Project Context

This note captures decisions and implementation context from the October 2026 class-routine work session. Read it before continuing related work.

## Domain models and decisions

- `Period` and `QuranicPeriod` are separate period catalogs. Both store `start_time` and `end_time` as formatted strings such as `8:00 AM`.
- `Subject` and `QuranicSubject` are separate subject catalogs.
- `ClassRoutine` represents a class's teacher assignment to exactly one regular `Period` or `QuranicPeriod`, and can link multiple regular `Subject` records.
- Routine time is read from its related period record; the routine does not duplicate start/end time fields. This avoids time values drifting out of sync when a period is edited.
- One teacher must not have overlapping routine periods. The ClassRoutine and period update services check intervals using half-open overlap semantics, so back-to-back periods are allowed. This is service-level protection, not a database exclusion constraint; direct database writes can bypass it.
- The requested Prisma table mapping is currently `@@map("class_rotine")` (spelled `rotine`) in `prisma/schema/classRoutine.prisma`.

## Recent business logic: staff payments and student fees

- Staff salary rates and student fee rates are separate from their payment records. Rate records carry effective dates; payment records store the amount actually paid, the payment date, and an optional unique receipt number. Payment amounts are supplied explicitly; these services do not calculate payments from rates or generate them automatically.
- Staff salary rates apply to exactly one academic or management staff member and record monthly salary, Eid bonus, change type (`INITIAL`, `INCREMENT`, or `ADJUSTMENT`), effective date, and optional note. A staff member cannot have two rates of the same staff category with the same effective date.
- Staff payments apply to exactly one academic or management staff member. Payment types are monthly salary, Eid-ul-Fitr bonus, Eid-ul-Adha bonus, and performance bonus. A staff member can have at most one payment for a given payment type and payment-period key.
- Student fee rates belong to a student and are categorized by fee type and billing frequency (`MONTHLY`, `HALF_YEARLY`, `YEARLY`, or `ONE_TIME`), with an amount and effective date range. A student cannot have duplicate rates for the same fee type, frequency, and effective start date.
- Student fee payments are recorded against a student, academic year, fee type, billing frequency, and billing-period key. At most one payment can exist for the same student, fee type, frequency, academic year, and billing-period key.
- Rate effective dates are stored and uniqueness is enforced for matching effective start dates; the current services do not check for overlapping effective date ranges.
- Create, single-field update, and delete operations for rates and payments are available to Super Admin, Admin, Teacher Admin, and Management roles. A Management user must have the `ACCOUNTANT` position. Creation verifies that referenced staff, students, and academic years exist; amounts must be nonnegative.
- Each rate/payment mutation and its audit log entry are written in the same database transaction.

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
