import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { config } from "./config";
import { prisma } from "./config/database";
import routes from "./routes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

const app = express();

// Configure CORS to allow origins from config.corsOrigins
// Allow CORS for all origins by reflecting the request origin.
// This effectively disables same-origin restrictions for browser clients.
app.use(
  cors({
    origin: true, // reflect request origin, allowing all origins
    credentials: true,
  })
);
app.use(express.json());
app.use(pinoHttp());

app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const recordCount = await prisma.transaction.count();
    res.json({
      status: "ok",
      database: "connected",
      recordCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      database: "disconnected",
      message:
        error instanceof Error ? error.message : "Database connection failed",
      timestamp: new Date().toISOString(),
    });
  }
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
