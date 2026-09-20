import dotenv from "dotenv";
dotenv.config();

interface IEnvVariables {
  DATABASE_URL: string;
  DATABASE_URL_DIRECT: string;
  PORT: string;
  NODE_ENV: "development" | "production";
  JWT_ACCESS_SECRET: string;
  JWT_ACCESS_EXPIRES_IN: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES_IN: string;
  BCRYPT_SALT_ROUND: string;
  APP_LOCAL_URL: string;
  COMMON_PASSWORD: string;
  SMTP_USERNAME: string;
  EMAIL_SENDER: string;
  EMAIL_SENDER_NAME: string;
  SMTP_PASSWORD: string;
  REDIS_USER_NAME: string;
  REDIS_PASSWORD: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_MOBILE_NO:string;
  SUPER_ADMIN_EMAIL:string;
  SUPER_ADMIN_NAME: string
}
const loadEnvVariables = (): IEnvVariables => {
  const envVars: string[] = [
    "DATABASE_URL",
    "DATABASE_URL_DIRECT",
    "PORT",
    "NODE_ENV",
    "JWT_ACCESS_SECRET",
    "JWT_ACCESS_EXPIRES_IN",
    "BCRYPT_SALT_ROUND",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES_IN",
    "APP_LOCAL_URL",
    "COMMON_PASSWORD",
    "SMTP_USERNAME",
    "EMAIL_SENDER",
    "EMAIL_SENDER_NAME",
    "SMTP_PASSWORD",
    "REDIS_USER_NAME",
    "REDIS_PASSWORD",
    "REDIS_HOST",
    "REDIS_PORT",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SUPER_ADMIN_PASSWORD",
    "SUPER_ADMIN_MOBILE_NO",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_NAME"
  ];
  for (const varName of envVars) {
    if (!process.env[varName]) {
      throw new Error(`Required env variable missing: ${varName}`);
    }
  }
  return {
    DATABASE_URL: process.env.DATABASE_URL as string,
    DATABASE_URL_DIRECT: process.env.DATABASE_URL_DIRECT as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    APP_LOCAL_URL: process.env.APP_LOCAL_URL as string,
    COMMON_PASSWORD: process.env.COMMON_PASSWORD as string,
    SMTP_USERNAME: process.env.SMTP_USERNAME as string,
    EMAIL_SENDER: process.env.EMAIL_SENDER as string,
    EMAIL_SENDER_NAME: process.env.EMAIL_SENDER_NAME as string,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD as string,
    REDIS_USER_NAME: process.env.REDIS_USER_NAME as string,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    REDIS_HOST: process.env.REDIS_HOST as string,
    REDIS_PORT: process.env.REDIS_PORT as string,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    SUPER_ADMIN_MOBILE_NO:process.env.SUPER_ADMIN_MOBILE_NO as string,
    SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME as string
  };
};
export const envVars = loadEnvVariables();
