"use client";

import { useAsync } from "@/hooks/useAsync";
import { apiClient } from "@/services/apiClient";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import { DollarSign, ShoppingCart, TrendingUp, Users, Tag, MapPin } from "lucide-react";
import { SummaryCardSkeleton } from "@/components/loading/skeletons";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  loading?: boolean;
}

function SummaryCard({ title, value, icon, loading }: SummaryCardProps) {
  if (loading) return <SummaryCardSkeleton />;

  return (
    <div className="bg-white rounded-lg shadow p-6 flex items-center gap-4">
      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
        {icon}
      </div>
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

export function DashboardSummary() {
  const { filters } = useDashboardFilters();
  const { data: summary, loading, error } = useAsync(() =>
    apiClient.getSummary(filters)
  );

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading summary: {error.message}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <SummaryCard
        title="Total Revenue"
        value={
          summary
            ? `$${summary.totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "$0.00"
        }
        icon={<DollarSign className="w-6 h-6" />}
        loading={loading}
      />
      <SummaryCard
        title="Total Orders"
        value={summary?.totalOrders.toLocaleString() || "0"}
        icon={<ShoppingCart className="w-6 h-6" />}
        loading={loading}
      />
      <SummaryCard
        title="Avg Order Value"
        value={
          summary
            ? `$${summary.averageOrderValue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "$0.00"
        }
        icon={<TrendingUp className="w-6 h-6" />}
        loading={loading}
      />
      <SummaryCard
        title="Total Customers"
        value={summary?.totalCustomers.toLocaleString() || "0"}
        icon={<Users className="w-6 h-6" />}
        loading={loading}
      />
      <SummaryCard
        title="Top Category"
        value={summary?.topSellingCategory || "N/A"}
        icon={<Tag className="w-6 h-6" />}
        loading={loading}
      />
      <SummaryCard
        title="Best Region"
        value={summary?.bestPerformingRegion || "N/A"}
        icon={<MapPin className="w-6 h-6" />}
        loading={loading}
      />
    </div>
  );
}
