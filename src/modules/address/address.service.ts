import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateAddressZodSchema,
  TUpdateAddressFieldZodSchema,
} from "./address.zod.validation.js";
import { Prisma } from "#db-client";
import { AddressOwnerType, AddressType } from "./address.interface.js";

// ============================================================
// CREATE ADDRESS SERVICE LAYER
// ============================================================
const createAddress = async (
  loggedInUser: TLoggedInUser,
  payload: TCreateAddressZodSchema,
) => {
  const {
    required_id,
    owner_type,
    address_type,
    flat_no,
    house_no,
    house_name,
    plot_no,
    road_no,
    neighbourhood,
    region,
    village,
    post_code,
    post_office,
    thana,
    district,
    country,
  } = payload;

  const field = owner_type === AddressOwnerType.USER ? "user" : "spouse";
  const createPayload = {
    flat_no,
    house_no,
    house_name,
    plot_no,
    road_no,
    neighbourhood,
    region,
    village,
    post_code,
    post_office,
    thana,
    district,
    country,
    [field]: {
      connect: {
        id: required_id,
      },
    },
    created_by: {
      connect: {
        id: loggedInUser.user_id,
      },
    },
  };

  let addressId: string | undefined;
  // USER ADDRESS
  if (owner_type === AddressOwnerType.USER) {
    const user = await prisma.user.findUnique({
      where: {
        id: required_id,
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
    addressId = AddressType.PRESENT
      ? user.present_address?.id
      : user.permanent_address?.id;
  } else if (owner_type === AddressOwnerType.SPOUSE_INFORMATION) {
    const spouseInformation = await prisma.spouseInformation.findUnique({
      where: {
        id: required_id,
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

    addressId = AddressType.PRESENT
      ? spouseInformation.present_address?.id
      : spouseInformation.permanent_address?.id;
  }

  let address;
  if (address_type === AddressType.PRESENT) {
    address = await prisma.presentAddress.create({
      data: createPayload,
    });

    await prisma.auditLog.create({
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
  } else if (address_type === AddressType.PERMANENT) {
    address = await prisma.permanentAddress.create({
      data: createPayload,
    });

    await prisma.auditLog.create({
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
  }
};

// ============================================================
// DELETE COMPLETE ADDRESS SERVICE LAYER
// ============================================================
export const deleteAddress = async (
  loggedInUser: TLoggedInUser,
  payload: TCreateAddressZodSchema,
) => {
  const { owner_type, address_type, required_id } = payload;

  // FIND USER ADDRESS ID
  let addressId: string | undefined;

  if (owner_type === AddressOwnerType.USER) {
    const user = await prisma.user.findUnique({
      where: {
        id: required_id,
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
      address_type === AddressType.PRESENT
        ? user.present_address?.id
        : user.permanent_address?.id;
  } else if (owner_type === AddressOwnerType.SPOUSE_INFORMATION) {
    const spouseInformation = await prisma.spouseInformation.findUnique({
      where: {
        id: required_id,
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
      address_type === AddressType.PRESENT
        ? spouseInformation.present_address?.id
        : spouseInformation.permanent_address?.id;
  }

  if (!addressId) {
    throw new AppError("Address not found.", 404);
  }

  // FIND ADDRESS BEFORE DELETE
  let oldAddress;
  if (address_type === AddressType.PRESENT) {
    oldAddress = await prisma.presentAddress.findUnique({
      where: { id: addressId },
    });
  } else {
    oldAddress = await prisma.permanentAddress.findUnique({
      where: { id: addressId },
    });
  }
  if (!oldAddress) {
    throw new AppError("Address not found.", 404);
  }
  // DELETE ADDRESS
  let deletedAddress;
  if (address_type === AddressType.PRESENT) {
    deletedAddress = await prisma.presentAddress.delete({
      where: {
        id: addressId,
      },
    });
  } else {
    deletedAddress = await prisma.permanentAddress.delete({
      where: {
        id: addressId,
      },
    });
  }
  // AUDIT LOG

  await prisma.auditLog.create({
    data: {
      entity_id: addressId,
      entity_name:
        address_type === AddressType.PRESENT
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
};

// ============================================================
// UPDATE ADDRESS SERVICE LAYER
// ============================================================
const updateUserAddressFiled = async (
  loggedInUser: TLoggedInUser,
  payload: TUpdateAddressFieldZodSchema,
) => {
  const { required_id, field, value, owner_type, address_type } = payload;

  let addressId: string | undefined;
  if (owner_type === AddressOwnerType.USER) {
    const user = await prisma.user.findUnique({
      where: { id: required_id },
      select: {
        id: true,
        present_address: {
          select: { id: true },
        },
        permanent_address: {
          select: { id: true },
        },
      },
    });
    if (!user) {
      throw new AppError(`User not found.`, StatusCodes.NOT_FOUND);
    }
    addressId =
      address_type === AddressType.PRESENT
        ? user.present_address?.id
        : user.permanent_address?.id;
  } else if (owner_type === AddressOwnerType.SPOUSE_INFORMATION) {
    const spouseInformantion = await prisma.spouseInformation.findUnique({
      where: { id: required_id },
      select: {
        id: true,
        present_address: {
          select: { id: true },
        },
        permanent_address: {
          select: { id: true },
        },
      },
    });
    if (!spouseInformantion) {
      throw new AppError(
        `Spouse information not found.`,
        StatusCodes.NOT_FOUND,
      );
    }
    if (!spouseInformantion) {
      throw new AppError(
        `Spouse information not found.`,
        StatusCodes.NOT_FOUND,
      );
    }
    addressId =
      address_type === AddressType.PRESENT
        ? spouseInformantion.present_address?.id
        : spouseInformantion.permanent_address?.id;
  }
  if (!addressId) {
    throw new AppError(`Address ID not found.`, StatusCodes.NOT_FOUND);
  }

  let oldAddress;
  if (address_type === AddressType.PRESENT) {
    oldAddress = await prisma.presentAddress.findUnique({
      where: { id: addressId },
    });
  } else if (address_type === AddressType.PERMANENT) {
    oldAddress = await prisma.permanentAddress.findUnique({
      where: { id: addressId },
    });
  }
  if (!oldAddress) {
    throw new AppError(`Address not found.`, StatusCodes.NOT_FOUND);
  }

  // PREVENT NULL FOR REQUIRED FIELDS
  if (
    (field === "thana" || field === "district" || field === "country") &&
    value === null
  ) {
    throw new AppError(`${field} cannot be empty.`, 400);
  }

  // UPDATE ADDRESS
  let updatedAddress;
  if (address_type === AddressType.PRESENT) {
    updatedAddress = (await prisma.presentAddress.update({
      where: { id: addressId },
      data: {
        [field]: value,
        updated_by: {
          connect: { id: loggedInUser.user_id },
        },
      },
    })) as Prisma.PresentAddressUpdateInput;
  } else if (address_type === AddressType.PERMANENT) {
    updatedAddress = await prisma.permanentAddress.update({
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

  // AUDIT LOG
  await prisma.auditLog.create({
    data: {
      entity_id: addressId,
      entity_name: AddressType.PRESENT ? "PresentAddress" : "PermanentAddress",
      action: "UPDATE",
      old_value: {
        [field]: oldAddress[field],
      },
      new_value: {
        [field]: value,
      },
      changed_by: {
        connect: { id: loggedInUser.user_id },
      },
    },
  });
  return updatedAddress;
};

export const userAddressService = {
  createAddress,
  deleteAddress,
  updateUserAddressFiled,
};
