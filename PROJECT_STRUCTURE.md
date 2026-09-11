# VerdeAfrique Repository Structure

This document reflects the repository inventory as of 2026-09-10. Dependency folders, Next.js build output, compiled output, coverage, and other ignored generated files are excluded from the tree.

## Repository Tree

```text
VerdeAfrique/
├── .gitignore
├── .github/
│   └── workflows/
│       └── ci.yml                         # CI build and Railway/Vercel deployment workflow
├── Capture1.PNG                           # captured reference image
├── DESIGN.md                              # design notes
├── README.md                              # repository overview
├── VerdeAfrique_README.md                  # project-specific README
├── PROJECT_STRUCTURE.md                    # this file
├── cart-item.json                          # sample cart item data
├── cookies.txt                             # local/test cookie data
├── item.json                               # sample item data
├── login.json                              # sample login data
├── package.json                            # pnpm monorepo scripts and overrides
├── pnpm-lock.yaml                          # pnpm workspace lockfile
├── pnpm-workspace.yaml                     # apps/* and packages/* workspaces
├── tbs-landing-page.jpg                    # landing-page asset
├── webhook-test.json                       # local courier webhook test payload
├── apps/
│   ├── backend/
│   │   ├── .env                            # local secrets/configuration; do not commit
│   │   ├── .env.example                    # backend environment template
│   │   ├── .gitignore
│   │   ├── eslint.config.js
│   │   ├── package.json                    # backend scripts and dependencies
│   │   ├── package-lock.json                # npm lockfile retained for the backend
│   │   ├── prisma.config.ts                 # Prisma 7 runtime datasource config
│   │   ├── tsconfig.json
│   │   ├── vitest.config.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma                # application data models
│   │   │   ├── seed.ts                      # seed categories, products, and admin user
│   │   │   └── migrations/
│   │   │       ├── migration_lock.toml
│   │   │       ├── 20260113101649_init/
│   │   │       ├── 20260118113241_add_user_auth/
│   │   │       ├── 20260119105721_add_token_to_session/
│   │   │       ├── 20260205101742_add_user_metadata/
│   │   │       ├── 20260415183303_add_performance_indexes/
│   │   │       ├── 20260416215455/
│   │   │       ├── 20260508141307_add_orders/
│   │   │       ├── 20260608104108_add_address_and_tracking/
│   │   │       ├── 20260808100141_add_expo_leads/
│   │   │       └── 20260907120000_add_courier_guy_fields/
│   │   ├── scripts/
│   │   │   ├── setup-admin.ts               # interactive admin account setup
│   │   │   └── update-descriptions.ts       # product description utility
│   │   ├── src/
│   │   │   ├── index.ts                    # Express app, middleware, routes, and webhook registration
│   │   │   ├── lib/
│   │   │   │   ├── auth.ts                 # sessions and password hashing
│   │   │   │   ├── cache.ts                # TTL cache and invalidation
│   │   │   │   ├── env.ts                  # Zod environment validation
│   │   │   │   ├── logger.ts               # structured logging
│   │   │   │   └── prisma.ts               # PrismaClient singleton with PostgreSQL adapter
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts                 # cookie and bearer authentication
│   │   │   │   ├── globalAuth.ts           # attaches the current user to requests
│   │   │   │   ├── perUserRateLimit.ts     # user/IP rate limiting
│   │   │   │   ├── rbac.ts                 # role-based access control
│   │   │   │   └── requestId.ts             # request ID middleware
│   │   │   ├── routes/
│   │   │   │   ├── address.ts              # address CRUD and default address
│   │   │   │   ├── adminOrders.ts           # admin order status and shipment actions
│   │   │   │   ├── adminUsers.ts            # admin user management
│   │   │   │   ├── auth.ts                  # register, login, logout, and current user
│   │   │   │   ├── cart.ts                  # cart operations and guest merge
│   │   │   │   ├── categories.ts            # category listing
│   │   │   │   ├── checkout.ts              # Paystack checkout initialization
│   │   │   │   ├── expo.ts                  # expo lead routes
│   │   │   │   ├── health.ts                # database health and latency check
│   │   │   │   ├── orders.ts                # customer order history and details
│   │   │   │   ├── products.ts              # product CRUD and pagination
│   │   │   │   ├── stats.ts                 # cached admin statistics
│   │   │   │   └── users.ts                 # user routes
│   │   │   ├── services/
│   │   │   │   ├── email.service.ts         # Brevo transactional email
│   │   │   │   ├── sms.service.ts           # optional SMS notifications
│   │   │   │   └── tcg.service.ts           # Shiplogic/The Courier Guy API client
│   │   │   ├── types/
│   │   │   │   └── express.d.ts             # Express request user typing
│   │   │   └── webhooks/
│   │   │       ├── courier.ts               # static Bearer-token courier status webhook
│   │   │       └── paystack.ts               # payment webhook and order creation
│   │   └── test/
│   │       ├── cacheInvalidation.test.ts
│   │       ├── cartMerge.test.ts
│   │       ├── globalSetup.ts
│   │       ├── helpers.ts
│   │       ├── rateLimit.test.ts
│   │       └── setup.ts
│   └── frontend/
│       ├── .gitignore
│       ├── eslint.config.mjs
│       ├── next-env.d.ts
│       ├── next.config.ts
│       ├── package.json
│       ├── playwright.config.ts
│       ├── postcss.config.mjs
│       ├── README.md
│       ├── tailwind.config.js
│       ├── tsconfig.json
│       ├── vitest.config.ts
│       ├── app/
│       │   ├── favicon.ico
│       │   ├── globals.css
│       │   ├── layout.tsx                  # root providers and layout
│       │   ├── page.tsx                    # homepage
│       │   ├── about/page.tsx
│       │   ├── account/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── addresses/page.tsx
│       │   │   ├── addresses/new/page.tsx
│       │   │   ├── addresses/[id]/edit/page.tsx
│       │   │   ├── orders/page.tsx
│       │   │   └── orders/[id]/page.tsx     # order detail and shipment tracking
│       │   ├── admin/
│       │   │   ├── layout.tsx               # admin authentication guard
│       │   │   ├── page.tsx                 # admin dashboard
│       │   │   ├── customers/page.tsx
│       │   │   ├── customers/[id]/page.tsx
│       │   │   ├── orders/page.tsx           # status and Ship order controls
│       │   │   ├── users/page.tsx
│       │   │   └── products/
│       │   │       ├── page.tsx
│       │   │       ├── ProductsTable.tsx
│       │   │       ├── error.tsx
│       │   │       ├── new/page.tsx
│       │   │       └── [id]/edit/page.tsx
│       │   ├── apothecary/page.tsx
│       │   ├── cart/page.tsx
│       │   ├── checkout/
│       │   │   ├── address/page.tsx
│       │   │   └── payment/page.tsx
│       │   ├── conferences/page.tsx
│       │   ├── consulting/page.tsx
│       │   ├── cosmetics/page.tsx
│       │   ├── edible/page.tsx
│       │   ├── expo/page.tsx
│       │   ├── flower/page.tsx
│       │   ├── login/page.tsx
│       │   ├── order/success/page.tsx
│       │   ├── products/
│       │   │   ├── page.tsx
│       │   │   ├── error.tsx
│       │   │   └── [id]/page.tsx
│       │   ├── register/page.tsx
│       │   └── training/page.tsx
│       ├── components/
│       │   ├── AddToCartButton.tsx
│       │   ├── CategoryFilter.tsx
│       │   ├── DebugAuth.tsx
│       │   ├── EmptyState.tsx
│       │   ├── HomePageClient.tsx
│       │   ├── ImageWithFallback.tsx
│       │   ├── LoginForm.tsx
│       │   ├── placeholder.ts
│       │   ├── ProductBrowser.test.tsx
│       │   ├── ProductBrowser.tsx
│       │   ├── ProductCard.tsx
│       │   ├── RegisterForm.tsx
│       │   ├── SkeletonCart.tsx
│       │   ├── SkeletonProductGrid.tsx
│       │   ├── SkeletonTable.tsx
│       │   ├── SwitchUserPrompt.tsx
│       │   ├── ToastProvider.tsx
│       │   ├── admin/DashboardStats.tsx
│       │   └── Layout/Navbar.tsx
│       ├── e2e/cart-flow.spec.ts
│       ├── lib/
│       │   ├── api-client.ts               # central API client and shipment methods
│       │   ├── AuthContext.tsx
│       │   ├── CartContext.tsx
│       │   ├── cookie.ts
│       │   ├── fetch-with-cookie.ts
│       │   ├── formatPrice.ts
│       │   └── auth/server.ts               # SSR auth helper
│       ├── public/
│       │   └── images/
│       │       ├── apothecary/
│       │       ├── cosmetics/
│       │       ├── edibles/
│       │       ├── flower/
│       │       └── products/
│       ├── test/setup.tsx
│       └── types/index.ts                   # frontend Product, User, and Category types
└── packages/
    └── shared-types/
        ├── index.ts                         # shared User, Product, and Category interfaces
        ├── package.json
        └── tsconfig.json
```

## Current Architecture

- Backend: Express, Prisma 7, PostgreSQL, Paystack, Brevo, and Shiplogic/The Courier Guy.
- Frontend: Next.js App Router, React 19, Tailwind CSS, Vitest, and Playwright.
- Shared code: `packages/shared-types` is consumed by the frontend through the pnpm workspace.
- Authentication: database-backed sessions using HttpOnly `session_token` cookies, with bearer-token support in backend authentication middleware.
- Cart: persistent authenticated carts plus local guest carts merged transactionally after login.
- Checkout: Paystack initialization and webhook processing create and update orders.
- Courier flow: admins create shipments from the admin order list; shipment metadata and tracking history are stored on `Order`; customers see tracking on order details.
- Webhooks: Paystack and courier endpoints are registered before `express.json()` and receive `express.raw()` request bodies. Courier authentication uses the configured static Bearer token in `TCG_WEBHOOK_SECRET`; Paystack uses its webhook secret when configured.
- Observability and protection: Helmet, CORS, structured Pino HTTP logging, request IDs, production rate limiting, per-user cart/checkout limits, and a database health endpoint are registered in `apps/backend/src/index.ts`.

## Environment Variables

Backend variables are documented in `apps/backend/.env.example`. The main settings are:

```text
DATABASE_URL
NODE_ENV
PORT
FRONTEND_URL
COOKIE_SECRET
SESSION_SECURE_COOKIE
PAYSTACK_SECRET_KEY
PAYSTACK_PUBLIC_KEY
PAYSTACK_WEBHOOK_SECRET
BREVO_API_KEY
BREVO_EMAIL_FROM
BREVO_EMAIL_FROM_NAME
BREVO_SMS_SENDER
ADMIN_EMAIL
ADMIN_PHONE
TCG_API_KEY
TCG_SANDBOX_MODE
TCG_WEBHOOK_SECRET
```

The frontend uses `NEXT_PUBLIC_API_URL` for the backend API base URL.

## Common Commands

```bash
pnpm install --frozen-lockfile
pnpm --filter backend exec prisma generate
pnpm --filter backend exec prisma migrate deploy
pnpm --filter backend typecheck
pnpm --filter frontend typecheck
pnpm --filter backend test
pnpm --filter frontend test
pnpm --filter frontend test:e2e
pnpm -r lint
pnpm -r build
```

The GitHub Actions workflow runs dependency installation, Prisma client generation, and the monorepo build on pushes and pull requests. Pushes to `main` deploy the backend to Railway and the frontend to Vercel.

Before production Courier Guy use, test with a sandbox key, create a test order, verify shipment persistence and notification delivery, expose the local webhook with ngrok, and confirm a status webhook updates the order before switching to production credentials.
