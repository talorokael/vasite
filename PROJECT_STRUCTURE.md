text
VerdeAfrique/
├── package.json                     # monorepo scripts (pnpm -w run ...)
├── pnpm-workspace.yaml              # workspaces: apps/*, packages/*
├── pnpm-lock.yaml
├── PROJECT_STRUCTURE.md             # this file (updated)
├── .github/
│   ├── appmod/                      # (metadata, not actively used)
│   │   └── appcat/
│   └── workflows/
│       └── ci.yml                   # install, lint, build
├── .vscode/
│   └── settings.json
├── apps/
│   ├── backend/
│   │   ├── .env                     # DATABASE_URL, FRONTEND_URL, COOKIE_SECRET, etc.
│   │   ├── .gitignore
│   │   ├── eslint.config.js         # ESLint 9 flat config
│   │   ├── package.json
│   │   ├── prisma.config.ts         # Prisma 7 runtime datasource config
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # models: User, Session, Product, Category
│   │   │   ├── seed.ts              # seeds initial categories, products, admin user
│   │   │   └── migrations/          # all migration folders with SQL files
│   │   ├── scripts/
│   │   │   └── setup-admin.ts       # interactive admin account creator
│   │   └── src/
│   │       ├── index.ts             # Express app, middleware, routes, error handler
│   │       ├── lib/
│   │       │   ├── auth.ts          # session creation/validation, password hashing
│   │       │   └── prisma.ts        # PrismaClient singleton
│   │       ├── middleware/
│   │       │   ├── auth.ts          # authenticate (cookie + header)
│   │       │   └── rbac.ts          # requireRole (admin / user)
│   │       ├── routes/
│   │       │   ├── auth.ts          # register, login, logout, getMe
│   │       │   ├── categories.ts    # list categories (with product counts)
│   │       │   ├── products.ts      # CRUD, pagination, soft delete, update helper
│   │       │   ├── stats.ts         # dashboard counts (users, products, orders placeholder)
│   │       │   └── users.ts         # list users, change role, soft delete placeholder
│   │       └── types/
│   │           └── express.d.ts     # extends Request with `user`
│   │
│   └── frontend/
│       ├── .env.local               # NEXT_PUBLIC_API_URL
│       ├── .gitignore
│       ├── eslint.config.mjs        # Next.js compatible ESLint config
│       ├── next.config.ts           # with reactStrictMode: true
│       ├── package.json
│       ├── postcss.config.mjs       # uses @tailwindcss/postcss
│       ├── tailwind.config.js       # Tailwind v4 (compatible)
│       ├── tsconfig.json
│       ├── .next/                   # build cache (ignored)
│       ├── app/
│       │   ├── globals.css          # Tailwind imports
│       │   ├── layout.tsx           # root layout, AuthProvider
│       │   ├── page.tsx             # homepage (server component)
│       │   ├── admin/
│       │   │   ├── layout.tsx       # server‑side auth guard (reads client_token)
│       │   │   ├── page.tsx         # admin dashboard (stats)
│       │   │   ├── products/
│       │   │   │   ├── page.tsx     # product list (server + client table)
│       │   │   │   ├── ProductsTable.tsx  # client component with soft‑delete toggle
│       │   │   │   ├── [id]/
│       │   │   │   │   └── edit/
│       │   │   │   │       └── page.tsx  # edit product form
│       │   │   │   └── new/
│       │   │   │       └── page.tsx      # create product form
│       │   │   └── users/
│       │   │       └── page.tsx     # user management list (placeholder)
│       │   ├── login/
│       │   │   └── page.tsx
│       │   └── register/
│       │       └── page.tsx
│       ├── components/
│       │   ├── CategoryFilter.tsx
│       │   ├── DebugAuth.tsx        # dev tool
│       │   ├── HomePageClient.tsx
│       │   ├── LoginForm.tsx
│       │   ├── ProductBrowser.tsx   # client component for product listing
│       │   ├── ProductCard.tsx
│       │   ├── RegisterForm.tsx
│       │   └── Layout/
│       │       └── Navbar.tsx
│       ├── lib/
│       │   ├── api-client.ts        # central API client (token, request/response)
│       │   ├── AuthContext.tsx      # auth state, token in‑memory, no localStorage
│       │   └── auth/
│       │       └── server.ts        # SSR helper: reads client_token cookie
│       ├── public/                  # static assets
│       └── types/
│           └── index.ts             # shared TypeScript interfaces (Product, User, etc.)
│
├── packages/
│   └── shared-types/               # (placeholder for future shared types)
│
├── infra/                          # future infra‑as‑code (k8s, terraform)
│   ├── k8s/
│   └── terraform/
├── scripts/                        # top‑level utility scripts (placeholder)
└── tests/                          # end‑to‑end / integration tests (placeholder)
Updated Notes (reflecting final state after Responses 1–24)
Auth Flow (current, production)
Backend creates a database session and sets an HttpOnly session_token cookie. It also returns the raw token in the JSON response (for client convenience).

Frontend stores a readable client_token cookie (via lib/auth/server.ts) and keeps the token in memory inside ApiClient.

No localStorage is used (removed in MP6 for security).

Client‑side API calls use Authorization: Bearer <token> (added by api-client.ts) and credentials: 'include'.

Server‑side (SSR) components call lib/auth/server.ts to read client_token from Next.js cookies and forward it as an Authorization header when calling /api/auth/me. This enables the admin layout to know the user before rendering.

Admin components guard data fetching with if (!user) return; to avoid race conditions during hydration.

Recent Fixes (incorporated)
Login/register endpoints return { user, token } and set both session_token (HttpOnly) and client_token (readable).

ApiClient.setToken() accepts string | null – clears token on logout.

AuthContext restores token from client_token cookie on initial load using an isLoading state to prevent premature redirects.

Removed all duplicate admin layouts (AdminLayout.tsx, AdminDashboard.tsx, AdminGuard.tsx – now handled by app/admin/layout.tsx server‑side).

Deleted empty middleware/cors.ts (CORS configured directly in index.ts using FRONTEND_URL).

Fixed next lint script to next lint . (avoids “invalid project directory” error).

ESLint 9 flat config installed per workspace (backend and frontend), with all required plugins.

Deployment URLs
Frontend: https://vasite-frontend.vercel.app

NEXT_PUBLIC_API_URL = https://backend-production-dfc8.up.railway.app

Backend: https://backend-production-dfc8.up.railway.app

FRONTEND_URL = https://vasite-frontend.vercel.app

DATABASE_URL (Railway internal) – e.g., postgresql://postgres:...@postgres.railway.internal:5432/railway

Security Note
The current approach uses a readable client_token cookie to enable SSR convenience without localStorage. For maximum security, a future iteration could switch to an HttpOnly‑only strategy with server‑side cookie forwarding or refresh tokens. However, the current setup already eliminates XSS risks from localStorage and uses secure, SameSite cookies in production.

