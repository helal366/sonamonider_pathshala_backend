import { ExamSubjectName, Prisma, Section, Version } from "#db-client";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../../helperFunctions/globalError/globalErrorHelperFunction";
import { prisma } from "../../lib/prisma";

const classIdCache = new Map<string, Promise<string>>();
type SeedBook = Omit<
  Prisma.BooklistCreateManyInput,
  "class_id" | "class_name" | "version" | "section"
>;
type SeedBookList = (Omit<Prisma.BooklistCreateManyInput, "class_id"> & {
  class_name: string;
})[];

const defineBookList = (
  class_name: string,
  section: Section,
  books: SeedBook[],
): SeedBookList =>
  books.map((book) => ({
    ...book,
    class_name,
    version: Version.BENGALI,
    section,
  }));

const getClassId = (className: string): Promise<string> => {
  const cachedClassId = classIdCache.get(className);
  if (cachedClassId) {
    return cachedClassId;
  }

  const classId = prisma.class
    .findUnique({
      where: { class_name: className },
      select: { id: true },
    })
    .then((classExists) => {
      if (!classExists) {
        throw new AppError("Class not found.", StatusCodes.NOT_FOUND);
      }

      return classExists.id;
    });

  classIdCache.set(className, classId);
  return classId;
};

const createBookList = async (books: SeedBookList) => {
  const data = await Promise.all(
    books.map(async ({ class_name, ...book }) => ({
      ...book,
      class_id: await getClassId(class_name),
    })),
  );

  return prisma.booklist.createMany({
    data,
    skipDuplicates: true,
  });
};

const bookListPlaygroupSchool = defineBookList("PLAYGROUP", Section.SCHOOL, [
  {
    book_name: "My 1st Step ABC Alphabet",
    publisher: "Nabarun Publications",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "My Handwriting (Book -I)",
    publisher: "Adeline Malakar",
    isBookMain: false,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "Spoken English Work Book - 0",
    publisher: "Standard/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "Success Math's With Ahead - A",
    publisher: "Orient Black Swan/World Book",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "How to Draw and Colour - A",
    publisher: "Nabarun Publications",
    isBookMain: false,
  },
  {
    book_name: "ছবি দেখে গোনা ও লেখা শেখা - ১",
    publisher: "Samia/(Rakib)",
    isBookMain: false,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "আমার বর্ণমালা B - I",
    publisher: "Read Publications - (Savar)",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "এসো লেখা শিখি - ১",
    publisher: "এডলিন মালাকার",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "কায়দা - তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন - Uttara",
    isBookMain: false,
  },
  {
    book_name: "এসো জীবন গড়ি-১",
    publisher: "এডুকেয়ার",
    isBookMain: false,
  },
]);
const bookListPlaygroupMadrasha = defineBookList(
  "PLAYGROUP",
  Section.MADRASHA,
  [
    {
      book_name: "My 1st Step ABC Alphabet",
      publisher: "Nabarun Publications",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH,
    },
    {
      book_name: "My Handwriting (Book -I)",
      publisher: "Adeline Malakar",
      isBookMain: false,
      subject_group: ExamSubjectName.ENGLISH,
    },
    {
      book_name: "Spoken English Work Book - 0",
      publisher: "Standard/(Metro)",
      isBookMain: false,
    },
    {
      book_name: "Success Math's With Ahead - A",
      publisher: "Orient Black Swan/World Book",
      isBookMain: true,
      subject_group: ExamSubjectName.MATHEMATICS,
    },
    {
      book_name: "Teaching of Islam - A",
      publisher: "Nabarun Publications",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC,
    },
    {
      book_name: "How to Draw and Colour - A",
      publisher: "Nabarun Publications",
      isBookMain: false,
    },
    {
      book_name: "ছবি দেখে গোনা ও লেখা শেখা - ১",
      publisher: "Samia/(Rakib)",
      isBookMain: false,
      subject_group: ExamSubjectName.MATHEMATICS,
    },
    {
      book_name: "আমার বর্ণমালা B - I",
      publisher: "Read Publications - (Savar)",
      isBookMain: true,
      subject_group: ExamSubjectName.BENGALI,
    },
    {
      book_name: "এসো লেখা শিখি - ১",
      publisher: "এডলিন মালাকার",
      isBookMain: false,
      subject_group: ExamSubjectName.BENGALI,
    },
    {
      book_name: "কায়দা - তাজবীদুল কুরআন",
      publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন - Uttara",
      isBookMain: false,
    },
    {
      book_name: "এসো জীবন গড়ি-১",
      publisher: "এডুকেয়ার",
      isBookMain: false,
    },
  ],
);
const bookListNurserySchool = defineBookList("NURSERY", Section.SCHOOL, [
  {
    book_name: "Child's First Step Picture ABC",
    publisher: "The Orient/(Nabarun)",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "My Handwriting (Book -II)",
    publisher: "Adeline Malakar",
    isBookMain: false,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "Spoken English Work Book - 0",
    publisher: "Standard/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "Success Math's With Ahead - B",
    publisher: "Orient Black Swan/World Book",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "How to Draw and Colour - B",
    publisher: "Nabarun",
    isBookMain: false,
  },
  {
    book_name: "ছবি দেখে গোনা ও লেখা শেখা - ২",
    publisher: "Samina/(Rakib)",
    isBookMain: false,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "আমার সহজ বাংলা পড়া B-2",
    publisher: "Read Publications- (Savar)",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "এসো লেখা শিখি-২",
    publisher: "এডলিন মালাকার",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "কায়দা- তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন/(Uttara)",
    isBookMain: false,
  },
  {
    book_name: "এসো জীবন গড়ি- ১",
    publisher: "এডুকেয়ার",
    isBookMain: false,
  },
]);
const bookListNurseryMadrasha = defineBookList("NURSERY", Section.MADRASHA, [
  {
    book_name: "Child's First Step Picture ABC",
    publisher: "The Orient/(Nabarun)",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "My Handwriting (Book -II)",
    publisher: "Adeline Malakar",
    isBookMain: false,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "Spoken English Work Book - 0",
    publisher: "Standard/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "Success Math's With Ahead - B",
    publisher: "Orient Black Swan/World Book",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "How to Draw and Colour - B",
    publisher: "Nabarun",
    isBookMain: false,
  },
  {
    book_name: "ছবি দেখে গোনা ও লেখা শেখা - ২",
    publisher: "Samina/(Rakib)",
    isBookMain: false,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "আমার সহজ বাংলা পড়া B-2",
    publisher: "Read Publications- (Savar)",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "এসো লেখা শিখি-২",
    publisher: "এডলিন মালাকার",
    isBookMain: false,
  },
  {
    book_name: "কায়দা- তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন/(Uttara)",
    isBookMain: false,
  },
  {
    book_name: "এসো জীবন গড়ি- ১",
    publisher: "এডুকেয়ার",
    isBookMain: false,
  },
  {
    book_name: "Teaching of Islam- A",
    publisher: "Nabarun",
    isBookMain: true,
    subject_group: ExamSubjectName.ARABIC,
  },
]);
const bookListKindergartenSchool = defineBookList(
  "KINDERGARTEN",
  Section.SCHOOL,
  [
    {
      book_name: "English Avenue- Premier I",
      publisher: "Excel Publishing Center/Nabarun",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH,
    },
    {
      book_name: "My Handwriting (Book- III)",
      publisher: "Adeline Malakar",
      isBookMain: false,
      subject_group: ExamSubjectName.ENGLISH,
    },
    {
      book_name: "Spoken English Work Book- 0",
      publisher: "Standard/(Metro)",
      isBookMain: false,
    },
    {
      book_name: "Success Math's With Ahead- I",
      publisher: "Orient Black Swan/World Book",
      isBookMain: true,
      subject_group: ExamSubjectName.MATHEMATICS,
    },
    {
      book_name: "How to Draw and Colour- C",
      publisher: "Nabarun",
      isBookMain: false,
    },
    {
      book_name: "ছবি দেখে গোনা ও লেখা শেখা- ২",
      publisher: "Samira/(Rakib)",
      isBookMain: false,
      subject_group: ExamSubjectName.MATHEMATICS,
    },
    {
      book_name: "শিশুদের সহজ বাংলা পড়া B- III",
      publisher: "Read Publications- (Savar)",
      isBookMain: true,
      subject_group: ExamSubjectName.BENGALI,
    },
    {
      book_name: "এসো লেখা শিখি- ৩",
      publisher: "এডলিন মালাকার",
      isBookMain: true,
      subject_group: ExamSubjectName.BENGALI,
    },
    {
      book_name: "কায়দা তাজবীদুল কুরআন",
      publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন/ (Uttara)",
      isBookMain: false,
    },
    {
      book_name: "এসো জীবন গড়ি- ১",
      publisher: "এডুকেয়ার",
      isBookMain: false,
    },
  ],
);
const bookListKindergartenMadrasha = defineBookList(
  "KINDERGARTEN",
  Section.MADRASHA,
  [
    {
      book_name: "English Avenue- Premier I",
      publisher: "Excel Publishing Center/Nabarun",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH,
    },
    {
      book_name: "My Handwriting (Book- III)",
      publisher: "Adeline Malakar",
      isBookMain: false,
      subject_group: ExamSubjectName.ENGLISH,
    },
    {
      book_name: "Spoken English Work Book- 0",
      publisher: "Standard/(Metro)",
      isBookMain: false,
    },
    {
      book_name: "Success Math's With Ahead- I",
      publisher: "Orient Black Swan/World Book",
      isBookMain: true,
      subject_group: ExamSubjectName.MATHEMATICS,
    },
    {
      book_name: "How to Draw and Colour- C",
      publisher: "Nabarun",
      isBookMain: false,
    },
    {
      book_name: "ছবি দেখে গোনা ও লেখা শেখা- ২",
      publisher: "Samira/(Rakib)",
      isBookMain: true,
      subject_group: ExamSubjectName.MATHEMATICS,
    },
    {
      book_name: "শিশুদের সহজ বাংলা পড়া B- III",
      publisher: "Read Publications- (Savar)",
      isBookMain: true,
      subject_group: ExamSubjectName.BENGALI,
    },
    {
      book_name: "এসো লেখা শিখি- ৩",
      publisher: "এডলিন মালাকার",
      isBookMain: false,
      subject_group: ExamSubjectName.BENGALI,
    },
    {
      book_name: "কায়দা তাজবীদুল কুরআন",
      publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন/ (Uttara)",
      isBookMain: false,
    },
    {
      book_name: "এসো জীবন গড়ি- ১",
      publisher: "এডুকেয়ার",
      isBookMain: false,
    },
    {
      book_name: "Teaching of Islam- B",
      publisher: "Nabarun",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC,
    },
  ],
);
const bookListGradeOneSchool = defineBookList("GRADE_ONE", Section.SCHOOL, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "My Handwriting (Book - III)",
    publisher: "Adeline Malakar",
    isBookMain: false,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "My Handwriting (Book - IV)",
    publisher: "Adeline Malakar",
    isBookMain: false,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "Spoken English Work Book- I",
    publisher: "Standard/(Metro)/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "Elementary Mathematics",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "এসো লেখা শিখি- ৪",
    publisher: "এডলিন মালাকার",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন",
    isBookMain: false,
  },
  {
    book_name: "এসো জীবন গড়ি- ২",
    publisher: "এডুকেয়ার",
    isBookMain: false,
  },
]);
const bookListGradeOneMadrasha = defineBookList("GRADE_ONE", Section.MADRASHA, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "My Handwriting (Book - III)",
    publisher: "Adeline Malakar",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "My Handwriting (Book - IV)",
    publisher: "Adeline Malakar",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "Spoken English Work Book- I",
    publisher: "Standard/(Metro)/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "Elementary Mathematics",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "এসো লেখা শিখি- ৪",
    publisher: "এডলিন মালাকার",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন",
    isBookMain: false,
  },
  {
    book_name: "এসো জীবন গড়ি- ২",
    publisher: "এডুকেয়ার",
    isBookMain: false,
  },
  {
    book_name: "আদ দুরুসুল আরাবিয়্যাহ",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ARABIC,
  },
  {
    book_name: "Teaching of Islam- I",
    publisher: "Nabarun",
    isBookMain: true,
    subject_group: ExamSubjectName.TEACHING_OF_ISLAM,
  },
]);
const bookListGradeTwoSchool = defineBookList("GRADE_TWO", Section.SCHOOL, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "My Handwriting (Book - V)",
    publisher: "Adeline Malakar",
    isBookMain: false,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "Spoken English Work Book- I",
    publisher: "Standard/(Metro)/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "Elementary Mathematics",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "এসো লেখা শিখি- ৫",
    publisher: "এডলিন মালাকার",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন",
    isBookMain: false,
  },
  {
    book_name: "এসো জীবন গড়ি- ২",
    publisher: "এডুকেয়ার",
    isBookMain: false,
  },
]);
const bookListGradeTwoMadrasha = defineBookList("GRADE_TWO", Section.MADRASHA, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "My Handwriting (Book - V)",
    publisher: "Adeline Malakar",
    isBookMain: false,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "Spoken English Work Book- I",
    publisher: "Standard/(Metro)/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "Elementary Mathematics",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "এসো লেখা শিখি- ৫",
    publisher: "এডলিন মালাকার",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন",
    isBookMain: false,
  },
  {
    book_name: "এসো জীবন গড়ি- ২",
    publisher: "এডুকেয়ার",
    isBookMain: false,
  },
  {
    book_name: "আদ দুরুসুল আরাবিয়্যাহ",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ARABIC,
  },
  {
    book_name: "Teaching of Islam- I",
    publisher: "Nabarun",
    isBookMain: true,
    subject_group: ExamSubjectName.TEACHING_OF_ISLAM,
  },
]);
const bookListGradeThreeSchool = defineBookList("GRADE_THREE", Section.SCHOOL, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "প্রাথমিক গণিত",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ELEMENTARY_MATHEMATICS,
  },
  {
    book_name: "প্রাথমিক বিজ্ঞান",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ELEMENTARY_SCIENCE,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
  },
  {
    book_name: "ইসলাম ও নৈতিক শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.RELIGION,
  },
  {
    book_name: "Spoken English Work Book-2",
    publisher: "Standard/(Metro)/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "নাদিয়া আমপারা",
    publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
    isBookMain: false,
  },
  {
    book_name: "তা'লীমুল ইসলাম",
    publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
    isBookMain: false,
  },
  {
    book_name: "মজার গল্প",
    publisher: "এডুকেয়ার",
    isBookMain: false,
  },
]);
const bookListGradeThreeMadrasha = defineBookList(
  "GRADE_THREE",
  Section.MADRASHA,
  [
    {
      book_name: "English For Today",
      publisher: "Text Book",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH,
    },
    {
      book_name: "আমার বাংলা বই",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BENGALI,
    },
    {
      book_name: "প্রাথমিক গণিত",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ELEMENTARY_MATHEMATICS,
    },
    {
      book_name: "প্রাথমিক বিজ্ঞান",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ELEMENTARY_SCIENCE,
    },
    {
      book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
    },
    {
      book_name: "Spoken English Work Book-2",
      publisher: "Standard/(Metro)/(Metro)",
      isBookMain: false,
    },
    {
      book_name: "নাদিয়া আমপারা",
      publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
      isBookMain: false,
    },
    {
      book_name: "তা'লীমুল ইসলাম",
      publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
      isBookMain: false,
    },
    {
      book_name: "মজার গল্প",
      publisher: "এডুকেয়ার",
      isBookMain: false,
    },
    {
      book_name: "আদ দুরুসুল আরাবিয়্যাহ",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC,
    },
    {
      book_name: "আকাইদ ও ফিকস",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.AQUAEED_AND_FIQH,
    },
  ],
);
const bookListGradeFourSchool = defineBookList("GRADE_FOUR", Section.SCHOOL, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "প্রাথমিক গণিত",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ELEMENTARY_MATHEMATICS,
  },
  {
    book_name: "প্রাথমিক বিজ্ঞান",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ELEMENTARY_SCIENCE,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
  },
  {
    book_name: "ইসলাম ও নৈতিক শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.RELIGION,
  },
  {
    book_name: "Spoken English Work Book-2",
    publisher: "Standard/(Metro)/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "নাদিয়া আমপারা",
    publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
    isBookMain: false,
  },
  {
    book_name: "তা'লীমুল ইসলাম",
    publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
    isBookMain: false,
  },
  {
    book_name: "আদর্শ মানব মুহাম্মদ (সা.)",
    publisher: "বাংলাদেশ ইসলামিক সেন্টার ঢাকা",
    isBookMain: false,
  },
]);
const bookListGradeFourMadrasha = defineBookList(
  "GRADE_FOUR",
  Section.MADRASHA,
  [
    {
      book_name: "English For Today",
      publisher: "Text Book",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH,
    },
    {
      book_name: "আমার বাংলা বই",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BENGALI,
    },
    {
      book_name: "প্রাথমিক গণিত",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ELEMENTARY_MATHEMATICS,
    },
    {
      book_name: "প্রাথমিক বিজ্ঞান",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ELEMENTARY_SCIENCE,
    },
    {
      book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
    },
    {
      book_name: "Spoken English Work Book-2",
      publisher: "Standard/(Metro)/(Metro)",
      isBookMain: false,
    },
    {
      book_name: "নাদিয়া আমপারা",
      publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
      isBookMain: false,
    },
    {
      book_name: "তা'লীমুল ইসলাম",
      publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
      isBookMain: false,
    },
    {
      book_name: "আদর্শ মানব মুহাম্মদ (সা.)",
      publisher: "বাংলাদেশ ইসলামিক সেন্টার ঢাকা",
      isBookMain: false,
    },
    {
      book_name: "আদ দুরুসুল আরাবিয়্যাহ",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC_1ST,
    },
    {
      book_name: "আরবি ব্যাকরণ (মিযানুস সরফ)",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC_2ND,
    },
    {
      book_name: "আকাইদ ও ফিকস",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.AQUAEED_AND_FIQH,
    },
  ],
);
const bookListGradeFiveSchool = defineBookList("GRADE_FIVE", Section.SCHOOL, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI,
  },
  {
    book_name: "প্রাথমিক গণিত",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ELEMENTARY_MATHEMATICS,
  },
  {
    book_name: "প্রাথমিক বিজ্ঞান",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ELEMENTARY_SCIENCE,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
  },
  {
    book_name: "ইসলাম ও নৈতিক শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.RELIGION,
  },
  {
    book_name: "Spoken English Work Book-3",
    publisher: "Standard/(Metro)/(Metro)",
    isBookMain: false,
  },
  {
    book_name: "নাদিয়া আমপারা",
    publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
    isBookMain: false,
  },
  {
    book_name: "তা'লীমুল ইসলাম",
    publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
    isBookMain: false,
  },
  {
    book_name: "মোরা বড় হতে চাই",
    publisher: "আই সি এস পাবলিকেশন্স",
    isBookMain: false,
  },
]);
const bookListGradeFiveMadrasha = defineBookList(
  "GRADE_FIVE",
  Section.MADRASHA,
  [
    {
      book_name: "English For Today",
      publisher: "Text Book",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH,
    },
    {
      book_name: "আমার বাংলা বই",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BENGALI,
    },
    {
      book_name: "প্রাথমিক গণিত",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ELEMENTARY_MATHEMATICS,
    },
    {
      book_name: "প্রাথমিক বিজ্ঞান",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ELEMENTARY_SCIENCE,
    },
    {
      book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
    },
    {
      book_name: "Spoken English Work Book-3",
      publisher: "Standard/(Metro)/(Metro)",
      isBookMain: false,
    },
    {
      book_name: "নাদিয়া আমপারা",
      publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
      isBookMain: false,
    },
    {
      book_name: "তা'লীমুল ইসলাম",
      publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
      isBookMain: false,
    },
    {
      book_name: "মোরা বড় হতে চাই",
      publisher: "আই সি এস পাবলিকেশন্স",
      isBookMain: false,
    },
    {
      book_name: "আদ দুরুসুল আরাবিয়্যাহ",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC_1ST,
    },
    {
      book_name: "আরবি ব্যাকরণ (মিযানুস সরফ)",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC_2ND,
    },
    {
      book_name: "আকাইদ ও ফিকস",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.AQUAEED_AND_FIQH,
    },
  ],
);
const bookListGradeSixSchool = defineBookList("GRADE_SIX", Section.SCHOOL, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH_1ST,
  },
  {
    book_name: "English Grammer and Composition",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH_2ND,
  },
  {
    book_name: "চারুপাঠ (বাংলা সাহিত্যের মূল বই)",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI_1ST,
  },
  {
    book_name: "আনন্দ পাঠ (বাংলা দ্রুত পঠন/সহায়ক বই)",
    publisher: "বোর্ড বই",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI_1ST,
  },
  {
    book_name: "বাংলা ব্যাকরণ ও নির্মিতি",
    publisher: "বোর্ড বই",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI_2ND,
  },
  {
    book_name: "গণিত",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "বিজ্ঞান",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.SCIENCE,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
  },
  {
    book_name: "তথ্য ও যোগাযোগ প্রযুক্তি",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ICT,
  },
  {
    book_name: "শারীরিক শিক্ষা ও স্বাস্থ্য",
    publisher: "বোর্ড বই",
    isBookMain: true,
  },
  {
    book_name: "লার্নিং উইথ হ্যাপিনেস",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.LEARNING_WITH_HAPPINESS,
  },
  {
    book_name: "আমার কারিগরি শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.VOCATIONAL_EDUCATION,
  },
  {
    book_name: "ইসলাম শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.RELIGION,
  },
]);
const bookListGradeSixMadrasha = defineBookList("GRADE_SIX", Section.MADRASHA, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH_1ST,
  },
  {
    book_name: "English Grammer and Composition",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH_2ND,
  },
  {
    book_name: "চারুপাঠ (বাংলা সাহিত্যের মূল বই)",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI_1ST,
  },
  {
    book_name: "আনন্দ পাঠ (বাংলা দ্রুত পঠন/সহায়ক বই)",
    publisher: "বোর্ড বই",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI_1ST,
  },
  {
    book_name: "বাংলা ব্যাকরণ ও নির্মিতি",
    publisher: "বোর্ড বই",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI_2ND,
  },
  {
    book_name: "গণিত",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "বিজ্ঞান",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.SCIENCE,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
  },
  {
    book_name: "তথ্য ও যোগাযোগ প্রযুক্তি",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ICT,
  },
  {
    book_name: "শারীরিক শিক্ষা ও স্বাস্থ্য",
    publisher: "বোর্ড বই",
    isBookMain: true,
  },
  {
    book_name: "লার্নিং উইথ হ্যাপিনেস",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.LEARNING_WITH_HAPPINESS,
  },
  {
    book_name: "আমার কারিগরি শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.VOCATIONAL_EDUCATION,
  },
  {
    book_name: "আল লুগাতুল আরাবিয়্যাতুল ইত্তিসালিয্যাহ",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ARABIC_1ST,
  },
  {
    book_name: "কাওয়াইদুল আরাবিয়্যাতুল",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ARABIC_2ND,
  },
  {
    book_name: "আকাইদ ও ফিকহ",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.AQUAEED_AND_FIQH,
  },
]);
const bookListGradeSevenSchool = defineBookList("GRADE_SEVEN", Section.SCHOOL, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH_1ST,
  },
  {
    book_name: "English Grammer and Composition",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH_2ND,
  },
  {
    book_name: "সপ্তবর্ণা (বাংলা সাহিত্যের মূল বই)",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI_1ST,
  },
  {
    book_name: "আনন্দ পাঠ (বাংলা দ্রুত পঠন/সহায়ক বই)",
    publisher: "বোর্ড বই",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI_1ST,
  },
  {
    book_name: "বাংলা ব্যাকরণ ও নির্মিতি",
    publisher: "বোর্ড বই",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI_2ND,
  },
  {
    book_name: "গণিত",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "বিজ্ঞান",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.SCIENCE,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
  },
  {
    book_name: "তথ্য ও যোগাযোগ প্রযুক্তি",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ICT,
  },
  {
    book_name: "শারীরিক শিক্ষা ও স্বাস্থ্য",
    publisher: "বোর্ড বই",
    isBookMain: true,
  },
  {
    book_name: "কর্ম ও জীবনমুখী শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.VOCATIONAL_EDUCATION,
  },
  {
    book_name: "কৃষি শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.AGRICULTURE,
  },
  {
    book_name: "গার্হস্থ্যবিজ্ঞান",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.HOME_SCIENCE,
  },
  {
    book_name: "ইসলাম শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.RELIGION,
  },
]);
const bookListGradeSevenMadrasha = defineBookList(
  "GRADE_SEVEN",
  Section.MADRASHA,
  [
    {
      book_name: "English For Today",
      publisher: "Text Book",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH_1ST,
    },
    {
      book_name: "English Grammer and Composition",
      publisher: "Text Book",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH_2ND,
    },
    {
      book_name: "চারুপাঠ (বাংলা সাহিত্যের মূল বই)",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BENGALI_1ST,
    },
    {
      book_name: "আনন্দ পাঠ (বাংলা দ্রুত পঠন/সহায়ক বই)",
      publisher: "বোর্ড বই",
      isBookMain: false,
      subject_group: ExamSubjectName.BENGALI_1ST,
    },
    {
      book_name: "বাংলা ব্যাকরণ ও নির্মিতি",
      publisher: "বোর্ড বই",
      isBookMain: false,
      subject_group: ExamSubjectName.BENGALI_2ND,
    },
    {
      book_name: "গণিত",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.MATHEMATICS,
    },
    {
      book_name: "বিজ্ঞান",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.SCIENCE,
    },
    {
      book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
    },
    {
      book_name: "তথ্য ও যোগাযোগ প্রযুক্তি",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ICT,
    },
    {
      book_name: "শারীরিক শিক্ষা ও স্বাস্থ্য",
      publisher: "বোর্ড বই",
      isBookMain: true,
    },
    {
      book_name: "কর্ম ও জীবনমুখী শিক্ষা",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.VOCATIONAL_EDUCATION,
    },
    {
      book_name: "কৃষি শিক্ষা",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.AGRICULTURE,
    },
    {
      book_name: "গার্হস্থ্যবিজ্ঞান",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.HOME_SCIENCE,
    },
    {
      book_name: "আল লুগাতুল আরাবিয়্যাতুল ইত্তিসালিয্যাহ",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC_1ST,
    },
    {
      book_name: "কাওয়াইদুল আরাবিয়্যাতুল",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC_2ND,
    },
    {
      book_name: "আকাইদ ও ফিকহ",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.AQUAEED_AND_FIQH,
    },
  ],
);
const bookListGradeEightSchool = defineBookList("GRADE_EIGHT", Section.SCHOOL, [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH_1ST,
  },
  {
    book_name: "English Grammer and Composition",
    publisher: "Text Book",
    isBookMain: true,
    subject_group: ExamSubjectName.ENGLISH_2ND,
  },
  {
    book_name: "সাহিত্য-কণিকা (বাংলা সাহিত্যের মূল বই)",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BENGALI_1ST,
  },
  {
    book_name: "আনন্দ পাঠ (বাংলা দ্রুত পঠন)",
    publisher: "বোর্ড বই",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI_1ST,
  },
  {
    book_name: "বাংলা ব্যাকরণ ও নির্মিতি",
    publisher: "বোর্ড বই",
    isBookMain: false,
    subject_group: ExamSubjectName.BENGALI_2ND,
  },
  {
    book_name: "গণিত",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.MATHEMATICS,
  },
  {
    book_name: "বিজ্ঞান",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.SCIENCE,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
  },
  {
    book_name: "তথ্য ও যোগাযোগ প্রযুক্তি",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.ICT,
  },
  {
    book_name: "শারীরিক শিক্ষা ও স্বাস্থ্য",
    publisher: "বোর্ড বই",
    isBookMain: true,
  },
  {
    book_name: "ইসলাম শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.RELIGION,
  },
  {
    book_name: "কৃষি শিক্ষা",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.AGRICULTURE,
  },
  {
    book_name: "গার্হস্থ্যবিজ্ঞান",
    publisher: "বোর্ড বই",
    isBookMain: true,
    subject_group: ExamSubjectName.HOME_SCIENCE,
  },
]);
const bookListGradeEightMadrasha = defineBookList(
  "GRADE_EIGHT",
  Section.MADRASHA,
  [
    {
      book_name: "English For Today",
      publisher: "Text Book",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH_1ST,
    },
    {
      book_name: "English Grammer and Composition",
      publisher: "Text Book",
      isBookMain: true,
      subject_group: ExamSubjectName.ENGLISH_2ND,
    },
    {
      book_name: "সাহিত্য-কণিকা (বাংলা সাহিত্যের মূল বই)",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BENGALI_1ST,
    },
    {
      book_name: "আনন্দ পাঠ (বাংলা দ্রুত পঠন)",
      publisher: "বোর্ড বই",
      isBookMain: false,
      subject_group: ExamSubjectName.BENGALI_1ST,
    },
    {
      book_name: "বাংলা ব্যাকরণ ও নির্মিতি",
      publisher: "বোর্ড বই",
      isBookMain: false,
      subject_group: ExamSubjectName.BENGALI_2ND,
    },
    {
      book_name: "গণিত",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.MATHEMATICS,
    },
    {
      book_name: "বিজ্ঞান",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.SCIENCE,
    },
    {
      book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.BANGLADESH_AND_GLOBAL_STUDIES,
    },
    {
      book_name: "তথ্য ও যোগাযোগ প্রযুক্তি",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ICT,
    },
    {
      book_name: "শারীরিক শিক্ষা ও স্বাস্থ্য",
      publisher: "বোর্ড বই",
      isBookMain: true,
    },
    {
      book_name: "কৃষি শিক্ষা",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.AGRICULTURE,
    },
    {
      book_name: "গার্হস্থ্যবিজ্ঞান",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.HOME_SCIENCE,
    },
    {
      book_name: "আল লুগাতুল আরাবিয়্যাতুল ইত্তিসালিয্যাহ",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC_1ST,
    },
    {
      book_name: "কাওয়াইদুল আরাবিয়্যাতুল",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.ARABIC_2ND,
    },
    {
      book_name: "আকাইদ ও ফিকহ",
      publisher: "বোর্ড বই",
      isBookMain: true,
      subject_group: ExamSubjectName.AQUAEED_AND_FIQH,
    },
  ],
);
const bookListSeedConfigs = [
  ["Playgroup School", bookListPlaygroupSchool],
  ["Playgroup Madrasha", bookListPlaygroupMadrasha],
  ["Nursery School", bookListNurserySchool],
  ["Nursery Madrasha", bookListNurseryMadrasha],
  ["Grade One School", bookListGradeOneSchool],
  ["Grade One Madrasha", bookListGradeOneMadrasha],
  ["Grade Two School", bookListGradeTwoSchool],
  ["Grade Two Madrasha", bookListGradeTwoMadrasha],
  ["Grade Three School", bookListGradeThreeSchool],
  ["Grade Three Madrasha", bookListGradeThreeMadrasha],
  ["Kindergarten School", bookListKindergartenSchool],
  ["Kindergarten Madrasha", bookListKindergartenMadrasha],
  ["Grade Four School", bookListGradeFourSchool],
  ["Grade Four Madrasha", bookListGradeFourMadrasha],
  ["Grade Five School", bookListGradeFiveSchool],
  ["Grade Five Madrasha", bookListGradeFiveMadrasha],
  ["Grade Six School", bookListGradeSixSchool],
  ["Grade Six Madrasha", bookListGradeSixMadrasha],
  ["Grade Seven School", bookListGradeSevenSchool],
  ["Grade Seven Madrasha", bookListGradeSevenMadrasha],
  ["Grade Eight School", bookListGradeEightSchool],
  ["Grade Eight Madrasha", bookListGradeEightMadrasha],
] as const;

export const runBookList = async () => {
  for (const [label, books] of bookListSeedConfigs) {
    console.log(`Seeding ${label} booklist...`);
    const result = await createBookList(books);
    console.log(`Regular periods done. Created ${result.count} entries.`);
  }
};
