import { Prisma } from "@prisma/client";
import type { TransactionFilters, TransactionQuery } from "../types";

export function buildWhereClause(
  filters: TransactionFilters
): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = {};

  if (filters.startDate || filters.endDate) {
    where.transactionDate = {};
    if (filters.startDate) {
      where.transactionDate.gte = new Date(`${filters.startDate}T00:00:00.000Z`);
    }
    if (filters.endDate) {
      where.transactionDate.lte = new Date(`${filters.endDate}T23:59:59.999Z`);
    }
  }

  if (filters.category) {
    where.category = filters.category;
  }

  if (filters.region) {
    where.region = filters.region;
  }

  if (filters.search) {
    where.OR = [
      { customerName: { contains: filters.search, mode: "insensitive" } },
      { productName: { contains: filters.search, mode: "insensitive" } },
      { transactionId: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  return where;
}

export function buildOrderBy(
  sortBy?: TransactionQuery["sortBy"],
  sortOrder?: TransactionQuery["sortOrder"]
): Prisma.TransactionOrderByWithRelationInput {
  const order = sortOrder ?? "desc";

  switch (sortBy) {
    case "amount":
      return { amount: order };
    case "customerName":
      return { customerName: order };
    case "date":
    default:
      return { transactionDate: order };
  }
}

export function decimalToNumber(value: Prisma.Decimal | number): number {
  return typeof value === "number" ? value : Number(value.toString());
}

export function formatTransaction(row: {
  id: number;
  transactionId: string;
  customerName: string;
  productName: string;
  category: string;
  region: string;
  amount: Prisma.Decimal;
  status: string;
  transactionDate: Date;
}) {
  return {
    id: row.id,
    transactionId: row.transactionId,
    customerName: row.customerName,
    productName: row.productName,
    category: row.category,
    region: row.region,
    amount: decimalToNumber(row.amount),
    status: row.status,
    transactionDate: row.transactionDate.toISOString(),
  };
}
