@echo off
echo Starting Backend...
start "Backend" cmd /k "cd backend && python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000"

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev -- --host"

echo App started!
