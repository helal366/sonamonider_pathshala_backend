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
const seedquranicSubjectes = async () => {
  const quranicSubjectes = [
    "NURANI_PLAYGROUP",
    "NURANI_NURSERY",
    "NURANI_PRELIMINARY",
    "NURANI_ADVANCE",
    "NURANI_AMPARA",
    "NAZERA_PRELIMINARY",
    "NAZERA_ADVANCE",
    "PRE_HIFZ",
    "HIFZ",
    "ARABIC_LITERATURE"
  ];

  await prisma.$transaction(
    async (tx) => {
      for (const quranicSubjectName of quranicSubjectes) {
        const existingquranicSubject = await tx.quranicSubject.findUnique({
          where: { quranic_subject_name: quranicSubjectName },
        });

        if (!existingquranicSubject) {
          await tx.quranicSubject.create({
            data: { quranic_subject_name: quranicSubjectName },
          });

          console.log(`${quranicSubjectName} Quranic class created.`);
        } else {
          console.log(`${quranicSubjectName} Quranic class already exists.`);
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
    quranic_period_name: "NURANI_MORNING",
    start_time: "7:01 AM",
    end_time: "7:50 AM",
  },
  {
    quranic_period_name: "HIFZ_MORNING",
    start_time: "6:01 AM",
    end_time: "7:50 AM",
  },
  {
    quranic_period_name: "ASSEMBLY",
    start_time: "7:51 AM",
    end_time: "8:00 AM",
  },
  {
    quranic_period_name: "QURANIC_EVENING",
    start_time: "3:01 PM",
    end_time: "5:00 PM",
  },

  {
    quranic_period_name: "HIFZ_NIGHT",
    start_time: "AFTER MAGRIB",
    end_time: "8:00 PM",
  },
  {
    quranic_period_name: "NURANI_NAZERA_GIRLS",
    start_time: "9:46 AM",
    end_time: "10:30 AM",
  },
  {
    quranic_period_name: "HIFZ_GIRLS",
    start_time: "08:01 AM",
    end_time: "09:00 AM",
  },
  {
    quranic_period_name: "ARABIC_LITERATURE_GIRLS",
    start_time: "09:01 AM",
    end_time: "09:45 AM",
  },
  {
    quranic_period_name: "ARABIC_LITERATURE_BOYS",
    start_time: "11:16 AM",
    end_time: "12:00 AM",
  },
  {
    quranic_period_name: "ARABIC_LITERATURE",
    start_time: "10:16 AM",
    end_time: "11:15 AM",
  },

];

const seedQuranicPeriods = async () => {
  await prisma.$transaction(
    async (tx) => {
      for (const period of quranicPeriods) {
        const existingPeriod = await tx.quranicPeriod.findUnique({
          where: {
            quranic_period_name: period.quranic_period_name,
          },
        });

        if (!existingPeriod) {
          await tx.quranicPeriod.create({
            data: period,
          });

          console.log(
            `${period.quranic_period_name} Quranic period created.`,
          );
        } else {
          console.log(
            `${period.quranic_period_name} Quranic period already exists.`,
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
  await seedquranicSubjectes();
  await seedQuranicPeriods();
};


