# 💸 Expense Tracker (MERN)

<img width="1920" height="1080" alt="Screenshot 2026-11-19 002538" src="https://github.com/user-attachments/assets/c69fd454-ffc6-454b-bdff-358b9922c65c" />
<img width="1920" height="1080" alt="Screenshot 2026-11-19 002519" src="https://github.com/user-attachments/assets/2dea63f7-1883-4a14-b56b-fa895842636f" />
<img width="1920" height="1080" alt="Screenshot 2026-11-19 002501" src="https://github.com/user-attachments/assets/38d7fbd5-e989-4a7b-8fe5-71a50966de8e" />




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
