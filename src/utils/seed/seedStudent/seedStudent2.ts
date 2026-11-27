// ===================================================
// GRADE_TWO, GRADE_THREE, GRADE_FOUR
// ===================================================

import { prisma } from "../../../lib/prisma";
import { gradeFourStudent } from "./seedStudentGradeFourPayload";
import { gradeThreeStudent } from "./seedStudentGradeThreePayload";
import { gradeTwoStudent } from "./seedStudentGradeTwoPayload";
import { createStudent } from "./seedStudentHelperFunction";

// ===================================================
// create GradeTwoSchoolMdAbdullahAlJamil
// ===================================================
const createGradeTwoSchoolMdAbdullahAlJamil = async () => {
  const payload = await gradeTwoStudent.gradeTwoSchoolMdAbdullahAlJamil();
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
// create GradeTwoSchoolKaziRokeyaRaisa
// ===================================================
const createGradeTwoSchoolKaziRokeyaRaisa = async () => {
  const payload = await gradeTwoStudent.gradeTwoSchoolKaziRokeyaRaisa();
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
// create GradeTwoMadrashaSafwanMabrur
// ===================================================
const createGradeTwoMadrashaSafwanMabrur = async () => {
  const payload = await gradeTwoStudent.gradeTwoMadrashaSafwanMabrur();
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
// create GradeTwoMadrashaHaseenShadab
// ===================================================
const createGradeTwoMadrashaHaseenShadab = async () => {
  const payload = await gradeTwoStudent.gradeTwoMadrashaHaseenShadab();
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
// create GradeThreeSchoolMaimunaAkterTuba
// ===================================================
const createGradeThreeSchoolMaimunaAkterTuba = async () => {
  const payload = await gradeThreeStudent.gradeThreeSchoolMaimunaAkterTuba();
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
// create GradeThreeSchoolRaiyanSarker
// ===================================================
const createGradeThreeSchoolRaiyanSarker = async () => {
  const payload = await gradeThreeStudent.gradeThreeSchoolRaiyanSarker();
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
// create GradeThreeMadrashaMiftahulJannat
// ===================================================
const createGradeThreeMadrashaMiftahulJannat = async () => {
  const payload = await gradeThreeStudent.gradeThreeMadrashaMiftahulJannat();
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
// create GradeThreeMadrashaMohammadAlifHossain
// ===================================================
const createGradeThreeMadrashaMohammadAlifHossain = async () => {
  const payload = await gradeThreeStudent.gradeThreeMadrashaMohammadAlifHossain();
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
// create GradeFourSchoolAdnanSamiRizwan
// ===================================================
const createGradeFourSchoolAdnanSamiRizwan = async () => {
  const payload = await gradeFourStudent.gradeFourSchoolAdnanSamiRizwan();
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
// create GradeFourSchoolMufidulIslam
// ===================================================
const createGradeFourSchoolMufidulIslam = async () => {
  const payload = await gradeFourStudent.gradeFourSchoolMufidulIslam();
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
// create GradeFourSchoolRuheeSiddique
// ===================================================
const createGradeFourSchoolRuheeSiddique = async () => {
  const payload = await gradeFourStudent.gradeFourMadrashaRuheeSiddique();
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
// create GradeFourMadrashaAtaurRahman
// ===================================================
const createGradeFourMadrashaAtaurRahman = async () => {
  const payload = await gradeFourStudent.gradeFourMadrashaAtaurRahman();
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
// GRADE_TWO, GRADE_THREE, GRADE_FOUR
// ===================================================
// SEED STUDENTS 2
// ===================================================
export const runStudent2Seeding = async () => {
  // Grade two
  await createGradeTwoSchoolMdAbdullahAlJamil();
  await createGradeTwoSchoolKaziRokeyaRaisa();
  await createGradeTwoMadrashaSafwanMabrur();
  await createGradeTwoMadrashaHaseenShadab();
  // Grade three
  await createGradeThreeSchoolMaimunaAkterTuba();
  await createGradeThreeSchoolRaiyanSarker();
  await createGradeThreeMadrashaMiftahulJannat();
  await createGradeThreeMadrashaMohammadAlifHossain();
  // Grade Four
  await createGradeFourSchoolAdnanSamiRizwan();
  await createGradeFourSchoolMufidulIslam();
  await createGradeFourSchoolRuheeSiddique();
  await createGradeFourMadrashaAtaurRahman();
};
