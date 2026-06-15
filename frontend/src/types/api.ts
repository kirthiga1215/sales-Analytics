// API Response Types
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

export interface Transaction {
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
  data: Transaction[];
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

// Filter Types
export interface DashboardFilters {
  startDate: string | null;
  endDate: string | null;
  category: string | null;
  region: string | null;
}

export interface TransactionQueryParams extends DashboardFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: "amount" | "date" | "customerName";
  sortOrder?: "asc" | "desc";
}

// Product Types
export interface TopProduct {
  productName: string;
  revenue: number;
  quantity: number;
  category: string;
}

export interface ProductMetrics {
  totalUniqueProducts: number;
  totalProductRevenue: number;
  averageProductPrice: number;
  topProduct: string;
}

export interface ProductByCategoryMetrics {
  category: string;
  totalRevenue: number;
  numberOfProducts: number;
  averagePrice: number;
}
