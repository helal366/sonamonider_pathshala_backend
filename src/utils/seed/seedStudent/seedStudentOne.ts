import { prisma } from "../../../lib/prisma";
import { gradeOneStudent } from "./seedStudentGradeOnePayload";
import { createStudent } from "./seedStudentHelperFunction";
import { nurserStudent } from "./seedStudentNurseryPayload";
import { playgroupStudent } from "./seedStudentPlaygroupPayload";

// ===================================================
// PLAYGROUP, NURSERY, GRADE_ONE
// ===================================================

// ===================================================
// create PlaygroupSchoolMuhsinaHasanMahima
// ===================================================
const createPlaygroupSchoolMuhsinaHasanMahima = async () => {
  const payload = await playgroupStudent.playgroupSchoolMuhsinaHasanMahima();
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
// create playgroupSchoolKurratulAyinBarakah
// ===================================================
const createPlaygroupSchoolKurratulAyinBarakah = async () => {
  const payload = await playgroupStudent.playgroupSchoolKurratulAyinBarakah();
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
// create PlaygroupMadrashaMohammadMostofa
// ===================================================
const createPlaygroupMadrashaMohammadMostofa = async () => {
  const payload = await playgroupStudent.playgroupMadrashaMohammadMostofa();
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
// create PlaygroupMadrashaTahmidHossainBayejid
// ===================================================
const createPlaygroupMadrashaTahmidHossainBayejid = async () => {
  const payload =
    await playgroupStudent.playgroupMadrashaTahmidHossainBayejid();
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
// create NurserySchoolMaryamBari
// ===================================================
const createNurserySchoolMaryamBari = async () => {
  const payload = await nurserStudent.nurserySchoolMaryamBari();
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
// create NurserySchoolAfrahaRahman
// ===================================================
const createNurserySchoolAfrahaRahman = async () => {
  const payload = await nurserStudent.nurserySchoolAfrahaRahman();
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
// create NurseryMadrashaRumaisaReza
// ===================================================
const createNurseryMadrashaRumaisaReza = async () => {
  const payload = await nurserStudent.nurseryMadrashaRumaisaReza();
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
// create NurseryMadrashaAhnafTahmid
// ===================================================
const createNurseryMadrashaAhnafTahmid = async () => {
  const payload = await nurserStudent.nurseryMadrashaAhnafTahmid();
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
// create GradeOneSchoolShefaAkter
// ===================================================
const createGradeOneSchoolShefaAkter = async () => {
  const payload = await gradeOneStudent.gradeOneSchoolShefaAkter();
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
// create GradeOneSchoolMinhaHasanSafa
// ===================================================
const createGradeOneSchoolMinhaHasanSafa = async () => {
  const payload = await gradeOneStudent.gradeOneSchoolMinhaHasanSafa();
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
// create GradeOneMadrashaMdRayhan
// ===================================================
const createGradeOneMadrashaMdRayhan = async () => {
  const payload = await gradeOneStudent.gradeOneMadrashaMdRayhan();
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
// create GradeOneMadrashaTasnimIslamPori
// ===================================================
const createGradeOneMadrashaTasnimIslamPori = async () => {
  const payload = await gradeOneStudent.gradeOneMadrashaTasnimIslamPori();
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
// PLAYGROUP, NURSERY, GRADE_ONE
// ===================================================
// SEED INITIAL STUDENTS ONE
// ===================================================
export const runStudentOneSeeding = async () => {
  await createPlaygroupSchoolMuhsinaHasanMahima();
  await createPlaygroupSchoolKurratulAyinBarakah();
  await createPlaygroupMadrashaMohammadMostofa();
  await createPlaygroupMadrashaTahmidHossainBayejid();
  await createNurserySchoolMaryamBari();
  await createNurserySchoolAfrahaRahman();
  await createNurseryMadrashaRumaisaReza();
  await createNurseryMadrashaAhnafTahmid();
  await createGradeOneSchoolShefaAkter();
  await createGradeOneSchoolMinhaHasanSafa();
  await createGradeOneMadrashaMdRayhan();
  await createGradeOneMadrashaTasnimIslamPori();
};
