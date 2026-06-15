#!/bin/bash
# Quick Start Guide for Sales Analytics Dashboard

echo "=========================================="
echo "Sales Analytics Dashboard - Quick Start"
echo "=========================================="
echo ""

# Step 1: Database
echo "Step 1: Starting PostgreSQL Database..."
echo ""
echo "Choose one:"
echo "  A) Docker (recommended): docker compose up -d"
echo "  B) Local PostgreSQL: Ensure it's running"
echo ""
read -p "Enter your choice (A/B): " choice

if [ "$choice" = "A" ] || [ "$choice" = "a" ]; then
  echo "Starting PostgreSQL with Docker..."
  docker compose up -d
  sleep 5
  echo "✓ PostgreSQL started"
fi

# Step 2: Backend
echo ""
echo "Step 2: Setting up Backend..."
cd backend
npm install
npm run db:generate
npm run db:push
npm run db:seed
echo "✓ Backend ready"

# Step 3: Frontend
echo ""
echo "Step 3: Setting up Frontend..."
cd ../frontend
npm install
echo "✓ Frontend ready"

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Step 4: Start the servers (in separate terminals):"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  npm run dev"
echo "  API: http://localhost:4000"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo "  Dashboard: http://localhost:3000/dashboard"
echo ""
echo "Health Check:"
echo "  curl http://localhost:4000/health"
echo ""
