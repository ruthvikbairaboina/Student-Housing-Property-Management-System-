# Student Housing Property Management System

Built Full-stack project with **React + Tailwind CSS** (frontend) and **Node.js + Express + MySQL** (backend).

## Features implemented

- Role-based authentication for **Admin**, **Owner**, **Tenant**, and **Employee**.
- Dashboard summaries and role-specific workflow highlights.
- Tenant management, room allocation visibility, parking assignments, complaint tracking.
- Relational MySQL schema for rental agreements, billing, and maintenance requests.
- REST API endpoints protected with JWT and role authorization middleware.

## Project structure

- `frontend/` – React + Vite + Tailwind application.
- `backend/` – Express API with MySQL integration.
- `backend/sql/schema.sql` – schema for all core entities.

## Quick start

### 1) Setup backend

```bash
cd backend
cp .env.example .env
npm install
```

Update `.env` values to match your MySQL instance.

Run SQL schema:

```bash
mysql -u root -p < sql/schema.sql
```

Start backend:

```bash
npm run dev
```

### 2) Setup frontend

```bash
cd ../frontend
npm install
npm run dev
```

The frontend expects API at `http://localhost:5000/api` by default.

## Example login payload

Use `/api/auth/register` to create users for each role, then login with `/api/auth/login`.

