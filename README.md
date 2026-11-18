# 💸 Expense Tracker (MERN)

A full-stack expense tracker with user login, add/edit/delete expenses, monthly filter and a category pie chart.

**Tech:** React (Vite) · Node.js · Express · MongoDB (Mongoose) · JWT authentication · bcrypt · Recharts

## Features
- Register / login with JWT authentication (passwords hashed with bcrypt)
- Each user sees only their own expenses
- Add, edit and delete expenses (title, amount, category, date)
- Filter by month and see the total spent
- Pie chart of spending by category

## Run locally

Requirements: Node.js 18+ and a MongoDB database (local, or free MongoDB Atlas).

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env      # Windows: copy .env.example .env
# open .env and set MONGO_URI and JWT_SECRET
npm run dev
```
Backend runs on http://localhost:5000

### 2. Frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173

## API
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/expenses | List my expenses |
| POST | /api/expenses | Add expense |
| PUT | /api/expenses/:id | Edit expense |
| DELETE | /api/expenses/:id | Delete expense |

## Folder structure
```
backend/   Express API (models, routes, auth middleware)
frontend/  React app (Auth + Dashboard components)
```
