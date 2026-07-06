VerdeAfrique/
├── package.json                     # monorepo scripts (pnpm -w run ...)
├── pnpm-workspace.yaml              # workspaces: apps/*, packages/*
├── pnpm-lock.yaml
├── PROJECT_STRUCTURE.md             # this file (updated for MP10)
├── .github/
│   ├── appmod/                      # (metadata, not actively used)
│   │   └── appcat/
│   └── workflows/
│       └── ci.yml                   # install, lint, build
├── .vscode/
│   └── settings.json                # TypeScript workspace version forced
├── apps/
│   ├── backend/
│   │   ├── .env                     # DATABASE_URL, FRONTEND_URL, COOKIE_SECRET, PAYSTACK_*, etc.
│   │   ├── .gitignore
│   │   ├── eslint.config.js         # ESLint 9 flat config
│   │   ├── package.json
│   │   ├── prisma.config.ts         # Prisma 7 runtime datasource config
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # models: User, Session, Product, Category, Cart, CartItem, Order, OrderItem
│   │   │   ├── seed.ts              # seeds initial categories, products, admin user
│   │   │   └── migrations/          # all migration folders with SQL files
│   │   ├── scripts/
│   │   │   └── setup-admin.ts       # interactive admin account creator
│   │   └── src/
│   │       ├── index.ts             # Express app, globalAuth, rate limiting, routes, error handler
│   │       ├── lib/
│   │       │   ├── auth.ts          # session creation/validation, password hashing (bcrypt 12 rounds)
│   │       │   ├── cache.ts         # TTL cache with getCached() and clearCache(keyPattern?)
│   │       │   ├── env.ts           # environment variable validation and defaults
│   │       │   ├── logger.ts        # structured logging utility
│   │       │   └── prisma.ts        # PrismaClient singleton — forces import 'dotenv/config' at module init, validates DATABASE_URL, uses PrismaPg adapter + pg Pool
│   │       ├── middleware/
│   │       │   ├── auth.ts          # authenticate (cookie + header)
│   │       │   ├── globalAuth.ts    # attaches req.user using session_token cookie (for all requests)
│   │       │   ├── perUserRateLimit.ts # rate limiter factory using user.id or ipKeyGenerator (IPv6 /56 masking)
│   │       │   ├── rbac.ts          # requireRole (admin / user)
│   │       │   └── requestId.ts     # request ID tracking middleware
│   │       ├── routes/
│   │       │   ├── address.ts        # Address CRUD (create, list, update, delete, set default)
│   │       │   ├── adminOrders.ts   # Admin order management (list, status updates, shipment tracking)
│   │       │   ├── adminUsers.ts    # Admin user list, role management (ADMIN/USER)
│   │       │   ├── auth.ts          # register, login, logout, getMe (validates session)
│   │       │   ├── cart.ts          # get cart, add/update/delete items, POST /merge (guest cart merge)
│   │       │   ├── categories.ts    # list categories (with product counts)
│   │       │   ├── checkout.ts      # Paystack transaction initialization
│   │       │   ├── health.ts        # health check endpoint (DB latency verification)
│   │       │   ├── orders.ts        # user order history, order details
│   │       │   ├── products.ts      # CRUD, pagination, soft delete, calls clearCache() after mutations
│   │       │   ├── stats.ts         # dashboard counts (cached, cleared on product changes)
│   │       │   └── users.ts         # list users, change role
│   │       ├── services/
│   │       │   ├── email.service.ts # Brevo transactional email (customer + admin notifications)
│   │       │   ├── sms.service.ts   # SMS notification service (optional)
│   │       │   └── tcg.service.ts   # Trading card game related service
│   │       ├── webhooks/
│   │       │   └── paystack.ts      # handles charge.success, signature verification, idempotency check, order creation, cart clearance, notifications
│   │       └── types/
│   │           └── express.d.ts     # extends Request with `user` property
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
│       │   ├── layout.tsx           # root layout, AuthProvider, CartProvider
│       │   ├── page.tsx             # homepage (server component)
│       │   ├── account/
│       │   │   └── orders/          # user order history and details
│       │   ├── admin/
│       │   │   ├── layout.tsx       # server‑side auth guard (reads client_token)
│       │   │   ├── page.tsx         # admin dashboard (stats)
│       │   │   ├── orders/          # admin order management (list, status update)
│       │   │   ├── products/
│       │   │   │   ├── page.tsx     # product list (server + client table)
│       │   │   │   ├── ProductsTable.tsx  # client component with soft‑delete toggle
│       │   │   │   ├── [id]/
│       │   │   │   │   └── edit/    # edit product form
│       │   │   │   └── new/         # create product form
│       │   │   └── users/
│       │   │       └── page.tsx     # user management list
│       │   ├── cart/
│       │   │   └── page.tsx         # shopping cart page, checkout button to Paystack
│       │   ├── login/
│       │   │   └── page.tsx
│       │   ├── order/
│       │   │   └── success/         # payment success page (reads reference)
│       │   └── register/
│       │       └── page.tsx
│       ├── components/
│       │   ├── CategoryFilter.tsx
│       │   ├── HomePageClient.tsx
│       │   ├── LoginForm.tsx
│       │   ├── ProductBrowser.tsx   # client component for product listing
│       │   ├── ProductCard.tsx      # Add to Cart button (uses CartContext)
│       │   ├── RegisterForm.tsx
│       │   └── Layout/
│       │       └── Navbar.tsx
│       ├── lib/
│       │   ├── api-client.ts        # central API client (token, request/response, mergeGuestCart)
│       │   ├── AuthContext.tsx      # auth state, token in‑memory, merges guest cart after login
│       │   ├── CartContext.tsx      # cart state, stores guest cart in localStorage, calls merge on login
│       │   ├── cookie.ts            # get/set client_token cookie
│       │   └── auth/
│       │       └── server.ts        # SSR helper: reads session_token cookie, forwards to /api/auth/me
│       ├── public/                  # static assets (placeholder.png, etc.)
│       └── types/
│           └── index.ts             # shared TypeScript interfaces (Product, User, Order, etc.)
│
├── packages/
│   └── shared-types/               # shared TypeScript definitions (index.ts, package.json, tsconfig.json)
│
├── infra/                          # future infra‑as‑code (k8s, terraform)
│   ├── k8s/
│   └── terraform/
├── scripts/                        # top‑level utility scripts (placeholder)
└── tests/                          # end‑to‑end / integration tests (placeholder)

Updated Notes (reflecting final state after MP10 Priority 1 & 2)

Authentication Flow (current, production)
- Backend creates a database session and sets an HttpOnly `session_token` cookie. It also returns the raw token in the JSON response (for client convenience).
- Frontend stores a readable `client_token` cookie (via lib/auth/server.ts) and keeps the token in memory inside ApiClient.
- No localStorage is used for authentication (removed in MP6 for security).
- Client‑side API calls use `Authorization: Bearer <token>` (added by api-client.ts) and `credentials: 'include'`.
- Server‑side (SSR) components call `lib/auth/server.ts` to read `session_token` from Next.js cookies and forward it as a `Cookie` header when calling `/api/auth/me`. This enables the admin layout to know the user before rendering.
- **Global auth middleware** (`globalAuth.ts`) attaches `req.user` to every request using the `session_token` cookie – used for per‑user rate limiting and convenience.

Recent Fixes & MP10 Additions (May 2026)

**Priority 1 – Data Integrity & Robustness**
- Added `globalAuth` middleware to populate `req.user` globally.
- Implemented per‑user rate limiting for `/api/cart` (100/15min) and `/api/checkout` (10/15min) using `express-rate-limit` with `ipKeyGenerator` for IPv6 safety.
- Enhanced health check (`/api/health`) to verify database connection and report latency.
- Fixed environment variable loading by forcing `dotenv/config` at module initialization inside `prisma.ts` and using a shared PrismaClient singleton (with `PrismaPg` adapter).
- Resolved `ERR_ERL_KEY_GEN_IPV6` warning by using `ipKeyGenerator` in fallback.

**Priority 2 – Critical UX Gaps**
- Added `POST /api/cart/merge` endpoint (transaction‑based upsert) to merge guest cart into user’s cart.
- Frontend: `AuthContext` now reads `localStorage.guestCart` after login, calls `mergeGuestCart`, and clears it.
- `CartContext` modified to store guest cart items in `localStorage` when user is not logged in (replaces alert popup).
- Manual cache invalidation: `clearCache(keyPattern?)` in `cache.ts`; called after product create/update/delete to clear `dashboard-stats` and product list caches.

**Deployment URLs (unchanged)**
- Frontend: https://vasite-frontend.vercel.app
- Backend: https://backend-production-dfc8.up.railway.app

**Environment Variables (updated)**
Backend (Railway):
- `DATABASE_URL`, `FRONTEND_URL`, `COOKIE_SECRET`, `SESSION_SECURE_COOKIE=true`
- `PAYSTACK_SECRET_KEY`, `PAYSTACK_WEBHOOK_SECRET` (optional)
- `NODE_ENV=production` (enables rate limiting)

Frontend (Vercel):
- `NEXT_PUBLIC_API_URL=https://backend-production-dfc8.up.railway.app`

**Security & Architectural Notes**
- The `session_token` cookie is HttpOnly, secure, and SameSite=none in production (for cross‑origin requests).
- `client_token` cookie (readable) is used only for SSR convenience; it is not used for API authentication (the backend ignores it).
- Rate limiting per user is achieved via the combination of `globalAuth` and custom key generator – unauthenticated requests fall back to masked IP.
- Guest cart merge uses a database transaction to avoid race conditions; localStorage is cleared only after successful merge.
- Cache invalidation is manual but centralised – all product mutations call `clearCache('dashboard-stats')` and `clearCache('products')`.

**Remaining MP10 Tasks (not started)**
- Priority 3: Frontend polish (placeholder images, loading skeletons, toast notifications, empty states).
- Priority 4: Testing (integration tests, E2E with Playwright).
- Priority 5: Infrastructure (CORS multi‑origin, structured logging, CI/CD improvements).
- Priority 6: Scalability (Redis cache, responsive design fixes).
- Priority 7: Documentation (demo video, STAR stories, Q&A prep).

The project is now fully functional for a real business with guest cart persistence, per‑user rate limiting, and robust health checks. The next focus is user‑facing polish and testing.