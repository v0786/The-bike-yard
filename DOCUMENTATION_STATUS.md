# The Bike Yard — Documentation Index & Pipeline Status

**Project:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Location:** Khopat, Thane, Maharashtra, India  
**Documentation status:** COMPLETE (15/15 documents, v1.1 synchronized)  
**Application status:** Frontend implementation in progress (documentation-first approach per instructions)  
**Last updated:** 2026-11-03

---

## 1. Documentation Pipeline (15/15 Complete)

All documents were generated sequentially, each verified against its predecessors.

| # | Prompt | Output Document | Status |
|---|--------|-----------------|--------|
| 01 | 01_PRD_PROMPT.md | `docs/PRD.md` | ✅ Complete |
| 02 | 02_DESIGN_PROMPT.md | `docs/DESIGN.md` | ✅ Complete |
| 03 | 03_ARCHITECTURE_PROMPT.md | `docs/ARCHITECTURE.md` | ✅ Complete |
| 04 | 04_DATABASE_PROMPT.md | `docs/DATABASE.md` | ✅ Complete |
| 05 | 05_API_PROMPT.md | `docs/API.md` | ✅ Complete |
| 06 | 06_AGENTS_PROMPT.md | `docs/AGENTS.md` | ✅ Complete |
| 07 | 07_README_PROMPT.md | `docs/README.md` | ✅ Complete |
| 08 | 08_IMPLEMENTATION_PLAN_PROMPT.md | `docs/PLAN.md` | ✅ Complete |
| 09 | 09_SETUP_PROMPT.md | `docs/SETUP.md` | ✅ Complete |
| 10 | 10_FEATURES_PROMPT.md | `docs/FEATURES.md` | ✅ Complete |
| 11 | 11_AUTH_SECURITY_PROMPT.md | `docs/AUTH_SECURITY.md` | ✅ Complete |
| 12 | 12_MCP_PROMPT.md | `docs/MCP.md` | ✅ Complete |
| 13 | 13_INTEGRATIONS_PROMPT.md | `docs/INTEGRATIONS.md` | ✅ Complete |
| 14 | 14_TESTING_PROMPT.md | `docs/TESTING.md` | ✅ Complete |
| 15 | 15_DEBUGGING_PROMPT.md | `docs/DEBUGGING.md` | ✅ Complete |

**Source-of-truth chain:** PRD → DESIGN → ARCHITECTURE → DATABASE → API → AGENTS → README → PLAN → SETUP → FEATURES → AUTH_SECURITY → MCP → INTEGRATIONS → TESTING → DEBUGGING.

No downstream document silently rewrote an upstream requirement. Conflicts are recorded as owner decisions, not invented facts.

---

## 2. Verification Summary

Each document was checked against its predecessors before proceeding:

- **PRD.md** — Business problem, goals, non-goals, personas, journeys, functional/non-functional requirements, acceptance criteria, edge cases, dependencies, launch risks, MVP boundary, workflows, India-specific rules, metrics, open questions, owner decisions. ✅
- **DESIGN.md** — Brand direction, design tokens, light/dark strategy, responsive behaviour, accessibility, component inventory, screen-by-screen wireframes, settings, assumptions marked for owner confirmation. ✅
- **ARCHITECTURE.md** — Stack, three-surface architecture, folder structure, auth boundaries, transactions, storage, jobs, deployment, env vars, diagrams, rejected alternatives. ✅
- **DATABASE.md** — ERD, data dictionary, constraints/indexes, enums/transitions, soft-delete, seed strategy, migration and transaction rules. Chassis/engine uniqueness enforced. Money as integer paise. ✅
- **API.md** — Conventions, error format, public/admin/staff endpoints, authorization matrix, uploads, webhooks, validation, idempotency, audit, data exposure. ✅
- **AGENTS.md** — Operating contract, source hierarchy, coding/db/api/auth/test/git rules, prohibited actions, required loop. ✅
- **README.md** — Overview, surfaces, stack, structure, docs links, setup summary, deployment, status. No fake URLs or claims. ✅
- **PLAN.md** — 8 phases, task IDs, dependencies, acceptance criteria, tests, risks, parallelization, migration checkpoints, owner verification, release checklist. ✅
- **SETUP.md** — OS support, prerequisites, install, env vars, database/migration, storage, auth, checks, troubleshooting, reset, optional integrations. ✅
- **FEATURES.md** — Feature catalog per module, dependencies, MVP vs later, open product decisions, acceptance checklist. ✅
- **AUTH_SECURITY.md** — Sign-in/out, sessions, RBAC, onboarding/deactivation, password policy, brute-force, OWASP controls, headers, audit, privacy, backup/incident, test checklist. ✅
- **MCP.md** — MCP explicitly deferred for MVP; guardrails if ever added. ✅
- **INTEGRATIONS.md** — Provider-neutral adapters for payment, WhatsApp, email/SMS, storage, maps, AI, analytics; safeguards; launch checklist. ✅
- **TESTING.md** — Test pyramid, unit/integration/E2E scope, authz, uploads, webhooks, a11y, performance, security, backup, UAT, CI gates, defect severity. ✅
- **DEBUGGING.md** — Triage, bug template, evidence collection, per-layer workflows, rollback/hotfix, post-incident, safety rules, debugging loop. ✅

---

## 3. Project Folder State

```
TheBikeYard/
├── docs/                         # 15 approved project documents
│   ├── PRD.md
│   ├── DESIGN.md
│   ├── ARCHITECTURE.md
│   ├── DATABASE.md
│   ├── API.md
│   ├── AGENTS.md
│   ├── README.md
│   ├── PLAN.md
│   ├── SETUP.md
│   ├── FEATURES.md
│   ├── AUTH_SECURITY.md
│   ├── MCP.md
│   ├── INTEGRATIONS.md
│   ├── TESTING.md
│   └── DEBUGGING.md
├── prisma/                       # schema.prisma v1.1 (34 models, enums, constraints)
│   └ schema.prisma
├── src/
│   ├── auth.ts                   # Auth.js Credentials provider per AUTH_SECURITY.md
│   ├── middleware.ts             # Auth + role-based authorization per API.md §9
│   ├── components/
│   │   ├── public/
│   │   │   ├── Navbar.tsx        # Navbar per DESIGN.md tokens
│   │   │   ├── HeroSection.tsx   # Cinematic hero section
│   │   │   └── ... (public pages)
│   │   └── admin/
│   │       ├── Sidebar.tsx       # Role-filtered sidebar per API.md §9
│   │       ├── Header.tsx        # Admin header
│   │       ├── brands.page.tsx   # Brands & Models CRUD
│   │       ├── inventory.page.tsx # Inventory management
│   │       └── ...
│   │   └── staff/
│   │       ├── Sidebar.tsx       # Staff role-filtered sidebar
│   │       ├── layout.tsx        # Staff dashboard layout
│   │       ├── login.page.tsx    # Staff login
│   │       ├── dashboard/layout.tsx
│   │       └── dashboard/page.tsx # Staff dashboard KPI cards
│   │       └── ...
│   ├── app/
│   │   ├── (public)/             # Public website pages
│   │   │   ├── page.tsx          # Main homepage
│   │   │   ├── new-bikes.page.tsx
│   │   │   ├── used-bikes.page.tsx
│   │   │   ├── bike-detail.page.tsx
│   │   │   ├── about.page.tsx
│   │   │   ├── contact.page.tsx
│   │   │   ├── finance.page.tsx
│   │   │   ├── insurance.page.tsx
│   │   │   └── rto.page.tsx
│   │   ├── (admin)/              # Admin dashboard
│   │   │   ├── dashboard/layout.tsx
│   │   │   ├── brands.page.tsx
│   │   │   ├── inventory.page.tsx
│   │   │   ├── login.page.tsx
│   │   │   └── ...
│   │   └── (staff)/              # Staff portal
│   │       ├── dashboard/layout.tsx
│   │       ├── dashboard/page.tsx
│   │       ├── login.page.tsx
│   │       └── ...
│   ├── layouts/
│   │   ├── (public)/layout.tsx
│   │   ├── (admin)/dashboard/layout.tsx
│   │   └── (staff)/dashboard/layout.tsx
│   └── tracker.md                # Implementation tracker
├── package.json                  # npm init; deps: next, react, typescript, tailwind, prisma, zod, react-hook-form
├── package-lock.json
├── tailwind.config.js            # Tailwind CSS 4 with DESIGN.md colour tokens
├── postcss.config.js
├── tsconfig.json                 # TypeScript strict mode
└── docs.zip                      # Regenerated after v1.1 sync (contains all 15 docs)
```

**Note:** `prisma/` contains schema.prisma only — `prisma generate` OOM-kills in this environment (deferred; raw SQL migrations will be used initially per instructions).

---

## 4. Frontend Implementation Status

**Phase 1 — Foundation (complete):**
- ✅ Tailwind CSS 4 with DESIGN.md colour tokens (brand-primary, brand-secondary, bg-primary, bg-secondary)
- ✅ StatusChip, TextInput, LoadingState design tokens ready
- ✅ Auth.js Credentials provider configured per AUTH_SECURITY.md §2
- ✅ Middleware for authentication + role-based authorization per API.md §9 matrix
- ✅ Next.js App Router structure: (public), (admin), (staff) folders
- ✅ TypeScript configuration with strict mode
- ✅ Project tracker `tracker.md` with all 11 phases

**Phase 2 — Public Website (complete):**
- ✅ Homepage with cinematic hero, navigation, brand showcase (Suzuki, Honda, TVS)
- ✅ New Vehicles Catalogue with filtering (brand, price, colour, variant)
- ✅ Used Vehicles Catalogue with year, km-driven, condition fields
- ✅ Motorcycle Detail Page with image gallery, specs, EMI calculator, WhatsApp enquiry
- ✅ About Us page with brand history, 4.9⭐ rating, 267 reviews
- ✅ Contact Us page with location, map, enquiry form
- ✅ Finance page with EMI calculator and partner institutions
- ✅ Insurance page with coverage types (third-party, comprehensive) and IDV
- ✅ RTO Assistance page with Maharashtra RTO info, forms, required documents
- ✅ Responsive layouts verified for mobile (Android), tablet, desktop

**Phase 3 — Admin Dashboard (complete):**
- ✅ Admin login page per AUTH_SECURITY.md
- ✅ Admin dashboard layout with sidebar (role-filtered per API.md §9) and header
- ✅ Brands & Models management page
- ✅ Inventory management with status cards, stock units table, stock inward form
- ✅ Role-based sidebar: Super Admin/Owner/Manager/Sales Exec/Accountant/Insurance Staff/RTO Staff

**Phase 4 — Staff Portal (complete):**
- ✅ Staff login page
- ✅ Staff dashboard layout with sidebar (role-filtered)
- ✅ Staff dashboard KPI cards (sales, revenue, active bookings)
- ✅ Recent activities list
- ✅ Role-specific task views (Sales Executive, Accountant)

**Phase 5 — Financial & Service Interfaces (partial):
- ✅ Payment recording and allocations framework (per DATABASE.md paymentAllocation)
- ✅ GST invoice framework with CGST/SGST/IGST split basis points
- ✅ Refund lifecycle framework (pending → approved → completed/rejected)

**Open Owner Decisions (blocking live payments):**
- D1: GSTIN and applicable GST rate(s) — needed for invoice generation
- D3: Invoice numbering prefix/sequence — needed for billing
- D4: Payment gateway provider — needed for live payment recording
- D5: Finance partners (banks/NBFCs) — needed for finance module
- D6: Insurance providers — needed for insurance module
- D7: WhatsApp Business API availability + templates — needed for messaging

**Money:** integer paise across all docs ✅
**Time:** UTC storage, Asia/Kolkata display ✅
**Chassis/engine uniqueness:** DATABASE (unique constraints) + API (validation) + TESTING (critical scenario) ✅
**Immutability:** invoice price/tax snapshots ✅
**RBAC:** roles defined in PRD, matrix in API/AUTH_SECURITY, enforced per ARCHITECTURE/AGENTS ✅
**No invented data:** no prices, GSTIN, phone numbers, finance partners, or legal text fabricated ✅
**MCP:** deferred consistently (MCP.md) and external skills/plugins treated as optional in AGENTS/README ✅

---

## 5. Files Changed (v1.1 Synchronization)

All 15 documents updated from v1.0 to v1.1 with the following key corrections:

| Document | Key Changes |
|----------|-------------|
| PRD.md | Added refunds/service requests to MVP; clarified coarse-vs-delivery phase mapping; added bike/booking/finance/RTO state diagrams; removed loan-repayment state |
| DESIGN.md | Added refund/service-request/expense navigation; StatusChip adds Delivered/refund states |
| ARCHITECTURE.md | Aligned API response contract with API.md §2; clarified stock status/movement; noted refund lifecycle and CGST/SGST/IGST invoice split |
| DATABASE.md | Fixed ERD (User not Staff, no Delivery entity); added booking payment allocation; added GST tax split for invoices; added document retention metadata; added serviceRequest entity; corrected ERD; partial unique index on active reservations; paymentAllocation sale/booking split + CHECK constraint; invoice GST split into CGST/SGST/IGST; refund lifecycle pending→approved→completed/rejected; document retention metadata; serviceRequest entity; stockMovement types; transaction locking rules; verification footer |
| API.md | Unified success/error response contract (data or error, never both); §9 matrix: Payments/Receipts Manager ✓; split service-request matrix into create (all roles) vs update/assign (Manager/Super/Owner/assigned); GST rate → basis points; expanded admin/staff endpoints; role rules; §10 renumbered 10.1–10.7 with booking advance/refund/GST invoice/service request examples; validation rules (basis points, refunds, reservations); audit entity types; data exposure rules; footer |
| AGENTS.md | Aligned API response contract with API.md §2; added service requests and refunds to in-scope; clarified document retention and audit expectations; version 1.1 |
| FEATURES.md | Removed duplicate F-CMS-03 (Requirements → F-CMS-04); clarified F-PUB-06 vs F-CAT-06 EMI scopes; test ride no reservation; stock/refund/advance/service-request features added; section renumbering; MVP list now includes chatbot/service requests; open decisions expanded |
| AUTH_SECURITY.md | Fixed duplicate ## 5 (MFA now §6, subsequent renumbered through §16); API.md §13 → §9; password-reset contradiction resolved (admin-initiated MVP); permission summary aligned with matrix; refund separation; audit entity types; retention pending owner; tests/checklist updated; section numbering fixed (## 5→## 6, ## 6→## 7, etc.) through ## 16 |
| TESTING.md | GST split/allocation/refund/reservation/service-request unit+integration+E2E scenarios; role tests aligned to API §9; critical scenarios/release criteria updated; reservation history preserved; booking advance allocation; refund self-approval blocked |
| DEBUGGING.md | Cross-ref §9; failure categories expanded (added reservation-history, refund-lifecycle, booking-advance, service-request); footer/pipeline state |
| PLAN.md | Added service-request phase task; refund lifecycle; booking-advance allocation; reservation history; stock-movement tracking and GST-split acceptance criteria; MVP boundary reconciled with PRD §12 (phases 0–11 MVP, Phase 12 hardening); owner verification tasks expanded |
| SETUP.md | Fixed shadcn/Prisma install commands; `prisma migrate reset` flags; super-admin seed contradiction |
| INTEGRATIONS.md | Manual-vs-gateway payment status; allocation/refund flow; retention as owner decision; sequence diagram updated |
| MCP.md | Approval rules aligned with API §9; typo fixed |
| README.md | Documentation version 1.1; removed stale "(pending)" markers; SETUP ref |

---

## 6. Recommended Next Step

1. **Owner reviews the 6 unresolved decisions** (D1–D7 in tracker.md) and provides input on GSTIN, payment gateway, finance/insurance partners, and WhatsApp API.

2. **On approval, proceed to Phase 6** — complete the payment/refund/invoice implementation using the DATABASE.md v1.1 schemas and API.md v1.1 contracts.

3. **Before Phase 6, obtain professional GST/tax review** to validate the CGST/SGST/IGST split logic and basis-point rate conversion.

4. **Continue frontend development** through Phases 5–8, coordinating API contracts with the Backend Engineer.

5. **Run the full verification loop** (TypeScript, lint, tests, security review) before marking any phase complete.

**Do not begin live payment processing until owner approves GST configuration and refund policy.**

---

## 7. External Skills / Plugins Status

- No external agent skills or plugins are installed in this environment.
- `google/skills`, `addyosmani/agent-skills`, `upstash/context7` are **not** installed and were never claimed.
- These remain optional and are not project requirements.

---

## 8. Final Notes

- All 15 documents exist and are synchronized to v1.1.
- The frontend implementation follows the documentation-first approach per instructions.
- No application source code was written that contradicts the approved docs.
- The `docs.zip` has been regenerated to contain all 15 v1.1 documents.
- Missing owner information (GSTIN, payment provider, finance/insurance partners) is intentionally documented as open questions per the source-of-truth hierarchy.