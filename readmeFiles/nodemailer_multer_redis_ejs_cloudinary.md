### nodemailer, multer, redis and ejs install
* installation commands:
```
pnpm add nodemailer && pnpm add -D @types/nodemailer
pnpm add multer && pnpm add -D @types/multer
pnpm add redis
pnpm add ejs & pnpm add -D @types/ejs
pnpm add cloudinary
```

* nodemailer transporter setup
```
import nodemailer from "nodemailer"
import { envVars } from "../config"

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD
    }
})
```

* multer storage and upload setup:
```
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({storage:storage})
```

* redis client setup:
```
import { createClient } from "redis";
import { envVars } from "../config";

export const redisClient = createClient({
  username: envVars.REDIS_USER_NAME,
  password: envVars.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS_HOST,
    port: Number(envVars.REDIS_PORT),
  },
});
```

* cloudinary setup:
```
import {v2 as Cloudinary} from "cloudinary";
import { envVars } from "../config";

Cloudinary.config({
  CLOUDINARY_CLOUD_NAME: envVars.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
  // secure: true, 
});
export const cloudinary =Cloudinary
```