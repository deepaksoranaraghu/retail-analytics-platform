# Retail Analytics Platform

An end-to-end full-stack retail analytics platform that ingests sales data, stores it in PostgreSQL, exposes analytics APIs, and visualizes KPIs through a Next.js dashboard with real-time order updates.

## Features

- ETL pipeline built with Dagster
- PostgreSQL for structured sales data storage
- Express.js backend with analytics APIs
- Next.js frontend dashboard
- Recharts-based data visualization
- Socket.IO live order updates
- Modular architecture for scaling to larger analytics workloads

## Tech Stack

### Frontend
- Next.js
- TypeScript
- Axios
- Tailwind CSS
- Recharts
- Socket.IO Client

### Backend
- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Socket.IO

### Data Engineering
- Dagster
- Pandas
- SQLAlchemy
- PostgreSQL

## Project Architecture

1. Sales data is stored in CSV format
2. Dagster ETL extracts, transforms, and loads the data into PostgreSQL
3. Express APIs calculate KPIs and reporting metrics
4. Next.js dashboard fetches and displays analytics
5. Socket.IO streams simulated live orders to the frontend

## API Endpoints

- `GET /api/test-db` — test database connectivity
- `GET /api/kpis` — total revenue, total orders, top products
- `GET /api/sales-by-category` — category-level sales revenue
- `GET /api/recent-orders` — latest orders
- WebSocket event: `new_order` — real-time order updates

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/deepaksoranaraghu/retail-analytics-platform.git
cd retail-analytics-platform
