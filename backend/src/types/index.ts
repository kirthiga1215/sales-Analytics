export const CATEGORIES = [
  "Electronics",
  "Furniture",
  "Books",
  "Clothing",
  "Sports",
  "Home",
  "Beauty",
] as const;

export const REGIONS = [
  "North",
  "South",
  "East",
  "West",
  "Central",
] as const;

export const STATUSES = [
  "Completed",
  "Pending",
  "Cancelled",
  "Returned",
] as const;

export type Category = (typeof CATEGORIES)[number];
export type Region = (typeof REGIONS)[number];
export type OrderStatus = (typeof STATUSES)[number];

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
