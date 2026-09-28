// ============================================================
// ADDRESS OWNER TYPE

import { Religion } from "#db-client";
import z4 from "zod/v4";

// ============================================================
export enum AddressOwnerType {
  USER = "USER",
  SPOUSE_INFORMATION = "SPOUSE_INFORMATION",
}

// ============================================================
// ADDRESS TYPE
// ============================================================
export enum AddressType {
  PRESENT = "PRESENT",
  PERMANENT = "PERMANENT",
}

// ============================================================
// UPDATE SINGLE ADDRESS FIELD TYPE
// ============================================================
export const ADDRESS_UPDATE_FIELDS = [
  "house_no", "house_name", "plot_no", "road_no", 
  "neighbourhood", "region", "village", "post_code", 
  "post_office", "thana", "district", "country"
] as const;

export type AddressUpdateField = typeof ADDRESS_UPDATE_FIELDS[number];

// ============================================================
// DELETE SINGLE ADDRESS FIELD TYOE
// ============================================================
export type AddressDeleteField =
  | "house_no"
  | "house_name"
  | "plot_no"
  | "road_no"
  | "neighbourhood"
  | "region"
  | "village"
  | "post_code"
  | "post_office";

// ============================================================
// SINGLE ADDRESS FIELD VALUE TYPE
// ============================================================  
export type AddressUpdateValue = string | Religion | null;