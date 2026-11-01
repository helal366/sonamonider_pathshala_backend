import { Section, Version } from "#db-client"
import { prisma } from "../lib/prisma";

const bookListPlaygroupSchool=[
    {
        "book_name": "My 1st Step ABC Alphabet",
        "publisher":"Nabarun Publications",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "My Handwriting (Book -I)",
        "publisher":"Adeline Malakar",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "Spoken English Work Book - 0",
        "publisher":"Standard/(Metro)",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "Success Math's With Ahead - A",
        "publisher":"Orient Black Swan/World Book",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "How to Draw and Colour - A",
        "publisher":"Nabarun Publications",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "ছবি দেখে গোনা ও লেখা শেখা - ১",
        "publisher":"Samia/(Rakib)",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "আমার বর্ণমালা B - I",
        "publisher":"Read Publications - (Savar)",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "এসো লেখা শিখি - ১",
        "publisher":"এডলিন মালাকার",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "কায়দা - তাজবীদুল কুরআন",
        "publisher":"বাংলাদেশ হলি কুরআন ফাউন্ডেশন - Uttara",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "এসো জীবন গড়ি-১",
        "publisher":"এডুকেয়ার",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },

];
const seedBookListPlaygroupSchool=async()=>{
    console.log("Seeding Playgroup school booklist...");
      const result = await prisma.booklist.createMany({
        data: bookListPlaygroupSchool,
        skipDuplicates: true,
      });
      console.log(`Regular periods done. Created ${result.count} entries.`);
}
const bookListPlaygroupMadrasha=[
    {
        "book_name": "My 1st Step ABC Alphabet",
        "publisher":"Nabarun Publications",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "My Handwriting (Book -I)",
        "publisher":"Adeline Malakar",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "Spoken English Work Book - 0",
        "publisher":"Standard/(Metro)",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "Success Math's With Ahead - A",
        "publisher":"Orient Black Swan/World Book",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "Teaching of Islam - A",
        "publisher":"Nabarun Publications",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "How to Draw and Colour - A",
        "publisher":"Nabarun Publications",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "ছবি দেখে গোনা ও লেখা শেখা - ১",
        "publisher":"Samia/(Rakib)",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "আমার বর্ণমালা B - I",
        "publisher":"Read Publications - (Savar)",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "এসো লেখা শিখি - ১",
        "publisher":"এডলিন মালাকার",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "কায়দা - তাজবীদুল কুরআন",
        "publisher":"বাংলাদেশ হলি কুরআন ফাউন্ডেশন - Uttara",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.MADRASHA,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
    {
        "book_name": "এসো জীবন গড়ি-১",
        "publisher":"এডুকেয়ার",
        "class_name":"PLAYGROUP",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true,
        "class_id": "f5322ce2-5928-4e89-8e50-91994fbeeb8f"
    },
];
const seedBookListPlaygroupMadrasha=async()=>{
    console.log("Seeding Playgroup madrasha booklist...");
      const result = await prisma.booklist.createMany({
        data: bookListPlaygroupMadrasha,
        skipDuplicates: true,
      });
      console.log(`Regular periods done. Created ${result.count} entries.`);
}
const bookListNurserySchool = [
    {
        "book_name": "Child's First Step Picture ABC",
        "publisher":"The Orient/(Nabarun)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "My Handwriting (Book -II)",
        "publisher":"Adeline Malakar",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Spoken English Work Book - 0",
        "publisher":"Standard/(Metro)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Success Math's With Ahead - B",
        "publisher":"Orient Black Swan/World Book",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "How to Draw and Colour - B",
        "publisher":"Nabarun",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "ছবি দেখে গোনা ও লেখা শেখা - ২",
        "publisher":"Samina/(Rakib)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "আমার সহজ বাংলা পড়া B-2",
        "publisher":"Read Publications- (Savar)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "এসো লেখা শিখি-২",
        "publisher":"এডলিন মালাকার",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "কায়দা- তাজবীদুল কুরআন",
        "publisher":"বাংলাদেশ হলি কুরআন ফাউন্ডেশন/(Uttara)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "এসো জীবন গড়ি- ১",
        "publisher":"এডুকেয়ার",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
]; 
const bookListNurseryMadrasha=[
    {
        "book_name": "Child's First Step Picture ABC",
        "publisher":"The Orient/(Nabarun)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "My Handwriting (Book -II)",
        "publisher":"Adeline Malakar",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Spoken English Work Book - 0",
        "publisher":"Standard/(Metro)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Success Math's With Ahead - B",
        "publisher":"Orient Black Swan/World Book",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "How to Draw and Colour - B",
        "publisher":"Nabarun",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "ছবি দেখে গোনা ও লেখা শেখা - ২",
        "publisher":"Samina/(Rakib)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "আমার সহজ বাংলা পড়া B-2",
        "publisher":"Read Publications- (Savar)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "এসো লেখা শিখি-২",
        "publisher":"এডলিন মালাকার",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "কায়দা- তাজবীদুল কুরআন",
        "publisher":"বাংলাদেশ হলি কুরআন ফাউন্ডেশন/(Uttara)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "এসো জীবন গড়ি- ১",
        "publisher":"এডুকেয়ার",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Teaching of Islam- A",
        "publisher":"Nabarun",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
]; 
const bookListKindergartenSchool=[
    {
        "book_name": "English Avenue- Premier I",
        "publisher":"Excel Publishing Center/Nabarun",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "My Handwriting (Book- III)",
        "publisher":"Adeline Malakar",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Spoken English Work Book- 0",
        "publisher":"Standard/(Metro)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Success Math's With Ahead- I",
        "publisher":"Orient Black Swan/World Book",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "How to Draw and Colour- C",
        "publisher":"Nabarun",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "ছবি দেখে গোনা ও লেখা শেখা- ২",
        "publisher":"Samira/(Rakib)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "শিশুদের সহজ বাংলা পড়া B- III",
        "publisher":"Read Publications- (Savar)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "এসো লেখা শিখি- ৩",
        "publisher":"এডলিন মালাকার",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "কায়দা তাজবীদুল কুরআন",
        "publisher":"বাংলাদেশ হলি কুরআন ফাউন্ডেশন/ (Uttara)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "এসো জীবন গড়ি- ১",
        "publisher":"এডুকেয়ার",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
]
const bookListKindergartenMadrasha=[
    {
        "book_name": "English Avenue- Premier I",
        "publisher":"Excel Publishing Center/Nabarun",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "My Handwriting (Book- III)",
        "publisher":"Adeline Malakar",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Spoken English Work Book- 0",
        "publisher":"Standard/(Metro)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Success Math's With Ahead- I",
        "publisher":"Orient Black Swan/World Book",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "How to Draw and Colour- C",
        "publisher":"Nabarun",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "ছবি দেখে গোনা ও লেখা শেখা- ২",
        "publisher":"Samira/(Rakib)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "শিশুদের সহজ বাংলা পড়া B- III",
        "publisher":"Read Publications- (Savar)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "এসো লেখা শিখি- ৩",
        "publisher":"এডলিন মালাকার",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "কায়দা তাজবীদুল কুরআন",
        "publisher":"বাংলাদেশ হলি কুরআন ফাউন্ডেশন/ (Uttara)",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "এসো জীবন গড়ি- ১",
        "publisher":"এডুকেয়ার",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
    {
        "book_name": "Teaching of Islam- B",
        "publisher":"Nabarun",
        "class_name":"NURSERY",
        "version": Version.BANGLA,
        "section": Section.SCHOOL,
        "isBookMain": true
    },
]
const runBookList=async()=>{
    await seedBookListPlaygroupSchool();
    await seedBookListPlaygroupMadrasha();
}