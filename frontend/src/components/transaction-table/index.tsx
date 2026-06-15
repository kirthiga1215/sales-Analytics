"use client";

import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState, ErrorState } from "@/components/empty-state";
import { useTransactions } from "@/hooks/use-dashboard-data";
import { useDashboardFilters } from "@/hooks/use-dashboard-filters";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getExportUrl } from "@/services/api";

const statusVariant: Record<
  string,
  "success" | "warning" | "danger" | "muted" | "default"
> = {
  Completed: "success",
  Pending: "warning",
  Cancelled: "danger",
  Returned: "muted",
};

export function TransactionTable() {
  const { filters, tableQuery, setTableQuery } = useDashboardFilters();
  const [searchInput, setSearchInput] = useState(tableQuery.search ?? "");
  const { data, isLoading, isError, refetch, isFetching } = useTransactions(tableQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTableQuery({ search: searchInput || undefined, page: 1 });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, setTableQuery]);

  const toggleSort = useCallback(
    (field: "amount" | "date" | "customerName") => {
      const isSame = tableQuery.sortBy === field;
      setTableQuery({
        sortBy: field,
        sortOrder: isSame && tableQuery.sortOrder === "desc" ? "asc" : "desc",
      });
    },
    [tableQuery.sortBy, tableQuery.sortOrder, setTableQuery]
  );

  const SortIcon = ({ field }: { field: "amount" | "date" | "customerName" }) => {
    if (tableQuery.sortBy !== field) return null;
    return tableQuery.sortOrder === "asc" ? (
      <ArrowUp className="ml-1 inline h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 inline h-3 w-3" />
    );
  };

  const handleExport = () => {
    window.open(
      getExportUrl({ ...filters, search: tableQuery.search }),
      "_blank"
    );
  };

  return (
    <Card className="border-white/15 bg-white/8">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base">Transactions</CardTitle>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="Search customer, product, ID..."
              className="w-full pl-9 sm:w-64"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : !data?.data.length ? (
          <EmptyState />
        ) : (
          <>
            <div className={`rounded-xl border border-white/10 ${isFetching ? "opacity-70" : ""}`}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => toggleSort("customerName")}
                    >
                      Customer
                      <SortIcon field="customerName" />
                    </TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => toggleSort("amount")}
                    >
                      Amount
                      <SortIcon field="amount" />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => toggleSort("date")}
                    >
                      Date
                      <SortIcon field="date" />
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs text-violet-200">
                        {row.transactionId}
                      </TableCell>
                      <TableCell>{row.customerName}</TableCell>
                      <TableCell className="max-w-[180px] truncate">
                        {row.productName}
                      </TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.region}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(row.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[row.status] ?? "default"}>
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-white/60">
                        {formatDate(row.transactionDate)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-white/50">
                Showing {(data.page - 1) * data.limit + 1}–
                {Math.min(data.page * data.limit, data.totalRecords)} of{" "}
                {data.totalRecords.toLocaleString()} records
              </p>
              <div className="flex items-center gap-3">
                <Select
                  value={String(tableQuery.limit ?? 20)}
                  onValueChange={(v) =>
                    setTableQuery({ limit: parseInt(v, 10), page: 1 })
                  }
                >
                  <SelectTrigger className="w-[100px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50, 100].map((n) => (
                      <SelectItem key={n} value={String(n)}>
                        {n} / page
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={data.page <= 1}
                    onClick={() => setTableQuery({ page: data.page - 1 })}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="min-w-[80px] text-center text-sm text-white/70">
                    {data.page} / {data.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    disabled={data.page >= data.totalPages}
                    onClick={() => setTableQuery({ page: data.page + 1 })}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
