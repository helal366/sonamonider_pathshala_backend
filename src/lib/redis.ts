import { createClient } from "redis";
import { envVars } from "../config/index.js";

export const redisClient = createClient({
  username: envVars.REDIS_USER_NAME,
  password: envVars.REDIS_PASSWORD,
  socket: {
    host: envVars.REDIS_HOST,
    port: Number(envVars.REDIS_PORT),
  },
});

// Handle Redis errors
redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error);
});

redisClient.on("reconnecting", () => {
  console.log("Redis reconnecting...");
});

redisClient.on("ready", () => {
  console.log("Redis is ready.");
});