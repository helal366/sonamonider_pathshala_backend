import { prisma } from "../lib/prisma.js";

// =========================================================
// SEED SHIFTS
// =========================================================
const seedShifts = async () => {
  const shifts = ["MORNING", "DAY", "BOYS", "GIRLS"];
  
  console.log("Seeding shifts...");
  const data = shifts.map(shift => ({ shift_name: shift }));
  
  const result = await prisma.shift.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`Shifts done. Created ${result.count} entries.`);
};

// =========================================================
// SEED CLASSES
// =========================================================
const seedClasses = async () => {
  const classes = [
    "PLAYGROUP", "NURSERY", "KINDERGARTEN", 
    "GRADE_ONE_ENGLISH", "GRADE_ONE_BANGLA", "GRADE_TWO_ENGLISH",
    "GRADE_TWO_BANGLA", "GRADE_THREE_BANGLA", "GRADE_FOUR_BANGLA",
    "GRADE_FIVE_BANGLA", "GRADE_SIX_BANGLA", "GRADE_SEVEN_BANGLA",
    "GRADE_EIGHT_BANGLA", "GRADE_NINE_BANGLA", "GRADE_TEN_BANGLA",
  ];

  console.log("Seeding classes...");
  const data = classes.map(className => ({ class_name: className }));

  const result = await prisma.class.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`Classes done. Created ${result.count} entries.`);
};

// =========================================================
// SEED QURANIC CLASS NAMES
// =========================================================
const seedquranicSubjectes = async () => {
  const quranicSubjectes = [
    "NURANI_PLAYGROUP", "NURANI_NURSERY", "NURANI_PRELIMINARY",
    "NURANI_ADVANCE", "NURANI_AMPARA", "NAZERA_PRELIMINARY",
    "NAZERA_ADVANCE", "PRE_HIFZ", "HIFZ", "ARABIC_LITERATURE",
  ];

  console.log("Seeding Quranic subjects...");
  const data = quranicSubjectes.map(subject => ({ quranic_subject_name: subject }));

  const result = await prisma.quranicSubject.createMany({
    data,
    skipDuplicates: true,
  });
  console.log(`Quranic subjects done. Created ${result.count} entries.`);
};

// ========================================================
// SEED QURANIC PERIODS
// ========================================================
const quranicPeriods = [
  { quranic_period_name: "NURANI_MORNING", start_time: "7:01 AM", end_time: "7:50 AM" },
  { quranic_period_name: "HIFZ_MORNING", start_time: "6:01 AM", end_time: "7:50 AM" },
  { quranic_period_name: "ASSEMBLY", start_time: "7:51 AM", end_time: "8:00 AM" },
  { quranic_period_name: "ARABIC_LITERATURE", start_time: "10:16 AM", end_time: "11:15 AM" },
  { quranic_period_name: "ARABIC_LITERATURE_BOYS", start_time: "11:16 AM", end_time: "12:00 PM" },
  { quranic_period_name: "ARABIC_LITERATURE_HIGH", start_time: "11:46 AM", end_time: "12:15 PM" },
  { quranic_period_name: "QURANIC_EVENING", start_time: "3:01 PM", end_time: "5:00 PM" },
  { quranic_period_name: "HIFZ_NIGHT", start_time: "5:00 PM", end_time: "8:00 PM" },
  { quranic_period_name: "HIFZ_GIRLS", start_time: "08:01 AM", end_time: "09:00 AM" },
  { quranic_period_name: "ARABIC_LITERATURE_GIRLS", start_time: "09:01 AM", end_time: "09:45 AM" },
  { quranic_period_name: "NURANI_NAZERA_GIRLS", start_time: "9:46 AM", end_time: "10:30 AM" },
];

const seedQuranicPeriods = async () => {
  console.log("Seeding Quranic periods...");
  const result = await prisma.quranicPeriod.createMany({
    data: quranicPeriods,
    skipDuplicates: true,
  });
  console.log(`Quranic periods done. Created ${result.count} entries.`);
};

// ========================================================
// SEED PERIODS
// ========================================================
const periods = [
  { period_name: "1ST_PERIOD", start_time: "8:01 AM", end_time: "8:45 AM" },
  { period_name: "TIFFIN_PERIOD", start_time: "8:46 AM", end_time: "9:00 AM" },
  { period_name: "2ND_PERIOD", start_time: "9:01 AM", end_time: "9:45 AM" },
  { period_name: "3RD_PERIOD", start_time: "9:46 AM", end_time: "10:15 AM" },
  { period_name: "4TH_PERIOD", start_time: "10:16 AM", end_time: "10:45 AM" },
  { period_name: "5TH_PERIOD", start_time: "10:46 AM", end_time: "11:15 AM" },
  { period_name: "6TH_PERIOD", start_time: "11:16 AM", end_time: "11:45 AM" },
  { period_name: "1ST_PERIOD_GIRLS", start_time: "10:31 AM", end_time: "11:15 AM" },
  { period_name: "TIFFIN_PERIOD_GIRLS", start_time: "11:16 AM", end_time: "11:30 AM" },
  { period_name: "2ND_PERIOD_GIRLS", start_time: "11:31 AM", end_time: "12:15 PM" },
  { period_name: "3RD_PERIOD_GIRLS", start_time: "12:16 PM", end_time: "1:00 PM" },
  { period_name: "JOHR_SALAT_BREAK", start_time: "1:01 PM", end_time: "1:20 PM" },
  { period_name: "4TH_PERIOD_GIRLS", start_time: "1:21 PM", end_time: "1:50 PM" },
  { period_name: "5TH_PERIOD_GIRLS", start_time: "1:51 PM", end_time: "2:20 PM" },
  { period_name: "6TH_PERIOD_GIRLS", start_time: "2:20 PM", end_time: "2:50 PM" },
];

const seedPeriods = async () => {
  console.log("Seeding regular periods...");
  const result = await prisma.period.createMany({
    data: periods,
    skipDuplicates: true,
  });
  console.log(`Regular periods done. Created ${result.count} entries.`);
};

const subjects = [
  "BANGLA",
  "ENGLISH",
  "MATH",
  "QURAN",
  "ARABIC",
  "SPOKEN_ENGLISH",
  "HAND_WRITING",
  "BGS",
  "ICT",
  "ISLAMIC",
  "AQUA",
  "AGRICULTURE",
];

const seedSubjects = async () => {
  console.log("Seeding regular subjects...");
  const result = await prisma.subject.createMany({
    data: subjects.map((subject_name) => ({ subject_name })),
    skipDuplicates: true,
  });
  console.log(`Regular subjects done. Created ${result.count} entries.`);
};

// ========================================================
// INITIAL EXECUTION HANDLER
// ========================================================
export const runInitialOthers = async () => {
  await seedShifts();
  await seedClasses();
  await seedquranicSubjectes();
  await seedSubjects();
  await seedQuranicPeriods();
  await seedPeriods();
  console.log("Initial secondary seeds completed safely.");
};
