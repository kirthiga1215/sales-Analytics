import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT ?? "4000", 10),
  // Accept a comma-separated list of allowed origins via CORS_ORIGIN
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:3000").split(",").map((s) => s.trim()),
  seedRecordCount: parseInt(process.env.SEED_RECORD_COUNT ?? "15000", 10),
};
