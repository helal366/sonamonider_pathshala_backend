import { Role } from "#db-client";
import { envVars } from "../config/index.js";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";

const seedSuperAdminRolePrincipalPosition = async () => {
  // Check PRINCIPAL position
  let principalPosition = await prisma.userPosition.findUnique({
    where: {
      position_name: "PRINCIPAL",
    },
  });

  // Create position only if it doesn't exist
  if (!principalPosition) {
    principalPosition = await prisma.userPosition.create({
      data: {
        position_name: "PRINCIPAL",
      },
    });

    console.log("PRINCIPAL position created.");
  } else {
    console.log("PRINCIPAL position already exists.");
  }
};

const createPrincipal = async () => {
  // Check SUPER_ADMIN user
  const existingSuperAdmin = await prisma.user.findFirst({
    where: {
      full_name: envVars.SUPER_ADMIN_NAME,
      mobile_number: envVars.SUPER_ADMIN_MOBILE_NO,
      email: envVars.SUPER_ADMIN_EMAIL,
    },
  });

  // Create SUPER_ADMIN user if it doesn't exist
  if (!existingSuperAdmin) {
    const hashedPassword = await bcrypt.hash(
      envVars.SUPER_ADMIN_PASSWORD,
      Number(envVars.BCRYPT_SALT_ROUND),
    );

    await prisma.user.create({
      data: {
        full_name: envVars.SUPER_ADMIN_NAME,
        mobile_number: envVars.SUPER_ADMIN_MOBILE_NO,
        email: envVars.SUPER_ADMIN_EMAIL,
        gender: "MALE",
        user_name: envVars.SUPER_ADMIN_MOBILE_NO,
        user_password: hashedPassword,

        current_role: Role.SUPER_ADMIN,

        current_position: {
          connect: {
            position_name: "PRINCIPAL",
          },
        },
      },
    });

    console.log("SUPER_ADMIN user created.");
  } else {
    console.log("SUPER_ADMIN user already exists.");
  }
};

const createAdminPosition = async () => {


    // Check PRINCIPAL position
    let CoOrdinatorPosition = await prisma.userPosition.findUnique({
      where: {
        position_name: "CO_ORDINATOR",
      },
    });
    // Create position only if it doesn't exist
    if (!CoOrdinatorPosition) {
      CoOrdinatorPosition = await prisma.userPosition.create({
        data: {
          position_name: "CO_ORDINATOR",
        },
      });
      console.log("CO_ORDINATOR position created.");
    } else {
      console.log("CO_ORDINATOR position already exists.");
    }
  
};

const createCoOrdinator = async()=>{
  
}
export const runInitialSeed = async () => {
  await seedSuperAdminRolePrincipalPosition();

  await createPrincipal();

  console.log("Initial seed completed successfully.");
};
