@echo off
REM Quick Start Guide for Sales Analytics Dashboard (Windows)

echo.
echo ==========================================
echo Sales Analytics Dashboard - Quick Start
echo ==========================================
echo.

REM Step 1: Database
echo Step 1: Starting PostgreSQL Database...
echo.
echo Choose one:
echo   A) Docker (recommended): docker compose up -d
echo   B) Local PostgreSQL: Ensure it's running
echo.
set /p choice="Enter your choice (A/B): "

if /i "%choice%"=="A" (
  echo Starting PostgreSQL with Docker...
  docker compose up -d
  timeout /t 5 /nobreak
  echo. 
  echo [OK] PostgreSQL started
)

REM Step 2: Backend
echo.
echo Step 2: Setting up Backend...
cd backend
call npm install
call npm run db:generate
call npm run db:push
call npm run db:seed
echo.
echo [OK] Backend ready

REM Step 3: Frontend
echo.
echo Step 3: Setting up Frontend...
cd ..\frontend
call npm install
echo.
echo [OK] Frontend ready

REM Summary
echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Step 4: Start the servers (in separate terminals):
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo   API: http://localhost:4000
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo   Dashboard: http://localhost:3000/dashboard
echo.
echo Health Check:
echo   curl http://localhost:4000/health
echo.
echo Press any key to exit...
pause
