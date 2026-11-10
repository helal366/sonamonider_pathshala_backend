import { prisma } from "../../lib/prisma.js";
import { runBookList } from "./seedBookList.js";

const main = async () => {
  await prisma.$connect();

  await runBookList();
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });