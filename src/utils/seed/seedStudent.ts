import { Gender, Role } from "#db-client";
import { prisma } from "../../lib/prisma";
// Seed Academic Years
const academicYears = ["2020","2021","2022","2023","2024","2025", "2026", "2027"];
const seedAcademicYears = async()=>{
    console.log("Seeding years...");
    const dataToInsert = academicYears.map((year)=> ({
        academic_year_name: year
    }));
    const result =await prisma.academicYear.createMany({
        data: dataToInsert,
        skipDuplicates: true
    });
    console.log(`Academic years seeding done. Created ${result.count} new academic years.`);
};

// Seed Quranic Subjects
const quranicSubjects = [
"NURANI_PLAYGROUP",
"NURANI_NURSERY",
"NURANI_PRELIMINARY",
"NURANI_AMMAPARA",
"NURANI_ADVANCE",
"NAZERA_PRELIMINARY",
"NAZERA_AMMAPARA",
"NAZERA_ADVANCE",
"PRE_HIFZ",
"HIFZ",
];
const seedQuranicSubjects = async()=>{
    console.log("Seeding quranic subjects...");
    const dataToInsert = quranicSubjects.map((qs)=>({
        quranic_subject_name: qs
    }));
    const result = await prisma.quranicSubject.createMany({
        data: dataToInsert,
        skipDuplicates: true
    });
    console.log(`Quranic subjects seeding done. Created ${result.count} new quranic subjects.`);
};

// Seed Arabic Subjects
const arabicSubjects = [
    
];
interface ICreateSeedStudentPayload {
  full_name: string;
  mobile_number: string;
  email: string;
  gender: Gender;
  user_name: string;
  hashedPassword: string;
  joining_date: Date;
  current_role: Role;
  position_name: string;
  class_name: string;
};

export const seedInitialStudents = async()=>{
    await seedAcademicYears();
    await seedQuranicSubjects();
}