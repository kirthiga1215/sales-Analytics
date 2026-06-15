import { Router } from "express";
import {
  exportTransactions,
  getCategorySales,
  getFilters,
  getRegionSales,
  getRevenueTrendHandler,
  getStatusBreakdown,
  getSummary,
  getTransactionsList,
  getTopProductsHandler,
  getProductMetricsHandler,
  getProductsByCategoryHandler,
} from "../controllers/dashboardController";
import { validateRequest } from "../middlewares/validateRequest";
import {
  dashboardFilterValidators,
  exportValidators,
  transactionValidators,
} from "../validators/transactionValidators";

const router = Router();

router.get("/filters", getFilters);

router.get(
  "/dashboard/summary",
  dashboardFilterValidators,
  validateRequest,
  getSummary
);

router.get(
  "/dashboard/revenue-trend",
  dashboardFilterValidators,
  validateRequest,
  getRevenueTrendHandler
);

router.get(
  "/dashboard/category",
  dashboardFilterValidators,
  validateRequest,
  getCategorySales
);

router.get(
  "/dashboard/region",
  dashboardFilterValidators,
  validateRequest,
  getRegionSales
);

router.get(
  "/dashboard/status",
  dashboardFilterValidators,
  validateRequest,
  getStatusBreakdown
);

router.get(
  "/transactions",
  transactionValidators,
  validateRequest,
  getTransactionsList
);

router.get(
  "/transactions/export",
  exportValidators,
  validateRequest,
  exportTransactions
);

router.get(
  "/products/top",
  dashboardFilterValidators,
  validateRequest,
  getTopProductsHandler
);

router.get(
  "/products/metrics",
  dashboardFilterValidators,
  validateRequest,
  getProductMetricsHandler
);

router.get(
  "/products/by-category",
  dashboardFilterValidators,
  validateRequest,
  getProductsByCategoryHandler
);

export default router;
