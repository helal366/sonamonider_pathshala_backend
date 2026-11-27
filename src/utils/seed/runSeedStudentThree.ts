import { prisma } from "../../lib/prisma.js";
import { runStudent3Seeding } from "./seedStudent/seedStudent3.js";

const main = async () => {
  await prisma.$connect();

  await runStudent3Seeding();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });