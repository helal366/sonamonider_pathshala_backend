


// ============================================================
// UPDATE FULL NAME
// ============================================================

import { Prisma } from "#db-client";
import { AppError } from "../../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../../lib/prisma";

export const updateUserFullNameService = async (
  userId: string,
  fullName: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        full_name: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        full_name: fullName,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          full_name: oldUser.full_name,
        },
        new_value: {
          full_name: updatedUser.full_name,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE GENDER
// ============================================================

export const updateUserGenderService = async (
  userId: string,
  gender: Prisma.UserUpdateInput["gender"],
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        gender: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        gender,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          gender: oldUser.gender,
        },
        new_value: {
          gender: updatedUser.gender,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE BLOOD GROUP
// ============================================================

export const updateUserBloodGroupService = async (
  userId: string,
  bloodGroup: Prisma.UserUpdateInput["blood_group"],
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        blood_group: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        blood_group: bloodGroup,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          blood_group: oldUser.blood_group,
        },
        new_value: {
          blood_group: updatedUser.blood_group,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE DATE OF BIRTH
// ============================================================

export const updateUserDateOfBirthService = async (
  userId: string,
  dateOfBirth: Date,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        date_of_birth: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        date_of_birth: dateOfBirth,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          date_of_birth: oldUser.date_of_birth,
        },
        new_value: {
          date_of_birth: updatedUser.date_of_birth,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE HEIGHT
// ============================================================

export const updateUserHeightService = async (
  userId: string,
  heightInCm: number,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        height_in_cm: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        height_in_cm: heightInCm,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          height_in_cm: oldUser.height_in_cm,
        },
        new_value: {
          height_in_cm: updatedUser.height_in_cm,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE WEIGHT
// ============================================================

export const updateUserWeightService = async (
  userId: string,
  weightInKg: number,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        weight_in_kg: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        weight_in_kg: weightInKg,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          weight_in_kg: oldUser.weight_in_kg,
        },
        new_value: {
          weight_in_kg: updatedUser.weight_in_kg,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE RELIGION
// ============================================================

export const updateUserReligionService = async (
  userId: string,
  religion: Prisma.UserUpdateInput["religion"],
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        religion: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        religion,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          religion: oldUser.religion,
        },
        new_value: {
          religion: updatedUser.religion,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE NATIONALITY
// ============================================================

export const updateUserNationalityService = async (
  userId: string,
  nationality: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nationality: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        nationality,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          nationality: oldUser.nationality,
        },
        new_value: {
          nationality: updatedUser.nationality,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE BIRTH CERTIFICATE NUMBER
// ============================================================

export const updateUserBirthCertificateNumberService = async (
  userId: string,
  birthCertificateNumber: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        birth_certificate_number: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        birth_certificate_number: birthCertificateNumber,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          birth_certificate_number: oldUser.birth_certificate_number,
        },
        new_value: {
          birth_certificate_number: updatedUser.birth_certificate_number,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE NID NUMBER
// ============================================================

export const updateUserNidNumberService = async (
  userId: string,
  nidNumber: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nid_number: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        nid_number: nidNumber,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          nid_number: oldUser.nid_number,
        },
        new_value: {
          nid_number: updatedUser.nid_number,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};


// ============================================================
// UPDATE PHOTO URL
// ============================================================

export const updateUserPhotoUrlService = async (
  userId: string,
  photoUrl: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const oldUser = await transaction.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        photo_url: true,
      },
    });

    if (!oldUser) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: { id: userId },
      data: {
        photo_url: photoUrl,
        updated_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    await transaction.auditLog.create({
      data: {
        entity_id: userId,
        entity_name: "User",
        action: "UPDATE",
        old_value: {
          photo_url: oldUser.photo_url,
        },
        new_value: {
          photo_url: updatedUser.photo_url,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedUser;
  });
};
