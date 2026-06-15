"use client";

import { useAsync } from "@/hooks/useAsync";
import { apiClient } from "@/services/apiClient";
import { useDashboardFilters } from "@/hooks/useDashboardFilters";
import { useState } from "react";
import { ChevronUp, ChevronDown, Download } from "lucide-react";
import { TableSkeleton } from "@/components/loading/skeletons";
import { ErrorState, EmptyState } from "@/components/empty-state";
import type { TransactionQueryParams } from "@/types/api";

type SortBy = "amount" | "date" | "customerName";
type SortOrder = "asc" | "desc";

export function TransactionTable() {
  const { filters } = useDashboardFilters();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [search, setSearch] = useState("");

  const queryParams: TransactionQueryParams = {
    ...filters,
    page,
    limit,
    sortBy,
    sortOrder,
    search: search || undefined,
  };

  const { data, loading, error, error: loadError } = useAsync(() =>
    apiClient.getTransactions(queryParams),
    false
  );

  const handleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const handleExport = async () => {
    try {
      const blob = await apiClient.exportTransactions(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert("Failed to export transactions");
    }
  };

  if (!data) {
    return (
      <div className="space-y-4">
        <TableSkeleton />
      </div>
    );
  }

  if (error) return <ErrorState message={error.message} />;
  if (data.data.length === 0) return <EmptyState title="No transactions found" />;

  const SortIcon = ({ field }: { field: SortBy }) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 inline ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Transactions</h3>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Transaction ID
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Customer
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Product
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Category
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Region
              </th>
              <th
                className="px-6 py-3 text-left font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("amount")}
              >
                Amount <SortIcon field="amount" />
              </th>
              <th className="px-6 py-3 text-left font-semibold text-gray-900">
                Status
              </th>
              <th
                className="px-6 py-3 text-left font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("date")}
              >
                Date <SortIcon field="date" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.data.map((transaction) => (
              <tr
                key={transaction.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-900 font-medium">
                  {transaction.transactionId}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {transaction.customerName}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {transaction.productName}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 text-gray-700">{transaction.region}</td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  ${transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.status === "Cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {(page - 1) * limit + 1} to{" "}
          {Math.min(page * limit, data.totalRecords)} of {data.totalRecords}{" "}
          results
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, data.totalPages) }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`px-3 py-2 rounded-lg ${
                    page === pageNum
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(Math.min(data.totalPages, page + 1))}
            disabled={page === data.totalPages}
            className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(parseInt(e.target.value));
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>
    </div>
  );
}
