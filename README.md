# Book Review Service – Backend

A professional-grade backend API for a Book Review application, built with FastAPI, SQLAlchemy, Alembic, and PostgreSQL. This service provides RESTful endpoints for managing books and their reviews, with robust validation, error handling, and database integration.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Set Up Python Environment](#2-set-up-python-environment)
  - [3. Install Dependencies](#3-install-dependencies)
  - [4. Configure Environment Variables](#4-configure-environment-variables)
  - [5. Set Up the Database](#5-set-up-the-database)
  - [6. Run Database Migrations](#6-run-database-migrations)
  - [7. Start the FastAPI Server](#7-start-the-fastapi-server)
  - [8. Start Redis Server](#8-start-redis-server)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Project Scripts](#project-scripts)
- [Troubleshooting](#troubleshooting)
- [Frontend Setup & Running](#frontend-setup--running)
- [Running Both Backend & Frontend Together (Dev)](#running-both-backend--frontend-together-dev)
- [Dockerized Deployment (Recommended)](#dockerized-deployment-recommended)

---

## Features

- Add, list, update, and delete books
- Add, list, update, and delete reviews for books
- Pagination, filtering, and validation
- SQLAlchemy ORM with Alembic migrations
- RESTful API with proper status codes and error handling
- OpenAPI/Swagger documentation
- Unit and integration tests with pytest
- Redis caching support (ensure redis-server is running)

---

## Tech Stack

- **Backend:** FastAPI (Python 3.10+)
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy
- **Migrations:** Alembic
- **Testing:** pytest
- **Caching:** Redis

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/bhavyansh001/book-review-service.git
or
git clone git@github.com:bhavyansh001/book-review-service.git
cd book-review-service/backend
```

### 2. Set Up Python Environment

It is recommended to use a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Copy the example environment file and edit as needed:

```bash
cp .env.example .env
```

Edit `.env` to set your database URL and other settings. Example for PostgreSQL:

```
DATABASE_URL=postgresql://book_admin:pass123@localhost:5432/book_reviews_db
REDIS_URL=redis://localhost:6379/0
```

### 5. Set Up the Database

#### Using PostgreSQL

Start PostgreSQL and create the user and database:

```sql
-- Connect to psql as the postgres user:
psql -U postgres

-- Then run:
CREATE USER book_admin WITH PASSWORD 'pass123';
CREATE DATABASE book_reviews_db;
GRANT ALL PRIVILEGES ON DATABASE book_reviews_db TO book_admin;
```

#### (Optional) Using SQLite

Set `DATABASE_URL=sqlite:///./book_reviews.db` in your `.env` file.

### 6. Run Database Migrations

Make sure PostgreSQL is running, then apply all Alembic migrations to set up the schema:

```bash
sudo systemctl start postgresql
alembic upgrade head
```

You can verify tables and indexes in psql:

```sql
\dt         -- List tables
\d books    -- Describe books table
\d reviews  -- Describe reviews table
\di         -- List indexes
```

### 7. Start the FastAPI Server

```bash
uvicorn app.main:app --reload
```

The API will be available at: [http://localhost:8000](http://localhost:8000)

### 8. Start Redis Server

Redis is required for caching. Make sure `redis-server` is running:

```bash
sudo systemctl start redis-server
```

---

## Running Tests

Run all tests with:

```bash
pytest app/tests/ --maxfail=2 --disable-warnings -v

```

- Unit and integration tests are located in `app/tests/`.
- Ensure your test database is configured if using PostgreSQL.

---

## API Documentation

Interactive API docs are available at:

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## Database Migrations (extending the app)

- **Create a new migration after model changes:**
  ```bash
  alembic revision --autogenerate -m "Describe your change"
  ```
- **Apply migrations:**
  ```bash
  alembic upgrade head
  ```
- **Downgrade migration:**
  ```bash
  alembic downgrade -1
  ```

---

## Project Scripts

- **Start server:** `uvicorn app.main:app --reload`
- **Run migrations:** `alembic upgrade head`
- **Run tests:** `pytest app/tests/`

- **Create migration:** `alembic revision --autogenerate -m "message"`
- **Start Redis:** `redis-server`

---

## Troubleshooting

- **Database connection errors:** Check your `.env` and ensure PostgreSQL is running.
- **Migrations not applying:** Ensure your `alembic.ini` and `app/config.py` point to the correct database.
- **Redis errors:** Make sure `redis-server` is running and `REDIS_URL` is set.
- **Tests failing:** Make sure your test database is set up and migrations are applied.

---

## Frontend Setup & Running

The frontend is a modern React + TypeScript app (Vite).

### 1. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 2. Run the Frontend in Development

```bash
npm run dev
```

The app will be available at: [http://localhost:5173](http://localhost:5173)

---

## Running Both Backend & Frontend Together (Dev)

A helper script is provided at the project root to run both services in development mode:

```bash
./run-dev.sh
```

- This will start the backend (FastAPI) and frontend (Vite) concurrently.
- Make sure you have installed backend and frontend dependencies first.
- Press Ctrl+C to stop both services.

---

## Dockerized Deployment

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed
- No other services running on ports 80, 8000, 5432, or 6379

### 1. Build and Start All Services

From the project root:

```bash
docker-compose up --build
```

- This will build and start:
  - PostgreSQL (with persistent volume)
  - Redis
  - Backend (FastAPI, Alembic migrations, and DB seed)
  - Frontend (React + Vite, served by nginx)

### 2. Access the App
- **Frontend:** http://127.0.0.1 (served by nginx)
- **Backend API:** http://127.0.0.1:8000
- **API Docs:** http://127.0.0.1:8000/docs

### 3. Database Seed Data
- On first run, the backend will automatically seed the database with 3 books and 2–3 reviews each.
- To re-seed manually:
  ```bash
  docker-compose exec backend python -m app.seed
  ```

### 4. Stopping and Cleaning Up
- To stop all services:
  ```bash
  docker-compose down
  ```
- To remove all data (including the database):
  ```bash
  docker-compose down -v
  ```

---
