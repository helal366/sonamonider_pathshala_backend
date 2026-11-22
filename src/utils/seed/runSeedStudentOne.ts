import { prisma } from "../../lib/prisma.js";
import { runStudent1Seeding } from "./seedStudent/seedStudent1.js";

const main = async () => {
  await prisma.$connect();

  await runStudent1Seeding();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
