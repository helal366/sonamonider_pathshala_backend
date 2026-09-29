import { StatusCodes } from "http-status-codes";
import { TLoggedInUser } from "../../commonInterfaces/interfaces";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import {
  TCreateAddressZodSchema,
  TDeleteAddressZodSchema,
  TUpdateAddressFieldZodSchema,
} from "./address.zod.validation.js";
import { Prisma } from "#db-client";
import { AddressOwnerType, AddressType } from "./address.interface.js";
import { addressHelperFunctions } from "./address.helperFunction";

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

  return prisma.$transaction(async (transaction) => {
    const address =
      address_type === AddressType.PRESENT
        ? await transaction.presentAddress.create({ data: createPayload })
        : await transaction.permanentAddress.create({ data: createPayload });

    await transaction.auditLog.create({
      data: {
        entity_id: address.id,
        entity_name:
          address_type === AddressType.PRESENT
            ? "PresentAddress"
            : "PermanentAddress",
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
  });
};

// ============================================================
// DELETE COMPLETE ADDRESS SERVICE LAYER
// ============================================================
const deleteAddress = async (
  loggedInUser: TLoggedInUser,
  payload: TDeleteAddressZodSchema,
) => {
  const { owner_type, address_type, required_id } = payload;

  // FIND USER ADDRESS ID
  const addressId = await addressHelperFunctions.findAddressIdHelperFunction(
    owner_type,
    required_id,
    address_type,
  );

  return prisma.$transaction(async (transaction) => {
    const oldAddress = await {
      [AddressType.PRESENT]: (id: string) =>
        transaction.presentAddress.findUnique({ where: { id } }),
      [AddressType.PERMANENT]: (id: string) =>
        transaction.permanentAddress.findUnique({ where: { id } }),
    }[address_type](addressId);

    if (!oldAddress) {
      throw new AppError("Address not found.", StatusCodes.NOT_FOUND);
    }

    const deletedAddress = await {
      [AddressType.PRESENT]: (id: string) =>
        transaction.presentAddress.delete({ where: { id } }),
      [AddressType.PERMANENT]: (id: string) =>
        transaction.permanentAddress.delete({ where: { id } }),
    }[address_type](addressId);

    await transaction.auditLog.create({
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
  });
};

// ============================================================
// UPDATE ADDRESS SERVICE LAYER
// ============================================================
const updateUserAddressFiled = async (
  loggedInUser: TLoggedInUser,
  payload: TUpdateAddressFieldZodSchema,
) => {
  const { required_id, field, value, owner_type, address_type } = payload;

  // FIND USER ADDRESS ID
  const addressId = await addressHelperFunctions.findAddressIdHelperFunction(
    owner_type,
    required_id,
    address_type,
  );

  // PREVENT NULL FOR REQUIRED FIELDS
  if (
    (field === "thana" || field === "district" || field === "country") &&
    (value === null || value.trim() === "")
  ) {
    throw new AppError(`${field} cannot be empty.`, 400);
  }

  return prisma.$transaction(async (transaction) => {
    const oldAddress = await {
      [AddressType.PRESENT]: (id: string) =>
        transaction.presentAddress.findUnique({ where: { id } }),
      [AddressType.PERMANENT]: (id: string) =>
        transaction.permanentAddress.findUnique({ where: { id } }),
    }[address_type](addressId);

    if (!oldAddress) {
      throw new AppError("Address not found.", StatusCodes.NOT_FOUND);
    }

    const updatedAddress =
      address_type === AddressType.PRESENT
        ? await transaction.presentAddress.update({
            where: { id: addressId },
            data: {
              [field]: value,
              updated_by: { connect: { id: loggedInUser.user_id } },
            },
          })
        : await transaction.permanentAddress.update({
            where: { id: addressId },
            data: {
              [field]: value,
              updated_by: { connect: { id: loggedInUser.user_id } },
            } as Prisma.PermanentAddressUpdateInput,
          });

    await transaction.auditLog.create({
      data: {
        entity_id: addressId,
        entity_name:
          address_type === AddressType.PRESENT
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
          connect: { id: loggedInUser.user_id },
        },
      },
    });

    return updatedAddress;
  });
};

export const userAddressServices = {
  createAddress,
  deleteAddress,
  updateUserAddressFiled,
};
