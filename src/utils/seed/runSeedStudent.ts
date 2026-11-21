import { prisma } from "../../lib/prisma.js";
import { runStudentSeeding } from "./seedStudent/seedStudent.js";

const main = async () => {
  await prisma.$connect();

  await runStudentSeeding();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
