* pg_isready -h localhost -p 5432

* git remote set-url origin https://github.com/helal366/model_academy_backend.git

* TERMINAL COMMAND TO CREATE RANDOM TOKEN = node -e "console.log(require('crypto').randomBytes(32).toString('hex'))*

* pnpm dlx vercel env import .env
* pnpm dlx vercel env add
* pnpm dlx vercel env ls
* pnpm dlx vercel --prod
* pnpm vercel env rm DATABASE_URL
* pnpm vercel env rm DATABASE_URL_DIRECT
* pnpm vercel env add DATABASE_URL
* pnpm vercel env add DATABASE_URL_DIRECT


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

