import { Gender, Role } from "#db-client";
import { envVars } from "../../config/index.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";
interface ICreateSirMadamPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  gender: Gender;
  user_name: string;
  hashedPassword: string;
  joining_date: Date;
  current_role: Role;
  position_name: string;
}
const createSirMadam = async (payload: ICreateSirMadamPayload) => {
  const {
    full_name,
    mobile_number,
    email,
    gender,
    hashedPassword,
    joining_date,
    current_role,
    position_name,
  } = payload;
  await prisma.user.create({
    data: {
      full_name,
      mobile_number,
      email,
      gender,
      user_name: mobile_number,
      user_password: hashedPassword,
      joining_date,
      current_role,

      current_position: {
        connect: {
          position_name,
        },
      },
    },
  });
};

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

const createPrincipal = async (joining_date: Date) => {
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
        joining_date,

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
const createNazimSir = async (joining_date: Date) => {
  const full_name = "Md Nazimuddin";
  const mobile_number = "01671588904";
  const email = "nazimuddin0708@gmail.com";
  const password = "123456";
  const gender = Gender.MALE;
  const current_role = Role.ADMIN;
  const position_name = "ADMINISTRATIVE_INCHARGE";

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
    const payload = {
      full_name,
      mobile_number,
      email,
      hashedPassword,
      user_name: mobile_number,
      gender,
      joining_date,
      current_role,
      position_name,
    };
    await createSirMadam(payload);

    console.log("Md Nazimuddin sir user created.");
  } else {
    console.log("Md Nazimuddin sir user already exists.");
  }
};

// Create Neha madam
const createNehaMadam = async (joining_date: Date) => {
  const full_name = "Niha Islam Sharna";
  const mobile_number = "01732639696";
  const email = "niha99islam@gmail.com";
  const password = "123456";
  const gender = Gender.FEMALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";

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
    const payload = {
      full_name,
      mobile_number,
      email,
      hashedPassword,
      user_name: mobile_number,
      gender,
      joining_date,
      current_role,
      position_name,
    };
    await createSirMadam(payload);

    console.log("Niha madam user created.");
  } else {
    console.log("Niha madam user already exists.");
  }
};

// Create Kouser Ahmed sir
const createKouserSir = async (joining_date: Date) => {
  const full_name = "Md Kouser Ahammed";
  const mobile_number = "01996797468";
  const email = "kousarahammed919@gmail.com";
  const password = "123456";
  const gender = Gender.MALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";

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
    const payload = {
      full_name,
      mobile_number,
      email,
      hashedPassword,
      user_name: mobile_number,
      gender,
      joining_date,
      current_role,
      position_name,
    };
    await createSirMadam(payload);

    console.log("Kouser sir user created.");
  } else {
    console.log("Kouser sir user already exists.");
  }
};

// Create Anipa Khatun madam
const createAnipaKhatunMadam = async (joining_date: Date) => {
  const full_name = "Anipa Khatun";
  const mobile_number = "01752457969";
  const email = "anipakhatun@gmail.com";
  const password = "123456";
  const gender = Gender.FEMALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";

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
    const payload = {
      full_name,
      mobile_number,
      email,
      hashedPassword,
      user_name: mobile_number,
      gender,
      joining_date,
      current_role,
      position_name,
    };
    await createSirMadam(payload);

    console.log("Anipa madam user created.");
  } else {
    console.log("Anipa madam user already exists.");
  }
};

// Create Sumayea Rahman madam
const createSumayeaRahmanMadam = async (joining_date: Date) => {
  const full_name = "Sumayea Rahman";
  const mobile_number = "01300881544";
  const email = "sumayearahman3@gmail.com";
  const password = "123456";
  const gender = Gender.FEMALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";

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
    const payload = {
      full_name,
      mobile_number,
      email,
      hashedPassword,
      user_name: mobile_number,
      gender,
      joining_date,
      current_role,
      position_name,
    };
    await createSirMadam(payload);

    console.log("Sumayea madam user created.");
  } else {
    console.log("Sumayea madam user already exists.");
  }
};

// Create Sajidul Islam sir
const createSajidulIslamSir = async(joining_date: Date)=>{
  const full_name = "Sajidul Islam";
  const mobile_number = "01353647321";
  const email = "dino503555@gmail.com";
  const password = "123456";
  const gender = Gender.MALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";

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
    const payload = {
      full_name,
      mobile_number,
      email,
      hashedPassword,
      user_name: mobile_number,
      gender,
      joining_date,
      current_role,
      position_name,
    };
    await createSirMadam(payload);

    console.log("Sajidul sir user created.");
  } else {
    console.log("Sajidul sir user already exists.");
  }
};

// Create Abu Sayed sir
const createAbuSayedSir = async(joining_date: Date)=>{
  const full_name = "Md Abu Syed";
  const mobile_number = "01717316049";
  const email = "sayeed2021bd@gmail.com";
  const password = "123456";
  const gender = Gender.MALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ACADEMIC_INCHARGE";

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
    const payload = {
      full_name,
      mobile_number,
      email,
      hashedPassword,
      user_name: mobile_number,
      gender,
      joining_date,
      current_role,
      position_name,
    };
    await createSirMadam(payload);

    console.log("Abu Syed sir user created.");
  } else {
    console.log("Abu Syed sir user already exists.");
  }
}
export const runInitialSeed = async () => {
  await seedPositions();

  await createPrincipal(new Date("2015-10-27T00:00:00.000Z"));

  await createNazimSir(new Date("2023-10-27T00:00:00.000Z"));

  await createNehaMadam(new Date("2023-10-27T00:00:00.000Z"));

  await createKouserSir(new Date("2023-10-27T00:00:00.000Z"));

  await createAnipaKhatunMadam(new Date("2023-10-27T00:00:00.000Z"));

  await createSumayeaRahmanMadam(new Date("2023-10-27T00:00:00.000Z"));

  await createSajidulIslamSir(new Date("2023-10-27T00:00:00.000Z"));

  await createAbuSayedSir(new Date("2023-10-27T00:00:00.000Z"))

  console.log("Initial seed completed successfully.");
};
