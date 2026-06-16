import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  DashboardSummary,
  RevenueTrendPoint,
  CategorySales,
  RegionSales,
  StatusBreakdown,
  PaginatedTransactions,
  FilterOptions,
  DashboardFilters,
  TransactionQueryParams,
  TopProduct,
  ProductMetrics,
  ProductByCategoryMetrics,
} from "@/types/api";

interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL =
    process.env.NEXT_PUBLIC_API_URL || "https://sales-analytics-production-dded.up.railway.app/api";
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  private handleError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      return {
        message: error.response?.data?.message || error.message,
        status: error.response?.status,
      };
    }
    return { message: "An unexpected error occurred" };
  }

  async getSummary(filters: DashboardFilters): Promise<DashboardSummary> {
    try {
      const { data } = await this.client.get<DashboardSummary>(
        "/dashboard/summary",
        {
          params: this.buildFilterParams(filters),
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRevenueTrend(filters: DashboardFilters): Promise<RevenueTrendPoint[]> {
    try {
      const { data } = await this.client.get<RevenueTrendPoint[]>(
        "/dashboard/revenue-trend",
        {
          params: this.buildFilterParams(filters),
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getCategorySales(filters: DashboardFilters): Promise<CategorySales[]> {
    try {
      const { data } = await this.client.get<CategorySales[]>(
        "/dashboard/category",
        {
          params: this.buildFilterParams(filters),
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getRegionSales(filters: DashboardFilters): Promise<RegionSales[]> {
    try {
      const { data } = await this.client.get<RegionSales[]>(
        "/dashboard/region",
        {
          params: this.buildFilterParams(filters),
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getStatusBreakdown(filters: DashboardFilters): Promise<StatusBreakdown[]> {
    try {
      const { data } = await this.client.get<StatusBreakdown[]>(
        "/dashboard/status",
        {
          params: this.buildFilterParams(filters),
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTransactions(
    params: TransactionQueryParams
  ): Promise<PaginatedTransactions> {
    try {
      const { data } = await this.client.get<PaginatedTransactions>(
        "/transactions",
        {
          params: this.buildTransactionParams(params),
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getFilterOptions(): Promise<FilterOptions> {
    try {
      const { data } = await this.client.get<FilterOptions>("/filters");
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exportTransactions(filters: DashboardFilters): Promise<Blob> {
    try {
      const { data } = await this.client.get("/transactions/export", {
        params: this.buildFilterParams(filters),
        responseType: "blob",
      });
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getTopProducts(filters: DashboardFilters): Promise<TopProduct[]> {
    try {
      const { data } = await this.client.get<TopProduct[]>(
        "/products/top",
        {
          params: this.buildFilterParams(filters),
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductMetrics(filters: DashboardFilters): Promise<ProductMetrics> {
    try {
      const { data } = await this.client.get<ProductMetrics>(
        "/products/metrics",
        {
          params: this.buildFilterParams(filters),
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getProductsByCategory(filters: DashboardFilters): Promise<ProductByCategoryMetrics[]> {
    try {
      const { data } = await this.client.get<ProductByCategoryMetrics[]>(
        "/products/by-category",
        {
          params: this.buildFilterParams(filters),
        }
      );
      return data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private buildFilterParams(filters: DashboardFilters) {
    return {
      ...(filters.startDate && { startDate: filters.startDate }),
      ...(filters.endDate && { endDate: filters.endDate }),
      ...(filters.category && { category: filters.category }),
      ...(filters.region && { region: filters.region }),
    };
  }

  private buildTransactionParams(params: TransactionQueryParams) {
    return {
      ...this.buildFilterParams(params),
      page: params.page || 1,
      limit: params.limit || 20,
      ...(params.search && { search: params.search }),
      ...(params.sortBy && { sortBy: params.sortBy }),
      ...(params.sortOrder && { sortOrder: params.sortOrder }),
    };
  }
}

export const apiClient = new ApiClient();
