"use client";

import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  Tag,
  MapPin,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/empty-state";
import { useDashboardSummary } from "@/hooks/use-dashboard-data";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { formatCurrency, formatNumber } from "@/lib/utils";

const cards = [
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: DollarSign,
    gradient: "from-emerald-400 to-teal-500",
    format: formatCurrency,
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingCart,
    gradient: "from-violet-400 to-purple-500",
    format: formatNumber,
  },
  {
    key: "averageOrderValue",
    label: "Average Order Value",
    icon: TrendingUp,
    gradient: "from-sky-400 to-blue-500",
    format: formatCurrency,
  },
  {
    key: "totalCustomers",
    label: "Total Customers",
    icon: Users,
    gradient: "from-amber-400 to-orange-500",
    format: formatNumber,
  },
  {
    key: "topSellingCategory",
    label: "Top Selling Category",
    icon: Tag,
    gradient: "from-pink-400 to-rose-500",
    format: (v: string | number) => String(v),
  },
  {
    key: "bestPerformingRegion",
    label: "Best Performing Region",
    icon: MapPin,
    gradient: "from-indigo-400 to-violet-500",
    format: (v: string | number) => String(v),
  },
] as const;

export function SummaryCards() {
  const { filters } = useDashboardFilters();
  const { data, isLoading, isError, refetch } = useDashboardSummary(filters);

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-5">
            <Skeleton className="mb-3 h-4 w-24" />
            <Skeleton className="h-8 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <ErrorState
        message="Unable to load summary metrics. Is the backend running on port 4000?"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {cards.map(({ key, label, icon: Icon, gradient, format }) => (
        <Card
          key={key}
          className="group relative overflow-hidden border-white/15 bg-white/8 p-5 transition-all hover:border-white/25 hover:bg-white/12"
        >
          <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gradient-to-br opacity-20 blur-2xl transition-opacity group-hover:opacity-30" />
          <CardContent className="relative p-0">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-white/50">
                {label}
              </p>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight text-white">
              {format(data[key] as never)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
