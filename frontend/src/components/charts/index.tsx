"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/empty-state";
import {
  useCategorySales,
  useRegionSales,
  useRevenueTrend,
  useStatusBreakdown,
} from "@/hooks/use-dashboard-data";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { formatCurrency, formatNumber } from "@/lib/utils";

const CHART_COLORS = [
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
  "#14b8a6",
];

const tooltipStyle = {
  contentStyle: {
    background: "rgba(15, 23, 42, 0.9)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "12px",
    backdropFilter: "blur(12px)",
    color: "#fff",
  },
};

function ChartSkeleton({ height = 280 }: { height?: number }) {
  return <Skeleton className="w-full" style={{ height }} />;
}

function ChartError({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[280px] items-center justify-center">
      <ErrorState message={message} onRetry={onRetry} />
    </div>
  );
}

export function RevenueTrendChart() {
  const { filters } = useDashboardFilters();
  const { data, isLoading, isError, refetch } = useRevenueTrend(filters);

  return (
    <Card className="border-white/15 bg-white/8 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Revenue Trend</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ChartSkeleton />
        ) : isError ? (
          <ChartError
            message="Failed to load revenue trend."
            onRetry={() => refetch()}
          />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={data ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [formatCurrency(Number(value)), "Revenue"]}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: "#a78bfa" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function CategoryBarChart() {
  const { filters } = useDashboardFilters();
  const { data, isLoading, isError, refetch } = useCategorySales(filters);

  return (
    <Card className="border-white/15 bg-white/8">
      <CardHeader>
        <CardTitle className="text-base">Sales by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <ChartSkeleton />
        ) : isError ? (
          <ChartError
            message="Failed to load category sales."
            onRetry={() => refetch()}
          />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="category"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 10 }}
                interval={0}
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [formatCurrency(Number(value)), "Sales"]}
              />
              <Bar dataKey="sales" radius={[6, 6, 0, 0]}>
                {(data ?? []).map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function RegionPieChart() {
  const { filters } = useDashboardFilters();
  const { data, isLoading, isError, refetch } = useRegionSales(filters);

  return (
    <Card className="border-white/15 bg-white/8">
      <CardHeader>
        <CardTitle className="text-base">Sales by Region</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[280px]">
        {isLoading ? (
          <ChartSkeleton />
        ) : isError ? (
          <ChartError
            message="Failed to load regional sales."
            onRetry={() => refetch()}
          />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data ?? []} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                type="number"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="region"
                width={70}
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [formatCurrency(Number(value)), "Sales"]}
              />
              <Bar dataKey="sales" radius={[0, 6, 6, 0]}>
                {(data ?? []).map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function StatusDonutChart() {
  const { filters } = useDashboardFilters();
  const { data, isLoading, isError, refetch } = useStatusBreakdown(filters);

  return (
    <Card className="border-white/15 bg-white/8">
      <CardHeader>
        <CardTitle className="text-base">Order Status</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[280px]">
        {isLoading ? (
          <ChartSkeleton />
        ) : isError ? (
          <ChartError
            message="Failed to load order status breakdown."
            onRetry={() => refetch()}
          />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
              <XAxis
                dataKey="status"
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.5)", fontSize: 11 }}
                tickFormatter={(v) => formatNumber(v)}
              />
              <Tooltip
                {...tooltipStyle}
                formatter={(value) => [formatNumber(Number(value)), "Orders"]}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {(data ?? []).map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardCharts() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <RevenueTrendChart />
      <CategoryBarChart />
      <RegionPieChart />
      <StatusDonutChart />
    </div>
  );
}
