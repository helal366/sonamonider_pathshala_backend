import { Section, Version } from "#db-client";

const standardMonthlyTuitionFeeRate = [
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2000,
    class_names: ["PLAYGROUP"],
    class_ids: [""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },

  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2500,
    class_names: ["NURSERY", "KINDERGARTEN", "GRADE_ONE", "GRADE_TWO"],
    class_ids: ["", "", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2700,
    class_names: ["GRADE_THREE", "GRADE_FOUR", "GRADE_FIVE"],
    class_ids: ["", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 3000,
    class_names: ["GRADE_SIX", "GRADE_SEVEN", "GRADE_EIGHT"],
    class_ids: ["", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 3500,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    class_ids: ["", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
    department: "SCIENCE",
  },
  {
    fee_type: "MONTHLY_TUITION_FEE",
    billing_frequency: "MONTHLY",
    amount: 3200,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    class_ids: ["", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
    department: {
      in: ["ARTS", "COMMERCE"], // Matches either department
    },
  },
];
const standardsessionFeeRate = [
  {
    fee_type: "SESSION_FEE",
    billing_frequency: "YEARLY",
    amount: 5000,
    class_names: ["PLAYGROUP"],
    class_ids: [""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
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
    class_ids: ["", "", "", "", "", "", "", "", "", "", "", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
];
const standardMonthlyAcademicEvaluationFeeRate = [
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 1000,
    class_names: ["PLAYGROUP"],
    class_ids: [""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 1200,
    class_names: ["NURSERY", "KINDERGARTEN", "GRADE_ONE", "GRADE_TWO"],
    class_ids: ["", "", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 1500,
    class_names: ["GRADE_THREE", "GRADE_FOUR", "GRADE_FIVE"],
    class_ids: ["", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2000,
    class_names: ["GRADE_SIX", "GRADE_SEVEN", "GRADE_EIGHT"],
    class_ids: ["", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2500,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    class_ids: ["", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
    department: "SCIENCE",
  },
  {
    fee_type: "MONTHLY_ACADEMIC_EVALUATION_FEE",
    billing_frequency: "MONTHLY",
    amount: 2000,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    class_ids: ["", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
    department: {
      in: ["ARTS", "COMMERCE"], // Matches either department
    },
  },
];

const standardLaboratoryLibraryFeeRate = [
  {
    fee_type: "LABORATORY_LIBRARY_FEE",
    billing_frequency: "YEARLY",
    amount: 500,
    class_names: ["GRADE_SIX", "GRADE_SEVEN", "GRADE_EIGHT"],
    class_ids: ["", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
  {
    fee_type: "LABORATORY_LIBRARY_FEE",
    billing_frequency: "YEARLY",
    amount: 1000,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    class_ids: ["", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
    department: "SCIENCE",
  },
  {
    fee_type: "LABORATORY_LIBRARY_FEE",
    billing_frequency: "YEARLY",
    amount: 500,
    class_names: ["GRADE_NINE", "GRADE_TEN"],
    class_ids: ["", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
    department: {
      in: ["ARTS", "COMMERCE"],
    },
  },
];

const standardExamFeeRate = [
  {
    fee_type: {
      in: ["HALF_YEARLY_EXAM_FEE", "ANNUAL_EXAM_FEE"],
    },
    billing_frequency: "HALF_YEARLY",
    amount: 500,
    class_names: ["PLAYGROUP", "NURSERY", "KINDERGARTEN"],
    class_ids: ["", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
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
    class_ids: ["", "", "", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
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
    class_ids: ["", "", "", "", ""],
    version: "BANGLA",
    section: {
        in: ["MADRASHA", "SCHOOL",]
    }, 
  },
];
