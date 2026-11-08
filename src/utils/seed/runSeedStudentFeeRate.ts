import { prisma } from "../../lib/prisma.js";
import { runStandardStudentFeeRateSeed } from "./seedStandardStudentFeeRates.js";

const main = async () => {
  await prisma.$connect();

  await runStandardStudentFeeRateSeed();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });