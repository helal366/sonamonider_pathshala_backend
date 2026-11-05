import { Prisma, Section, Version } from "#db-client";
import { prisma } from "../../lib/prisma";

const classIdCache = new Map<string, Promise<string>>();
type SeedBook = Omit<Prisma.BooklistCreateManyInput, "class_id"> & {
  class_name: string;
};

const getClassId = (className: string) => {
  const cachedClassId = classIdCache.get(className);
  if (cachedClassId) {
    return cachedClassId;
  }

  const classId = prisma.class
    .findUniqueOrThrow({
      where: { class_name: className },
      select: { id: true },
    })
    .then(({ id }) => id);

  classIdCache.set(className, classId);
  return classId;
};

const createBookList = async (books: SeedBook[]) => {
  const data = await Promise.all(
    books.map(async (book) => ({
      ...book,
      class_id: await getClassId(book.class_name),
    })),
  );

  return prisma.booklist.createMany({
    data,
    skipDuplicates: true,
  });
};

const bookListPlaygroupSchool = [
  {
    book_name: "My 1st Step ABC Alphabet",
    publisher: "Nabarun Publications",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book -I)",
    publisher: "Adeline Malakar",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book - 0",
    publisher: "Standard/(Metro)",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Success Math's With Ahead - A",
    publisher: "Orient Black Swan/World Book",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "How to Draw and Colour - A",
    publisher: "Nabarun Publications",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "ছবি দেখে গোনা ও লেখা শেখা - ১",
    publisher: "Samia/(Rakib)",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "আমার বর্ণমালা B - I",
    publisher: "Read Publications - (Savar)",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি - ১",
    publisher: "এডলিন মালাকার",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "কায়দা - তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন - Uttara",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি-১",
    publisher: "এডুকেয়ার",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
];
const seedBookListPlaygroupSchool = async () => {
  console.log("Seeding Playgroup School booklist...");
  const result = await createBookList(bookListPlaygroupSchool);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListPlaygroupMadrasha = [
  {
    book_name: "My 1st Step ABC Alphabet",
    publisher: "Nabarun Publications",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book -I)",
    publisher: "Adeline Malakar",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book - 0",
    publisher: "Standard/(Metro)",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Success Math's With Ahead - A",
    publisher: "Orient Black Swan/World Book",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Teaching of Islam - A",
    publisher: "Nabarun Publications",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "How to Draw and Colour - A",
    publisher: "Nabarun Publications",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "ছবি দেখে গোনা ও লেখা শেখা - ১",
    publisher: "Samia/(Rakib)",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আমার বর্ণমালা B - I",
    publisher: "Read Publications - (Savar)",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি - ১",
    publisher: "এডলিন মালাকার",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "কায়দা - তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন - Uttara",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি-১",
    publisher: "এডুকেয়ার",
    class_name: "PLAYGROUP",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
];
const seedBookListPlaygroupMadrasha = async () => {
  console.log("Seeding Playgroup Madrasha booklist...");
  const result = await createBookList(bookListPlaygroupMadrasha);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListNurserySchool = [
  {
    book_name: "Child's First Step Picture ABC",
    publisher: "The Orient/(Nabarun)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book -II)",
    publisher: "Adeline Malakar",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book - 0",
    publisher: "Standard/(Metro)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Success Math's With Ahead - B",
    publisher: "Orient Black Swan/World Book",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "How to Draw and Colour - B",
    publisher: "Nabarun",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "ছবি দেখে গোনা ও লেখা শেখা - ২",
    publisher: "Samina/(Rakib)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "আমার সহজ বাংলা পড়া B-2",
    publisher: "Read Publications- (Savar)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি-২",
    publisher: "এডলিন মালাকার",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "কায়দা- তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন/(Uttara)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি- ১",
    publisher: "এডুকেয়ার",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
];
const seedBoolListNurserySchool = async () => {
  console.log("Seeding Nursery School booklist...");
  const result = await createBookList(bookListNurserySchool);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListNurseryMadrasha = [
  {
    book_name: "Child's First Step Picture ABC",
    publisher: "The Orient/(Nabarun)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book -II)",
    publisher: "Adeline Malakar",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book - 0",
    publisher: "Standard/(Metro)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Success Math's With Ahead - B",
    publisher: "Orient Black Swan/World Book",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "How to Draw and Colour - B",
    publisher: "Nabarun",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "ছবি দেখে গোনা ও লেখা শেখা - ২",
    publisher: "Samina/(Rakib)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আমার সহজ বাংলা পড়া B-2",
    publisher: "Read Publications- (Savar)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি-২",
    publisher: "এডলিন মালাকার",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "কায়দা- তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন/(Uttara)",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি- ১",
    publisher: "এডুকেয়ার",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Teaching of Islam- A",
    publisher: "Nabarun",
    class_name: "NURSERY",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
];
const seedBoolListNurseryMadrasha = async () => {
  console.log("Seeding Nursery Madrasha booklist...");
  const result = await createBookList(bookListNurseryMadrasha);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListKindergartenSchool = [
  {
    book_name: "English Avenue- Premier I",
    publisher: "Excel Publishing Center/Nabarun",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book- III)",
    publisher: "Adeline Malakar",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book- 0",
    publisher: "Standard/(Metro)",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Success Math's With Ahead- I",
    publisher: "Orient Black Swan/World Book",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "How to Draw and Colour- C",
    publisher: "Nabarun",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "ছবি দেখে গোনা ও লেখা শেখা- ২",
    publisher: "Samira/(Rakib)",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "শিশুদের সহজ বাংলা পড়া B- III",
    publisher: "Read Publications- (Savar)",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি- ৩",
    publisher: "এডলিন মালাকার",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন/ (Uttara)",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি- ১",
    publisher: "এডুকেয়ার",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
];
const seedBoolListKindergartenSchool = async () => {
  console.log("Seeding Kindergarten School booklist...");
  const result = await createBookList(bookListKindergartenSchool);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListKindergartenMadrasha = [
  {
    book_name: "English Avenue- Premier I",
    publisher: "Excel Publishing Center/Nabarun",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book- III)",
    publisher: "Adeline Malakar",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book- 0",
    publisher: "Standard/(Metro)",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Success Math's With Ahead- I",
    publisher: "Orient Black Swan/World Book",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "How to Draw and Colour- C",
    publisher: "Nabarun",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "ছবি দেখে গোনা ও লেখা শেখা- ২",
    publisher: "Samira/(Rakib)",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "শিশুদের সহজ বাংলা পড়া B- III",
    publisher: "Read Publications- (Savar)",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি- ৩",
    publisher: "এডলিন মালাকার",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন/ (Uttara)",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি- ১",
    publisher: "এডুকেয়ার",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Teaching of Islam- B",
    publisher: "Nabarun",
    class_name: "KINDERGARTEN",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
];
const seedBoolListKindergartenMadrasha = async () => {
  console.log("Seeding Kindergarten Madrasha booklist...");
  const result = await createBookList(bookListKindergartenMadrasha);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeOneSchool = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book - III)",
    publisher: "Adeline Malakar",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book - IV)",
    publisher: "Adeline Malakar",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book- I",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Elementary Mathematics",
    publisher: "Text Book",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি- ৪",
    publisher: "এডলিন মালাকার",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি- ২",
    publisher: "এডুকেয়ার",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
];
const seedBoolListGradeOneSchool = async () => {
  console.log("Seeding Grade One School booklist...");
  const result = await createBookList(bookListGradeOneSchool);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeOneMadrasha = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book - III)",
    publisher: "Adeline Malakar",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book - IV)",
    publisher: "Adeline Malakar",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book- I",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Elementary Mathematics",
    publisher: "Text Book",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি- ৪",
    publisher: "এডলিন মালাকার",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি- ২",
    publisher: "এডুকেয়ার",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আদ দুরুসুল আরাবিয়্যাহ",
    publisher: "বোর্ড বই",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Teaching of Islam- I",
    publisher: "Nabarun",
    class_name: "GRADE_ONE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
];
const seedBoolListGradeOneMadrasha = async () => {
  console.log("Seeding Grade One Madrasha booklist...");
  const result = await createBookList(bookListGradeOneMadrasha);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeTwoSchool = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book - V)",
    publisher: "Adeline Malakar",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book- I",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Elementary Mathematics",
    publisher: "Text Book",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি- ৫",
    publisher: "এডলিন মালাকার",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি- ২",
    publisher: "এডুকেয়ার",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
];
const seedBookListGradeTwoSchool = async () => {
  console.log("Seeding Grade Two School booklist...");
  const result = await createBookList(bookListGradeTwoSchool);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeTwoMadrasha = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "My Handwriting (Book - V)",
    publisher: "Adeline Malakar",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book- I",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Elementary Mathematics",
    publisher: "Text Book",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো লেখা শিখি- ৫",
    publisher: "এডলিন মালাকার",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "কায়দা তাজবীদুল কুরআন",
    publisher: "বাংলাদেশ হলি কুরআন ফাউন্ডেশন",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "এসো জীবন গড়ি- ২",
    publisher: "এডুকেয়ার",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আদ দুরুসুল আরাবিয়্যাহ",
    publisher: "বোর্ড বই",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Teaching of Islam- I",
    publisher: "Nabarun",
    class_name: "GRADE_TWO",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
];
const seedBookListGradeTwoMadrasha = async () => {
  console.log("Seeding Grade Two Madrasha booklist...");
  const result = await createBookList(bookListGradeTwoMadrasha);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeThreeSchool = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক গণিত",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক বিজ্ঞান",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "ইসলাম ও নৈতিক শিক্ষা",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book-2",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "নাদিয়া আমপারা",
    publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "তা'লীমুল ইসলাম",
    publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "মজার গল্প",
    publisher: "এডুকেয়ার",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
];
const seedBookListGradeThreeSchool = async () => {
  console.log("Seeding Grade Three School booklist...");
  const result = await createBookList(bookListGradeThreeSchool);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeThreeMadrasha = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক গণিত",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক বিজ্ঞান",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book-2",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "নাদিয়া আমপারা",
    publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "তা'লীমুল ইসলাম",
    publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "মজার গল্প",
    publisher: "এডুকেয়ার",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আদ দুরুসুল আরাবিয়্যাহ",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আকাইদ ও ফিকস",
    publisher: "বোর্ড বই",
    class_name: "GRADE_THREE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
];
const seedBookListGradeThreeMadrasha = async () => {
  console.log("Seeding Grade Three Madrasha booklist...");
  const result = await createBookList(bookListGradeThreeMadrasha);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeFourSchool = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক গণিত",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক বিজ্ঞান",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "ইসলাম ও নৈতিক শিক্ষা",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book-2",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "নাদিয়া আমপারা",
    publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "তা'লীমুল ইসলাম",
    publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "আদর্শ মানব মুহাম্মদ (সা.)",
    publisher: "বাংলাদেশ ইসলামিক সেন্টার ঢাকা",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
];
const seedBookListGradeFourSchool = async () => {
  console.log("Seeding Grade Four School booklist...");
  const result = await createBookList(bookListGradeFourSchool);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeFourMadrasha = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক গণিত",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক বিজ্ঞান",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book-2",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "নাদিয়া আমপারা",
    publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "তা'লীমুল ইসলাম",
    publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আদর্শ মানব মুহাম্মদ (সা.)",
    publisher: "বাংলাদেশ ইসলামিক সেন্টার ঢাকা",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আদ দুরুসুল আরাবিয়্যাহ",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আরবি ব্যাকরণ",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আকাইদ ও ফিকস",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FOUR",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
];
const seedBookListGradeFourMadrasha = async () => {
  console.log("Seeding Grade Four Madrasha booklist...");
  const result = await createBookList(bookListGradeFourMadrasha);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeFiveSchool = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক গণিত",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক বিজ্ঞান",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "ইসলাম ও নৈতিক শিক্ষা",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book-3",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "নাদিয়া আমপারা",
    publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "তা'লীমুল ইসলাম",
    publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
  {
    book_name: "মোরা বড় হতে চাই",
    publisher: "আই সি এস পাবলিকেশন্স",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.SCHOOL,
    isBookMain: true,
  },
];
const seedBookListGradeFiveSchool = async () => {
  console.log("Seeding Grade Five School booklist...");
  const result = await createBookList(bookListGradeFiveSchool);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
const bookListGradeFiveMadrasha = [
  {
    book_name: "English For Today",
    publisher: "Text Book",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আমার বাংলা বই",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক গণিত",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "প্রাথমিক বিজ্ঞান",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "বাংলাদেশ ও বিশ্বপরিচয়",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "Spoken English Work Book-3",
    publisher: "Standard/(Metro)/(Metro)",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "নাদিয়া আমপারা",
    publisher: "নাদিয়াতুল কুরআন প্রকাশনী",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "তা'লীমুল ইসলাম",
    publisher: "প্রকাশনা ও গবেষনা বিভাগ- তা'লীমুল মিল্লাত",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "মোরা বড় হতে চাই",
    publisher: "আই সি এস পাবলিকেশন্স",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আদ দুরুসুল আরাবিয়্যাহ",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আরবি ব্যাকরণ",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
  {
    book_name: "আকাইদ ও ফিকস",
    publisher: "বোর্ড বই",
    class_name: "GRADE_FIVE",
    version: Version.BENGALI,
    section: Section.MADRASHA,
    isBookMain: true,
  },
];
const seedBookListGradeFiveMadrasha = async () => {
  console.log("Seeding Grade Five Madrasha booklist...");
  const result = await createBookList(bookListGradeFiveMadrasha);
  console.log(`Regular periods done. Created ${result.count} entries.`);
};
export const runBookList = async () => {
  await seedBookListPlaygroupSchool();
  await seedBookListPlaygroupMadrasha();
  await seedBoolListNurserySchool();
  await seedBoolListNurseryMadrasha();
  await seedBoolListGradeOneSchool();
  await seedBoolListGradeOneMadrasha();
  await seedBookListGradeTwoSchool();
  await seedBookListGradeTwoMadrasha();
  await seedBookListGradeThreeSchool();
  await seedBookListGradeThreeMadrasha();
  await seedBoolListKindergartenSchool();
  await seedBoolListKindergartenMadrasha();
  await seedBookListGradeFourSchool();
  await seedBookListGradeFourMadrasha();
  await seedBookListGradeFiveSchool();
  await seedBookListGradeFiveMadrasha();
};
