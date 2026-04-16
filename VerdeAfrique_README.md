# VerdeAfrique – E-commerce Admin Dashboard

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Express](https://img.shields.io/badge/Express-5-lightgrey)
![Prisma](https://img.shields.io/badge/Prisma-7-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![License](https://img.shields.io/badge/License-MIT-green)

**Production‑ready full‑stack project**  
Monorepo: Next.js 16 (App Router) + Express 5 + Prisma 7 + PostgreSQL  

🌍 **Live Demo**  
Frontend: https://vasite-frontend.vercel.app  
Backend: https://backend-production-dfc8.up.railway.app

---

# ✨ Features

## Admin Dashboard
- Product management (CRUD)
- Soft delete system
- Pagination
- Category management
- Dashboard stats

## Secure Authentication
- Database sessions (revocable)
- HttpOnly cookies
- Session rotation
- Protected routes

## Role‑Based Access
- ADMIN / USER roles
- Middleware protection
- Server‑side session validation

## Full‑Stack Type Safety
- Shared TypeScript types
- Prisma generated types
- Strict TypeScript enabled

---

# 🧱 Tech Stack

| Area | Technology |
|------|------------|
| Frontend | Next.js 16 |
| Styling | Tailwind CSS |
| Backend | Express 5 |
| ORM | Prisma 7 |
| Database | PostgreSQL |
| Authentication | Cookie Sessions |
| Monorepo | pnpm workspaces |
| Deployment | Vercel + Railway |
| Language | TypeScript |

---

# 🚀 Getting Started

## Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL

---

# 📦 Installation

```bash
git clone https://github.com/talorokael/vasite.git
cd verdeafrique
pnpm install
```

---

# 🔧 Environment Setup

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.local.example apps/frontend/.env
```

Example backend env:

```
DATABASE_URL=postgresql://user:password@localhost:5432/verdeafrique
SESSION_SECRET=your-secret
FRONTEND_URL=http://localhost:3000
```

---

# 🗄️ Database Setup

```bash
pnpm --filter backend exec dotenv -e .env -- prisma migrate dev --name init
pnpm --filter backend exec dotenv -e .env -- prisma db seed
```

---

# 👤 Create Admin User

```bash
pnpm --filter backend exec tsx scripts/setup-admin.ts
```

---

# 🧪 Development

Backend

```bash
pnpm --filter backend dev
```

Frontend

```bash
pnpm --filter frontend dev
```

---

# 📁 Project Structure

```
verdeafrique/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── lib/
│   │   └── prisma/
│   └── frontend/
│       ├── app/
│       ├── components/
│       └── lib/
└── packages/
    └── shared-types/
```

---

# 🔐 Authentication Flow

| Request | Storage | Purpose |
|---------|---------|---------|
| Browser | HttpOnly Cookie | Security |
| SSR | Client Cookie | Server Rendering |
| SPA | Memory | API calls |

Sessions stored in database for revocation.

---

# 📡 API Routes

## Auth

```
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
```

## Products

```
GET /api/products
POST /api/products
PUT /api/products/:id
DELETE /api/products/:id
```

## Categories

```
GET /api/categories
POST /api/categories
```

---

# 🧪 Scripts

| Script | Description |
|--------|-------------|
| pnpm dev | Run all apps |
| pnpm build | Build project |
| pnpm lint | Lint project |
| pnpm test | Run tests |

---

# 🌐 Deployment

## Backend (Railway)

Environment variables:

```
DATABASE_URL
SESSION_SECRET
FRONTEND_URL
```

Build Command

```
cd apps/backend && pnpm install && pnpm build
```

Start Command

```
node dist/index.js
```

---

## Frontend (Vercel)

Environment variable

```
NEXT_PUBLIC_API_URL=backend-url
```

---

# 📸 Screenshots

## Dashboard
(Add screenshot here)

## Products Page
(Add screenshot here)

## Login Page


---

# 📈 Architecture

Frontend  
↓  
Next.js App Router  
↓  
API Client  
↓  
Express API  
↓  
Prisma  
↓  
PostgreSQL

---

# 🎯 Portfolio Value

This project demonstrates:

- Production‑ready architecture
- Authentication design
- Type safety across stack
- Monorepo management
- Real deployment workflow

---

# 🛣️ Roadmap

- [x] Authentication
- [x] Admin Dashboard
- [x] Product CRUD
- [x] Role‑based access
- [ ] Image uploads
- [ ] Analytics
- [ ] Audit logs

---

# 📄 License

MIT

---

# 👤 Author

Your Name  
GitHub: https://github.com/talorokael
