import { BloodGroup, Religion } from "#db-client";

export type UserDeleteField =
  | "blood_group"
  | "date_of_birth"
  | "height_in_cm"
  | "weight_in_kg"
  | "religion"
  | "birth_certificate_number"
  | "nid_number"
  | "photo_url";

export type UserDeleteValue =
  | BloodGroup
  | Date
  | number
  | Religion
  | string
  | null;
