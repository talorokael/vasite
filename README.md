# VerdeAfrique – E‑commerce Admin Dashboard

**Production‑ready full‑stack portfolio project**  
Monorepo: Next.js 16 (App Router) + Express 5 + Prisma 7 + PostgreSQL  
Deployed: [Frontend (Vercel)](https://your-frontend-url.vercel.app) | [Backend (Railway)](https://your-backend-url.up.railway.app)

---

## ✨ Key Features

- **Admin Dashboard** – Manage products (CRUD, soft delete, pagination), users, and view stats
- **Secure Authentication** – Database sessions (revocable) + HttpOnly cookies + in‑memory token
- **Role‑Based Access** – `ADMIN` / `USER` roles with middleware protection
- **Hybrid Next.js Pattern** – Server components for initial data, client components for interactivity
- **Full Type Safety** – Shared TypeScript types across frontend/backend

---

## 🧱 Tech Stack

| Area | Technology |
|------|-------------|
| Frontend | Next.js 16, Tailwind CSS, React Context |
| Backend | Express 5, Prisma 7, PostgreSQL |
| Auth | bcrypt, database sessions, cookie‑parser |
| Monorepo | pnpm workspaces |
| Deployment | Vercel (frontend), Railway (backend + DB) |
| CI/CD | GitHub Actions (lint, build, typecheck) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL (local or Docker)

### Installation

```bash
# Clone and install dependencies
git clone https://github.com/your-username/verdeafrique.git
cd verdeafrique
pnpm install

# Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Configure DATABASE_URL in backend/.env
# Example: postgresql://user:password@localhost:5432/verdeafrique
Database Setup
bash
# Run migrations and seed (creates default categories + demo user)
pnpm --filter backend exec dotenv -e .env -- prisma migrate dev --name init
pnpm --filter backend exec dotenv -e .env -- prisma db seed
Create Admin User
bash
pnpm --filter backend exec tsx scripts/setup-admin.ts
Run Development Servers
bash
# Backend (port 4000)
pnpm --filter backend dev

# Frontend (port 3000)
pnpm --filter frontend dev
📁 Project Structure
text
verdeafrique/
├── apps/
│   ├── backend/          # Express + Prisma
│   │   ├── src/
│   │   │   ├── routes/   # API endpoints
│   │   │   ├── middleware/
│   │   │   └── lib/      # auth, prisma client
│   │   └── prisma/
│   └── frontend/         # Next.js
│       ├── app/          # App Router pages
│       ├── components/
│       └── lib/          # api-client, AuthContext
└── packages/
    └── shared-types/     # TypeScript interfaces
🔐 Authentication Flow (Hybrid)
Request Type	Token Storage	Purpose
Browser (fetch)	HttpOnly cookie	Prevents XSS, auto‑sent
Server‑side (SSR)	Readable client_token cookie	Enables getServerSession
API client (SPA)	In‑memory variable	Manual Authorization header
Session revocability – Sessions stored in DB; delete row = immediate logout.

🧪 Running Tests
bash
# Backend (if any)
pnpm --filter backend test

# Linting all workspaces
pnpm lint
🌐 Deployment
Backend (Railway)
Set DATABASE_URL, FRONTEND_URL, SESSION_SECRET in Railway environment

Build command: cd apps/backend && pnpm install && pnpm build

Start command: node dist/index.js

Frontend (Vercel)
Set NEXT_PUBLIC_API_URL = your Railway backend URL

Vercel automatically detects Next.js

