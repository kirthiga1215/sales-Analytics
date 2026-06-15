import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Use runtime require for @prisma/client to avoid TypeScript compile-time
// errors in environments where the module shape may differ (hosting platforms)
const PrismaPkg: any = require("@prisma/client");
const PrismaClient = PrismaPkg.PrismaClient ?? PrismaPkg;

const globalForPrisma = globalThis as unknown as {
  prisma: any;
  pool: Pool;
};

function createPrismaClient() {
  const pool = globalForPrisma.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);

  if (!globalForPrisma.pool) {
    globalForPrisma.pool = pool;
  }

  // Instantiate PrismaClient (shape may vary depending on @prisma/client version)
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
