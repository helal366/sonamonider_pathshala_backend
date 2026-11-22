import { prisma } from "../../lib/prisma.js";
import { runStudentTwoSeeding } from "./seedStudent/seedStudentTwo.js";

const main = async () => {
  await prisma.$connect();

  await runStudentTwoSeeding();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });