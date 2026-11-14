import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";

// ============================================================
// GET ALL USERS SERVICE LAYER
// ============================================================
const getAllUsers = async () => {
  const allUsers = await prisma.user.findMany({
    select:{
      full_name: true,
      gender: true,
      blood_group: true,
      date_of_birth: true,
      height_in_cm: true,
      weight_in_kg: true,
      religion: true,
      nationality: true,
      birth_certificate_number: true,
      nid_number: true,
      photo_url: true,
      mobile_number: true,
      is_mobile_verified: true,
      email: true,
      is_email_verified: true,
      user_name: true,
      active_status: true,
      is_deleted: true,
      current_role: true,
      joining_date: true,
      current_position: {
        select: {position_name: true}
      },
      father_details: true,
      mother_details: true,
      spouse_information: true,
      present_address: true,
      permanent_address: true
    },
  });

  if (allUsers.length === 0) {
    throw new AppError(`No users found.`, StatusCodes.NOT_FOUND);
  }
  return allUsers;
};
// ============================================================
// GET ACTIVE USERS SERVICE LAYER
// ============================================================
const getActiveUsers = async () => {
  const activeUsers = await prisma.user.findMany({
    where: {
      active_status: "ACTIVE",
      is_deleted: false,
    },
    omit: { user_password: true },
    include: {
      current_position: {
        select: { position_name: true },
      },
      
    },
  });
  if (activeUsers.length === 0) {
    throw new AppError(`No active users found.`, StatusCodes.NOT_FOUND);
  }
  return activeUsers;
};


// ============================================================
// GET INACTIVE USERS SERVICE LAYER
// ============================================================
const getInactiveUsers=async()=>{
    const inactiveUsers = await prisma.user.findMany({
    where: {
      active_status: "INACTIVE",
      is_deleted: false,
    },
    select:{
      full_name: true,
      gender: true,
      blood_group: true,
      date_of_birth: true,
      height_in_cm: true,
      weight_in_kg: true,
      religion: true,
      nationality: true,
      birth_certificate_number: true,
      nid_number: true,
      photo_url: true,
      mobile_number: true,
      is_mobile_verified: true,
      email: true,
      is_email_verified: true,
      user_name: true,
      active_status: true,
      is_deleted: true,
      current_role: true,
      joining_date: true,
      current_position: {
        select: {position_name: true}
      },
      father_details: true,
      mother_details: true,
      spouse_information: true,
      present_address: true,
      permanent_address: true
    },
  });
  if (inactiveUsers.length === 0) {
    throw new AppError(`No inactive users found.`, StatusCodes.NOT_FOUND);
  }
  return inactiveUsers;
};


// ============================================================
// GET SOFT DELETED USERS SERVICE LAYER
// ============================================================
const getSoftDeletedUsers=async()=>{
    const softDeletedUsers = await prisma.user.findMany({
    where: {
      is_deleted: true,
    },
    select:{
      full_name: true,
      gender: true,
      blood_group: true,
      date_of_birth: true,
      height_in_cm: true,
      weight_in_kg: true,
      religion: true,
      nationality: true,
      birth_certificate_number: true,
      nid_number: true,
      photo_url: true,
      mobile_number: true,
      is_mobile_verified: true,
      email: true,
      is_email_verified: true,
      user_name: true,
      active_status: true,
      is_deleted: true,
      current_role: true,
      joining_date: true,
      current_position: {
        select: {position_name: true}
      },
      father_details: true,
      mother_details: true,
      spouse_information: true,
      present_address: true,
      permanent_address: true
    },
  });
  if (softDeletedUsers.length === 0) {
    throw new AppError(`No deleted users found.`, StatusCodes.NOT_FOUND);
  }
  return softDeletedUsers;
}
// ============================================================
// GET SINGLE USER SERVICE LAYER
// ============================================================
const getSingleUser = async (id: string) => {
  const singleUser = await prisma.user.findUnique({
    where: { id },

    select:{
      full_name: true,
      gender: true,
      blood_group: true,
      date_of_birth: true,
      height_in_cm: true,
      weight_in_kg: true,
      religion: true,
      nationality: true,
      birth_certificate_number: true,
      nid_number: true,
      photo_url: true,
      mobile_number: true,
      is_mobile_verified: true,
      email: true,
      is_email_verified: true,
      user_name: true,
      active_status: true,
      is_deleted: true,
      current_role: true,
      joining_date: true,
      current_position: {
        select: {position_name: true}
      },
      father_details: true,
      mother_details: true,
      spouse_information: true,
      present_address: true,
      permanent_address: true
    },
  });

  if (!singleUser) {
    throw new AppError("User not found.", StatusCodes.NOT_FOUND);
  }

  return singleUser;
};

export const userGetServices = {
  getAllUsers,
  getActiveUsers,
  getInactiveUsers,
  getSoftDeletedUsers,
  getSingleUser,
};
