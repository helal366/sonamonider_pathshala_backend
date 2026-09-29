import { prisma } from "../lib/prisma.js";
import { runInitialSeed } from "./seed.js";

const main = async () => {
  await prisma.$connect();

  await runInitialSeed();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
