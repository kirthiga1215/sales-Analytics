import type { Request, Response } from "express";
import {
  getDashboardSummary,
  getFilterOptions,
  getOrderStatusBreakdown,
  getRevenueTrend,
  getSalesByCategory,
  getSalesByRegion,
  getTransactions,
  streamTransactionsForExport,
  getTopProducts,
  getProductMetrics,
  getProductsByCategory,
} from "../services/dashboardService";
import { asyncHandler } from "../middlewares/validateRequest";

export const getSummary = asyncHandler(async (req: Request, res: Response) => {
  const summary = await getDashboardSummary(req.query);
  res.json(summary);
});

export const getRevenueTrendHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getRevenueTrend(req.query);
    res.json(data);
  }
);

export const getCategorySales = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getSalesByCategory(req.query);
    res.json(data);
  }
);

export const getRegionSales = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getSalesByRegion(req.query);
    res.json(data);
  }
);

export const getStatusBreakdown = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getOrderStatusBreakdown(req.query);
    res.json(data);
  }
);

export const getTransactionsList = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getTransactions(req.query);
    res.json(data);
  }
);

export const getFilters = asyncHandler(async (_req: Request, res: Response) => {
  res.json(getFilterOptions());
});

export const exportTransactions = asyncHandler(
  async (req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="transactions-${Date.now()}.csv"`
    );

    const header =
      "Transaction ID,Customer Name,Product Name,Category,Region,Amount,Status,Transaction Date\n";
    res.write(header);

    for await (const batch of streamTransactionsForExport(req.query)) {
      for (const line of batch) {
        res.write(`${line}\n`);
      }
    }

    res.end();
  }
);

export const getTopProductsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getTopProducts(req.query);
    res.json(data);
  }
);

export const getProductMetricsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getProductMetrics(req.query);
    res.json(data);
  }
);

export const getProductsByCategoryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const data = await getProductsByCategory(req.query);
    res.json(data);
  }
);
