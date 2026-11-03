# DECISIONS.md — The Bike Yard

## Architecture Decisions

### D1: Authentication — Database-backed sessions (NOT JWT)

**Decision:** Use Auth.js with Prisma adapter and `session.strategy = "database"`.
**Rationale:** AUTH_SECURITY §2-3 mandates database-backed sessions for simpler revocation and server-side control of financial operations; JWTs explicitly rejected.
**Status:** Implemented in `src/lib/auth.ts`.

### D2: Session validation in middleware

**Decision:** Middleware reads NextAuth session cookie via `getToken()` (next-auth/jwt), not custom headers.
**Rationale:** Original middleware read `authorization`/`x-user-role` headers which NextAuth does not set — auth bypass. Cookies are the correct transport.
**Status:** Implemented in `src/middleware.ts`.

### D3: Money representation

**Decision:** All monetary values stored as integer paise (BIGINT) per DATABASE.md §1 and ARCHITECTURE §3.
**Rationale:** Avoid floating-point arithmetic for currency; GST/CGST/SGST split must reconcile exactly.
**Status:** Implemented in `src/lib/currency.ts`.

### D4: Timezone handling

**Decision:** UTC storage, Asia/Kolkata display per DATABASE.md §1 and PRD §14.
**Status:** Implemented in `src/lib/date.ts`.

### D5: Route authorization

**Decision:** Server-side `requireAuth()`/`requireRole()` guards on all admin/staff API routes; middleware enforces route-level access.
**Rationale:** AUTH_SECURITY §4.3 — server must verify permissions; UI hiding is supplementary only.
**Status:** Implemented in `src/lib/api-auth.ts` and all 27 route files.

### D6: Integration providers

**Decision:** All external integrations (payment, WhatsApp, email, AI, storage) use stub providers in MVP per INTEGRATIONS.md.
**Rationale:** Providers pending owner selection; interface abstraction allows swap without code changes.
**Status:** Stubs in `src/lib/storage.ts`, `src/lib/pdf.ts`, `src/lib/ai.ts`, `src/lib/notifications.ts`.

### D7: Prisma schema version

**Decision:** Prisma 6.12.0 (client + CLI) pinned in package.json.
**Rationale:** Prisma 7 removed `url` from datasource and changed index rules; schema authored for v6 compatibility.
**Status:** `prisma generate` succeeds.

### Open Owner Decisions (unresolved, blocking live payments/invoices)

- GSTIN and applicable GST rate(s) — needed for invoice generation
- Invoice numbering prefix/sequence — needed for billing
- Payment gateway provider — needed for live payment recording
- Finance partners (banks/NBFCs) — needed for finance module
- Insurance providers — needed for insurance module
- WhatsApp Business API availability + templates — needed for messaging
- Document retention durations — needed before production launch
