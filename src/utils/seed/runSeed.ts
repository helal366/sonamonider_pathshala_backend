import { prisma } from "../../lib/prisma.js";
import { runInitialSeed } from "./seed.js";
import { runBookList } from "./seedBookList.js";
import { runInitialOthers } from "./seedOthers.js";
import { runStandardStudentFeeRateSeed } from "./seedStandardStudentFeeRates.js";

const main = async () => {
  await prisma.$connect();

  await runInitialSeed();

  await runInitialOthers();

  await runStandardStudentFeeRateSeed();

  // await runBookList();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
