// ===================================================
// GRADE_TWO, GRADE_THREE, GRADE_FOUR
// ===================================================

import { prisma } from "../../../lib/prisma";
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
// GRADE_TWO, GRADE_THREE, GRADE_FOUR
// ===================================================
// SEED INITIAL STUDENTS ONE
// ===================================================
export const runStudentTwoSeeding = async () => {
    await createGradeOneSchoolMdAbdullahAlJamil();
    await createGradeTwoSchoolKaziRokeyaRaisa();
};