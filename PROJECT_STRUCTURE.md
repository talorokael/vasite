# VerdeAfrique Project Structure

```
VerdeAfrique/ (PNPM monorepo)
├── apps/
│   ├── backend/ (Port 3001)
│   │   ├── prisma/
│   │   │   ├── schema.prisma           # ✅ Models: User, Session, Product, Category
│   │   │   ├── migrations/             # ✅ 3 migrations applied
│   │   │   │   ├── 20260113101649_init/
│   │   │   │   ├── 20260118113241_add_user_auth/
│   │   │   │   └── 20260119105721_add_token_to_session/
│   │   │   └── seed.ts                 # ✅ Logic correct, fails on execution
│   │   ├── src/
│   │   │   ├── index.ts                # ✅ Express server with CORS
│   │   │   ├── lib/
│   │   │   │   ├── prisma.ts           # ✅ Prisma client singleton
│   │   │   │   └── auth.ts
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts             # ✅ authenticate, requireRole
│   │   │   │   ├── cors.ts
│   │   │   │   └── rbac.ts
│   │   │   ├── routes/                 # ✅ Auth, Products, Categories endpoints
│   │   │   │   ├── auth.ts
│   │   │   │   └── categories.ts
│   │   │   └── types/
│   │   │       └── express.d.ts
│   │   ├── prisma.config.ts            # ✅ Custom config with dotenv/config
│   │   ├── .env                        # ✅ Contains DATABASE_URL
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── eslint.config.js
│   │   └── .gitignore
│   │
│   └── frontend/ (Port 3000, Next.js 16)
│       ├── app/
│       │   ├── layout.tsx              # ✅ AuthProvider wrapper
│       │   ├── page.tsx                # ✅ Server Component fetches data
│       │   └── globals.css             # ✅ Tailwind v4 (@import "tailwindcss")
│       ├── components/
│       │   ├── ProductBrowser.tsx      # ✅ Client component with filtering
│       │   ├── CategoryFilter.tsx      # ✅ Interactive category buttons
│       │   ├── LoginForm.tsx           # ✅ Functional auth form
│       │   ├── RegisterForm.tsx        # ✅ Fixed (was calling login)
│       │   └── Layout/
│       │       └── Navbar.tsx
│       ├── lib/
│       │   ├── api-client.ts           # ✅ Typed with token management
│       │   └── AuthContext.tsx         # ✅ Full auth state (needs fix for localStorage duplication)
│       ├── types/
│       │   └── index.ts                # ✅ Product, User, Category interfaces
│       ├── public/
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.ts
│       ├── postcss.config.mjs
│       ├── tailwind.config.js
│       ├── eslint.config.mjs
│       ├── .gitignore
│       └── README.md
│
├── packages/
│   └── shared-types/
│
├── infra/
│   ├── k8s/
│   └── terraform/
│
├── scripts/
├── tests/
├── .github/
│   └── workflows/
│       └── ci.yml                      # ✅ CI pipeline
├── .vscode/
│   └── settings.json
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
└── .gitignore
```

## Quick Reference

| Component | Location | Status | Notes |
|-----------|----------|--------|-------|
| **Backend Server** | `apps/backend/` | ✅ Running on Port 3001 | Express with CORS, Auth middleware |
| **Database** | Prisma (PostgreSQL) | ✅ Configured | 3 migrations applied |
| **Frontend** | `apps/frontend/` | ✅ Running on Port 3000 | Next.js 16 with Tailwind v4 |
| **Authentication** | Backend middleware + AuthContext | ✅ Implemented | Token-based, localStorage managed |
| **API Client** | `lib/api-client.ts` | ✅ Typed | Handles token management |
| **Database Seeding** | `prisma/seed.ts` | ⚠️ Logic OK | Needs execution fix |
| **CI/CD** | `.github/workflows/ci.yml` | ✅ Pipeline set up | Automated testing & deployment |

## Known Issues

- 🔧 Seed script needs debugging during execution
- 📝 AuthContext has localStorage duplication that needs refactoring
