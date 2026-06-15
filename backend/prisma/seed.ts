import "dotenv/config";
import { faker } from "@faker-js/faker";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "@prisma/client";
import { config } from "../src/config";
import { CATEGORIES, REGIONS, STATUSES } from "../src/types";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PRODUCT_PREFIXES: Record<string, string[]> = {
  Electronics: ["Laptop", "Phone", "Tablet", "Monitor", "Headphones", "Camera"],
  Furniture: ["Desk", "Chair", "Sofa", "Bed", "Cabinet", "Table"],
  Books: ["Novel", "Textbook", "Biography", "Comics", "Journal", "Guide"],
  Clothing: ["Shirt", "Jeans", "Jacket", "Dress", "Shoes", "Hat"],
  Sports: ["Ball", "Racket", "Dumbbell", "Bike", "Mat", "Gloves"],
  Home: ["Lamp", "Rug", "Curtain", "Vase", "Mirror", "Clock"],
  Beauty: ["Serum", "Cream", "Lipstick", "Perfume", "Shampoo", "Mask"],
};

function randomDate(start: Date, end: Date): Date {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

async function main() {
  const count = config.seedRecordCount;
  console.log(`Seeding ${count} transactions...`);

  await prisma.transaction.deleteMany();

  const batchSize = 500;
  const startDate = new Date("2024-01-01");
  const endDate = new Date("2026-06-15");

  for (let offset = 0; offset < count; offset += batchSize) {
    const currentBatch = Math.min(batchSize, count - offset);
    const records = Array.from({ length: currentBatch }, (_, i) => {
      const category = faker.helpers.arrayElement([...CATEGORIES]);
      const products = PRODUCT_PREFIXES[category] ?? ["Item"];
      const product = faker.helpers.arrayElement(products);

      return {
        transactionId: `TXN-${String(offset + i + 1).padStart(6, "0")}`,
        customerName: faker.person.fullName(),
        productName: `${product} ${faker.commerce.productAdjective()}`,
        category,
        region: faker.helpers.arrayElement([...REGIONS]),
        amount: faker.number.float({ min: 5, max: 2500, fractionDigits: 2 }),
        status: faker.helpers.arrayElement([...STATUSES]),
        transactionDate: randomDate(startDate, endDate),
      };
    });

    await prisma.transaction.createMany({ data: records });
    console.log(`Inserted ${Math.min(offset + currentBatch, count)} / ${count}`);
  }

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
