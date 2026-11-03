# The Bike Yard — Implementation Tracker

**Version:** 1.0 (created 2026-11-03)  
**Source of truth:** All 15 approved docs in `docs/`  
**Current phase:** Phase 0 — Repository Audit (complete)

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
| TRACKER-03 | Confirm Prisma schema generation | CO | schema.prisma created v1.1; `prisma generate` OOM-killing in this env — client generation deferred; raw SQL migrations will be used initially |
| TRACKER-04 | Set up git repo and initial commit | NS | Not yet; will initialize after schema is created |
| TRACKER-05 | Document baseline environment setup | NS | See SETUP.md for prerequisites |

---

## Phase 1 — Foundation

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-1-01 | Configure Next.js App Router base layout | IP | TRACKER-01 | Lead Architect |
| PHASE-1-02 | Set up Tailwind CSS 4 with design tokens (colors, fonts) per DESIGN.md | IP | TRACKER-01 | UI/UX Designer |
| PHASE-1-03 | Create design system: StatusChip, TextInput, LoadingState per DESIGN.md | NS | PHASE-1-02 | UI/UX Designer |
| PHASE-1-04 | Configure Auth.js Credentials provider; create first Super Admin seed per SETUP.md | IP | TRACKER-03 | Security Engineer |
| PHASE-1-05 | Initialize Prisma from DATABASE.md schema; generate client | NS | TRACKER-03 | Database Engineer |
| PHASE-1-06 | Set up ESLint, Prettier; enforce TypeScript strict mode | NS | TRACKER-01 | Lead Architect |
| PHASE-1-07 | Configure logging, error boundaries, and global error handler | IP | Winston logger configured; error boundaries in layout components; middleware auth checks |
| PHASE-1-08 | Create project-level DECISIONS.md and CHANGELOG.md | NS | PHASE-1-01 | Lead Architect |

---

## Phase 2 — Public Website

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-2-01 | Homepage with hero, navigation, and all sections | CO | PHASE-1-01 to PHASE-1-02 | Frontend Engineer |
| PHASE-2-02 | New Vehicles Catalogue page | CO | PHASE-1-02 | Frontend Engineer |
| PHASE-2-03 | Used Vehicles Catalogue page | CO | PHASE-1-02 | Frontend Engineer |
| PHASE-2-04 | Motorcycle Detail Page | CO | PHASE-1-02 | Frontend Engineer |
| PHASE-2-05 | Static public pages (About, Contact, Finance, Insurance, RTO) | CO | PHASE-1-02 | Frontend Engineer |
| PHASE-2-06 | Responsive layouts and mobile testing | NS | PHASE-2-01 to PHASE-2-05 | Frontend Engineer |

---

## Phase 3 — Admin Dashboard

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-3-01 | Admin login page | CO | PHASE-1-04 | Frontend Engineer |
| PHASE-3-02 | Admin dashboard layout (sidebar + header) | CO | PHASE-1-01, PHASE-1-04 | Frontend Engineer |
| PHASE-3-03 | Admin dashboard pages (brands, inventory, customers, etc.) | NS | PHASE-3-01, PHASE-3-02 | Frontend Engineer |
| PHASE-3-04 | Role-based sidebar filtering per API.md §9 | CO | PHASE-3-01, AUTH_SECURITY.md | Frontend Engineer |
| PHASE-3-05 | Admin forms (create/edit brands, models, variants, colours) | NS | PHASE-3-03 | Frontend Engineer |

---

## Phase 4 — Staff Portal

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-4-01 | Staff authentication and dashboard | NS | PHASE-1-04 | Security Engineer + Frontend Engineer |
| PHASE-4-02 | Staff portal pages (leads, tasks, document uploads) | NS | PHASE-4-01 | Frontend Engineer |

---

## Phase 5 — Financial & Service Interfaces

| ID | Task | Status | Dependencies | Assignee |
|----|------|--------|--------------|----------|
| PHASE-5-01 | Payment recording and allocations | NS | PHASE-1-05, PHASE-3-03 | Backend Engineer |
| PHASE-5-02 | GST invoices with CGST/SGST/IGST split | NS | PHASE-1-05, PHASE-5-01 | Backend Engineer |
| PHASE-5-03 | Refund lifecycle (pending → approved → completed) | NS | PHASE-1-05 | Backend Engineer |

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