# VerdeAfrique – Full-Stack E-Commerce Platform

**Production-ready African botanical e-commerce platform with admin dashboard**  
**Tech Stack:** Next.js 16 (App Router) + Express 5 + Prisma 7 + PostgreSQL  
**Deployment:** [Frontend (Vercel)](https://vasite-frontend.vercel.app) | [Backend (Railway)](https://backend-production-dfc8.up.railway.app)

For detailed technical documentation and interview preparation materials, see [INTERVIEW_AUDIT.md](./INTERVIEW_AUDIT.md).

---

## ✨ Key Features

### 🛍️ Customer Features
- **Browse Products** – Filter by category (Flowers, Edibles, Cosmetics, Apothecary, TCG)
- **Guest Checkout** – Browse and add items without registration
- **Seamless Login** – Guest cart atomically merges with user account using Prisma transactions (zero data loss)
- **Secure Checkout** – Multi-step checkout with address selection + Paystack payment integration
- **Order Tracking** – Order history with real-time status updates and shipping details
- **Email Notifications** – Automatic order confirmation and status updates via Brevo

### 👨‍💼 Admin Features
- **Admin Dashboard** – Real-time sales stats, order count, user metrics with caching
- **Product Management** – Full CRUD with soft delete, image handling, pagination, bulk actions
- **Order Management** – View all orders, update status, manage shipments, track revenue
- **User Management** – List users, change roles (ADMIN/USER), view customer activity

### 🔐 Security & Architecture
- **Database Sessions** – Revocable sessions stored in PostgreSQL (not JWT tokens)
- **HttpOnly Cookies** – Secure session tokens, immune to XSS attacks
- **Per-User Rate Limiting** – Fair allocation: authenticated users (100 req/15min), guests (10 req/15min)
- **Role-Based Access Control** – Middleware-enforced ADMIN/USER permissions
- **Webhook Safety** – Paystack signature verification, idempotency checks via unique constraints
- **Monorepo Type Safety** – Shared TypeScript types via `packages/shared-types`

---

## 🧱 Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js App Router | 16 |
| | React Server Components + Client Components | latest |
| | Tailwind CSS | v4 |
| | React Context (Auth, Cart state) | built-in |
| **Backend** | Express.js | 5 |
| | Prisma ORM | 7 |
| | PostgreSQL | 16+ |
| **Authentication** | bcrypt | 12 salt rounds |
| | Database sessions | HttpOnly cookies |
| **Payment** | Paystack | Webhook integration |
| **Email** | Brevo (Sendinblue) | Transactional API |
| **Monorepo** | pnpm workspaces | 10.23.0+ |
| **Deployment** | Vercel (Frontend) | – |
| | Railway (Backend + DB) | – |
| **CI/CD** | GitHub Actions | lint, build, typecheck |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 10+
- PostgreSQL 14+ (local or Docker)
- Git

### Installation & Setup

```bash
# Clone repository
git clone https://github.com/your-username/verdeafrique.git
cd verdeafrique

# Install dependencies
pnpm install

# Set up backend environment
cp apps/backend/.env.example apps/backend/.env
# Edit .env and set: DATABASE_URL, PAYSTACK_SECRET_KEY, BREVO_API_KEY, etc.

# Set up frontend environment
cp apps/frontend/.env.example apps/frontend/.env
# Edit .env and set: NEXT_PUBLIC_API_URL=http://localhost:4000

# Run database migrations and seed
pnpm --filter backend exec dotenv -e .env -- prisma migrate dev
pnpm --filter backend exec dotenv -e .env -- prisma db seed

# Create admin user (interactive prompt)
pnpm --filter backend exec tsx scripts/setup-admin.ts
```

### Development Servers

```bash
# Terminal 1 - Backend (Express, port 4000)
pnpm --filter backend dev

# Terminal 2 - Frontend (Next.js, port 3000)
pnpm --filter frontend dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the frontend.

---

## 📁 Project Structure

```
verdeafrique/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── index.ts             # Express app setup, middleware stack
│   │   │   ├── routes/              # API endpoints (auth, cart, checkout, orders, etc.)
│   │   │   ├── middleware/          # globalAuth, rate limiting, RBAC
│   │   │   ├── services/            # Email, SMS, TCG services
│   │   │   ├── lib/                 # Auth, cache, Prisma client
│   │   │   ├── webhooks/            # Paystack webhook handler
│   │   │   └── types/               # Express type extensions
│   │   ├── prisma/
│   │   │   ├── schema.prisma        # Database schema (8 tables)
│   │   │   ├── seed.ts              # Initial seed data
│   │   │   └── migrations/          # All incremental migrations
│   │   └── test/                    # Unit tests
│   │
│   └── frontend/
│       ├── app/                     # Next.js App Router pages
│       │   ├── layout.tsx           # Root layout with providers
│       │   ├── page.tsx             # Homepage
│       │   ├── admin/               # Admin dashboard (protected)
│       │   ├── account/             # User account & orders
│       │   ├── cart/                # Shopping cart
│       │   ├── checkout/            # Checkout flow
│       │   └── [category]/          # Product category pages
│       ├── components/              # Reusable React components
│       ├── lib/                     # Utilities (API client, auth contexts)
│       ├── public/                  # Static assets
│       └── e2e/                     # Playwright E2E tests
│
├── packages/
│   └── shared-types/                # Shared TypeScript definitions
│
├── infra/                           # Infrastructure as Code (k8s, terraform)
└── PROJECT_STRUCTURE.md             # Detailed file structure
```

---

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` – Create account with email + password
- `POST /api/auth/login` – Login and receive session token
- `POST /api/auth/logout` – Revoke session
- `GET /api/auth/me` – Get authenticated user info

### Products & Categories
- `GET /api/products` – List products (paginated, filterable)
- `GET /api/products/:id` – Get product details
- `POST /api/products` – Create product (admin only)
- `PUT /api/products/:id` – Update product (admin only)
- `DELETE /api/products/:id` – Soft delete product (admin only)
- `GET /api/categories` – List all categories

### Cart Management
- `GET /api/cart` – Get user's cart with items
- `POST /api/cart` – Add item to cart (or update quantity)
- `PUT /api/cart/:cartItemId` – Update cart item quantity
- `DELETE /api/cart/:cartItemId` – Remove item from cart
- `POST /api/cart/merge` – Merge guest cart items (after login)

### Checkout & Orders
- `POST /api/checkout/create-session` – Initialize Paystack payment
- `GET /api/orders` – Get user's orders
- `GET /api/orders/:id` – Get order details
- `POST /api/webhooks/paystack` – Paystack webhook (charge.success)

### Admin Only
- `GET /api/admin/orders` – View all orders
- `PUT /api/admin/orders/:id` – Update order status
- `GET /api/admin/users` – List all users
- `PUT /api/admin/users/:id/role` – Change user role
- `GET /api/stats` – Dashboard statistics (cached)

### Addresses
- `GET /api/addresses` – List user's addresses
- `POST /api/addresses` – Create address
- `PUT /api/addresses/:id` – Update address
- `DELETE /api/addresses/:id` – Delete address
- `PUT /api/addresses/:id/default` – Set as default

### System
- `GET /api/health` – Health check (includes DB latency)

---

## 🔐 Authentication & Session Flow

### How It Works
1. **Registration/Login** → Backend hashes password with bcrypt (12 rounds), creates a database session token, stores in PostgreSQL
2. **Session Storage** → Backend sets `session_token` in HttpOnly secure cookie (auto-sent by browser)
3. **Per-Request Auth** → `globalAuth` middleware validates session token against database, attaches `req.user` to all requests
4. **Logout** → Frontend requests `/api/auth/logout` → Backend deletes session row → immediate invalidation
5. **Guest Cart Merge** → On login, frontend sends localStorage guest cart → backend atomically merges using Prisma `$transaction` + `upsert`

### Why Database Sessions?
- ✅ **Revocable** – Delete session row = instant logout (JWT can't do this)
- ✅ **Stateful** – Can store metadata, track login history
- ✅ **Secure** – HttpOnly cookie prevents XSS token theft
- ✅ **Audit Trail** – All sessions logged in database

---

## 💳 Payment Flow (Paystack)

1. User selects address and clicks "Pay"
2. Frontend calls `POST /api/checkout/create-session`
3. Backend validates address ownership, calculates total, initializes Paystack transaction
4. Paystack redirects to payment page
5. User enters card details → Paystack charges
6. Paystack sends `charge.success` webhook to backend
7. Backend verifies signature, checks for duplicates (idempotency via `stripeSessionId`), creates order
8. Backend clears cart, sends confirmation emails to customer + admin
9. Frontend redirects to `/order/success?reference=...`
10. User can view order in account → order history

**Safety Features:**
- HMAC-SHA512 signature verification
- Idempotency check (unique `stripeSessionId` constraint)
- Server-side verification of amount before creating order
- Transaction rollback on error

---

## 🗄️ Database Schema

### Core Tables
- **User** – Email, password hash, role (ADMIN/USER), metadata
- **Session** – Token, user ID, expiry time (revocable)
- **Product** – Name, price, images, category, soft-delete flag
- **Category** – Category name (Flowers, Edibles, Cosmetics, Apothecary, TCG)
- **Cart** – One per user, contains CartItems
- **CartItem** – Product ID + quantity (unique per cart)
- **Order** – Total, status, Paystack reference (idempotency key), user + address
- **OrderItem** – Product snapshot + quantity per order
- **Address** – User addresses (street, city, country, postal code, phone)

### Key Relationships
- User → Sessions (one-to-many, revocable)
- User → Cart (one-to-one)
- Cart → CartItems (one-to-many)
- CartItem → Product (many-to-one)
- User → Orders (one-to-many)
- Order → OrderItems (one-to-many, product snapshot)
- Order → Address (many-to-one)
- Product → Category (many-to-one)

---

## 🧪 Testing

```bash
# Run backend unit tests (Vitest)
pnpm --filter backend test

# Run frontend component tests
pnpm --filter frontend test

# Run E2E tests (Playwright)
pnpm --filter frontend e2e

# Lint all workspaces
pnpm lint

# Type check all workspaces
pnpm typecheck
```

---

## 📊 Environment Variables

### Backend (`.env`)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/verdeafrique

# Server
PORT=4000
NODE_ENV=production
FRONTEND_URL=http://localhost:3000

# Authentication
COOKIE_SECRET=your-secret-key-here
SESSION_SECURE_COOKIE=false  # true in production

# Payment (Paystack)
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_WEBHOOK_SECRET=webhook_secret_...

# Email (Brevo)
BREVO_API_KEY=xkeysib_...
ADMIN_EMAIL=admin@example.com

# Optional
STRIPE_SECRET_KEY=sk_test_...  # Unused
LOG_LEVEL=debug
```

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set root directory: (leave as default, Vercel auto-detects monorepo)
3. Set build command: `pnpm build --filter frontend`
4. Set start command: (Vercel auto-detects Next.js)
5. Add environment variable: `NEXT_PUBLIC_API_URL=https://backend-production-dfc8.up.railway.app`
6. Deploy!

### Backend (Railway)
1. Connect GitHub repo to Railway
2. Create PostgreSQL service (Railway managed)
3. Create Node.js service for backend
4. Set environment variables:
   - `DATABASE_URL=...` (from Railway PostgreSQL)
   - `FRONTEND_URL=https://vasite-frontend.vercel.app`
   - `NODE_ENV=production`
   - `PAYSTACK_SECRET_KEY=...`
   - `BREVO_API_KEY=...`
   - etc.
5. Set build command: `cd apps/backend && pnpm install && pnpm build`
6. Set start command: `node dist/index.js`
7. Deploy!

### DNS Configuration
- Frontend domain → Vercel CNAME
- Backend domain → Railway-generated URL (or custom CNAME)

---

## 📈 Performance & Caching

- **Product List Cache** – 15-minute TTL, cleared on create/update/delete
- **Dashboard Stats Cache** – 5-minute TTL, cleared on product changes
- **Image Optimization** – Next.js `Image` component with automatic sizing
- **Database Indexes** – Added on frequently queried fields (userId, productId, cartId)
- **Rate Limiting** – Per-user (100/15min auth, 10/15min guest) + IPv6 /56 masking

---

## 🎓 Key Architectural Decisions

### Why Database Sessions Over JWT?
- Sessions are revocable (logout is instant, not delayed by token TTL)
- Can track login history and metadata
- Smaller payload than JWT (just a token string)
- HttpOnly cookies prevent XSS token theft

### Why Per-User Rate Limiting?
- Fair resource allocation (authenticated users get more quota)
- IPv6 /56 masking prevents single-user botnets
- User ID lookup is fast with globalAuth middleware

### Why Prisma Over Raw SQL?
- Type-safe queries with auto-generated client
- Migration management (no manual SQL)
- Atomic transactions for complex operations (cart merge)
- Better performance with connection pooling

### Why Next.js App Router?
- Server Components by default (better performance)
- File-based routing
- Built-in image optimization
- Seamless API route integration

---

## 🔄 Recent Improvements (May 2026)

✅ **Guest Cart Merge** – Atomic Prisma transaction preserves guest cart on login  
✅ **Per-User Rate Limiting** – Fair resource allocation with IPv6 safety  
✅ **Global Auth Middleware** – Attaches user to all requests for middleware access  
✅ **Health Check Endpoint** – Verifies DB connection + latency measurement  
✅ **Environment Validation** – Enforced at startup via dotenv  

---

## 📚 Further Reading

- [INTERVIEW_AUDIT.md](./INTERVIEW_AUDIT.md) – Comprehensive technical documentation, STAR stories, 20 interview Q&A
- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) – Detailed file-by-file breakdown
- [DESIGN.md](./DESIGN.md) – UI/UX design decisions

---

## 📧 Support & Questions

For technical details, deployment issues, or interview preparation, refer to [INTERVIEW_AUDIT.md](./INTERVIEW_AUDIT.md).

---

**Last Updated:** June 2026  
**Status:** Production Ready  
**License:** MIT
