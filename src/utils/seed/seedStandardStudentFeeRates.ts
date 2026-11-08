import { randomUUID } from "node:crypto";
import {
  BillingFrequency,
  Department,
  Section,
  StudentFeeType,
  Version,
} from "#db-client";
import { prisma } from "../../lib/prisma";

type SeedRate = {
  fee_type: StudentFeeType | { in: StudentFeeType[] };
  billing_frequency: BillingFrequency;
  amount: number;
  class_names: string[];
  version: Version;
  section: Section | { in: Section[] };
  department?: Department | { in: Department[] };
  ic_registration_fee?: number;
  ic_duration_hrs?: number;
  qc_duration_hrs?: number;
};

const defineRates = (rates: SeedRate[]) => rates;

const standardMonthlyTuitionFeeRate = defineRates([
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2000,
    class_names: ["PLAYGROUP"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },

  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2500,
    class_names: ["NURSERY", "KINDERGARTEN", "GRADE_ONE", "GRADE_TWO"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2700,
    class_names: ["GRADE_THREE", "GRADE_FOUR", "GRADE_FIVE"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 3000,
    class_names: ["GRADE_SIX", "GRADE_SEVEN", "GRADE_EIGHT"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 3500,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: "SCIENCE",
  },
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 3200,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: {
      in: ["ARTS", "COMMERCE"], // Matches either department
    },
  },
]);

const standardsessionFeeRate = defineRates([
  {
    fee_type: "SESSION_FEE",
    billing_frequency: "YEARLY",
    amount: 5000,
    class_names: ["PLAYGROUP"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "SESSION_FEE",
    billing_frequency: "YEARLY",
    amount: 10000,
    class_names: [
      "NURSERY",
      "KINDERGARTEN",
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardIdCardSheetSuggestionSyllabusFeeRate = defineRates([
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 1000,
    class_names: ["PLAYGROUP"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 1200,
    class_names: ["NURSERY", "KINDERGARTEN", "GRADE_ONE", "GRADE_TWO"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 1500,
    class_names: ["GRADE_THREE", "GRADE_FOUR", "GRADE_FIVE"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2000,
    class_names: ["GRADE_SIX", "GRADE_SEVEN", "GRADE_EIGHT"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2500,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: "SCIENCE",
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2000,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: {
      in: ["ARTS", "COMMERCE"], // Matches either department
    },
  },
]);

const standardLaboratoryLibraryFeeRate = defineRates([
  {
    fee_type: "LABORATORY_LIBRARY_FEE",
    billing_frequency: "YEARLY",
    amount: 500,
    class_names: ["GRADE_SIX", "GRADE_SEVEN", "GRADE_EIGHT"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "LABORATORY_LIBRARY_FEE",
    billing_frequency: "YEARLY",
    amount: 1000,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: "SCIENCE",
  },
  {
    fee_type: "LABORATORY_LIBRARY_FEE",
    billing_frequency: "YEARLY",
    amount: 500,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: {
      in: ["ARTS", "COMMERCE"],
    },
  },
]);

const standardExamFeeRate = defineRates([
  {
    fee_type: {
      in: ["HALF_YEARLY_EXAM_FEE", "ANNUAL_EXAM_FEE"],
    },
    billing_frequency: "YEARLY",
    amount: 500,
    class_names: ["PLAYGROUP", "NURSERY", "KINDERGARTEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: {
      in: ["HALF_YEARLY_EXAM_FEE", "ANNUAL_EXAM_FEE"],
    },
    billing_frequency: "HALF_YEARLY",
    amount: 700,
    class_names: [
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: {
      in: ["HALF_YEARLY_EXAM_FEE", "ANNUAL_EXAM_FEE"],
    },
    billing_frequency: "HALF_YEARLY",
    amount: 900,
    class_names: [
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardIntensiveCareFeeRate = defineRates([
  {
    fee_type: "INTENSIVE_CARE_FEE",
    billing_frequency: "MONTHLY",
    ic_duration_hrs: 2.0,
    amount: 1000,
    ic_registration_fee: 500,
    class_names: ["GRADE_ONE", "GRADE_TWO"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "INTENSIVE_CARE_FEE",
    billing_frequency: "MONTHLY",
    ic_duration_hrs: 2.0,
    amount: 1200,
    ic_registration_fee: 500,
    class_names: ["GRADE_THREE", "GRADE_FOUR"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "INTENSIVE_CARE_FEE",
    billing_frequency: "MONTHLY",
    ic_duration_hrs: 3.0,
    amount: 1500,
    ic_registration_fee: 500,
    class_names: ["GRADE_FIVE", "GRADE_SIX", "GRADE_SEVEN", "GRADE_EIGHT"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "INTENSIVE_CARE_FEE",
    billing_frequency: "MONTHLY",
    ic_duration_hrs: 4.0,
    amount: 2500,
    ic_registration_fee: 500,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: "SCIENCE",
  },
  {
    fee_type: "INTENSIVE_CARE_FEE",
    billing_frequency: "MONTHLY",
    ic_duration_hrs: 3.0,
    amount: 2000,
    ic_registration_fee: 500,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: {
      in: ["ARTS", "COMMERCE"],
    },
  },
]);

const standardQuranicEveningFeeRate = defineRates([
  {
    fee_type: "QURAN_EVENING_MONTHLY_FEE",
    billing_frequency: "MONTHLY",
    amount: 1000,
    qc_duration_hrs: 2.0,
    class_names: [
      "PLAYGROUP",
      "NURSERY",
      "KINDERGARTEN",
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardQuranicNightFeeRate = defineRates([
  {
    fee_type: "QURAN_NIGHT_MONTHLY_FEE",
    billing_frequency: "MONTHLY",
    amount: 1000,
    qc_duration_hrs: 2.0,
    class_names: [
      "PLAYGROUP",
      "NURSERY",
      "KINDERGARTEN",
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardTransferCertificateFeeRate = defineRates([
  {
    fee_type: "TRANSFER_CERTIFICATION_FEE",
    billing_frequency: "ONE_TIME",
    amount: 500,
    class_names: [
      "PLAYGROUP",
      "NURSERY",
      "KINDERGARTEN",
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardOtherCertificateFeeRate = defineRates([
  {
    fee_type: "OTHER_CERTIFICATE_FEE",
    billing_frequency: "ONE_TIME",
    amount: 300,
    class_names: [
      "PLAYGROUP",
      "NURSERY",
      "KINDERGARTEN",
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardResidentialFeeRate = defineRates([
  {
    fee_type: "RESIDENTIAL_FEE",
    billing_frequency: "MONTHLY",
    amount: 6500,
    class_names: [
      "PLAYGROUP",
      "NURSERY",
      "KINDERGARTEN",
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardAdmissionFeeRate = defineRates([
  {
    fee_type: "ADMISSION_FEE",
    billing_frequency: "YEARLY",
    amount: 5000,
    class_names: [
      "PLAYGROUP",
      "NURSERY",
      "KINDERGARTEN",
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardDayCareFeeRate = defineRates([
  {
    fee_type: "DAYCARE_FEE",
    billing_frequency: "MONTHLY",
    amount: 5500,
    class_names: [
      "PLAYGROUP",
      "NURSERY",
      "KINDERGARTEN",
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardEstablishmentFeeRate = defineRates([
  {
    fee_type: "ESTABLISHMENT_FEE",
    billing_frequency: "ONE_TIME",
    amount: 5000,
    class_names: [
      "PLAYGROUP",
      "NURSERY",
      "KINDERGARTEN",
      "GRADE_ONE",
      "GRADE_TWO",
      "GRADE_THREE",
      "GRADE_FOUR",
      "GRADE_FIVE",
      "GRADE_SIX",
      "GRADE_SEVEN",
      "GRADE_EIGHT",
      "GRADE_NINE",
      "GRADE_TEN",
    ],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
]);

const standardMonthlyAcademicEvaluationFeeRate = defineRates([
  {
    fee_type: "ID_CARD_SHEET_SUGGESTION_SYLLABUS_FEE",
    billing_frequency: "MONTHLY",
    amount: 1000,
    class_names: ["PLAYGROUP"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "ID_CARD_SHEET_SUGGESTION_SYLLABUS_FEE",
    billing_frequency: "MONTHLY",
    amount: 1200,
    class_names: ["NURSERY", "KINDERGARTEN", "GRADE_ONE", "GRADE_TWO"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "ID_CARD_SHEET_SUGGESTION_SYLLABUS_FEE",
    billing_frequency: "MONTHLY",
    amount: 1500,
    class_names: ["GRADE_THREE", "GRADE_FOUR", "GRADE_FIVE"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "ID_CARD_SHEET_SUGGESTION_SYLLABUS_FEE",
    billing_frequency: "MONTHLY",
    amount: 2000,
    class_names: ["GRADE_SIX", "GRADE_SEVEN", "GRADE_EIGHT"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
  },
  {
    fee_type: "ID_CARD_SHEET_SUGGESTION_SYLLABUS_FEE",
    billing_frequency: "MONTHLY",
    amount: 2500,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: "SCIENCE",
  },
  {
    fee_type: "ID_CARD_SHEET_SUGGESTION_SYLLABUS_FEE",
    billing_frequency: "MONTHLY",
    amount: 2000,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    version: "BENGALI",
    section: {
      in: ["MADRASHA", "SCHOOL"],
    },
    department: {
      in: ["ARTS", "COMMERCE"], // Matches either department
    },
  },
]);

const expandSelection = <T>(selection: T | { in: T[] }): T[] => {
  if (
    typeof selection === "object" &&
    selection !== null &&
    "in" in selection
  ) {
    return selection.in;
  }
  return [selection as T];
};

const getRateKey = (rate: {
  fee_type: StudentFeeType;
  billing_frequency: BillingFrequency;
  amount: number | { toString(): string };
  ic_registration_fee?: number | { toString(): string } | null;
  ic_duration_hrs?: number | { toString(): string } | null;
  qc_duration_hrs?: number | { toString(): string } | null;
  section: Section;
  version: Version;
  department: Department | null;
  class_ids: string[];
}) =>
  JSON.stringify([
    rate.fee_type,
    rate.billing_frequency,
    Number(rate.amount),
    rate.ic_registration_fee == null
      ? null
      : Number(rate.ic_registration_fee),
    rate.ic_duration_hrs == null ? null : Number(rate.ic_duration_hrs),
    rate.qc_duration_hrs == null ? null : Number(rate.qc_duration_hrs),
    rate.section,
    rate.version,
    rate.department,
    [...rate.class_ids].sort(),
  ]);

export const runStandardStudentFeeRateSeed = async () => {
  const classes = await prisma.class.findMany({
    select: { id: true, class_name: true },
  });
  const classIdByName = new Map(
    classes.map(({ id, class_name }) => [class_name, id]),
  );

  const rateGroups = [
    ...standardMonthlyTuitionFeeRate,
    ...standardsessionFeeRate,
    ...standardMonthlyAcademicEvaluationFeeRate,
    ...standardLaboratoryLibraryFeeRate,
    ...standardExamFeeRate,
    ...standardIntensiveCareFeeRate,
    ...standardQuranicEveningFeeRate,
    ...standardQuranicNightFeeRate,
    ...standardTransferCertificateFeeRate,
    ...standardOtherCertificateFeeRate,
    ...standardResidentialFeeRate,
    ...standardAdmissionFeeRate,
    ...standardDayCareFeeRate,
    ...standardEstablishmentFeeRate,
    ...standardIdCardSheetSuggestionSyllabusFeeRate,
  ];

  let createdCount = 0;
  let skippedCount = 0;
  const existingRates = await prisma.standardStudentFeeRate.findMany({
    include: {
      assigned_classes: { select: { class_id: true } },
    },
  });
  const existingRateKeys = new Set(
    existingRates.map((rate) =>
      getRateKey({
        ...rate,
        class_ids: rate.assigned_classes.map(({ class_id }) => class_id),
      }),
    ),
  );
  const ratesToCreate: {
    id: string;
    fee_type: StudentFeeType;
    billing_frequency: BillingFrequency;
    amount: number;
    ic_registration_fee?: number;
    ic_duration_hrs?: number;
    qc_duration_hrs?: number;
    section: Section;
    version: Version;
    department: Department | null;
  }[] = [];
  const classAssociationsToCreate: {
    class_id: string;
    standard_student_fee_rate_id: string;
  }[] = [];

  for (const rate of rateGroups) {
    const classIds = rate.class_names.map((className) => {
      const classId = classIdByName.get(className);
      if (!classId) {
        throw new Error(
          `Class not found while seeding fee rates: ${className}`,
        );
      }
      return classId;
    });

    const feeTypes = expandSelection(rate.fee_type);
    const sections = expandSelection(rate.section);
    const departments =
      rate.department === undefined
        ? [null]
        : expandSelection(rate.department);

    for (const feeType of feeTypes) {
      for (const section of sections) {
        for (const department of departments) {
          const rateKey = getRateKey({
            fee_type: feeType,
            billing_frequency: rate.billing_frequency,
            amount: rate.amount,
            ic_registration_fee: rate.ic_registration_fee,
            ic_duration_hrs: rate.ic_duration_hrs,
            qc_duration_hrs: rate.qc_duration_hrs,
            section,
            version: rate.version,
            department,
            class_ids: classIds,
          });
          if (existingRateKeys.has(rateKey)) {
            skippedCount += 1;
            continue;
          }

          const id = randomUUID();
          ratesToCreate.push({
            id,
            fee_type: feeType,
            billing_frequency: rate.billing_frequency,
            amount: rate.amount,
            ic_registration_fee: rate.ic_registration_fee,
            ic_duration_hrs: rate.ic_duration_hrs,
            qc_duration_hrs: rate.qc_duration_hrs,
            section,
            version: rate.version,
            department,
          });
          classAssociationsToCreate.push(
            ...classIds.map((class_id) => ({
              class_id,
              standard_student_fee_rate_id: id,
            })),
          );
          existingRateKeys.add(rateKey);
          createdCount += 1;
        }
      }
    }
  }

  if (ratesToCreate.length > 0) {
    await prisma.$transaction([
      prisma.standardStudentFeeRate.createMany({ data: ratesToCreate }),
      prisma.classStandardStudentFeeRate.createMany({
        data: classAssociationsToCreate,
      }),
    ]);
  }

  console.log(
    `Standard student fee rates seeded. Created ${createdCount} entries; skipped ${skippedCount} existing entries.`,
  );
};
