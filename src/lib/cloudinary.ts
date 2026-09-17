import {v2 as Cloudinary} from "cloudinary";
import { envVars } from "../config";

Cloudinary.config({
  CLOUDINARY_CLOUD_NAME: envVars.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
  // secure: true, 
});
export const cloudinary =Cloudinary