import { Prisma } from "#db-client";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";

import { AddressOwnerType, AddressType } from "./address.interface";

// ============================================================
// ADDRESS FIELD TYPES
// ============================================================

type AddressUpdateField =
  | "house_no"
  | "house_name"
  | "plot_no"
  | "road_no"
  | "neighbourhood"
  | "region"
  | "village"
  | "post_code"
  | "post_office"
  | "thana"
  | "district"
  | "country";

type AddressDeleteField =
  | "house_no"
  | "house_name"
  | "plot_no"
  | "road_no"
  | "neighbourhood"
  | "region"
  | "village"
  | "post_code"
  | "post_office";

type AddressUpdateValue = string | null;

// ============================================================
// CREATE ADDRESS
// ============================================================

export const createAddress = async (
  requiredId: string,
  addressData: Record<string, unknown>,
  ownerType: AddressOwnerType,
  addressType: AddressType,
  loggedInUser: {
    user_id: string;
  },
) => {
  return prisma.$transaction(async (transaction) => {
    // ========================================================
    // USER ADDRESS
    // ========================================================

    if (ownerType === AddressOwnerType.USER) {
      const user = await transaction.user.findUnique({
        where: {
          id: requiredId,
        },
        select: {
          id: true,
          present_address: {
            select: {
              id: true,
            },
          },
          permanent_address: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError("User not found.", 404);
      }

      // ------------------------------------------------------
      // PRESENT ADDRESS
      // ------------------------------------------------------

      if (addressType === AddressType.PRESENT) {
        if (user.present_address) {
          throw new AppError("User present address already exists.", 409);
        }

        const address = await transaction.presentAddress.create({
          data: {
            house_no: addressData.house_no as string | undefined,
            house_name: addressData.house_name as string | undefined,
            plot_no: addressData.plot_no as string | undefined,
            road_no: addressData.road_no as string | undefined,
            neighbourhood: addressData.neighbourhood as string | undefined,
            region: addressData.region as string | undefined,
            village: addressData.village as string | undefined,
            post_code: addressData.post_code as string | undefined,
            post_office: addressData.post_office as string | undefined,
            thana: addressData.thana as string,
            district: addressData.district as string,
            country:
              (addressData.country as string | undefined) ?? "Bangladesh",
            user: {
              connect: {
                id: requiredId,
              },
            },
            created_by: {
              connect: {
                id: loggedInUser.user_id,
              },
            },
          },
        });

        await transaction.auditLog.create({
          data: {
            entity_id: address.id,
            entity_name: "PresentAddress",
            action: "CREATE",
            old_value: Prisma.JsonNull,
            new_value: address as unknown as Prisma.InputJsonValue,
            changed_by: {
              connect: {
                id: loggedInUser.user_id,
              },
            },
          },
        });

        return address;
      }

      // ------------------------------------------------------
      // PERMANENT ADDRESS
      // ------------------------------------------------------

      if (addressType === AddressType.PERMANENT) {
        if (user.permanent_address) {
          throw new AppError("User permanent address already exists.", 409);
        }

        const address = await transaction.permanentAddress.create({
          data: {
            house_no: addressData.house_no as string | undefined,
            house_name: addressData.house_name as string | undefined,
            plot_no: addressData.plot_no as string | undefined,
            road_no: addressData.road_no as string | undefined,
            neighbourhood: addressData.neighbourhood as string | undefined,
            region: addressData.region as string | undefined,
            village: addressData.village as string | undefined,
            post_code: addressData.post_code as string | undefined,
            post_office: addressData.post_office as string | undefined,
            thana: addressData.thana as string,
            district: addressData.district as string,
            country:
              (addressData.country as string | undefined) ?? "Bangladesh",
            user: {
              connect: {
                id: requiredId,
              },
            },
            created_by: {
              connect: {
                id: loggedInUser.user_id,
              },
            },
          },
        });

        await transaction.auditLog.create({
          data: {
            entity_id: address.id,
            entity_name: "PermanentAddress",
            action: "CREATE",
            old_value: Prisma.JsonNull,
            new_value: address as unknown as Prisma.InputJsonValue,
            changed_by: {
              connect: {
                id: loggedInUser.user_id,
              },
            },
          },
        });

        return address;
      }
    }

    // ========================================================
    // SPOUSE INFORMATION ADDRESS
    // ========================================================

    if (ownerType === AddressOwnerType.SPOUSE_INFORMATION) {
      const spouseInformation = await transaction.spouseInformation.findUnique({
        where: {
          id: requiredId,
        },
        select: {
          id: true,
          present_address: {
            select: {
              id: true,
            },
          },
          permanent_address: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!spouseInformation) {
        throw new AppError("Spouse information not found.", 404);
      }

      // ------------------------------------------------------
      // PRESENT ADDRESS
      // ------------------------------------------------------

      if (addressType === AddressType.PRESENT) {
        if (spouseInformation.present_address) {
          throw new AppError("Spouse present address already exists.", 409);
        }

        const address = await transaction.presentAddress.create({
          data: {
            house_no: addressData.house_no as string | undefined,
            house_name: addressData.house_name as string | undefined,
            plot_no: addressData.plot_no as string | undefined,
            road_no: addressData.road_no as string | undefined,
            neighbourhood: addressData.neighbourhood as string | undefined,
            region: addressData.region as string | undefined,
            village: addressData.village as string | undefined,
            post_code: addressData.post_code as string | undefined,
            post_office: addressData.post_office as string | undefined,
            thana: addressData.thana as string,
            district: addressData.district as string,
            country:
              (addressData.country as string | undefined) ?? "Bangladesh",
            spouse: {
              connect: {
                id: requiredId,
              },
            },
            created_by: {
              connect: {
                id: loggedInUser.user_id,
              },
            },
          },
        });

        await transaction.auditLog.create({
          data: {
            entity_id: address.id,
            entity_name: "PresentAddress",
            action: "CREATE",
            old_value: Prisma.JsonNull,
            new_value: address as unknown as Prisma.InputJsonValue,
            changed_by: {
              connect: {
                id: loggedInUser.user_id,
              },
            },
          },
        });

        return address;
      }

      // ------------------------------------------------------
      // PERMANENT ADDRESS
      // ------------------------------------------------------

      if (addressType === AddressType.PERMANENT) {
        if (spouseInformation.permanent_address) {
          throw new AppError("Spouse permanent address already exists.", 409);
        }

        const address = await transaction.permanentAddress.create({
          data: {
            house_no: addressData.house_no as string | undefined,
            house_name: addressData.house_name as string | undefined,
            plot_no: addressData.plot_no as string | undefined,
            road_no: addressData.road_no as string | undefined,
            neighbourhood: addressData.neighbourhood as string | undefined,
            region: addressData.region as string | undefined,
            village: addressData.village as string | undefined,
            post_code: addressData.post_code as string | undefined,
            post_office: addressData.post_office as string | undefined,
            thana: addressData.thana as string,
            district: addressData.district as string,
            country:
              (addressData.country as string | undefined) ?? "Bangladesh",
            spouse: {
              connect: {
                id: requiredId,
              },
            },
            created_by: {
              connect: {
                id: loggedInUser.user_id,
              },
            },
          },
        });

        await transaction.auditLog.create({
          data: {
            entity_id: address.id,
            entity_name: "PermanentAddress",
            action: "CREATE",
            old_value: Prisma.JsonNull,
            new_value: address as unknown as Prisma.InputJsonValue,
            changed_by: {
              connect: {
                id: loggedInUser.user_id,
              },
            },
          },
        });

        return address;
      }
    }

    throw new AppError("Invalid address owner type or address type.", 400);
  });
};

// ============================================================
// DELETE COMPLETE ADDRESS
// ============================================================

export const deleteAddress = async (
  requiredId: string,
  ownerType: AddressOwnerType,
  addressType: AddressType,
  loggedInUser: {
    user_id: string;
  },
) => {
  return prisma.$transaction(async (transaction) => {
    let addressId: string | undefined;

    // ========================================================
    // FIND USER ADDRESS
    // ========================================================

    if (ownerType === AddressOwnerType.USER) {
      const user = await transaction.user.findUnique({
        where: {
          id: requiredId,
        },
        select: {
          id: true,
          present_address: {
            select: {
              id: true,
            },
          },
          permanent_address: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError("User not found.", 404);
      }

      addressId =
        addressType === AddressType.PRESENT
          ? user.present_address?.id
          : user.permanent_address?.id;
    }

    // ========================================================
    // FIND SPOUSE ADDRESS
    // ========================================================

    if (ownerType === AddressOwnerType.SPOUSE_INFORMATION) {
      const spouseInformation = await transaction.spouseInformation.findUnique({
        where: {
          id: requiredId,
        },
        select: {
          id: true,
          present_address: {
            select: {
              id: true,
            },
          },
          permanent_address: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!spouseInformation) {
        throw new AppError("Spouse information not found.", 404);
      }

      addressId =
        addressType === AddressType.PRESENT
          ? spouseInformation.present_address?.id
          : spouseInformation.permanent_address?.id;
    }

    if (!addressId) {
      throw new AppError("Address not found.", 404);
    }

    // ========================================================
    // FIND ADDRESS BEFORE DELETE
    // ========================================================

    let oldAddress;
    if (addressType === AddressType.PRESENT) {
      oldAddress = await transaction.presentAddress.findUnique({
        where: { id: addressId },
      });
    } else {
      oldAddress = await transaction.permanentAddress.findUnique({
        where: { id: addressId },
      });
    }
    if (!oldAddress) {
      throw new AppError("Address not found.", 404);
    }

    // ========================================================
    // DELETE ADDRESS
    // ========================================================

    let deletedAddress;
    if (addressType === AddressType.PRESENT) {
      deletedAddress = await transaction.presentAddress.delete({
        where: {
          id: addressId,
        },
      });
    } else {
      deletedAddress = await transaction.permanentAddress.delete({
        where: {
          id: addressId,
        },
      });
    }


    // ========================================================
    // AUDIT LOG
    // ========================================================

    await transaction.auditLog.create({
      data: {
        entity_id: addressId,
        entity_name:
          addressType === AddressType.PRESENT
            ? "PresentAddress"
            : "PermanentAddress",
        action: "DELETE",
        old_value: oldAddress as unknown as Prisma.InputJsonValue,
        new_value: Prisma.JsonNull,
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return deletedAddress;
  });
};

// ============================================================
// UPDATE SINGLE ADDRESS FIELD
// ============================================================

export const updateAddressField = async (
  requiredId: string,
  field: AddressUpdateField,
  value: AddressUpdateValue,
  ownerType: AddressOwnerType,
  addressType: AddressType,
  loggedInUser: {
    user_id: string;
  },
) => {
  return prisma.$transaction(async (transaction) => {
    let addressId: string | undefined;

    // ========================================================
    // FIND ADDRESS OWNER
    // ========================================================

    if (ownerType === AddressOwnerType.USER) {
      const user = await transaction.user.findUnique({
        where: {
          id: requiredId,
        },
        select: {
          id: true,
          present_address: {
            select: {
              id: true,
            },
          },
          permanent_address: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError("User not found.", 404);
      }

      addressId =
        addressType === AddressType.PRESENT
          ? user.present_address?.id
          : user.permanent_address?.id;
    }

    if (ownerType === AddressOwnerType.SPOUSE_INFORMATION) {
      const spouseInformation = await transaction.spouseInformation.findUnique({
        where: {
          id: requiredId,
        },
        select: {
          id: true,
          present_address: {
            select: {
              id: true,
            },
          },
          permanent_address: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!spouseInformation) {
        throw new AppError("Spouse information not found.", 404);
      }

      addressId =
        addressType === AddressType.PRESENT
          ? spouseInformation.present_address?.id
          : spouseInformation.permanent_address?.id;
    }

    if (!addressId) {
      throw new AppError("Address not found.", 404);
    }

    // ========================================================
    // FIND CURRENT ADDRESS
    // ========================================================


let oldAddress;

if (addressType === AddressType.PRESENT) {
  oldAddress = await transaction.presentAddress.findUnique({
    where: {
      id: addressId,
    },
  });
} else {
  oldAddress = await transaction.permanentAddress.findUnique({
    where: {
      id: addressId,
    },
  });
}

if (!oldAddress) {
  throw new AppError("Address not found.", 404);
}



    // ========================================================
    // PREVENT NULL FOR REQUIRED FIELDS
    // ========================================================

    if (
      (field === "thana" || field === "district" || field === "country") &&
      value === null
    ) {
      throw new AppError(`${field} cannot be empty.`, 400);
    }

    // ========================================================
    // UPDATE ADDRESS
    // ========================================================

let updatedAddress;

if (addressType === AddressType.PRESENT) {
  updatedAddress = await transaction.presentAddress.update({
    where: {
      id: addressId,
    },
    data: {
      [field]: value,
      updated_by: {
        connect: {
          id: loggedInUser.user_id,
        },
      },
    } as Prisma.PresentAddressUpdateInput,
  });
} else {
  updatedAddress = await transaction.permanentAddress.update({
    where: {
      id: addressId,
    },
    data: {
      [field]: value,
      updated_by: {
        connect: {
          id: loggedInUser.user_id,
        },
      },
    } as Prisma.PermanentAddressUpdateInput,
  });
}

    // ========================================================
    // AUDIT LOG
    // ========================================================

    await transaction.auditLog.create({
      data: {
        entity_id: addressId,
        entity_name:
          addressType === AddressType.PRESENT
            ? "PresentAddress"
            : "PermanentAddress",
        action: "UPDATE",
        old_value: {
          [field]: oldAddress[field],
        },
        new_value: {
          [field]: value,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedAddress;
  });
};

// ============================================================
// DELETE SINGLE ADDRESS FIELD
// ============================================================

export const deleteAddressField = async (
  requiredId: string,
  field: AddressDeleteField,
  ownerType: AddressOwnerType,
  addressType: AddressType,
  loggedInUser: {
    user_id: string;
  },
) => {
  return prisma.$transaction(async (transaction) => {
    let addressId: string | undefined;

    // ========================================================
    // FIND ADDRESS OWNER
    // ========================================================

    if (ownerType === AddressOwnerType.USER) {
      const user = await transaction.user.findUnique({
        where: {
          id: requiredId,
        },
        select: {
          id: true,
          present_address: {
            select: {
              id: true,
            },
          },
          permanent_address: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        throw new AppError("User not found.", 404);
      }

      addressId =
        addressType === AddressType.PRESENT
          ? user.present_address?.id
          : user.permanent_address?.id;
    }

    if (ownerType === AddressOwnerType.SPOUSE_INFORMATION) {
      const spouseInformation = await transaction.spouseInformation.findUnique({
        where: {
          id: requiredId,
        },
        select: {
          id: true,
          present_address: {
            select: {
              id: true,
            },
          },
          permanent_address: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!spouseInformation) {
        throw new AppError("Spouse information not found.", 404);
      }

      addressId =
        addressType === AddressType.PRESENT
          ? spouseInformation.present_address?.id
          : spouseInformation.permanent_address?.id;
    }

    if (!addressId) {
      throw new AppError("Address not found.", 404);
    }

    // ========================================================
    // FIND CURRENT ADDRESS
    // ========================================================

let oldAddress;

if (addressType === AddressType.PRESENT) {
  oldAddress = await transaction.presentAddress.findUnique({
    where: {
      id: addressId,
    },
  });
} else {
  oldAddress = await transaction.permanentAddress.findUnique({
    where: {
      id: addressId,
    },
  });
}

if (!oldAddress) {
  throw new AppError("Address not found.", 404);
}

    // ========================================================
    // DELETE SINGLE FIELD
    // ========================================================

let updatedAddress;

if (addressType === AddressType.PRESENT) {
  updatedAddress = await transaction.presentAddress.update({
    where: {
      id: addressId,
    },
    data: {
      [field]: null,
      updated_by: {
        connect: {
          id: loggedInUser.user_id,
        },
      },
    } as Prisma.PresentAddressUpdateInput,
  });
} else {
  updatedAddress = await transaction.permanentAddress.update({
    where: {
      id: addressId,
    },
    data: {
      [field]: null,
      updated_by: {
        connect: {
          id: loggedInUser.user_id,
        },
      },
    } as Prisma.PermanentAddressUpdateInput,
  });
}

    // ========================================================
    // AUDIT LOG
    // ========================================================

    await transaction.auditLog.create({
      data: {
        entity_id: addressId,
        entity_name:
          addressType === AddressType.PRESENT
            ? "PresentAddress"
            : "PermanentAddress",
        action: "UPDATE",
        old_value: {
          [field]: oldAddress[field],
        },
        new_value: {
          [field]: null,
        },
        changed_by: {
          connect: {
            id: loggedInUser.user_id,
          },
        },
      },
    });

    return updatedAddress;
  });
};
