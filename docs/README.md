# README.md — The Bike Yard

**The Bike Yard** — Complete Dealership Management & Digital Showroom Platform  
A motorcycle dealership management system and modern showroom website for The Bike Yard, Khopat, Thane, Maharashtra, India.

**Status:** Planned / In Development — Documentation phase complete (15 documents, synchronized v1.1). Application code not yet written.  
**Documentation version:** 1.1 — cross-document synchronization pass (reservation history, booking advances, refunds, GST split, service requests, RBAC, API envelope).

---

## Overview

The Bike Yard is a single integrated web application with three interfaces:

1. **Public Website** — Customers explore bikes, pricing, finance, insurance, and services; submit enquiries and book test rides.
2. **Admin Dashboard** — Dealership owners and staff manage sales, inventory, payments, customers, documentation, and daily operations.
3. **Staff Portal** — Role-scoped task management for sales executives, insurance staff, RTO staff, and accountants.

Built as one application, one central database, three interfaces, shared business logic.

---

## Application Surfaces

**Public Website:**
- Home / Showroom (hero banner, featured bikes, offers)
- Explore Bikes (catalogue with filters)
- Bike Details & Pricing (gallery, specs, EMI calculator)
- Finance & Loan (information)
- Insurance (information)
- Registration / RTO (information)
- Services
- Blogs & News
- About Us, Contact Us, FAQ
- AI Chatbot

**Admin Dashboard:**
- Overview, Sales, Purchase/Inward, Stock Management, Stock Outward
- Bike Variants, Pricing Management, Customer Management
- Booking Management, Finance Management, Insurance Management
- RTO / Registration, Payments, Bills & Invoices
- Staff Management, Daily Tasks, Reports & Analytics
- Blogs Management, Social Media, FAQ Management, Requirements, Settings

**Staff Portal:**
- My Dashboard, Customer Enquiries, Sales Leads, Bookings
- Insurance Forms, Registration Forms, Finance Applications
- Service Requests, Daily Tasks, My Performance

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (App Router, React) |
| Language | TypeScript |
| UI | Tailwind CSS |
| Components | shadcn/ui |
| Backend | Next.js API Routes + Server Actions |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Auth.js |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| File Storage | S3-compatible storage |
| PDF Generation | Node.js PDF library |
| AI | Pluggable AI provider |
| Deployment | Vercel (planned) |

---

## Repository Structure

```
the-bike-yard/
├── docs/                 # 15 project documents (PRD, DESIGN, ARCHITECTURE, etc.)
├── prisma/               # Data model, migrations, seed
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js routes (public, admin, staff, api, auth)
│   ├── components/       # ui, public, admin, staff, shared
│   ├── lib/              # Prisma, auth, validations, currency, storage, pdf, ai
│   ├── services/         # Business logic layer
│   ├── middleware.ts     # Route protection, RBAC
│   └── types/            # TypeScript declarations
├── .env.example          # Safe example environment variables
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Prerequisites

- Node.js (v20+)
- npm or pnpm
- PostgreSQL database (local or managed)
- S3-compatible storage bucket (local MinIO for development)

---

## Project Documentation

All 15 source-of-truth documents live in `/docs`:

1. PRD.md — Product requirements
2. DESIGN.md — UI/UX design system
3. ARCHITECTURE.md — Technical architecture
4. DATABASE.md — Data model
5. API.md — API specification
6. AGENTS.md — Coding agent rules
7. README.md — This file
8. PLAN.md — Implementation plan
9. SETUP.md — Local setup
10. FEATURES.md — Feature guide
11. AUTH_SECURITY.md — Auth & security
12. MCP.md — MCP integration (deferred for MVP)
13. INTEGRATIONS.md — External integrations
14. TESTING.md — Testing strategy
15. DEBUGGING.md — Debugging playbook

---

## Local Setup Summary

Detailed steps are in SETUP.md.

1. Clone repository.
2. Copy `.env.example` to `.env.local` and fill in safe placeholder values.
3. Install dependencies: `npm install`
4. Create PostgreSQL database.
5. Run migrations: `npx prisma migrate dev`
6. Seed data: `npx prisma db seed`
7. Start dev server: `npm run dev`

---

## Environment Configuration

See `.env.example` for variable names and purpose. Secret values are never committed.

Key variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STORAGE_PROVIDER`, `S3_*`, `AI_PROVIDER`, `PAYMENT_PROVIDER`, `BASE_URL`.

---

## Development Commands

Commands to be verified against actual `package.json` scripts once the project is initialized (Phase 1). Not yet verified.

---

## Deployment Overview

Planned for Vercel with preview deployments per branch. Production deployment after owner approval and security review. Database migrations run via `prisma migrate deploy`.

---

## Contribution Workflow

1. Read all source-of-truth documents before editing.
2. Inspect existing repository state.
3. Implement smallest complete change per AGENTS.md loop.
4. Run tests, lint, typecheck, build.
5. Update documentation when contracts change.
6. Small, coherent commits; no secrets committed.

---

## Security & Support

- Server-side authorization enforcement; no client-side trust of prices/permissions/stock.
- Secrets stored server-side only.
- Customer documents access-restricted by role.
- Audit logs for privileged and financial actions.
- GST-compliant invoicing requires professional tax review before production.

---

## Current Status & Known Limitations

- **Status:** Documentation phase complete. No application code written yet.
- **Known limitations:** No payment gateway provider selected; no WhatsApp/SMS provider selected; no AI provider selected; GST configuration pending owner verification.

---

**Verification:** README.md v1.1 summarizes the six upstream documents and the actual repository state (documentation only, not a git repo, Node.js available). No new product requirements created. No fake URLs, badges, screenshots, or deployment status claimed.

**Next:** Proceed to 08_IMPLEMENTATION_PLAN_PROMPT.md to generate PLAN.md.