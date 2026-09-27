import { ActiveStatus, BloodGroup, Gender, Religion } from "#db-client"

export type UserPatchField =
    | "full_name"
    | "gender"
    | "blood_group"
    | "date_of_birth"
    | "height_in_cm"
    | "weight_in_kg"
    | "religion"
    | "nationality"
    | "birth_certificate_number"
    | "nid_number"
    | "photo_url"
    | "mobile_number"
    | "is_mobile_verified"
    | "email"
    | "is_email_verified"
    | "active_status"
    | "is_deleted"


export type UserPatchValue =
  | string
  | number
  | Date
  | ActiveStatus
  | Gender
  | BloodGroup
  | Religion
  | boolean
  | null;

