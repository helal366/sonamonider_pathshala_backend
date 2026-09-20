import { prisma } from "../lib/prisma";
import { runInitialSeed } from "./seed";

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