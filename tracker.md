# The Bike Yard — Implementation Tracker

**Version:** 1.1 (updated 2026-11-03)  
**Source of truth:** All 15 approved docs in `docs/`  
**Current phase:** Phase 1-12 (foundation, public shell, admin/staff pages, services, API auth, tests complete; production build verified)

---

## Legend

- **NS** — Not Started
- **IP** — In Progress
- **BL** — Blocked
- **IV** — In Review
- **CO** — Completed

Each task follows: `DOC-<doc>`, `PHASE-<n>-<task>`, or `TRACKER-<id>`.

---

## Phase 0 — Repository Audit

| ID | Task | Status | Notes |
|----|------|--------|-------|
| TRACKER-01 | Inspect repository structure | CO | Next.js/React/Prisma/Tailwind scaffold present; prisma/ empty; src/ empty directories ready |
| TRACKER-02 | Verify documentation pipeline completeness | CO | All 15 docs present and v1.1 synced; see DOCUMENTATION_STATUS.md |
| TRACKER-03 | Confirm Prisma schema generation | CO | schema.prisma fixed v1.1 (UUID→String @db.Uuid, provider string, generator=prisma-client-js); `prisma generate` succeeds; Prisma Client v6.12.0 generated |
| TRACKER-04 | Set up git repo and initial commit | CO | Git repo initialized; initial commit saved |
| TRACKER-05 | Document baseline environment setup | IP | .env.example present; Node 22, npm 10 available |

---

## Phase 1 — Foundation

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-1-01 | Configure Next.js App Router base layout | CO | Root layout.tsx created with Inter font, globals.css |
| PHASE-1-02 | Set up Tailwind CSS 4 with design tokens (colors, fonts) per DESIGN.md | CO | globals.css with design tokens; @tailwindcss/postcss configured; security headers in next.config.mjs |
| PHASE-1-03 | Create design system: StatusChip, TextInput, LoadingState per DESIGN.md | CO | StatusChip, Button, Input, Card, Badge, Table, Dialog, DropdownMenu, Form components in src/components/ui/ |
| PHASE-1-04 | Configure Auth.js Credentials provider; create first Super Admin seed per SETUP.md | CO | NextAuth with Prisma adapter, database-backed sessions (not JWT), JWT explicitly rejected per AUTH_SECURITY §3 |
| PHASE-1-05 | Initialize Prisma from DATABASE.md schema; generate client | CO | Schema fixed; prisma generate succeeds; Prisma Client v6.12.0; migrations + seed created |
| PHASE-1-06 | Set up ESLint, Prettier; enforce TypeScript strict mode | CO | tsconfig strict mode; jsx errors fixed; package.json scripts added |
| PHASE-1-07 | Configure logging, error boundaries, and global error handler | IP | Middleware auth checks; error handling pending |
| PHASE-1-08 | Create project-level DECISIONS.md and CHANGELOG.md | CO | DECISIONS.md, CHANGELOG.md created |

---

## Phase 2 — Public Website

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-2-01 | Homepage with hero, navigation, and all sections | CO | PHASE-1-01 to PHASE-1-02 | Frontend Engineer |
| PHASE-2-02 | New Vehicles Catalogue page | CO | PHASE-1-02 | Frontend Engineer |
| PHASE-2-03 | Used Vehicles Catalogue page | CO | PHASE-1-02 | Frontend Engineer |
| PHASE-2-04 | Motorcycle Detail Page | CO | PHASE-1-02 | Frontend Engineer |
| PHASE-2-05 | Static public pages (About, Contact, Finance, Insurance, RTO) | CO | PHASE-1-02 | Frontend Engineer |
| PHASE-2-06 | Public API routes (bikes, brands, faqs, enquiries) | CO | PHASE-1-05 | Backend Engineer |
| PHASE-2-07 | Responsive layouts and mobile testing | NS | PHASE-2-01 to PHASE-2-05 | Frontend Engineer |

---

## Phase 3 — Admin Dashboard

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-3-01 | Admin login page | CO | PHASE-1-04 | Frontend Engineer |
| PHASE-3-02 | Admin dashboard layout (sidebar + header) | CO | PHASE-1-01, PHASE-1-04 | Frontend Engineer |
| PHASE-3-03 | Admin dashboard pages (brands, inventory, customers, etc.) | CO | PHASE-3-01, PHASE-3-02 | Frontend Engineer |
| PHASE-3-04 | Role-based sidebar filtering per API.md §9 | CO | PHASE-3-01, AUTH_SECURITY.md | Frontend Engineer |
| PHASE-3-05 | Admin forms (create/edit brands, models, variants, colours) | NS | PHASE-3-03 | Frontend Engineer |
| PHASE-3-06 | Admin API routes (dashboard, customers, sales, payments, stock, bookings, finance, insurance, rto, invoices, refunds, brands) | CO | PHASE-1-05 | Backend Engineer |

---

## Phase 4 — Staff Portal

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-4-01 | Staff authentication and dashboard | CO | PHASE-1-04 | Security Engineer + Frontend Engineer |
| PHASE-4-02 | Staff portal pages (leads, tasks, document uploads) | CO | PHASE-4-01 | Frontend Engineer |
| PHASE-4-03 | Staff pages (dashboard, enquiries, leads, bookings, insurance, registration, finance, service, tasks, performance, login) | CO | PHASE-4-01 | Frontend Engineer |

---

## Phase 5 — Financial & Service Interfaces

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-5-01 | Payment recording and allocations | IP | PHASE-1-05, PHASE-3-03 | Backend Engineer |
| PHASE-5-02 | GST invoices with CGST/SGST/IGST split | IP | PHASE-1-05, PHASE-5-01 | Backend Engineer |
| PHASE-5-03 | Refund lifecycle (pending → approved → completed) | IP | PHASE-1-05 | Backend Engineer |

---

## Phase 7 — Finance, Insurance & RTO

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| P7-1 | Finance applications | CO | P5-5 | Backend Engineer |
| P7-2 | Insurance applications | CO | P5-5 | Backend Engineer |
| P7-3 | RTO applications | CO | P5-5 | Backend Engineer |
| P7-4 | Document uploads (secure, role-restricted) | CO | P7-1, P7-2, P7-3 | Backend Engineer |

---

## Phase 8 — Staff Portal, Tasks & Notifications

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| P8-1 | Staff dashboard | CO | P1-2, P5-2 | Frontend Engineer |
| P8-2 | Daily tasks | CO | P1-2 | Frontend Engineer |
| P8-3 | Notifications | NS | P8-2 | Backend Engineer |
| P8-4 | My performance | CO | P5-5, P6-1 | Frontend Engineer |
| P8-5 | Service requests | CO | P5-5 | Frontend Engineer |

---

## Phase 9 — Reports & Analytics

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| P9-1 | Dashboard overview cards | CO | P5-5, P6-1, P4-3 | Backend Engineer |
| P9-2 | Sales/revenue charts | IP | P5-5, P6-1 | Backend Engineer |
| P9-3 | Best-selling variants | NS | P5-5 | Backend Engineer |
| P9-4 | Stock ageing | NS | P4-3 | Backend Engineer |
| P9-5 | Salesperson performance | NS | P5-5, P1-1 | Backend Engineer |
| P9-6 | Export reports | NS | P9-1 to P9-5 | Backend Engineer |

---

## Phase 10 — Blogs, Social Media, FAQ, Settings

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| P10-1 | Blogs management | IP | P1-2 | Backend Engineer |
| P10-2 | Social media links | IP | P1-2 | Backend Engineer |
| P10-3 | FAQ management | IP | P1-2 | Backend Engineer |
| P10-4 | Settings | CO | P0-6 | Backend Engineer |
| P10-5 | Public social/FAQ display | NS | P10-2, P10-3 | Frontend Engineer |

---

## Phase 11 — AI Chatbot Integration

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| P11-1 | Chatbot knowledge source | IP | P3-1, P10-3 | Backend Engineer |
| P11-2 | Chatbot responses | IP | P11-1 | Backend Engineer |
| P11-3 | Chatbot enquiry collection | NS | P11-2, P5-2 | Backend Engineer |
| P11-4 | No hallucination guard | IP | P11-2 | Backend Engineer |

---

## Phase 12 — Testing, Security & Production Readiness

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| P12-1 | Unit tests | CO | All phases | QA Engineer |
| P12-2 | Integration tests | NS | All phases | QA Engineer |
| P12-3 | E2E tests | NS | All phases | QA Engineer |
| P12-4 | Role-based authz tests | NS | P1-2 | QA Engineer |
| P12-5 | Security review | NS | All phases | Security Engineer |
| P12-6 | Accessibility review | NS | All phases | QA Engineer |
| P12-7 | Production build | CO | All phases | Lead Architect |
| P12-8 | Deployment config | NS | P12-7 | Lead Architect |

---

## Open Owner Decisions (blocking vs non-blocking)

**Block Phase 6 (live payments/invoices) until approved:**
- D1: GSTIN and applicable GST rate(s) — needed for invoice generation
- D3: Invoice numbering prefix/sequence — needed for billing
- D4: Payment gateway provider — needed for live payment recording
- D5: Finance partners (banks/NBFCs) — needed for finance module
- D6: Insurance providers — needed for insurance module
- D7: WhatsApp Business API availability + templates — needed for messaging

**Can proceed independently (foundational work only):**
- D2: Dealership type (multi-brand/single-brand/used+new) — affects catalogue structure but not core DB
- D8: Dark mode inclusion — cosmetic, can be added later
- D5 (tracker): Customer login in v1 — already deferred to later phase per PRD
- D6 (tracker): Multi-tenant now vs later — schema already includes `dealershipId`
- D7 (tracker): MFA for privileged accounts — defer to Phase 2+

---

## Team Assignments (to be assigned)

| Role | Status |
|------|--------|
| Lead Architect / Team Lead | To be assigned |
| UI/UX Designer | To be assigned |
| Frontend Engineer | To be assigned |
| Backend Engineer | To be assigned |
| Database Engineer | To be assigned |
| Security Engineer | To be assigned |
| QA Engineer | To be assigned |

---

## Implementation Tracker Notes

- Tasks marked **BL** (blocked) require owner input before proceeding
- All foundations (Phase 1) are independent of business decisions where possible (design tokens, auth shell, Prisma schema)
- The `prisma/` schema must be created from DATABASE.md v1.1 before any phase can write real data
- After Phase 1, subsequent phases depend on owner decisions (see block list above)
- All code must follow: TypeScript strict, Zod validation, UTC+Asia/Kolkata timestamps, integer paise for money, server-side authorization per API.md §9
- No fake integrations, no hardcoded production data, no placeholder nonfunctional forms