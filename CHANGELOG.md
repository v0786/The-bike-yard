# CHANGELOG — The Bike Yard

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
