#!/bin/bash
# Script to run both backend (FastAPI) and frontend (React + TS) in development mode

# Ensure the script uses its own process group
trap '' SIGINT
set -m

# Start backend
cd backend || exit 1
if [ -f venv/bin/activate ]; then
  source venv/bin/activate
fi
uvicorn app.main:app --reload &
BACKEND_PID=$!
cd ..

# Start frontend
cd frontend || exit 1
npm run dev &
FRONTEND_PID=$!
cd ..

# Function to kill all child processes
cleanup() {
  echo "\nStopping backend (PID $BACKEND_PID) and frontend (PID $FRONTEND_PID)..."
  kill -TERM -$BACKEND_PID 2>/dev/null
  kill -TERM -$FRONTEND_PID 2>/dev/null
  exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for both to exit
wait $BACKEND_PID
wait $FRONTEND_PID
