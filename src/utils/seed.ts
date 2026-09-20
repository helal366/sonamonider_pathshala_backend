import { envVars } from "../config";
import { prisma } from "../lib/prisma";
import bcrypt from "bcryptjs";

const seedSuperAdminRolePrincipalPosition = async () => {
  // Check SUPER_ADMIN role
  let superAdminRole = await prisma.userRole.findUnique({
    where: {
      role_name: "SUPER_ADMIN",
    },
  });

  // Create role only if it doesn't exist
  if (!superAdminRole) {
    superAdminRole = await prisma.userRole.create({
      data: {
        role_name: "SUPER_ADMIN",
      },
    });

    console.log("SUPER_ADMIN role created.");
  } else {
    console.log("SUPER_ADMIN role already exists.");
  }

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
        role: {
          connect: {
            id: superAdminRole.id,
          },
        },
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

        role: {
          connect: {
            role_name: "SUPER_ADMIN",
          },
        },

        position: {
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

export const runInitialSeed = async () => {
  await seedSuperAdminRolePrincipalPosition();

  await createPrincipal();

  console.log("Initial seed completed successfully.");
};


