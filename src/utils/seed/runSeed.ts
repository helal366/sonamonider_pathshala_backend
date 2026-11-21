import { prisma } from "../../lib/prisma.js";
import { runInitialSeedPositionStaff } from "./seedStaff/seedStaff.js";
import { runInitialClassSubject } from "./seedClassSubject/seedClassSubject.js";
import { runStandardStudentFeeRateSeed } from "./seedStandardStudentFeeRate/seedStandardStudentFeeRates.js";

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
