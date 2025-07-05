#!/bin/bash
set -e

# Wait for DB to be ready
if [ -n "$DATABASE_URL" ]; then
  echo "Waiting for database to be ready..."
  until python -c "import psycopg2; from urllib.parse import urlparse; u=urlparse('$DATABASE_URL'); import time; import sys; import psycopg2; time.sleep(1); conn=psycopg2.connect(dbname=u.path[1:], user=u.username, password=u.password, host=u.hostname, port=u.port); conn.close()"; do
    echo "Postgres is unavailable - sleeping"
    sleep 1
  done
fi

# Run Alembic migrations
alembic upgrade head

# Seed the database (only if not already seeded)
python -m app.seed || true

# Start FastAPI app
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
