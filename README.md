# DevOps Task

This is a full-stack project built for a DevOps technical task. It includes:

-  Backend: Node.js + Express + Prisma + PostgreSQL
-  Frontend: React.js
-  Authentication: JWT & Google OAuth
-  Role-based Access Control: Admin & User
-  CRUD Projects with permissions

## Tech Stack

- Frontend: React, Axios, Vite
- Backend: Express.js, Prisma ORM, JWT
- Database: PostgreSQL (Neon)
- Deployment: Manual (locally)
- Auth: Google OAuth 2.0 + JWT

##  How to Run Locally

### 1. Clone the repo

git clone https://github.com/FaisalSaqallah/devops-task.git
cd devops-task

### 2. Backend Setup

cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

### 3. Frontend Setup

cd frontend
npm install
npm run dev

##  Admin Credentials

To login as admin or user, use:

- Email
- Password 

Or sign in via Google.

##  Project Structure

devops-task/
│
├── backend/
│   ├── routes/
│   ├── prisma/
│   └── app.js
│
└── frontend/
    ├── src/
    └── public/


##  Author

**Faisal Saqallah**  
[GitHub Profile](https://github.com/FaisalSaqallah)
