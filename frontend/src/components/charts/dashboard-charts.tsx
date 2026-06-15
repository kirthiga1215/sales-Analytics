"use client";

import { useAsync } from "@/hooks/useAsync";
import { apiClient } from "@/services/apiClient";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartSkeleton, SummaryCardSkeleton } from "@/components/loading/skeletons";
import { ErrorState, EmptyState } from "@/components/empty-state";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

interface ChartProps {
  title: string;
  dataKey: string;
  type?: "line" | "bar" | "pie";
}

export function RevenueChart({ title, dataKey }: ChartProps) {
  const { filters } = useDashboardFilters();
  const { data, loading, error } = useAsync(() =>
    apiClient.getRevenueTrend(filters)
  );

  if (loading) return <ChartSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data || data.length === 0) return <EmptyState title="No revenue data" />;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip formatter={(value) => {
            if (typeof value === "number") {
              return `$${value.toFixed(2)}`;
            }
            return value;
          }} />
          <Legend />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#3b82f6"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryChart({ title, dataKey }: ChartProps) {
  const { filters } = useDashboardFilters();
  const { data, loading, error } = useAsync(() =>
    apiClient.getCategorySales(filters)
  );

  if (loading) return <ChartSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data || data.length === 0) return <EmptyState title="No category data" />;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" angle={-45} textAnchor="end" height={60} />
          <YAxis />
          <Tooltip formatter={(value) => {
            if (typeof value === "number") {
              return `$${value.toFixed(2)}`;
            }
            return value;
          }} />
          <Legend />
          <Bar dataKey={dataKey} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RegionChart({ title, dataKey }: ChartProps) {
  const { filters } = useDashboardFilters();
  const { data, loading, error } = useAsync(() =>
    apiClient.getRegionSales(filters)
  );

  if (loading) return <ChartSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data || data.length === 0) return <EmptyState title="No region data" />;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip formatter={(value) => {
            if (typeof value === "number") {
              return `$${value.toFixed(2)}`;
            }
            return value;
          }} />
          <Legend />
          <Bar dataKey={dataKey} fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StatusChart({ title, dataKey }: ChartProps) {
  const { filters } = useDashboardFilters();
  const { data, loading, error } = useAsync(() =>
    apiClient.getStatusBreakdown(filters)
  );

  if (loading) return <ChartSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data || data.length === 0) return <EmptyState title="No status data" />;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey="status"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
