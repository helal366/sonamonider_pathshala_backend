import { Role } from "#db-client";
import { envVars } from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

const seedPositions = async () => {
  const positions = [
    "PRINCIPAL",
    "VICE_PRINCIPAL",
    "ADMINISTRATIVE_INCHARGE",
    "ACADEMIC_INCHARGE",
    "LOGISTIC_OFFICER",
    "ACADEMIC_STAFF",
    "MANAGEMENT_STAFF",
    "TEACHER",
    "ASSISTANT_TEACHER",
    "TEACHER_ASSISTANT",
    "CO_ORDINATOR",
    "ACCOUNTANT",
    "STUDENT",
    "GOVERNING_BODY",
    "SISTER",
    "AAYA",
    "GUARD",
    "CLEANER",
  ];

  console.log("Seeding positions...");

  // 1. Map array to the structure your model expects
  const dataToInsert = positions.map((position) => ({
    position_name: position,
  }));

  // 2. Perform a single batch operation instead of a loop inside a transaction
  const result = await prisma.userPosition.createMany({
    data: dataToInsert,
    skipDuplicates: true, // It will ignore names that already exist without throwing errors
  });

  console.log(`Positions seeding done. Created ${result.count} new positions.`);
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

// Create Nazim Sir
const createNazimSir = async()=>{
  const full_name = "Md Nazimuddin";
  const mobile_number = "01671588904";
  const email = "nazimuddin0708@gmail.com";
  const password = "123456";
  const gender= "MALE";

  const existing = await prisma.user.findFirst({
    where: {
      full_name,
      mobile_number,
      email,
    },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(envVars.BCRYPT_SALT_ROUND),
    );

    await prisma.user.create({
      data: {
        full_name,
        mobile_number,
        email,
        gender,
        user_name: mobile_number,
        user_password: hashedPassword,

        current_role: Role.ADMIN,

        current_position: {
          connect: {
            position_name: "ADMINISTRATIVE_INCHARGE",
          },
        },
      },
    });

    console.log("Md Nazimuddin sir user created.");
  } else {
    console.log("Md Nazimuddin sir user already exists.");
  }
}

// Create Neha madam
const createNehaMadam= async()=>{
  const full_name = "Niha Islam Sharna";
  const mobile_number = "01732639696";
  const email = "niha99islam@gmail.com";
  const password = "123456";
  const gender= "FEMALE";

  const existing = await prisma.user.findFirst({
    where: {
      full_name,
      mobile_number,
      email,
    },
  });

  if (!existing) {
    const hashedPassword = await bcrypt.hash(
      password,
      Number(envVars.BCRYPT_SALT_ROUND),
    );

    await prisma.user.create({
      data: {
        full_name,
        mobile_number,
        email,
        gender,
        user_name: mobile_number,
        user_password: hashedPassword,

        current_role: Role.ACADEMIC,

        current_position: {
          connect: {
            position_name: "ASSISTANT_TEACHER",
          }
        },
      },
    });

    console.log("Niha madam user created.");
  } else {
    console.log("Niha madam user already exists.");
  }
}
export const runInitialSeed = async () => {
  await seedPositions();

  await createPrincipal();

  await createNazimSir();

  await createNehaMadam();

  console.log("Initial seed completed successfully.");
};
