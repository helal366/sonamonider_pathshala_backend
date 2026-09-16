# Installation

- create .gitignore file and write
```
node_modules/

.env
.env.*
!.env.example

dist/

src/generated/

*.log
logs/

.DS_Store
Thumbs.db

.vscode/
.idea/

*.tmp
*.temp

.vercel/

*.tsbuildinfo
/generated/prisma

/prisma/src/generated/prisma
.vercel
```

- create .vercelignore files in the root directory
```
cat > .vercelignore <<'EOF'
node_modules/
dist/
.git/
!.env
.env.*
*.log
EOF
```
- create vercel.json file in the root directory. write the following code. you will find the vercel deployment details later.

```
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.ts"
    }
  ]
}
```

- command

```
pnpm init   --> will create package.json
pnpm add -D tsx  --> will create node_modules, pnpm-lock.yaml, pnpm-workspace.yaml files
pnpm approve-builds
pnpm add -D typescript
pnpm add -D @types/node
pnpm exec tsc --init  --> will create tsconfig.json file

pnpm add express bcryptjs cors cookie-parser http-status-codes jsonwebtoken ms dotenv
pnpm add -D shx @types/express @types/cors @types/cookie-parser @types/http-status-codes @types/jsonwebtoken @types/ms
```

- handle prisma
```
pnpm add pg -D @types/pg 
pnpm add -D prisma@7.10.0
pnpm approve-builds
pnpm add @prisma/client@7.10.0
pnpm add @prisma/adapter-pg@7.10.0
 
pnpm add @neondatabase/serverless
pnpm add @prisma/adapter-neon@7.10.0
pnpm add ws -D @types/ws
pnpm prisma init --output ./src/generated/prisma

```

#### package.json add:
```
  "type":"module",
```
* package.json scripts part:
```
"scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "shx rm -rf dist && pnpm prisma generate && tsup",
    "postinstall": "prisma generate",
    "vercel-build": "prisma generate && prisma migrate deploy && tsup",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
```
* before scripts into package.json:
```
"imports": {
    "#db-client": {
      "types": "./src/generated/prisma/client.ts",
      "default": "./dist/src/generated/prisma/client.js",
      "development": "./src/generated/prisma/client.ts"
    }
}
```

#### tsconfig.json
- replace tsconfig.json with the following code:
```
{
  "compilerOptions": {
    "rootDir": "./",        // Change from "./src" to "./" to support root config files
    "outDir": "./dist",
   "module": "ESNext",
    "moduleResolution": "bundler",
    "target": "ES2023",
    "types": ["node", "express", "cookie-parser", "cors", "jsonwebtoken"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "strict": true,
    "esModuleInterop": true,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true,
    "customConditions": ["development"],
  },
  "include": ["src/**/*",  "src/generated/prisma/**/*", "prisma.config.ts"], // Include prisma.config.ts here
  "exclude": ["node_modules", "prisma/generated"] // Remove prisma.config.ts from here
}
```


- create src and dist folder at the root directory

#### config folder and index.ts file:
- config/index.ts setup: create a config folder into src folder and a index.ts file into config folder.

```
import dotenv from "dotenv";
dotenv.config();
interface EnvVariables{
    PORT: string,
    DATABASE_URL: string,
    NODE_ENV: "development" | "production",
    JWT_ACCESS_SECRET:string,
    JWT_ACCESS_EXPIRES:string,
    JWT_REFRESH_SECRET:string,
    JWT_REFRESH_EXPIRES:string,
    BCRYPT_SALT_ROUND:string,
    APP_LOCAL_URL:string,
}
const loadEnvVariables=():EnvVariables=> {
    const envVars:string[] = ["PORT", "DATABASE_URL", "NODE_ENV", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRES", "BCRYPT_SALT_ROUND",  "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRES", "APP_LOCAL_URL"];
    envVars.forEach(element=>{
        if(!process.env[element]){
            throw new Error(`Required environmental variable missing: ${element}`)
        }
    })
    return {
    PORT : process.env.PORT as string,
    DATABASE_URL : process.env.DATABASE_URL as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES:process.env.JWT_REFRESH_EXPIRES as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    APP_LOCAL_URL: process.env.APP_LOCAL_URL as string,
}
}
export const envVars = loadEnvVariables();
```

#### generate prisma
```
 pnpm postinstall
```

#### prisma.ts, db connection:

* create a folder named "lib" into src. then create a file named prisma.ts
* into the prisma.ts file add the following code:

```
import "dotenv/config";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "#db-client"; // Automatically maps to client.ts / client.js

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.NEON_DB_POOLED_LINK });
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
```

- create your own database add DATABASE_URL at .env

* prisma.config.ts: create a folder named schema into prisma folder
```
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["NEON_DB_LINK_DIRECT"], // Add this line here
  },
});

```
#### express setup
* app.ts : into src, create an app.ts file.
```
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";

const app:Application = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
app.get("/", (req:Request,res:Response)=>{
    res.send("This is prisma press backend server. Please use the API endpoints to interact with the server.")
})
export default app;
```

#### server.ts

```
import app from "./app.js";
import { envVars } from "./config/index.js";
import { prisma } from "./lib/prisma.js";

async function connectDB() {
  try {
    await prisma.$connect();
    console.log("Connected to the database successfully.");
  } catch (error) {
    console.error("Error starting server:", error);
  }
}
connectDB();

if (envVars.NODE_ENV !== "production") {
  const PORT = envVars.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (err) => {
    console.error("Server failed to start:", err);
  });
}

export default app;
```

### deployment in vercel




- go to terminal and run the following command:

```
pnpm build
```

- globally install vercel: (alrready done, do not need for next projects)

```
pnpm add -g vercel
pnpm approve-builds -g
```

- then login to vercel:

```
vercel login
```

- then start to deploy in vercel. write the following command in vercel

```
vercel
```

step by step answer the appeared questions

- add the following code at package.json into scripts

```
 "deploy": "pnpm build && vercel --prod"
```

- now go to vercel and add the env variables.


#### pnpm-workspace.yaml
* go to pnpm-workspace.yaml file and replace everything with the following code:

```
packages:
  - .

allowBuilds:
  '@prisma/engines': true
  esbuild: true
  prisma: true
```


### vercel rebind
```
vercel login
vercel link
vercel env pull .env.production.local

export ENABLE_EXPERIMENTAL_COREPACK=1
vercel --prod --force

```

#### SSLCOMMERZ
* Payment gateway
* View Docs
* Create SandBox
* Store the given informations ent to your email
* Go to Merchant url
* Login

* Initiate Payment
* install sslcommerz
```
pnpm add sslcommerz-lts
pnpm add --save-dev @types/sslcommerz-lts
```


### stripe payment

- Stripe payment

* Sign up/Login first
* Go to Stripe docs from Developer tab
* Get started with Stripe
* Sell subscription as SaaS start-up
* Create a test product and price
* Click on the option: Create a test product in the dashboard

-> Another way:

- Go to Dashboard
- Product Catalog
- Create product

---

Now create product

- Fill up name and description
- Pricing Model : Standard pricing
- Price in BDT (should select this currency)
- According to project : Recurring or One Time (One Time for now)