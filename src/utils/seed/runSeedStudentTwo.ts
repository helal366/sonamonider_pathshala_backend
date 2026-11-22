import { prisma } from "../../lib/prisma.js";
import { runStudent2Seeding } from "./seedStudent/seedStudent2.js";

const main = async () => {
  await prisma.$connect();

  await runStudent2Seeding();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
