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

### D8: Motorcycle Data Integration Engine — information/pricing separation

**Decision:** External providers manage motorcycle information through dedicated
`BikeModel` / `BikeVariant` / `BikeColour` / `BikeImage` entities, while authorised backend
staff exclusively manage `BikePricing` with an immutable `BikePriceHistory` audit trail. The
sync engine has no code path to pricing. Providers are pluggable via `MotorcycleDataProvider`.
**Rationale:** Business rule — external APIs must never create or overwrite staff-managed
prices; the admin pricing interface must not be able to edit API-managed specifications.
**Status:** Implemented in `prisma/schema.prisma`, `src/services/bike-*.ts`,
`src/services/bike-provider/`. Documented in `docs/BIKE_DATA_INTEGRATION.md`.

### D9: Migration generation and repair of the local migration baseline

**Decision:** Treat `prisma/schema.prisma` as the committed source of truth (the repo
gitignores `prisma/migrations/` as generated artefacts). For the local/test database the
baseline migration was regenerated from the schema and the new
`20261105215510_bike_data_integration` migration was created and applied via
`prisma migrate dev`.
**Rationale:** The pre-existing local `20261103000000_init/migration.sql` did not match the
schema (PascalCase table names with no `@@map` targets, and an orphan `PaymentAllocation`
model absent from `schema.prisma`), so a database migrated from it could not satisfy the
Prisma client — 18 baseline tests failed. The schema is authoritative per ARCHITECTURE/
DATABASE; the local migration was demonstrably non-functional.
**Impact:** A local database previously migrated with the old baseline must be rebuilt
(`prisma migrate reset`) before `prisma migrate deploy`. The project is pre-launch (all docs
"Pending Dealership Owner Review"), so no production data is affected.
**Status:** Implemented; `prisma migrate deploy` + full test suite pass.

### Open Owner Decisions (unresolved, blocking live payments/invoices)

- GSTIN and applicable GST rate(s) — needed for invoice generation
- Invoice numbering prefix/sequence — needed for billing
- Payment gateway provider — needed for live payment recording
- Finance partners (banks/NBFCs) — needed for finance module
- Insurance providers — needed for insurance module
- WhatsApp Business API availability + templates — needed for messaging
- Document retention durations — needed before production launch
