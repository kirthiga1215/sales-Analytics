import axios from "axios";
import type {
  CategorySales,
  DashboardSummary,
  FilterOptions,
  PaginatedTransactions,
  RegionSales,
  RevenueTrendPoint,
  StatusBreakdown,
  TransactionFilters,
  TransactionQuery,
} from "@/types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://sales-analytics-production-dded.up.railway.app/api";

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

function toParams(filters: TransactionFilters | TransactionQuery) {
  const params: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") {
      params[key] = value as string | number;
    }
  }
  return params;
}

export async function fetchSummary(
  filters: TransactionFilters
): Promise<DashboardSummary> {
  const { data } = await api.get<DashboardSummary>("/dashboard/summary", {
    params: toParams(filters),
  });
  return data;
}

export async function fetchRevenueTrend(
  filters: TransactionFilters
): Promise<RevenueTrendPoint[]> {
  const { data } = await api.get<RevenueTrendPoint[]>("/dashboard/revenue-trend", {
    params: toParams(filters),
  });
  return data;
}

export async function fetchCategorySales(
  filters: TransactionFilters
): Promise<CategorySales[]> {
  const { data } = await api.get<CategorySales[]>("/dashboard/category", {
    params: toParams(filters),
  });
  return data;
}

export async function fetchRegionSales(
  filters: TransactionFilters
): Promise<RegionSales[]> {
  const { data } = await api.get<RegionSales[]>("/dashboard/region", {
    params: toParams(filters),
  });
  return data;
}

export async function fetchStatusBreakdown(
  filters: TransactionFilters
): Promise<StatusBreakdown[]> {
  const { data } = await api.get<StatusBreakdown[]>("/dashboard/status", {
    params: toParams(filters),
  });
  return data;
}

export async function fetchTransactions(
  query: TransactionQuery
): Promise<PaginatedTransactions> {
  const { data } = await api.get<PaginatedTransactions>("/transactions", {
    params: toParams(query),
  });
  return data;
}

export async function fetchFilterOptions(): Promise<FilterOptions> {
  const { data } = await api.get<FilterOptions>("/filters");
  return data;
}

export function getExportUrl(filters: TransactionFilters): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return `${API_BASE}/transactions/export${qs ? `?${qs}` : ""}`;
}
