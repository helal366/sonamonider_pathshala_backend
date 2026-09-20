import app from "./app.js";
import { envVars } from "./config/index.js";
import { prisma } from "./lib/prisma.js";
import "dotenv/config";
import { redisClient } from "./lib/redis.js";
import { transporter } from "./lib/nodemailer.js";

async function connectDB() {
  try {
    
    await prisma.$connect();
    console.log("Connected to the database successfully.");
    
    await redisClient.connect();
    console.log("Redis connected successfully.");

    await transporter.verify();
    console.log("Nodemailer connected successfully.");

    await prisma.$queryRaw`SELECT NOW()`;
    console.log("Database query successful.");
  } catch (error) {
    console.error("Error starting server:", error);
  }
}
connectDB();

if (!process.env.VERCEL && envVars.NODE_ENV !== "production") {
  const PORT = envVars.PORT || 5000;
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on("error", (err) => {
    console.error("Server failed to start:", err);
  });
}

export default app;
