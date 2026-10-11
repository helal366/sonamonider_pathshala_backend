import { prisma } from "../lib/prisma.js";
import { runInitialSeed } from "./seed.js";
import { runInitialOthers } from "./seedOthers.js";

const main = async () => {
  await prisma.$connect();

  await runInitialSeed();

  await runInitialOthers();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
