import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";
import { AddressOwnerType, AddressType } from "./address.interface";

const findAddressIdHelperFunction = async (
  owner_type: AddressOwnerType,
  required_id: string,
  address_type: AddressType,
): Promise<string> => {
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
    throw new AppError(`Address not found.`, StatusCodes.NOT_FOUND);
  }

  return addressId;
};

export const addressHelperFunctions = {
  findAddressIdHelperFunction,
};
