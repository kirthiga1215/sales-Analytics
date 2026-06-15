import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  seedRecordCount: parseInt(process.env.SEED_RECORD_COUNT ?? "15000", 10),
};
