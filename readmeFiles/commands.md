* pg_isready -h localhost -p 5432

* git remote set-url origin https://github.com/helal366/model_academy_backend.git

* TERMINAL COMMAND TO CREATE RANDOM TOKEN = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))*

* pnpm dlx vercel env import .env
* pnpm dlx vercel env add
* pnpm dlx vercel env ls
* pnpm dlx vercel env pull .env.vercel
* pnpm dlx vercel --prod
* pnpm vercel env rm DATABASE_URL
* pnpm vercel env rm DATABASE_URL_DIRECT
* pnpm vercel env rm SUPER_ADMIN_EMAIL
* pnpm vercel env add DATABASE_URL
* pnpm vercel env add DATABASE_URL_DIRECT
* pnpm vercel env add SUPER_ADMIN_EMAIL


* 
* pnpm store prune
* pnpm config set fetch-timeout 60000

* redis-cli ping


1. Remove the .env file from the Git index (stops tracking it)
- The --cached flag ensures it stays on your computer and ONLY gets removed from Git.
* git rm --cached .env

2. Commit the change
* git commit -m "chore: remove .env from git tracking and keep it local"

3. Push to your repository (e.g., GitHub, GitLab)
* git push origin main

## DROP FULL DATABASE TABLES AND SCHEMAS AND THE VSCODE COMMANDS:
* Commands
```
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
```
* After dropping the tables , the next vscodes:
```
rm -rf prisma/migrations
pnpm exec prisma migrate dev --name init
pnpm exec prisma generate
pnpm build
pnpm seed
pnpm seedBookList
```

## Total time check for transaction:
```
console.time("Total Transaction Time");

await prisma.$transaction(async (tx) => {
  console.time("Step 1: First Query");
  const step1 = await tx.model.findMany({...}); // Adjust to your model
  console.timeEnd("Step 1: First Query");

  console.time("Step 2: Second Query");
  const step2 = await tx.model.update({...}); // Adjust to your model
  console.timeEnd("Step 2: Second Query");
});

console.timeEnd("Total Transaction Time");
```
## For Avro bangla
```
pkill code
ibus engine                // ibus-avro
echo $GTK_IM_MODULE
echo $QT_IM_MODULE
echo $XMODIFIERS
/usr/bin/code                     //VS Code Snap
/usr/share/code/bin/code          //VS Code .deb
```
## SSLCommerz test credit card numbers are :
* Test Credit Card Account Numbers
* VISA
- Card Number: 4111111111111111
- Exp: 12/25
- CVV: 111

* Mastercard
- Card Number: 5111111111111111
- Exp: 12/25
- CVV: 111

* American Express
- Card Number: 371111111111111
- Exp: 12/25
- CVV: 111

* Mobile OTP
- 111111 or 123456

## SSLCommerz product profile
* product_profile
- general
- physical-goods
- non-physical-goods
- airline-tickets
- travel-vertical
- telecom-vertical

## PROMPT
* Prompt 1 — Understand the project
- Explain the complete architecture of this backend.
- Do not modify any files.

* Prompt 2 — Code review
- Review my existing backend code for potential bugs, security issues, and incorrect business logic.

- Do not modify any files.
- Only report findings with file paths.

## Prompt 3 — Implement a feature
- Study the existing module patterns and PROJECT_CONTEXT.md.
- Implement the requested feature following all existing project conventions. Avoid modifying unrelated files.

## Copilot CLI instructions
Update the existing `.github/copilot-instructions.md` file.

Do not replace or remove the existing instructions. Preserve all existing project architecture, business rules, commands, and conventions.

Add a new section titled `## Mandatory coding conventions` with the following rules:

1. **TypeScript imports:** Always use `.js` extensions for relative local imports, even when importing `.ts` files.
2. **Zod:** Use Zod v4 with `import z4 from "zod/v4"`. Follow the existing Zod v4 validation patterns.
3. **API responses:** Use the existing `sendResponse` utility for successful API responses.
4. **Asynchronous operations:** Use `catchAsync` for asynchronous controller and route-handler operations, following existing patterns.
5. **Error handling:** Use `AppError` and `http-status-codes` for application errors. Do not introduce inconsistent error-handling patterns.
6. **Prisma:** Import and use the canonical Prisma client through the `#db-client` alias or the existing `src/lib/prisma.ts` setup. Follow existing transaction patterns.
7. **Audit logging:** Preserve and implement audit logging wherever required by existing business logic. Use the authenticated user's ID as the audit actor where applicable.
8. **Updates:** Prefer focused single-field update operations when the API requirement calls for updating one field. Follow existing validation, authorization, duplicate checking, and audit logging patterns.
9. **Authentication and authorization:** Never bypass `userAuth` or role-based access control. Follow the existing role hierarchy and route conventions.
10. **Project context:** Before modifying academic, financial, fee/payment, staff-management, or class-scheduling logic, read the relevant sections of `PROJECT_CONTEXT.md` and inspect the related Prisma models and existing services.

Additional requirements:
- Follow the existing codebase instead of inventing new architectural patterns.
- Do not introduce new dependencies without asking first.
- Do not modify unrelated files.
- If an existing convention conflicts with these instructions, explain the conflict before making changes.

After updating the file, show me the complete updated contents and summarize what you added.

### Start Copilot
- cd ~/projects/level_two_batch_seven/assignments/assignment_6/sonamonider_pathshala_backend
- copilot

### Review code
- Review this module for bugs and security issues.
- Do not modify files.

### Implement features
- Study the existing patterns and project instructions.
- Implement this feature without modifying unrelated files.

### Validate
- pnpm run typecheck
- pnpm build

### 1. Verify your configuration
- Read .github/copilot-instructions.md and PROJECT_CONTEXT.md.

- Summarize the coding conventions and business rules
- you must follow when modifying this backend.

- Do not modify any files.

### 2. Perform your first backend code review
Act as a senior TypeScript backend engineer.

Review my Sonamonider Pathshala backend project.

First, read:
- .github/copilot-instructions.md
- PROJECT_CONTEXT.md

Then inspect the project and identify:

1. Potential TypeScript errors.
2. Prisma query and transaction problems.
3. Incorrect Zod validation.
4. Authentication and authorization vulnerabilities.
5. API response and error-handling inconsistencies.
6. Possible database integrity issues.
7. Performance problems.

Important:
- Do not modify any files.
- Do not invent business rules.
- Follow the existing project architecture.
- Report only actual findings supported by code.

Organize findings by severity: Critical, High, Medium, Low.
Include file paths and explanations for each finding.

### 3. Understand Copilot's working modes
Here are some useful commands:
Command	Purpose
/help	Show available commands
/model	Change AI model
/ide	Manage VS Code connection
/init	Generate/update repository instructions
/exit	Exit Copilot CLI