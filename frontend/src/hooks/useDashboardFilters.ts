"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { DashboardFilters } from "@/types/api";

interface DashboardContextType {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  resetFilters: () => void;
}

const defaultFilters: DashboardFilters = {
  startDate: null,
  endDate: null,
  category: null,
  region: null,
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const value: DashboardContextType = {
    filters,
    setFilters,
    resetFilters: handleResetFilters,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardFilters() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboardFilters must be used within DashboardProvider");
  }
  return context;
}
