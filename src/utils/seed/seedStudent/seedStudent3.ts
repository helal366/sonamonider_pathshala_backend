// ===================================================
// GRADE_FIVE, GRADE_SIX, GRADE_EIGHT
// ===================================================
import { prisma } from "../../../lib/prisma";
import { gradeFiveStudent } from "./seedStudentGradeFivePayload";
import { gradeEightStudent } from "./seedStudentGradeEightPayload";
import { gradeSixStudent } from "./seedStudentGradeSixPayload";
import { createStudent } from "./seedStudentHelperFunction";

// ===================================================
// create GradeFiveSchoolAlFattahArabi
// ===================================================
const createGradeFiveSchoolAlFattahArabi = async () => {
  const payload = await gradeFiveStudent.gradeFiveSchoolAlFattahArabi();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: {id: true}
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeFiveSchoolAyanBinJamil
// ===================================================
const createGradeFiveSchoolAyanBinJamil = async () => {
  const payload = await gradeFiveStudent.gradeFiveMadrashaAyanBinJamil();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: {id: true}
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeFiveSchoolAsiyaAkterJui
// ===================================================
const createGradeFiveSchoolAsiyaAkterJui = async () => {
  const payload = await gradeFiveStudent.gradeFiveSchoolAsiyaAkterJui();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: {id: true}
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeFiveMadrashaSumayaAkter
// ===================================================
const createGradeFiveMadrashaSumayaAkter = async () => {
  const payload = await gradeFiveStudent.gradeFiveMadrashaSumayaAkter();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: { id: true },
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeSixSchoolArnobHossain
// ===================================================
const createGradeSixSchoolArnobHossain = async () => {
  const payload = await gradeSixStudent.gradeSixSchoolArnobHossain();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: { id: true },
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeSixSchoolMdNadimKhan
// ===================================================
const createGradeSixSchoolMdNadimKhan = async () => {
  const payload = await gradeSixStudent.gradeSixSchoolMdNadimKhan();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: { id: true },
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeSixSchoolSaymaRahmanAmirah
// ===================================================
const createGradeSixSchoolSaymaRahmanAmirah = async () => {
  const payload = await gradeSixStudent.gradeSixSchoolSaymaRahmanAmirah();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: { id: true },
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeSixMadrashaSarminAkterSanjeda
// ===================================================
const createGradeSixMadrashaSarminAkterSanjeda = async () => {
  const payload = await gradeSixStudent.gradeSixMadrashaSarminAkterSanjeda();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: { id: true },
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeEightMadrashaSazzadHossain
// ===================================================
const createGradeEightMadrashaSazzadHossain = async () => {
  const payload = await gradeEightStudent.gradeEightMadrashaSazzadHossain();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: { id: true },
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeEightMadrashaAbdullahAlFahmi
// ===================================================
const createGradeEightMadrashaAbdullahAlFahmi = async () => {
  const payload = await gradeEightStudent.gradeEightMadrashaAbdullahAlFahmi();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: { id: true },
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// create GradeEightSchoolJannatulFerdous
// ===================================================
const createGradeEightSchoolJannatulFerdous = async () => {
  const payload = await gradeEightStudent.gradeEightSchoolJannatulFerdous();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
    select: { id: true },
  });
  if (!existing) {
    await createStudent(payload);
    console.log(
      `Student ${full_name} created with Section: ${section} Shift: ${shift_name}`,
    );
  } else if (existing) {
    console.log(
      `Student ${full_name} with Section: ${section} Shift: ${shift_name} already exists.`,
    );
  }
};

// ===================================================
// GRADE_FIVE, GRADE_SIX, GRADE_EIGHT
// ===================================================
// SEED STUDENTS 2
// ===================================================
export const runStudent3Seeding = async () => {
  // Grade five
  await createGradeFiveSchoolAlFattahArabi();
  await createGradeFiveSchoolAyanBinJamil();
  await createGradeFiveSchoolAsiyaAkterJui();
  await createGradeFiveMadrashaSumayaAkter();
  // Grade six
  await createGradeSixSchoolArnobHossain();
  await createGradeSixSchoolMdNadimKhan();
  await createGradeSixSchoolSaymaRahmanAmirah();
  await createGradeSixMadrashaSarminAkterSanjeda();
  // Grade eight
  await createGradeEightMadrashaSazzadHossain();
  await createGradeEightMadrashaAbdullahAlFahmi();
  await createGradeEightSchoolJannatulFerdous();
};