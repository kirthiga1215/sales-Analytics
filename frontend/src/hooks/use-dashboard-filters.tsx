"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { TransactionFilters, TransactionQuery } from "@/types";

interface DashboardFilterContextValue {
  filters: TransactionFilters;
  tableQuery: TransactionQuery;
  setFilters: (filters: Partial<TransactionFilters>) => void;
  setTableQuery: (query: Partial<TransactionQuery>) => void;
  resetFilters: () => void;
}

const DashboardFilterContext = createContext<DashboardFilterContextValue | null>(null);

const defaultFilters: TransactionFilters = {};
const defaultTableQuery: TransactionQuery = {
  page: 1,
  limit: 20,
  sortBy: "date",
  sortOrder: "desc",
};

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFiltersState] = useState<TransactionFilters>(defaultFilters);
  const [tableQuery, setTableQueryState] = useState<TransactionQuery>(defaultTableQuery);

  const value = useMemo(
    () => ({
      filters,
      tableQuery: { ...filters, ...tableQuery },
      setFilters: (next: Partial<TransactionFilters>) => {
        setFiltersState((prev) => ({ ...prev, ...next }));
        setTableQueryState((prev) => ({ ...prev, page: 1 }));
      },
      setTableQuery: (next: Partial<TransactionQuery>) => {
        setTableQueryState((prev) => ({ ...prev, ...next }));
      },
      resetFilters: () => {
        setFiltersState(defaultFilters);
        setTableQueryState(defaultTableQuery);
      },
    }),
    [filters, tableQuery]
  );

  return (
    <DashboardFilterContext.Provider value={value}>
      {children}
    </DashboardFilterContext.Provider>
  );
}

export function useDashboardFilters() {
  const ctx = useContext(DashboardFilterContext);
  if (!ctx) {
    throw new Error("useDashboardFilters must be used within DashboardFilterProvider");
  }
  return ctx;
}
