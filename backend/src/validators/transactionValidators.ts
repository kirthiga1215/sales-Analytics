import { query } from "express-validator";
import { CATEGORIES, REGIONS } from "../types";

const optionalDate = query("startDate")
  .optional()
  .isISO8601()
  .withMessage("startDate must be a valid ISO date");

const optionalEndDate = query("endDate")
  .optional()
  .isISO8601()
  .withMessage("endDate must be a valid ISO date");

const optionalCategory = query("category")
  .optional()
  .isIn([...CATEGORIES])
  .withMessage("Invalid category");

const optionalRegion = query("region")
  .optional()
  .isIn([...REGIONS])
  .withMessage("Invalid region");

const optionalSearch = query("search")
  .optional()
  .isString()
  .trim()
  .isLength({ max: 100 })
  .withMessage("Search must be at most 100 characters");

export const dashboardFilterValidators = [
  optionalDate,
  optionalEndDate,
  optionalCategory,
  optionalRegion,
  optionalSearch,
];

export const transactionValidators = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit must be between 1 and 100"),
  query("sortBy")
    .optional()
    .isIn(["amount", "date", "customerName"])
    .withMessage("Invalid sortBy field"),
  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("sortOrder must be asc or desc"),
  ...dashboardFilterValidators,
];

export const exportValidators = [...dashboardFilterValidators];
