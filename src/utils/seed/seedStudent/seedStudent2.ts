// ===================================================
// GRADE_TWO, GRADE_THREE, GRADE_FOUR
// ===================================================

import { prisma } from "../../../lib/prisma";
import { gradeThreeStudent } from "./seedStudentGradeThreePayload";
import { gradeTwoStudent } from "./seedStudentGradeTwoPayload";
import { createStudent } from "./seedStudentHelperFunction";

// ===================================================
// create GradeOneSchoolMdAbdullahAlJamil
// ===================================================
const createGradeOneSchoolMdAbdullahAlJamil = async () => {
  const payload = await gradeTwoStudent.gradeTwoSchoolMdAbdullahAlJamil();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
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
// create GradeTwoMadrashaHaseenShadeb
// ===================================================
const createGradeTwoMadrashaHaseenShadeb = async () => {
  const payload = await gradeTwoStudent.gradeTwoMadrashaHaseenShadeb();
  const { full_name, mobile_number, section, shift_name } = payload;
  const existing = await prisma.student.findFirst({
    where: {
      user_primary_data: {
        full_name,
        mobile_number,
      },
    },
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
  await createGradeOneSchoolMdAbdullahAlJamil();
  await createGradeTwoSchoolKaziRokeyaRaisa();
  await createGradeTwoMadrashaSafwanMabrur();
  await createGradeTwoMadrashaHaseenShadeb();
  await createGradeThreeSchoolMaimunaAkterTuba();
  await createGradeThreeSchoolRaiyanSarker();
  await createGradeThreeMadrashaMiftahulJannat();
};
