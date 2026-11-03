# AGENTS.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Draft  
**Version:** 1.1  
**Source of Truth:** Yes — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md  
**Previous Documents:** PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md  
**Next Document:** README.md (Prompt 07)  
**Change history:** v1.1 — aligned API response contract with API.md v1.1; added service requests and refunds to in-scope; clarified document retention and audit expectations.

---

## 1. Project Mission & Scope Boundaries

Build a single Next.js application with three interfaces (public website, admin dashboard, staff portal) for The Bike Yard motorcycle dealership in Khopat, Thane, Maharashtra, India.

**In scope:** Public showroom, bike catalogue, inventory (stock inward/outward/adjustment), stock movement history, customers, leads, test rides, bookings, booking advances, sales, payments, payment allocation, receipts, refunds, invoices (CGST/SGST/IGST split), finance/insurance/RTO applications, service requests, staff management, RBAC, audit logs, blogs, FAQs, settings, AI chatbot (stub provider for MVP).

**Out of scope:** Multi-tenant SaaS (architecture may be ready but not active), customer login portal, native mobile apps, real payment gateway integration (stub only), real WhatsApp/SMS integration, used bike trade-in, workshop/parts management, workshop job cards, parts inventory, service billing.

---

## 2. Source-of-Truth Hierarchy

1. PRD.md — Product behaviour
2. DESIGN.md — User experience
3. ARCHITECTURE.md — Technical boundaries
4. DATABASE.md — Data model
5. API.md — API contracts
6. AGENTS.md — How the agent works (cannot override 1-5)

If a change is needed, update the earliest affected document first, then reconcile downstream documents. Never silently rewrite requirements.

---

## 3. Mandatory Document-Reading Order

Before any implementation task:
1. Read PRD.md for feature requirements.
2. Read DESIGN.md for UI/UX patterns.
3. Read ARCHITECTURE.md for stack and boundaries.
4. Read DATABASE.md for schema and constraints.
5. Read API.md for endpoint contracts.
6. Inspect existing repository code.

---

## 4. Coding Standards

- **Language:** TypeScript, strict mode.
- **Formatting:** Prettier (default Next.js config).
- **Naming:** kebab-case for files/routes, PascalCase for components, camelCase for variables/functions.
- **Components:** shadcn/ui primitives in `src/components/ui/`.
- **Business logic:** Service layer in `src/services/`, never in route handlers or UI components.
- **Validation:** Zod schemas in `src/lib/validations/`, shared client/server.
- **Money:** Integer paise (BIGINT); never floating-point.
- **Timestamps:** UTC storage, Asia/Kolkata display.
- **No hardcoded secrets, prices, or credentials.**

---

## 5. Database Rules

- Migrations via Prisma (`prisma migrate dev`, `prisma migrate deploy`).
- Seed data fictional, clearly marked, development only.
- Chassis number and engine number unique constraints enforced.
- All stock/financial mutations in `prisma.$transaction()`.
- Soft deletes (`deletedAt`); no hard deletes for business entities.
- Indexes on frequently queried fields per DATABASE.md.

---

## 6. API Implementation Rules

- Server Actions for form mutations; API Routes for webhooks/external.
- Response contract (canonical, matches API.md §2): success `{ data, meta? }`; error `{ error: { code, message, field?, details? } }`. Never return `{ data, error, meta }` together.
- Server recalculates all financial values; never trust client-supplied totals, prices, permissions, or stock status.
- Webhook signatures verified; duplicate processing prevented via idempotency key.
- Safe error messages; no stack traces or internal details to client.
- Authorization enforced server-side on every endpoint, per API.md §9.

---

## 7. Authorization & Sensitive Data

- Role-based access enforced in middleware and service layer.
- UI may hide controls but server must verify permissions.
- Customer documents, finance data, and payment records access-restricted by role and by `document.accessLevel`.
- No passwords, tokens, or secrets in browser or client bundle.
- Audit log entries for privileged and financial actions.
- Document retention durations and purge procedures require owner approval; do not invent or auto-delete.

---

## 8. Test-First Expectations

- Unit tests for calculations (including GST split), validators, state transitions, permissions.
- Integration tests for database transactions, API handlers, provider adapters, booking→sale advance allocation, refund lifecycle.
- E2E tests for enquiry, test ride, stock inward/adjustment/outward, reservation history, sale, payment, refund, invoice, delivery, service request.
- Role-based authorization tests for every protected action.
- No claim that tests passed unless actually executed.

---

## 9. Dependency Policy

- Inspect before adding; justify new packages.
- No unnecessary frameworks beyond ARCHITECTURE.md stack.
- Provider integrations (payment, messaging, AI) behind abstraction interfaces; stub implementations for MVP.

---

## 10. Git Workflow

- Inspect `git status` before editing.
- Small, coherent commits; descriptive messages.
- Avoid destructive commands (`git reset --hard`, `git push --force` without review).
- Never commit `.env`, secrets, or production credentials.
- No repository is currently initialized (Phase 0 will handle this).

---

## 11. Documentation Update Requirements

- When implementation changes a contract, update the affected source document.
- Keep PRD → DESIGN → ARCHITECTURE → DATABASE → API → AGENTS consistent.
- Record architecture decisions and open questions.

---

## 12. Handling Ambiguity

- Missing business-critical info: record as open question, continue with safe configurable placeholder.
- Conflicting requirements: stop, identify conflict, request clarification; do not silently invent.
- Missing credentials: use development stubs; never hardcode real values.

---

## 13. Prohibited Actions

- No fake integrations (fake payment success, fake WhatsApp delivery).
- No fake production data or claims that unrun tests passed.
- No hardcoded secrets, tokens, credentials, or private customer information.
- No bypassing authentication, permissions, validation, or audit requirements.
- No client-only authorization.
- No direct database access from UI components.
- No unverified tax calculations.
- No unrestricted file access.
- No placeholder buttons that appear functional.

---

## 14. Required Agent Loop

1. Read relevant source-of-truth documents.
2. Inspect existing repository.
3. Summarize task, files affected, acceptance criteria.
4. Make small implementation plan.
5. Implement smallest complete change.
6. Run targeted tests, lint, typecheck, build.
7. Inspect diff for regressions, security issues, unrelated changes.
8. Update docs and tracker.
9. Report files changed, checks run, results, known limitations, next step.

---

**Verification:** AGENTS.md v1.1 is complete and consistent with PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md v1.1, and API.md v1.1. The response contract matches API.md §2 and the permission rules reference API.md §9. It cannot override those documents. No dealership information, prices, GST details, or finance partners invented.

**Next:** Proceed to 07_README_PROMPT.md to generate README.md (then reconcile with AGENTS.md v1.1).