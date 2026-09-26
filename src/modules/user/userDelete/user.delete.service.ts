

// ============================================================
// DELETE BLOOD GROUP
// ============================================================

import { AppError } from "../../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../../lib/prisma";

export const deleteUserBloodGroupService = async (
  userId: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        blood_group: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: {
        id: userId,
      },
      data: {
        blood_group: null,
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
          blood_group: user.blood_group,
        },
        new_value: {
          blood_group: null,
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
// DELETE DATE OF BIRTH
// ============================================================

export const deleteUserDateOfBirthService = async (
  userId: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        date_of_birth: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: {
        id: userId,
      },
      data: {
        date_of_birth: null,
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
          date_of_birth: user.date_of_birth,
        },
        new_value: {
          date_of_birth: null,
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
// DELETE HEIGHT
// ============================================================

export const deleteUserHeightService = async (
  userId: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        height_in_cm: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: {
        id: userId,
      },
      data: {
        height_in_cm: null,
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
          height_in_cm: user.height_in_cm,
        },
        new_value: {
          height_in_cm: null,
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
// DELETE WEIGHT
// ============================================================

export const deleteUserWeightService = async (
  userId: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        weight_in_kg: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: {
        id: userId,
      },
      data: {
        weight_in_kg: null,
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
          weight_in_kg: user.weight_in_kg,
        },
        new_value: {
          weight_in_kg: null,
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
// DELETE RELIGION
// ============================================================

export const deleteUserReligionService = async (
  userId: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        religion: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: {
        id: userId,
      },
      data: {
        religion: null,
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
          religion: user.religion,
        },
        new_value: {
          religion: null,
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
// DELETE BIRTH CERTIFICATE NUMBER
// ============================================================

export const deleteUserBirthCertificateNumberService = async (
  userId: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        birth_certificate_number: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: {
        id: userId,
      },
      data: {
        birth_certificate_number: null,
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
          birth_certificate_number: user.birth_certificate_number,
        },
        new_value: {
          birth_certificate_number: null,
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
// DELETE NID NUMBER
// ============================================================

export const deleteUserNidNumberService = async (
  userId: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        nid_number: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: {
        id: userId,
      },
      data: {
        nid_number: null,
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
          nid_number: user.nid_number,
        },
        new_value: {
          nid_number: null,
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
// DELETE PHOTO URL
// ============================================================

export const deleteUserPhotoUrlService = async (
  userId: string,
  loggedInUser: { user_id: string },
) => {
  return await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        photo_url: true,
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    const updatedUser = await transaction.user.update({
      where: {
        id: userId,
      },
      data: {
        photo_url: null,
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
          photo_url: user.photo_url,
        },
        new_value: {
          photo_url: null,
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

