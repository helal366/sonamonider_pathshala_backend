import { prisma } from "../lib/prisma";

// =========================================================
// SEED ROLES
// =========================================================
const seedRoles = async () => {
  const roles = [
    "TEACHER_ADMIN",
    "ADMIN",
    "MANAGEMENT",
    "ACADEMIC",
    "STUDENT",
    "GOVERNING_BODY",
  ];

  await prisma.$transaction(
    async (tx) => {
      for (const role of roles) {
        const existingRole = await tx.userRole.findUnique({
          where: { role_name: role },
        });

        if (!existingRole) {
          await tx.userRole.create({
            data: { role_name: role },
          });

          console.log(`${role} role created.`);
        } else {
          console.log(`${role} role already exists.`);
        }
      }
    },
    { timeout: 60000 },
  );
};

// =========================================================
// SEED POSITIONS
// =========================================================
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
    "CO-ORDINATOR",
    "ACCOUNTANT",
    "STUDENT",
    "GOVERNING_BODY",
    "SISTER",
    "AAYA",
    "GUARD",
    "CLEANER",
  ];

  await prisma.$transaction(
    async (tx) => {
      for (const position of positions) {
        const existingPosition = await tx.userPosition.findUnique({
          where: { position_name: position },
        });

        if (!existingPosition) {
          await tx.userPosition.create({
            data: { position_name: position },
          });

          console.log(`${position} position created.`);
        } else {
          console.log(`${position} position already exists.`);
        }
      }
    },
    { timeout: 60000 },
  );
};

// =========================================================
// SEED SHIFTS
// =========================================================
const seedShifts = async () => {
  const shifts = ["MORNING", "DAY", "BOYS", "GIRLS"];

  await prisma.$transaction(
    async (tx) => {
      for (const shift of shifts) {
        const existingShift = await tx.shift.findUnique({
          where: { shift_name: shift },
        });

        if (!existingShift) {
          await tx.shift.create({
            data: { shift_name: shift },
          });

          console.log(`${shift} shift created.`);
        } else {
          console.log(`${shift} shift already exists.`);
        }
      }
    },
    { timeout: 60000 },
  );
};

// =========================================================
// SEED CLASSES
// =========================================================
const seedClasses = async () => {
  const classes = [
    "PLAYGROUP",
    "NURSERY",
    "KINDERGARTEN",
    "KINDERGARTEN_DAY",
    "GRADE_ONE_ENGLISH",
    "GRADE_ONE_BANGLA",
    "GRADE_TWO_ENGLISH",
    "GRADE_TWO_BANGLA",
    "GRADE_THREE_BANGLA",
    "GRADE_FOUR_BANGLA",
    "GRADE_FIVE_BANGLA",
    "GRADE_SIX_BANGLA",
    "GRADE_SEVEN_BANGLA",
    "GRADE_EIGHT_BANGLA",
    "GRADE_NINE_BANGLA",
    "GRADE_TEN_BANGLA",
  ];

  await prisma.$transaction(
    async (tx) => {
      for (const className of classes) {
        const existingClass = await tx.class.findUnique({
          where: { class_name: className },
        });

        if (!existingClass) {
          await tx.class.create({
            data: { class_name: className },
          });

          console.log(`${className} class created.`);
        } else {
          console.log(`${className} class already exists.`);
        }
      }
    },
    { timeout: 60000 },
  );
};

// =========================================================
// SEED QURANIC CLASS NAMES
// =========================================================
const seedQuranicClasses = async () => {
  const quranicClasses = [
    "NURANI_PLAYGROUP",
    "NURANI_NURSERY",
    "NURANI_PRELIMINARY",
    "NURANI_ADVANCE",
    "NURANI_AMPARA",
    "NAZERA",
    "HIFZ",
    "ARABIC_LITERATURE"
  ];

  await prisma.$transaction(
    async (tx) => {
      for (const quranicClassName of quranicClasses) {
        const existingQuranicClass = await tx.quranicClass.findUnique({
          where: { quranic_class_name: quranicClassName },
        });

        if (!existingQuranicClass) {
          await tx.quranicClass.create({
            data: { quranic_class_name: quranicClassName },
          });

          console.log(`${quranicClassName} Quranic class created.`);
        } else {
          console.log(`${quranicClassName} Quranic class already exists.`);
        }
      }
    },
    { timeout: 60000 },
  );
};

// ========================================================
// SEED QURANIC PERIODS
// ========================================================
const quranicPeriods = [
  {
    quranic_class_period_name: "NURANI_MORNING",
    start_time: "7:01 AM",
    end_time: "7:50 AM",
  },
  {
    quranic_class_period_name: "NAZERA_MORINING",
    start_time: "6:01 AM",
    end_time: "7:50 AM",
  },
  {
    quranic_class_period_name: "HIFZ_MORNING",
    start_time: "6:01 AM",
    end_time: "7:50 AM",
  },
  {
    quranic_class_period_name: "ASSEMBLY",
    start_time: "7:51 AM",
    end_time: "8:00 AM",
  },
  {
    quranic_class_period_name: "NURANI_EVENING",
    start_time: "3:01 PM",
    end_time: "5:00 PM",
  },
  {
    quranic_class_period_name: "NAZERA_EVENING",
    start_time: "3:01 PM",
    end_time: "5:00 PM",
  },
  {
    quranic_class_period_name: "HIFZ_EVENING",
    start_time: "3:01 PM",
    end_time: "5:00 PM",
  },
  {
    quranic_class_period_name: "HIFZ_NIGHT",
    start_time: "AFTER MAGRIB",
    end_time: "8:00 PM",
  },
  {
    quranic_class_period_name: "NURANI_GIRLS",
    start_time: "9:16 AM",
    end_time: "10:15 AM",
  },
  {
    quranic_class_period_name: "NAZERA_GIRLS_ONE",
    start_time: "7:01 AM",
    end_time: "8:30 AM",
  },
  {
    quranic_class_period_name: "NAZERA_GIRLS_TWO",
    start_time: "9:16 AM",
    end_time: "10:15 AM",
  },
  {
    quranic_class_period_name: "HIFZ_GIRLS_ONE",
    start_time: "7:01 AM",
    end_time: "8:30 AM",
  },
  {
    quranic_class_period_name: "HIFZ_GIRLS_TWO",
    start_time: "9:16 AM",
    end_time: "10:15 AM",
  },
  {
    quranic_class_period_name: "ARABIC_LITERATURE_MORNING",
    start_time: "10:16 AM",
    end_time: "11:30 AM",
  },
  {
    quranic_class_period_name: "ARABIC_LITERATURE_BOYS_IV_V",
    start_time: "11:16 AM",
    end_time: "12:00 AM",
  },
  {
    quranic_class_period_name: "ARABIC_LITERATURE_BOYS_VI",
    start_time: "11:46 AM",
    end_time: "12:15 AM",
  },
  {
    quranic_class_period_name: "ARABIC_LITERATURE_GIRLS",
    start_time: "08:31 AM",
    end_time: "09:15 AM",
  },
];

const seedQuranicPeriods = async () => {
  await prisma.$transaction(
    async (tx) => {
      for (const period of quranicPeriods) {
        const existingPeriod = await tx.quranicClassPeriod.findUnique({
          where: {
            quranic_class_period_name: period.quranic_class_period_name,
          },
        });

        if (!existingPeriod) {
          await tx.quranicClassPeriod.create({
            data: period,
          });

          console.log(
            `${period.quranic_class_period_name} Quranic class period created.`,
          );
        } else {
          console.log(
            `${period.quranic_class_period_name} Quranic class period already exists.`,
          );
        }
      }
    },
    { timeout: 60000 },
  );
};
export const runInitialOthers = async () => {
  await seedRoles();
  await seedPositions();
  await seedShifts();
  await seedClasses();
  await seedQuranicClasses();
  await seedQuranicPeriods();
};

/**
NURANI_MORNING
NAZERA_MORINING
HIFZ_MORNING
NURANI_EVENING
NAZERA_EVENING
HIFZ_EVENING
HIFZ_NIGHT
NURANI_GIRLS
NAZERA_GIRLS
HIFZ_GIRLS
   **/
