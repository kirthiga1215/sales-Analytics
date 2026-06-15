"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchCategorySales,
  fetchFilterOptions,
  fetchRegionSales,
  fetchRevenueTrend,
  fetchStatusBreakdown,
  fetchSummary,
  fetchTransactions,
} from "@/services/api";
import type { TransactionFilters, TransactionQuery } from "@/types";

export function useFilterOptions() {
  return useQuery({
    queryKey: ["filterOptions"],
    queryFn: fetchFilterOptions,
  });
}

export function useDashboardSummary(filters: TransactionFilters) {
  return useQuery({
    queryKey: ["summary", filters],
    queryFn: () => fetchSummary(filters),
  });
}

export function useRevenueTrend(filters: TransactionFilters) {
  return useQuery({
    queryKey: ["revenueTrend", filters],
    queryFn: () => fetchRevenueTrend(filters),
  });
}

export function useCategorySales(filters: TransactionFilters) {
  return useQuery({
    queryKey: ["categorySales", filters],
    queryFn: () => fetchCategorySales(filters),
  });
}

export function useRegionSales(filters: TransactionFilters) {
  return useQuery({
    queryKey: ["regionSales", filters],
    queryFn: () => fetchRegionSales(filters),
  });
}

export function useStatusBreakdown(filters: TransactionFilters) {
  return useQuery({
    queryKey: ["statusBreakdown", filters],
    queryFn: () => fetchStatusBreakdown(filters),
  });
}

export function useTransactions(query: TransactionQuery) {
  return useQuery({
    queryKey: ["transactions", query],
    queryFn: () => fetchTransactions(query),
    placeholderData: (prev) => prev,
  });
}
