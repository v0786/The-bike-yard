# SETUP.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Planning — Pending project initialization  
**Version:** 1.1  
**Source of Truth:** Yes — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md, AGENTS.md, PLAN.md  
**Change history:** v1.1 — corrected shadcn/ui and Prisma install commands; fixed `prisma migrate reset` flags; resolved super-admin seed vs manual-creation contradiction.

---

## 1. Supported Operating Systems

- Linux (Ubuntu 22.04+, Debian 12+, Fedora 38+)
- macOS (v13+, Sonoma, Ventura)
- Windows (via WSL2 recommended; native Node.js v20+ also supported)

---

## 2. Prerequisites

| Requirement | Minimum Version | Notes |
|-------------|-----------------|-------|
| Node.js | v20.0.0 | Use nvm/nvm-windows to manage versions |
| npm | 10.0.0 | Or pnpm/yarn |
| PostgreSQL | 15.0+ | Local or managed (Supabase, Neon, PlanetScale) |
| Git | 2.40+ | For version control |
| Optional: pnpm | 9.0.0 | Recommended over npm for lockfile consistency |

---

## 3. Clone & Install

```bash
# 1. Clone the repository
git clone <repository-url>

# 2. Navigate to project directory
cd the-bike-yard

# 3. Install dependencies
npm install

# 4. Install dev dependencies
npm install -D tailwindcss postcss autoprefixer @types/node @types/react @types/react-dom eslint eslint-plugin-react

# 5. Install runtime dependencies (Prisma client is a runtime dependency)
npm install @prisma/client

# 6. Initialise shadcn/ui (CLI)
npx shadcn@latest init
```

---

## 4. Environment Variables

Copy `.env.example` to `.env.local` and fill in safe placeholder values. **Never** commit `.env.local` or real secrets.

```bash
cp .env.example .env.local
```

### Required Environment Variables

| Variable | Purpose | Safe Example Placeholder |
|----------|---------|-------------------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/bikeyard` |
| `NEXTAUTH_SECRET` | Auth.js session signing key | `32-byte-random-string-generate-with-openssl-rand-32` |
| `NEXTAUTH_URL` | Application base URL | `http://localhost:3000` |
| `BASE_URL` | Public site URL | `http://localhost:3000` |
| `STORAGE_PROVIDER` | `local` or `s3` | `local` |
| `S3_BUCKET_NAME` | Storage bucket name | `bikeyard-dev` |
| `S3_ENDPOINT` | S3-compatible endpoint (local) | `http://localhost:9000` |
| `S3_ACCESS_KEY_ID` | Storage credentials | `minioadmin` |
| `S3_SECRET_ACCESS_KEY` | Storage credentials | `minioadmin` |
| `AI_PROVIDER` | `stub`, `openai`, `anthropic` | `stub` |
| `AI_API_KEY` | AI provider key | `sk-test-key-do-not-use-in-production` |
| `PAYMENT_PROVIDER` | `stub`, `stripe` | `stub` |

---

## 5. Database Creation & Migration

```bash
# 1. Create the database (PostgreSQL example)
createdb bikeyard

# 2. Run Prisma migrations
npx prisma migrate dev --name init

# 2b. Or run without interactive mode (production-ready)
npx prisma migrate deploy

# 3. Seed development data
npx prisma db seed
```

### Seed Data

The seed script (`prisma/seed.ts`) creates:
- One dealership record (The Bike Yard, Khopat, Thane, Maharashtra, INR)
- Default roles (Super Admin, Owner, Manager, Sales Executive, Accountant, Insurance Staff, RTO Staff)
- One super admin user (email: `admin@thebikeyard.local`)
- Fictional bike catalogue data (brands, models, variants, colours, price lists)
- One sample stock unit (with unique chassis and engine number)

**All seed data is fictional and for development only. Never use in production without professional review.**

---

## 6. Local File Storage Setup (Development)

For development without S3, use MinIO or the local filesystem:

```bash
# If using MinIO (S3-compatible)
# 1. Start MinIO server
# 2. Create bucket: bikeyard-dev
# 3. Set environment variables
export S3_ENDPOINT=http://localhost:9000
export S3_ACCESS_KEY_ID=minioadmin
export S3_SECRET_ACCESS_KEY=minioadmin
export S3_BUCKET_NAME=bikeyard-dev
export STORAGE_PROVIDER=s3

# Or use local filesystem (default)
export STORAGE_PROVIDER=local
```

---

## 7. Authentication Setup

```bash
# 1. Generate Auth.js secret
openssl rand -hex 32

# 2. Set in .env.local
NEXTAUTH_SECRET=your-32-byte-secret

# 3. Start the app
npm run dev
```

Sign-in flow uses the Credentials provider. The seed script creates the first Super Admin account (`admin@thebikeyard.local`); change its password immediately after first sign-in. Do not create production users by direct database insert.

---

## 8. Starting Frontend & Backend

```bash
# Start Next.js dev server (includes API routes)
npm run dev

# App runs at http://localhost:3000
# Public website: http://localhost:3000
# Admin dashboard: http://localhost:3000/admin (auth required)
# Staff portal: http://localhost:3000/staff (auth required)
```

---

## 9. Running Checks

```bash
# Lint
npm run lint

# Type checking
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm start
```

---

## 10. Common Errors & Recovery

| Error | Cause | Fix |
|-------|-------|-----|
| `P2002: Unique constraint failed` | Duplicate chassis number or engine number in seed data | Remove or modify duplicate; ensure chassis/engine uniqueness |
| `P2014: Migration method not found` | Prisma schema out of sync with migration folder | Run `npx prisma migrate resolve --rolled-back <migration-name>` then re-apply |
| `EADDRINUSE` | Port 3000 already in use | Kill existing process or change port in `next.config.js` |
| `ENOENT` | Missing file or directory | Run `npm install` again; check paths |

---

## 11. Resetting Local Development Data Safely

```bash
# 1. Reset database (DANGEROUS: deletes all data)
npx prisma migrate reset

# 2. Or re-run seed only
npx prisma db seed

# 3. To undo local changes and start fresh
git checkout -- .
npm install
npx prisma migrate reset
npx prisma db seed
npm run dev
```

---

## 12. Optional Integrations (Stub for MVP)

| Integration | Development Approach |
|-------------|---------------------|
| Payment gateway | Use `PAYMENT_PROVIDER=stub`; record payments manually; integrate later |
| WhatsApp Business | Use development stubs; integrate after provider selection |
| Email/SMS notifications | Use transport config for later; in-app notifications functional immediately |
| AI chatbot provider | Use `AI_PROVIDER=stub`; replace with OpenAI/Anthropic after selection |
| S3 storage | Use local filesystem or MinIO for development; swap to production bucket later |

---

## 13. Windows & Linux/macOS Notes

**Windows:**
- Use Git Bash or PowerShell with `&` encoding for paths
- Node modules may need `npm rebuild` for native deps
- WSL2 recommended for PostgreSQL and toolchain

**Linux/macOS:**
- PostgreSQL may need `brew install postgresql` (macOS) or `sudo apt-get install postgresql` (Ubuntu)
- Ensure `psql` is in PATH
- nvm recommended for Node version management

---

**Verification:** SETUP.md v1.1 is complete and consistent with PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md v1.1, API.md v1.1, AGENTS.md v1.1, and PLAN.md v1.1. No dealership information, prices, GST details, or finance partners invented. All TBD items are marked.

**Next:** Proceed to 10_FEATURES_PROMPT.md to generate FEATURES.md.