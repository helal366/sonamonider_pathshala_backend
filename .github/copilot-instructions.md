# Copilot instructions for sonamonider_pathshala_backend

## Project shape

This repository is a TypeScript Express API backed by PostgreSQL and Prisma. The app boots in `src/server.ts`, mounts feature routers in `src/app.ts`, and serves REST endpoints under `/api/v1/smps/*`.

The architecture is feature-oriented: each domain module lives under `src/modules/<feature>/` and typically includes a route, controller, service, and Zod validation file. Shared cross-cutting concerns live in `src/middlewares/`, `src/utils/`, and `src/lib/`.

Prisma schema files are split across `prisma/schema/*.prisma`; the generated client is emitted to `src/generated/prisma`, and the app imports it via the `#db-client` alias in `package.json` and `src/lib/prisma.ts`.

`PROJECT_CONTEXT.md` is the key repo-specific design note. It captures business rules for class routines, fee/payment logic, and period/subject behavior; if you are changing these areas, read it before patching logic.

## Build, test, and validation commands

Use the repo scripts from `package.json`:

- Install dependencies: `pnpm install`
- Run the API locally: `pnpm dev`
- Type-check: `pnpm run typecheck`
- Build output bundle: `pnpm build`
- Start the built server: `pnpm start`
- Prisma migrate: `pnpm db:migrate`
- Push schema directly: `pnpm db:push`
- Reset DB + schema: `pnpm db:reset`
- Seed data: `pnpm seed`
- Seed book list: `pnpm seedBookList`

There is no dedicated `test` script or Jest/Vitest setup in this repo. For a single validation target, use:

- `pnpm run typecheck`
- `pnpm exec prisma validate`

If a schema change is involved, run Prisma generation/build checks before submitting code.

## High-level architecture and conventions

- `src/app.ts` is the composition root: it imports each router and mounts it on its API path.
- Most routes follow the pattern `router.<method>(..., userAuth(...), validateZod*(), controller.method)`.
- Authentication and request validation are centralized in:
  - `src/middlewares/userAuth.ts`
  - `src/middlewares/validateZodSchema.ts`
- Error handling is intentionally centralized through `catchAsync`, `AppError`, and the global error middleware.
- Request validation is performed with Zod; do not bypass the middleware unless the route truly has no body/query/params to validate.
- Roles are enforced explicitly with `Role` values from the generated Prisma client, e.g. `Role.SUPER_ADMIN`, `Role.ADMIN`, `Role.TEACHER_ADMIN`, `Role.MANAGEMENT`.
- `src/lib/prisma.ts` is the canonical Prisma client setup. Prefer using that client over ad hoc DB access.

## Domain-specific rules to preserve

Before changing behavior in routine, payment, or academic scheduling areas, check `PROJECT_CONTEXT.md` and the related Prisma schema files. Some of the repo’s important constraints are:

- Class routines are modeled as shared sessions that may include multiple classes, teachers, and subject links without duplicating the session row.
- Teacher/class overlap checks are enforced in service logic, not only through DB constraints.
- General and Quranic periods are distinct catalogs, and time validation is done at the service layer.
- Staff payment and student fee rates are stored separately from actual payment records; payment amounts are explicit, not calculated automatically.
- Uniqueness and effective-date logic are domain-sensitive; do not “simplify” these rules without reading the project context and related schema.

## Mandatory coding conventions

1. TypeScript imports: Always use `.js` extensions for relative local imports, even when importing `.ts` files.
2. Zod: Use Zod v4 with `import z4 from "zod/v4"`. Follow the existing Zod v4 validation patterns.
3. API responses: Use the existing `sendResponse` utility for successful API responses.
4. Asynchronous operations: Use `catchAsync` for asynchronous controller and route-handler operations, following existing patterns.
5. Error handling: Use `AppError` and `http-status-codes` for application errors. Do not introduce inconsistent error-handling patterns.
6. Prisma: Import and use the canonical Prisma client through the `#db-client` alias or the existing `src/lib/prisma.ts` setup. Follow existing transaction patterns.
7. Audit logging: Preserve and implement audit logging wherever required by existing business logic. Use the authenticated user's ID as the audit actor where applicable.
8. Updates: Prefer focused single-field update operations when the API requirement calls for updating one field. Follow existing validation, authorization, duplicate checking, and audit logging patterns.
9. Authentication and authorization: Never bypass `userAuth` or role-based access control. Follow the existing role hierarchy and route conventions.
10. Project context: Before modifying academic, financial, fee/payment, staff-management, or class-scheduling logic, read the relevant sections of `PROJECT_CONTEXT.md` and inspect the related Prisma models and existing services.

## Working style for this repo

- Prefer surgical edits in the existing module pattern instead of introducing new framework layers.
- Keep the route naming and path conventions consistent with the surrounding modules.
- If you change Prisma models or enums, also review the relevant schema files and the generated client impact.
- For database-heavy work, prefer transactional patterns that match the existing service-layer approach used across the modules.
