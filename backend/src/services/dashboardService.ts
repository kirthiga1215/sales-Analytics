import { prisma } from "../config/database";
import {
  buildOrderBy,
  buildWhereClause,
  decimalToNumber,
  formatTransaction,
} from "../utils/queryBuilder";
import type {
  CategorySales,
  DashboardSummary,
  FilterOptions,
  PaginatedTransactions,
  RegionSales,
  RevenueTrendPoint,
  StatusBreakdown,
  TransactionFilters,
  TransactionQuery,
  TopProduct,
  ProductMetrics,
  ProductByCategoryMetrics,
} from "../types";
import { CATEGORIES, REGIONS, STATUSES } from "../types";

function parseFilters(query: Record<string, unknown>): TransactionFilters {
  return {
    startDate: query.startDate as string | undefined,
    endDate: query.endDate as string | undefined,
    category: query.category as string | undefined,
    region: query.region as string | undefined,
    search: query.search as string | undefined,
  };
}

export async function getDashboardSummary(
  query: Record<string, unknown>
): Promise<DashboardSummary> {
  const filters = parseFilters(query);
  const where = buildWhereClause(filters);

  const [aggregate, topCategory, topRegion, customers] = await Promise.all([
    prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _count: { id: true },
      _avg: { amount: true },
    }),
    prisma.transaction.groupBy({
      by: ["category"],
      where,
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 1,
    }),
    prisma.transaction.groupBy({
      by: ["region"],
      where,
      _sum: { amount: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 1,
    }),
    prisma.transaction.findMany({
      where,
      select: { customerName: true },
      distinct: ["customerName"],
    }),
  ]);

  const totalRevenue = decimalToNumber(aggregate._sum.amount ?? 0);
  const totalOrders = aggregate._count.id;
  const averageOrderValue =
    totalOrders > 0 ? decimalToNumber(aggregate._avg.amount ?? 0) : 0;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    totalOrders,
    averageOrderValue: Math.round(averageOrderValue * 100) / 100,
    totalCustomers: customers.length,
    topSellingCategory: topCategory[0]?.category ?? "N/A",
    bestPerformingRegion: topRegion[0]?.region ?? "N/A",
  };
}

export async function getRevenueTrend(
  query: Record<string, unknown>
): Promise<RevenueTrendPoint[]> {
  const where = buildWhereClause(parseFilters(query));
  const conditions: string[] = ["1=1"];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (where.transactionDate && typeof where.transactionDate === "object") {
    const dateFilter = where.transactionDate as { gte?: Date; lte?: Date };
    if (dateFilter.gte) {
      conditions.push(`transaction_date >= $${paramIndex++}`);
      params.push(dateFilter.gte);
    }
    if (dateFilter.lte) {
      conditions.push(`transaction_date <= $${paramIndex++}`);
      params.push(dateFilter.lte);
    }
  }
  if (where.category) {
    conditions.push(`category = $${paramIndex++}`);
    params.push(where.category);
  }
  if (where.region) {
    conditions.push(`region = $${paramIndex++}`);
    params.push(where.region);
  }

  const sql = `
    SELECT DATE(transaction_date) as date, SUM(amount)::float as revenue
    FROM transactions
    WHERE ${conditions.join(" AND ")}
    GROUP BY DATE(transaction_date)
    ORDER BY date ASC
  `;

  // Use any-cast for prisma to avoid TypeScript generic errors when the runtime
  // prisma client shape differs on hosting platforms.
  const rows = (await (prisma as any).$queryRawUnsafe(sql, ...params)) as {
    date: Date;
    revenue: number;
  }[];

  return rows.map((row: any) => ({
    date: formatDateOnly(row.date),
    revenue: Math.round(Number(row.revenue) * 100) / 100,
  }));
}

function formatDateOnly(value: Date): string {
  const year = value.getUTCFullYear();
  const month = String(value.getUTCMonth() + 1).padStart(2, "0");
  const day = String(value.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getSalesByCategory(
  query: Record<string, unknown>
): Promise<CategorySales[]> {
  const where = buildWhereClause(parseFilters(query));
  const rows = await prisma.transaction.groupBy({
    by: ["category"],
    where,
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  return rows.map((row: any) => ({
    category: row.category,
    sales: Math.round(decimalToNumber(row._sum.amount ?? 0) * 100) / 100,
  }));
}

export async function getSalesByRegion(
  query: Record<string, unknown>
): Promise<RegionSales[]> {
  const where = buildWhereClause(parseFilters(query));
  const rows = await prisma.transaction.groupBy({
    by: ["region"],
    where,
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  return rows.map((row: any) => ({
    region: row.region,
    sales: Math.round(decimalToNumber(row._sum.amount ?? 0) * 100) / 100,
  }));
}

export async function getOrderStatusBreakdown(
  query: Record<string, unknown>
): Promise<StatusBreakdown[]> {
  const where = buildWhereClause(parseFilters(query));
  const rows = await prisma.transaction.groupBy({
    by: ["status"],
    where,
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  return rows.map((row: any) => ({
    status: row.status,
    count: row._count.id,
  }));
}

export async function getTransactions(
  query: Record<string, unknown>
): Promise<PaginatedTransactions> {
  const filters = parseFilters(query);
  const where = buildWhereClause(filters);
  const page = Math.max(1, parseInt(String(query.page ?? "1"), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? "20"), 10)));
  const sortBy = query.sortBy as TransactionQuery["sortBy"];
  const sortOrder = query.sortOrder as TransactionQuery["sortOrder"];
  const skip = (page - 1) * limit;

  const [rows, totalRecords] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: buildOrderBy(sortBy, sortOrder),
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    data: rows.map(formatTransaction),
    page,
    limit,
    totalRecords,
    totalPages: Math.ceil(totalRecords / limit) || 1,
  };
}

export async function* streamTransactionsForExport(
  query: Record<string, unknown>
): AsyncGenerator<string[]> {
  const where = buildWhereClause(parseFilters(query));
  const batchSize = 1000;
  let cursor: number | undefined;

  while (true) {
    const rows = await prisma.transaction.findMany({
      where,
      take: batchSize,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" },
    });

    if (rows.length === 0) break;

    yield rows.map((row: any) => {
      const t = formatTransaction(row);
      return [
        t.transactionId,
        t.customerName,
        t.productName,
        t.category,
        t.region,
        t.amount.toFixed(2),
        t.status,
        t.transactionDate,
      ].join(",");
    });

    cursor = rows[rows.length - 1]!.id;
    if (rows.length < batchSize) break;
  }
}

export function getFilterOptions(): FilterOptions {
  return {
    categories: [...CATEGORIES],
    regions: [...REGIONS],
    statuses: [...STATUSES],
  };
}

export async function getTopProducts(
  query: Record<string, unknown>
): Promise<TopProduct[]> {
  const where = buildWhereClause(parseFilters(query));
  const rows = await prisma.transaction.groupBy({
    by: ["productName", "category"],
    where,
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 10,
  });

  return rows.map((row: any) => ({
    productName: row.productName,
    revenue: Math.round(decimalToNumber(row._sum.amount ?? 0) * 100) / 100,
    quantity: row._count.id,
    category: row.category,
  }));
}

export async function getProductMetrics(
  query: Record<string, unknown>
): Promise<ProductMetrics> {
  const where = buildWhereClause(parseFilters(query));

  const [uniqueProducts, aggregate] = await Promise.all([
    prisma.transaction.findMany({
      where,
      select: { productName: true },
      distinct: ["productName"],
    }),
    prisma.transaction.aggregate({
      where,
      _sum: { amount: true },
      _avg: { amount: true },
    }),
  ]);

  const topProduct = await prisma.transaction.groupBy({
    by: ["productName"],
    where,
    _sum: { amount: true },
    orderBy: { _sum: { amount: "desc" } },
    take: 1,
  });

  return {
    totalUniqueProducts: uniqueProducts.length,
    totalProductRevenue: Math.round(
      decimalToNumber(aggregate._sum.amount ?? 0) * 100
    ) / 100,
    averageProductPrice: Math.round(
      decimalToNumber(aggregate._avg.amount ?? 0) * 100
    ) / 100,
    topProduct: topProduct[0]?.productName ?? "N/A",
  };
}

export async function getProductsByCategory(
  query: Record<string, unknown>
): Promise<ProductByCategoryMetrics[]> {
  const where = buildWhereClause(parseFilters(query));

  const rows = await prisma.transaction.groupBy({
    by: ["category"],
    where,
    _sum: { amount: true },
    _count: { id: true },
    orderBy: { _sum: { amount: "desc" } },
  });

  const productCounts = await Promise.all(
    rows.map(async (row: any) => {
      const uniqueCount = await prisma.transaction.findMany({
        where: { ...where, category: row.category },
        select: { productName: true },
        distinct: ["productName"],
      });
      return {
        category: row.category,
        totalRevenue: Math.round(
          decimalToNumber(row._sum.amount ?? 0) * 100
        ) / 100,
        numberOfProducts: uniqueCount.length,
        averagePrice: Math.round(
          (decimalToNumber(row._sum.amount ?? 0) / row._count.id) * 100
        ) / 100,
      };
    })
  );

  return productCounts;
}
