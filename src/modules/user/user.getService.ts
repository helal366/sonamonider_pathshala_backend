import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";

// ============================================================
// GET ALL USERS SERVICE LAYER
// ============================================================
const getAllUsers = async () => {
  const allUsers = await prisma.user.findMany({
    omit: { user_password: true },
    include: {
      current_position: {
        select: { position_name: true },
      },
      current_role: {
        select: { role_name: true },
      },
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
      current_role: {
        select: { role_name: true },
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
    omit: { user_password: true },
    include: {
      current_position: {
        select: { position_name: true },
      },
      current_role: {
        select: { role_name: true },
      },
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
    omit: { user_password: true },
    include: {
      current_position: {
        select: { position_name: true },
      },
      current_role: {
        select: { role_name: true },
      },
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
    omit: {
      user_password: true,
    },
    include: {
      management_staff_profile: true,
      academic_staff_profile: true,
      student_profile: true,
      governing_body_profile: true,
      current_role: {
        select: { role_name: true },
      },
      current_position: {
        select: { position_name: true },
      },
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
