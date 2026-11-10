import { Gender, Role, SubjectForSubjectTeacher } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { envVars } from "../../config/index.js";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction.js";
import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcryptjs";

// Seed positions

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

interface ICreateStaffPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  gender: Gender;
  user_name: string;
  hashedPassword: string;
  joining_date: Date;
  current_role: Role;
  position_name: string;
  subject_for_subject_teacher: string | null;
  grade_teacher: string | null;
  group_teacher: string | null;
}

const AcademicRole = ["ACADEMIC", "TEACHER_ADMIN"];
const ManagementRole = ["MANAGEMENT", "ADMIN"];
const getAddressing = (gender: Gender): string => {
  return gender === Gender.MALE ? "Sir" : "Madam";
};
const createStaff = async (payload: ICreateStaffPayload) => {
  const {
    full_name,
    mobile_number,
    email,
    gender,
    hashedPassword,
    joining_date,
    current_role,
    position_name,
    subject_for_subject_teacher,
    grade_teacher,
    group_teacher,
  } = payload;
  const position = await prisma.userPosition.findUnique({
    where: { position_name },
  });
  if (!position) {
    throw new AppError(`Provided position not found.`, StatusCodes.NOT_FOUND);
  }
  const isAcademic = AcademicRole.includes(current_role);
  const isManagement = ManagementRole.includes(current_role);
  if (!isAcademic && !isManagement) {
    throw new AppError("Invalid staff role.", StatusCodes.BAD_REQUEST);
  }
  await prisma.$transaction(async (transaction) => {
    const created = await transaction.user.create({
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
        ...(isAcademic
          ? {
              academic_staff_profile: {
                create: {
                  current_role,
                  current_position: {
                    connect: {
                      position_name,
                    },
                  },
                },
              },
            }
          : {
              management_staff_profile: {
                create: {
                  current_role,
                  current_position: {
                    connect: {
                      position_name,
                    },
                  },
                },
              },
            }),
      },
      include: {
        academic_staff_profile: {
          select: {
            id: true,
          },
        },
        management_staff_profile: {
          select: {
            id: true,
          },
        },
      },
    });
    // SubProfileId
    const subProfileId = isAcademic
      ? created.academic_staff_profile?.id
      : created.management_staff_profile?.id;
    // Create promotion history
    await prisma.promotionHistory.create({
      data: {
        current_role,
        current_position: {
          connect: {
            position_name,
          },
        },
        ...(isAcademic
          ? {
              academic_staff: {
                connect: {
                  id: created.academic_staff_profile?.id,
                },
              },
            }
          : {
              management_staff: {
                connect: {
                  id: created.management_staff_profile?.id,
                },
              },
            }),
        start_date: joining_date,
      },
    });

    // Subject teacher
    if (subject_for_subject_teacher && isManagement) {
      throw new AppError(`Management staff is not allowed as Subject teacher.`, StatusCodes.BAD_REQUEST)
    };

    if(subject_for_subject_teacher && isAcademic){
      await transaction.academicStaff.update({
        where: {id: created.academic_staff_profile?.id},
        data: {
          subject_for_subject_teacher
        }
      })
    }
    // Check both grade teacher and group teacher
    if(grade_teacher && group_teacher){
      throw new AppError(`An academic staff has no authorization to assign for both grade and group teacher.`, StatusCodes.UNAUTHORIZED)
    }
    // Grade teacher
    if(grade_teacher && isManagement){
      throw new AppError(`Management staff is not allowed as Grade teacher.`, StatusCodes.BAD_REQUEST)
    };
    if(grade_teacher && isAcademic){
      await transaction.academicStaff.update({
        where: {
          id: created.academic_staff_profile?.id
        },
        data: {
          grade_group_teacher_class: {
            connect: {
              class_name: grade_teacher
            }
          }
        }
      })
    }

    // Group teacher 
    if(group_teacher && isManagement){
      throw new AppError(`Management staff is not allowed as Group teacher.`, StatusCodes.BAD_REQUEST)
    };

    if(group_teacher && isAcademic){
      await transaction.academicStaff.update({
        where: {
          id: created.academic_staff_profile?.id
        },
        data: {
          grade_group_teacher_class: {
            connect: {
              class_name: group_teacher
            }
          }
        }
      })
    }
  });

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
  const subject_for_subject_teacher = null;
  const grade_teacher = null;
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
  }
};

// Create Niha madam
const createNihaMadam = async (joining_date: Date) => {
  const full_name = "Niha Islam Sharna";
  const mobile_number = "01732639696";
  const email = "niha99islam@gmail.com";
  const password = "123456";
  const gender = Gender.FEMALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";
  const subject_for_subject_teacher = null;
  const grade_teacher = "GRADE_ONE";
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
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
  const subject_for_subject_teacher = SubjectForSubjectTeacher.MATHEMATICS;
  const grade_teacher = null;
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
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
  const subject_for_subject_teacher = SubjectForSubjectTeacher.BENGALI;
  const grade_teacher = "GRADE_FOUR";
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
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
  const subject_for_subject_teacher = SubjectForSubjectTeacher.ARABIC;
  const grade_teacher = "GRADE_TWO";
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
  }
};

// Create Sajidul Islam sir
const createSajidulIslamSir = async (joining_date: Date) => {
  const full_name = "Sajidul Islam";
  const mobile_number = "01353647321";
  const email = "dino503555@gmail.com";
  const password = "123456";
  const gender = Gender.MALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";
  const subject_for_subject_teacher = null;
  const grade_teacher = null;
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
  }
};

// Create Abu Sayed sir
const createAbuSayedSir = async (joining_date: Date) => {
  const full_name = "Md Abu Syed";
  const mobile_number = "01717316049";
  const email = "sayeed2021bd@gmail.com";
  const password = "123456";
  const gender = Gender.MALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ACADEMIC_INCHARGE";
  const subject_for_subject_teacher = null;
  const grade_teacher = null;
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
  }
};

// Create Asma Akter madam
const createAsmaAkterMadam = async (joining_date: Date) => {
  const full_name = "Asma Akter";
  const mobile_number = "01322035427";
  const email = "asmaakter26696@gmail.com";
  const password = "123456";
  const gender = Gender.FEMALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";
  const subject_for_subject_teacher = null;
  const grade_teacher = null;
  const group_teacher = "NURSERY";

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
  }
};

// Create Fatema Amin Suchona madam
const createFatemaAminSuchonaMadam = async (joining_date: Date) => {
  const full_name = "Fatema Amin Suchona";
  const mobile_number = "01685155960";
  const email = "aminsuchona@gmail.com";
  const password = "123456";
  const gender = Gender.FEMALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";
  const subject_for_subject_teacher = null;
  const grade_teacher = null;
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
  }
};

// Create Taslima Khatun madam
const createTaslimaKhatunMadam = async (joining_date: Date) => {
  const full_name = "Taslima Khatun";
  const mobile_number = "01726718457";
  const email = "taslimakhandaker1@gmail.com";
  const password = "123456";
  const gender = Gender.FEMALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";
  const subject_for_subject_teacher = null;
  const grade_teacher = "GRADE_THREE";
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
  }
};

// Create A K M Moniruzzaman sir
const createAKMMoniruzzamanSir = async (joining_date: Date) => {
  const full_name = "A K M Moniruzzaman";
  const mobile_number = "01774243944";
  const email = "akmmoniruzzaman088@gmail.com";
  const password = "123456";
  const gender = Gender.MALE;
  const current_role = Role.ACADEMIC;
  const position_name = "ASSISTANT_TEACHER";
  const subject_for_subject_teacher = SubjectForSubjectTeacher.ENGLISH;
  const grade_teacher = "GRADE_EIGHT";
  const group_teacher = null;

  const addressing = getAddressing(gender);
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
      subject_for_subject_teacher,
      grade_teacher,
      group_teacher,
    };
    await createStaff(payload);

    console.log(`${full_name} ${addressing} user created.`);
  } else {
    console.log(`${full_name} ${addressing} user already exists.`);
  }
};
export const runInitialSeedPositionStaff = async () => {
  await seedPositions();

  await createPrincipal(new Date("2015-10-27T00:00:00.000Z"));
  await createNazimSir(new Date("2023-10-27T00:00:00.000Z"));
  await createNihaMadam(new Date("2023-10-27T00:00:00.000Z"));
  await createKouserSir(new Date("2023-10-27T00:00:00.000Z"));
  await createAnipaKhatunMadam(new Date("2023-10-27T00:00:00.000Z"));
  await createSumayeaRahmanMadam(new Date("2023-10-27T00:00:00.000Z"));
  await createSajidulIslamSir(new Date("2023-10-27T00:00:00.000Z"));
  await createAbuSayedSir(new Date("2023-10-27T00:00:00.000Z"));
  await createAsmaAkterMadam(new Date("2025-07-31T00:00:00.000Z"));
  await createFatemaAminSuchonaMadam(new Date("2026-09-15T00:00:00.000Z"));
  await createTaslimaKhatunMadam(new Date("2026-09-15T00:00:00.000Z"));
  await createAKMMoniruzzamanSir(new Date("2025-08-02T00:00:00.000Z"));

  console.log("Initial seed completed successfully.");
};
