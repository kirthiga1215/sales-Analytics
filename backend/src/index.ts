import app from "./app";
import { config } from "./config";
import { prisma } from "./config/database";

async function main() {
  await prisma.$connect();
  app.listen(config.port, () => {
    console.log(`API running on http://localhost:${config.port}`);
  });
}

main().catch(async (error) => {
  console.error("Failed to start server:", error);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
