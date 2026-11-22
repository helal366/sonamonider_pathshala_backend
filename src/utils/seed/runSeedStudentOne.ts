import { prisma } from "../../lib/prisma.js";
import { runStudentOneSeeding } from "./seedStudent/seedStudentOne.js";

const main = async () => {
  await prisma.$connect();

  await runStudentOneSeeding();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
