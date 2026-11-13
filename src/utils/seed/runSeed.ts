import { prisma } from "../../lib/prisma.js";
import { runInitialSeedPositionStaff } from "./seedStaff.js";
import { runInitialClassSubject } from "./seedClassSubject.js";
import { runStandardStudentFeeRateSeed } from "./seedStandardStudentFeeRates.js";

const main = async () => {
  await prisma.$connect();

  await runInitialClassSubject();
  
  await runInitialSeedPositionStaff();

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
