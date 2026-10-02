import { ActiveStatus, BloodGroup, Gender, Religion } from "#db-client";
import { prisma } from "../../lib/prisma";

// ==========================================
// CREATE USER
// ==========================================
export interface IExistencePayload {
  role_name: string;
  full_name: string;
  mobile_number: string;
}
export interface IUserCount {
  role_name: string;
  mobile_number: string;
}

export interface IDynamicProfilePayload {
  cleanRole: string;
  full_name: string;
  mobile_number: string;
  email: string;
  positionId: string;
  roleId: string;
  loggedInUserId: string;
  active_class_id?: string;
}

export const VALID_USER_ROLES = [
  "MANAGEMENT",
  "ACADEMIC",
  "STUDENT",
  "GOVERNING_BODY"
] as const;

export type TCleanRole = typeof VALID_USER_ROLES[number];

export interface ICreatedUserWithProfiles{
  management_staff_profile?: {id:string} | null;
  academic_staff_profile?: {id:string} | null;
  student_profile?: {id:string} | null;
  governing_body_profile: {id:string} | null;
}

export interface IFindSubProfilePayload{
  cleanRole: TCleanRole,
  createdUser: ICreatedUserWithProfiles,
  targetEntityName: string
}

export interface IBuildInitialAuditRecordsPayload {
  userId: string;
  subProfileId: string;
  targetEntityName: string;
  full_name: string;
  mobile_number: string;
  email: string | null; // Allow null if optional in your system
  cleanRole: string;
  cleanPosition: string;
  roleId: string;
  positionId: string;
  loggedInUserId: string;
}
// ==========================================
// UPDATE SINGLE USER FIELD ADMIN 
// ==========================================

// Use Object.values() combined with 'as const' typing to create strict tuple arrays
export const GENDER_ENUM = Object.values(Gender) as [Gender, ...Gender[]];
export const BLOOD_GROUP_ENUM = Object.values(BloodGroup) as [
  BloodGroup,
  ...BloodGroup[],
];
export const RELIGION_ENUM = Object.values(Religion) as [
  Religion,
  ...Religion[],
];


// Keep your base structural groupings clean
export const STRING_FIELDS = [
  "full_name",
  "nationality",
  "birth_certificate_number",
  "nid_number",
  "photo_url",
  "mobile_number",
  "email",
] as const;

export const FLOAT_FIELDS = ["height_in_cm", "weight_in_kg"] as const;
export const DATE_FIELDS = ["date_of_birth"] as const;

// Combined list of standard admin fields for easy validation referencing elsewhere
export const UPDATE_SINGLE_USER_FIELD_ADMIN = [
  ...STRING_FIELDS,
  ...FLOAT_FIELDS,
  ...DATE_FIELDS,
  "gender",
  "blood_group",
  "religion",
] as const;

// =================================================
// UPDATE SINGLE USER FIELD SUPER ADMIN ZOD SCHEMA
// =================================================
export const ACTIVE_STATUS_ENUM = Object.values(ActiveStatus) as [
  ActiveStatus,
  ...ActiveStatus[],
];
export const UPDATE_SINGLE_USER_FIELD_SUPER_ADMIN = [
  "is_mobile_verified",
  "is_email_verified",
  "active_status",
  "is_deleted",
] as const;

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
