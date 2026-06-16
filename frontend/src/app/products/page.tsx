"use client";

import { AppNavigation } from "@/components/navigation/app-navigation";
import { DashboardFilters } from "@/components/filters";
import { DashboardFilterProvider, useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { useAsync } from "@/hooks/useAsync";
import { apiClient } from "@/services/apiClient";
import { BarChart3, TrendingUp, Package, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

function ProductsContent() {
  const { filters } = useDashboardFilters();

  const { data: metrics, loading: metricsLoading } = useAsync(
    () => apiClient.getProductMetrics(filters),
    [filters]
  );

  const { data: topProducts, loading: topProductsLoading } = useAsync(
    () => apiClient.getTopProducts(filters),
    [filters]
  );

  const { data: productsByCategory, loading: categoriesLoading } = useAsync(
    () => apiClient.getProductsByCategory(filters),
    [filters]
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-violet-600/30 blur-[120px]" />
        <div className="absolute -right-32 top-1/4 h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[100px]" />
        <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-indigo-600/25 blur-[100px]" />
      </div>

      <AppNavigation />

      <main className="mx-auto max-w-[1600px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Package className="h-6 w-6 text-violet-300" />
            Products Report
          </h2>
          <p className="mt-1 text-sm text-white/60">
            Analyze product performance and sales metrics
          </p>
        </div>

        <DashboardFilters />

        {/* Product Metrics Cards */}
        <div className="transition-opacity duration-300 ease-in-out">
          {metrics ? (
            <div className="grid gap-4 md:grid-cols-4">
              <MetricCard
                title="Total Unique Products"
                value={metrics.totalUniqueProducts}
                icon={<Package className="h-5 w-5" />}
              />
              <MetricCard
                title="Total Revenue"
                value={`$${(metrics.totalProductRevenue / 1000000).toFixed(2)}M`}
                icon={<TrendingUp className="h-5 w-5" />}
              />
              <MetricCard
                title="Average Price"
                value={`$${metrics.averageProductPrice.toLocaleString()}`}
                icon={<BarChart3 className="h-5 w-5" />}
              />
              <MetricCard
                title="Top Product"
                value={metrics.topProduct}
                icon={<Package className="h-5 w-5" />}
                isText
              />
            </div>
          ) : metricsLoading ? (
            <div className="grid gap-4 md:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-24 rounded-lg bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : null}
        </div>

        {/* Top Products Table */}
        <div className="rounded-lg border border-white/10 bg-slate-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">
            Top 10 Products by Revenue
          </h3>
          <div className="transition-opacity duration-300 ease-in-out">
            {topProducts && topProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="px-4 py-2 text-left text-white/70">Product Name</th>
                      <th className="px-4 py-2 text-left text-white/70">Category</th>
                      <th className="px-4 py-2 text-right text-white/70">Revenue</th>
                      <th className="px-4 py-2 text-right text-white/70">Quantity Sold</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map((product, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 text-white">{product.productName}</td>
                        <td className="px-4 py-3 text-white/60">{product.category}</td>
                        <td className="px-4 py-3 text-right text-green-400">
                          ${product.revenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-white/60">
                          {product.quantity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : topProductsLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 rounded bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-white/60">
                <AlertCircle className="mr-2 h-5 w-5" />
                No products found
              </div>
            )}
          </div>
        </div>

        {/* Products by Category */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Category Performance</h3>
            <div className="transition-opacity duration-300 ease-in-out">
              {productsByCategory && productsByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="category" tick={{ fill: "rgba(255,255,255,0.6)" }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.6)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "white" }}
                    />
                    <Bar dataKey="totalRevenue" fill="#a855f7" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              ) : categoriesLoading ? (
                <div className="h-80 rounded bg-white/5 animate-pulse" />
              ) : null}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-900/50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-white">Products per Category</h3>
            <div className="transition-opacity duration-300 ease-in-out">
              {productsByCategory && productsByCategory.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={productsByCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="category" tick={{ fill: "rgba(255,255,255,0.6)" }} />
                    <YAxis tick={{ fill: "rgba(255,255,255,0.6)" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                      }}
                      labelStyle={{ color: "white" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="numberOfProducts"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      name="Product Count"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : categoriesLoading ? (
                <div className="h-80 rounded bg-white/5 animate-pulse" />
              ) : null}
            </div>
          </div>
        </div>

        {/* Category Details Table */}
        <div className="rounded-lg border border-white/10 bg-slate-900/50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">Category Breakdown</h3>
          <div className="transition-opacity duration-300 ease-in-out">
            {productsByCategory && productsByCategory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-white/10">
                    <tr>
                      <th className="px-4 py-2 text-left text-white/70">Category</th>
                      <th className="px-4 py-2 text-right text-white/70">Total Revenue</th>
                      <th className="px-4 py-2 text-right text-white/70">Unique Products</th>
                      <th className="px-4 py-2 text-right text-white/70">Average Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productsByCategory.map((cat, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150"
                      >
                        <td className="px-4 py-3 font-medium text-white">{cat.category}</td>
                        <td className="px-4 py-3 text-right text-green-400">
                          ${cat.totalRevenue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right text-white/60">
                          {cat.numberOfProducts}
                        </td>
                        <td className="px-4 py-3 text-right text-white/60">
                          ${cat.averagePrice.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : categoriesLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-12 rounded bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  isText = false,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  isText?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 p-4">
      <div className="flex items-center gap-2 text-white/60 mb-2">
        {icon}
        <span className="text-sm">{title}</span>
      </div>
      <div
        className={`${
          isText
            ? "text-lg font-semibold text-white truncate"
            : "text-2xl font-bold text-white"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <DashboardFilterProvider>
      <ProductsContent />
    </DashboardFilterProvider>
  );
}