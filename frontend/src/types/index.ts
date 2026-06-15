export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  category?: string;
  region?: string;
  search?: string;
}

export interface TransactionQuery extends TransactionFilters {
  page?: number;
  limit?: number;
  sortBy?: "amount" | "date" | "customerName";
  sortOrder?: "asc" | "desc";
}

export interface DashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  topSellingCategory: string;
  bestPerformingRegion: string;
}

export interface RevenueTrendPoint {
  date: string;
  revenue: number;
}

export interface CategorySales {
  category: string;
  sales: number;
}

export interface RegionSales {
  region: string;
  sales: number;
}

export interface StatusBreakdown {
  status: string;
  count: number;
}

export interface TransactionRecord {
  id: number;
  transactionId: string;
  customerName: string;
  productName: string;
  category: string;
  region: string;
  amount: number;
  status: string;
  transactionDate: string;
}

export interface PaginatedTransactions {
  data: TransactionRecord[];
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface FilterOptions {
  categories: string[];
  regions: string[];
  statuses: string[];
}
