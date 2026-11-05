# CHANGELOG — The Bike Yard

## [1.2.0] — 2026-11-05

### Added

- Motorcycle Data Integration Engine with a pluggable `MotorcycleDataProvider` interface
  (`src/services/bike-provider/`), registry, rate limiter, and error taxonomy.
- Official `BikeWaleProvider` (interface ready; refuses to run until authorised credentials
  are supplied — no invented endpoints, no scraping) and a development/test `MockBikeProvider`.
- New Prisma entities: `DataProvider`, `BikeModel`, `BikeVariant`, `BikeColour`, `BikeImage`,
  `BikePricing`, `BikePriceHistory`, `BikeSyncRun`, `BikeSyncLog`, `BikeProviderRequest`
  (migration `20261105215510_bike_data_integration`).
- Synchronisation engine: scheduled (cron) + manual triggers, duplicate detection,
  field-level updates, per-model transactions, retry with backoff, request logging, rate
  limiting, provider attribution + last-sync timestamps. Never deletes and never touches pricing.
- Staff-exclusive pricing service with server-side role checks, Zod validation, and immutable
  `BikePriceHistory` audit trail (staff id, previous/new values, reason, IP, timestamp).
- Admin dashboard pages: Bike Catalogue, Bike Catalogue detail, Bike Pricing (with history and
  publish), Data Sync (providers, manual trigger, runs, errors) + sidebar links.
- API routes: admin catalogue/pricing/sync/providers, public read-only catalogue, cron sync.
- Tests: provider auth gate, pricing role guard, validation, route-level 401/403/400, and
  DB-backed integration (import, mapping, duplicate detection, updates, price protection,
  permissions, history, retry/recovery, failed-run isolation, public pricing exposure).

### Fixed

- Regenerated the stale `20261103000000_init` migration so it matches `schema.prisma`
  (previously created PascalCase tables and an orphan `PaymentAllocation` model, causing 18
  baseline test failures). Added `migration_lock.toml`.
- Excluded the standalone `frontend/` Vite app and generated artefacts from ESLint.

## [1.1.0] — 2026-11-03

### Added

- Full Next.js App Router scaffold with public, admin, and staff interfaces
- Prisma schema v1.1 with 34+ models (User, Role, Session, Dealership, StockUnit, Sale, Payment, Invoice, Refund, etc.)
- Database-backed Auth.js sessions with Credentials provider and Prisma adapter
- Server-side authorization guards on all 27 API routes (requireAuth/requireRole)
- Service layer: stock, payment, sales, customer, finance, insurance, RTO, invoice, chatbot
- UI design system: Button, Input, Card, Badge, Table, Dialog, DropdownMenu, Form, StatusChip
- Currency utilities (integer paise, GST CGST/SGST/IGST split)
- Date utilities (UTC storage, Asia/Kolkata display)
- Zod validation schemas for all entities
- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- Unit tests (currency, GST, validation, RBAC) — 54 tests passing
- Integration tests, RBAC tests
- Prisma migrations (initial) and seed script
- package.json scripts (dev/build/start/lint/test/postinstall)
- Security headers middleware configuration

### Fixed

- Prisma schema: UUID→String @db.Uuid, provider string literal, generator=prisma-client-js
- Auth: JWT→database-backed sessions (AUTH_SECURITY §2-3)
- Auth: middleware now reads NextAuth cookies instead of headers
- Removed hardcoded password in stale src/auth.ts
- GST split: cgst+sgst+igst = gstAmount guaranteed (no rounding loss)
- TypeScript JSX errors in inherited pages (closed tags, template literals)
- tsconfig rootDir/include cleaned up

### Changed

- Route config: auth routes limited to /auth/:path* (webhooks excluded from auth middleware)
- Prisma generate runs on postinstall

### Security

- Server-side authorization on all API routes
- Session stored in database (revocable)
- Security headers per AUTH_SECURITY §10
- No secrets in client bundle
