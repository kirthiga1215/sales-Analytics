# Sales Analytics Dashboard - Complete Implementation Guide

## 🚀 Project Overview

This is a **full-stack sales analytics dashboard** built with:
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM
- **Database**: PostgreSQL
- **Infrastructure**: Docker & Docker Compose

The application handles **10,000+ mock transaction records** with server-side pagination, filtering, sorting, and CSV export capabilities.

---

## 📊 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js 14, React 19, TypeScript, Tailwind CSS, Recharts, Axios, Lucide |
| **Backend** | Node.js, Express.js, TypeScript, Prisma ORM, pino logging, express-validator |
| **Database** | PostgreSQL 15+ (Docker or Local) |
| **DevOps** | Docker, Docker Compose |

---

## ✨ Features Implemented

### Dashboard
- ✅ Summary Cards (Revenue, Orders, AOV, Customers, Top Category, Best Region)
- ✅ Revenue Trend Chart (Line Chart)
- ✅ Sales by Category (Bar Chart)
- ✅ Sales by Region (Bar Chart)
- ✅ Order Status Breakdown (Pie Chart)
- ✅ Paginated Transactions Table with sorting/searching
- ✅ Responsive UI with Tailwind CSS

### Filters
- ✅ Date Range Filter (Start & End Date)
- ✅ Category Filter (Electronics, Furniture, Books, Clothing, Sports, Home, Beauty)
- ✅ Region Filter (North, South, East, West, Central)
- ✅ Reset Filters Button
- ✅ Real-time UI updates on filter changes

### Data Management
- ✅ 15,000+ Mock Transactions Seeded
- ✅ Server-side Pagination (20/50/100 records per page)
- ✅ Sorting by Amount, Date, Customer Name
- ✅ Search by Customer Name
- ✅ CSV Export with Filters Applied
- ✅ Efficient Database Queries with Indexes

### Error Handling
- ✅ React Error Boundary
- ✅ Empty States
- ✅ Loading Skeletons
- ✅ Error Messages with Retry
- ✅ API Error Handling

---

## 🛠️ Quick Start

### 1. Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL 15+ (or Docker)

### 2. PostgreSQL Setup

**Option A: Using Docker (Recommended)**

```bash
cd sales-analytics
docker compose up -d
```

**Option B: Local PostgreSQL**

1. Install PostgreSQL locally
2. Create database:
```sql
CREATE DATABASE sales_analytics;
```
3. Update `backend/.env` with your connection string

### 3. Backend Setup

```bash
cd backend
npm install
npm run db:generate    # Generate Prisma client
npm run db:push        # Create tables
npm run db:seed        # Seed 15,000 records
npm run dev            # Start on port 4000
```

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run dev            # Start on port 3000
```

Visit: `http://localhost:3000/dashboard`

---

## 📁 Project Structure

```
sales-analytics/
├── frontend/                        # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/page.tsx  # Main dashboard
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── summary-cards/      # KPI cards
│   │   │   ├── charts/             # Recharts components
│   │   │   ├── filters/            # Filter controls
│   │   │   ├── transaction-table/  # Data table
│   │   │   ├── loading/            # Skeletons
│   │   │   ├── empty-state/        # Empty/error states
│   │   │   └── ui/                 # Base UI components
│   │   ├── services/apiClient.ts   # Axios client
│   │   ├── hooks/                  # Custom hooks
│   │   ├── types/api.ts            # Type definitions
│   │   └── lib/                    # Utilities
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.local
│
├── backend/                         # Express API
│   ├── src/
│   │   ├── controllers/            # Request handlers
│   │   ├── services/               # Business logic
│   │   ├── routes/index.ts         # API routes
│   │   ├── middlewares/            # Middleware
│   │   ├── validators/             # Validation
│   │   ├── types/                  # Type definitions
│   │   ├── config/                 # Configuration
│   │   ├── utils/                  # Helpers
│   │   ├── app.ts                  # Express setup
│   │   └── index.ts                # Server entry
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── seed.ts                 # Data seeding
│   ├── package.json
│   └── .env
│
├── docker-compose.yml              # PostgreSQL container
├── PROJECT_STATUS.md               # Implementation status
└── README.md                       # This file
```

---

## 🔌 API Endpoints

### Dashboard Analytics

```
GET /api/dashboard/summary         # Get KPI metrics
GET /api/dashboard/revenue-trend   # Revenue trend over time
GET /api/dashboard/category        # Sales by category
GET /api/dashboard/region          # Sales by region
GET /api/dashboard/status          # Order status breakdown
GET /api/filters                   # Available filters
```

### Transactions

```
GET /api/transactions              # Paginated transactions
GET /api/transactions/export       # Export as CSV
```

### Query Parameters

- `startDate`, `endDate` - Date range (YYYY-MM-DD)
- `category`, `region` - Filters
- `page`, `limit` - Pagination
- `sortBy` - Field to sort by
- `sortOrder` - asc/desc
- `search` - Search query

### Example Requests

```bash
# Get summary with filters
curl "http://localhost:4000/api/dashboard/summary?startDate=2024-01-01&endDate=2024-12-31&category=Electronics"

# Get paginated transactions
curl "http://localhost:4000/api/transactions?page=1&limit=50&sortBy=amount&sortOrder=desc"

# Export CSV
curl "http://localhost:4000/api/transactions/export?category=Electronics" > transactions.csv
```

---

## 📦 Database Schema

### Transactions Table

```sql
CREATE TABLE transactions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transaction_id VARCHAR(255) UNIQUE,
  customer_name VARCHAR(255),
  product_name VARCHAR(255),
  category VARCHAR(100),
  region VARCHAR(100),
  amount DECIMAL(10, 2),
  status VARCHAR(50),
  transaction_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_date (transaction_date),
  INDEX idx_category (category),
  INDEX idx_region (region),
  INDEX idx_status (status)
);
```

### Mock Data

- **Records**: 15,000 transactions
- **Date Range**: 2024-01-01 to 2026-06-15
- **Categories**: Electronics, Furniture, Books, Clothing, Sports, Home, Beauty
- **Regions**: North, South, East, West, Central
- **Statuses**: Completed, Pending, Cancelled, Returned
- **Amount**: $5 - $2,500

---

## 🔧 Configuration

### Backend `.env`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sales_analytics?schema=public"
NODE_ENV="development"
PORT=4000
CORS_ORIGIN="http://localhost:3000"
SEED_RECORD_COUNT=15000
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

---

## 📝 Npm Scripts

### Backend

```bash
npm run dev              # Development server
npm run build            # Build TypeScript
npm run start            # Production server
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to DB
npm run db:seed          # Seed mock data
npm run db:reset         # Reset database
npm run lint             # Run ESLint
```

### Frontend

```bash
npm run dev              # Development server
npm run build            # Build for production
npm run start            # Production server
npm run lint             # Run ESLint
```

---

## 🐛 Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED
```

**Solution**: Start PostgreSQL
```bash
# Docker
docker compose up -d

# Or start your local PostgreSQL server
```

### Port Already in Use

```bash
# Find process on port 4000
lsof -i :4000
kill -9 <PID>
```

### Database Reset

```bash
cd backend
npm run db:reset
npm run db:seed
```

---

## 🚀 Deployment

### Backend (Render, Fly.io, Railway)

1. Push to GitHub
2. Connect repository
3. Set environment variables
4. Deploy

### Frontend (Vercel, Netlify)

1. Push to GitHub
2. Import project
3. Set `NEXT_PUBLIC_API_URL` to production API
4. Deploy

---

## 📚 Project Completion Status

- ✅ Project scaffolding (Frontend & Backend)
- ✅ Database schema & Prisma setup
- ✅ Mock data seeding (15,000 records)
- ✅ Backend REST APIs (all endpoints)
- ✅ Frontend components (all)
- ✅ Global state management
- ✅ Charts & visualizations
- ✅ Pagination & filtering
- ✅ CSV export
- ✅ Error handling & boundaries
- ✅ Loading skeletons
- ✅ Empty/error states
- ✅ Responsive design
- ✅ Type-safe codebase

**Submission Deadline**: 6-7 Working Days ✅

---

**Last Updated**: June 15, 2026 | **Version**: 1.0.0 | **Status**: Production Ready

API runs at `http://localhost:4000`

Verify database connection:

```bash
curl http://localhost:4000/health
```

Expected response: `{ "status": "ok", "database": "connected", "recordCount": 15000 }`

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Dashboard at `http://localhost:3000/dashboard`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/summary` | Summary KPI cards |
| GET | `/api/dashboard/revenue-trend` | Revenue over time |
| GET | `/api/dashboard/category` | Sales by category |
| GET | `/api/dashboard/region` | Sales by region |
| GET | `/api/dashboard/status` | Order status breakdown |
| GET | `/api/transactions` | Paginated transactions |
| GET | `/api/transactions/export` | CSV export (filtered) |
| GET | `/api/filters` | Filter dropdown options |

## Features

- Glassmorphism dashboard UI
- 6 summary KPI cards with loading skeletons
- Date range, category, and region filters
- 4 interactive charts (line, bar, pie, donut)
- Server-side pagination, search, and sorting
- Backend CSV export for large datasets
- 15,000 mock records via Faker.js seed

## Environment Variables

**Backend** (`backend/.env`):

```
# Local PostgreSQL (default)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sales_analytics?schema=public

# Docker PostgreSQL (if using docker compose)
# DATABASE_URL=postgresql://sales:sales123@localhost:5432/sales_analytics?schema=public

PORT=4000
CORS_ORIGIN=http://localhost:3000
SEED_RECORD_COUNT=15000
```

**Frontend** (`frontend/.env.local`):
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
