# VerdeAfrique — Project Structure (Detailed, up-to-date)

Overview
- Monorepo managed with `pnpm` workspaces. Core goal: production-ready e-commerce (Next.js frontend, Express backend, PostgreSQL with Prisma).
- Local dev ports: frontend `3000`, backend `3001`.

Top-level
- `package.json` (monorepo scripts)
- `pnpm-workspace.yaml` (includes `apps/*` and `packages/*`)
- `pnpm-lock.yaml` (pnpm lockfile)
- `PROJECT_STRUCTURE.md` (this file)
- `.github/` (CI workflows and appmod metadata)
- `.vscode/` (workspace settings)

Repository tree (complete, workspace-relative)

- package.json
- pnpm-workspace.yaml
- pnpm-lock.yaml
- PROJECT_STRUCTURE.md
- .github/
  - appmod/
    - appcat/
  - workflows/
    - ci.yml
- .vscode/
  - settings.json
- apps/
  - backend/
    - .env
    - .gitignore
    - eslint.config.js
    - package.json
    - pnpm-lock.yaml (workspace-level)
    - prisma.config.ts
    - tsconfig.json
    - prisma/
      - schema.prisma
      - seed.ts
      - migrations/
        - migration_lock.toml
        - 20260113101649_init/
          - migration.sql
        - 20260118113241_add_user_auth/
          - migration.sql
        - 20260119105721_add_token_to_session/
          - migration.sql
        - 20260205101742_add_user_metadata/
          - migration.sql
    - scripts/
      - setup-admin.ts
    - src/
      - index.ts
      - lib/
        - auth.ts
        - prisma.ts
      - middleware/
        - auth.ts
        - cors.ts
        - rbac.ts
      - routes/
        - auth.ts
        - categories.ts
        - products.ts
        - stats.ts
        - users.ts
      - types/
        - express.d.ts
  - frontend/
    - .env.local
    - .gitignore
    - eslint.config.mjs
    - next-env.d.ts
    - next.config.ts
    - package.json
    - postcss.config.mjs
    - README.md
    - tailwind.config.js
    - tsconfig.json
    - .next/            (build / dev cache)
      - dev/
      - cache/
      - logs/
      - server/
      - static/
      - types/
    - app/
      - globals.css
      - layout.tsx
      - page.tsx
      - admin/
        - layout.tsx
        - page.tsx
        - products/
          - page.tsx
          - ProductsTable.tsx
          - [id]/
            - edit/
              - page.tsx
          - new/
            - page.tsx
        - users/
          - page.tsx
      - login/
        - page.tsx
      - register/
        - page.tsx
    - components/
      - CategoryFilter.tsx
      - DebugAuth.tsx
      - HomePageClient.tsx
      - LoginForm.tsx
      - ProductBrowser.tsx
      - ProductCard.tsx
      - RegisterForm.tsx
      - admin/
        - AdminDashboard.tsx
        - AdminGuard.tsx
        - AdminLayout.tsx
        - DashboardStats.tsx
      - Layout/
        - Navbar.tsx
    - lib/
      - api-client.ts
      - AuthContext.tsx
    - public/
      - (static assets)
    - types/
      - index.ts
- packages/
  - shared-types/
    - (placeholder)
- infra/
  - k8s/
  - terraform/
- scripts/
- tests/

Apps detailed notes

- Backend (`apps/backend`)
  - Node + Express (`express@^5`) with Prisma for PostgreSQL.
  - Dev scripts: `dev` uses `tsx` watch; `build` uses `tsc`.
  - Prisma models: `User`, `Session`, `Product`, `Category` (see `prisma/schema.prisma`).
  - Seed: `prisma/seed.ts` populates initial users, categories, products.
  - Entrypoint: `src/index.ts` sets up security middleware (Helmet, rate limiting), CORS, routes, health-check, and a global error handler.
  - Routes live in `src/routes/*` (auth, products, categories, stats, users).
  - Middleware in `src/middleware` (auth, cors helper, RBAC).
  - Example `.env` content (your local example):

  DATABASE_URL="postgresql://username:password@localhost:5432/verdeafrique?schema=public"
  NODE_ENV=development
  FRONTEND_URL="http://localhost:3000"
  COOKIE_SECRET="your-secret-key-change-this-in-production"
  SESSION_SECURE_COOKIE="false"

- Frontend (`apps/frontend`)
  - Next.js 16 App Router + React 19, TypeScript.
  - Dev script: `pnpm --filter frontend dev` (or `pnpm -w dev` from workspace root as configured).
  - App structure uses `app/` with server components and client components under `components/` and `app/admin/*` for admin UI.
  - API client in `lib/api-client.ts` calls backend endpoints (uses `NEXT_PUBLIC_API_URL` set in `.env.local`).

Packages

- `packages/shared-types` — placeholder package for shared TypeScript types between apps.

Infra, scripts, tests

- `infra/` contains `k8s/` and `terraform/` directories for future infra-as-code.
- `scripts/` and `tests/` are present as top-level placeholders.

CI & Dev
- `.github/workflows/ci.yml` runs install, lint, and build for the monorepo.

Notes
- This tree mirrors the attached workspace snapshot and includes the sample `.env` values you provided. If you'd like I can expand any subtree (e.g., show every file inside `.next/` or list migration SQL contents).

## Auth, recent fixes, and deployment notes

Auth flow (current)
- Backend creates secure sessions (Prisma sessions) and sets an HttpOnly cookie `session_token` **and** returns the raw token in JSON for client-side convenience.
- Frontend stores a readable cookie `client_token` (via apps/frontend/lib/cookie.ts) and sets the token in memory on the ApiClient (`apiClient.setToken(token)`).
- Client-side API calls use `Authorization: Bearer <token>` (api-client) and include credentials.
- Server-side Next helper (`apps/frontend/lib/auth/server.ts`) reads `client_token` from Next cookies and forwards it as `Authorization` when calling the backend `/api/auth/me` endpoint (this enables SSR/server components to detect the user).
- Admin components guard fetching with `if (!user) return;` to avoid race conditions.

Recent fixes summary
- Login/register now return `{ user, token }` and set `session_token`.
- Added `client_token` cookie and `apiClient.setToken()` so SSR + client fetches use the same token.
- Guarded data-fetching components to wait for AuthProvider initialization.
- Removed problematic cross-domain cookie setting; rely on SameSite/Secure and platform env variables.

Deployment notes
- Frontend (Vercel): https://vasite-frontend.vercel.app
  - NEXT_PUBLIC_API_URL = https://backend-production-dfc8.up.railway.app
- Backend (Railway): https://backend-production-dfc8.up.railway.app
  - Railway DATABASE_URL (example): postgresql://postgres:...@postgres.railway.internal:5432/railway
  - FRONTEND_URL = https://vasite-frontend.vercel.app

Security note
- Current approach uses a readable `client_token` to enable SSR convenience. For maximum security consider switching to an HttpOnly-first strategy with server-side cookie forwarding or refresh-tokens to avoid exposing tokens to JS.