# STAGING_VALIDATION_PLAN.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Draft — Phase 2: Production Hardening → Staging Validation  
**Version:** 1.0  
**Source of Truth:** Yes — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md, AGENTS.md, AUTH_SECURITY.md, TESTING.md, DEBUGGING.md, PRODUCTION_READINESS_REPORT.md  
**Previous Phase:** Phase 1 — Foundation & Production Readiness Audit (COMPLETE)  
**Current Phase:** Phase 2 — Staging & Real-World Validation  
**Next Phase:** Phase 3 — Production Readiness Sign-off (owner approvals only)

---

## 1. Overview

This document defines the staging validation plan for The Bike Yard dealership platform.  
The staging environment is a pre-production clone of production used to validate:

- Full application deployment end-to-end
- Database migrations and seed data integrity
- Backup and restore procedures
- Browser-based E2E user journeys (Playwright)
- Role-Based Access Control (RBAC) across all 7 roles
- Dealership business workflows end-to-end
- Multi-dealership tenant isolation
- Security (authentication, authorization, CSRF, CSP, file upload, sensitive data)
- Performance under load
- Rollback and recovery procedures

**Rule:** No production data, no production credentials, no real payment providers, no real customer PII shall be used in staging. All testing uses synthetic/fictional data seeded via `prisma/seed.ts`.

---

## 2. Agent Roles & Responsibilities

| Role | Responsibility |
|------|---------------|
| **Build Agent** | Infrastructure provisioning, environment variables, database setup, migration execution, build verification |
| **QA Engineer** | Test case execution, E2E Playwright execution, regression testing, defect reporting |
| **Security Engineer** | Security review, penetration testing, RBAC verification, penetration test coordination |
| **DevOps Engineer** | Backup/restore verification, rollback procedure testing, deployment pipeline verification, monitoring configuration |

Each agent executes only within its domain and reports results to this document.

---

## 3. Staging Environment Architecture

| Component | Technology | Configuration | Notes |
|-----------|-----------|---------------|-------|
| Application | Next.js 16.4.4 | `npm run build`, `npm start` | Production build, not `next dev` |
| Database | PostgreSQL 16 | Separate staging DB (not production) | Separate from production DB |
| Auth | NextAuth.js (Prisma adapter) | Database-backed sessions | `NEXTAUTH_SECRET` must be unique per env |
| File Storage | S3-compatible (MinIO local / AWS S3) | `STORAGE_PROVIDER=s3` or `local` | Never use production bucket |
| AI Provider | Stub | `AI_PROVIDER=stub` | No real AI provider in staging |
| Payment Provider | Stub | `PAYMENT_PROVIDER=stub` | No real payment gateway |

## 4. Environment Variables Configuration

Create `.env.staging` (NOT committed to git) from `.env.example`:

| Variable | Example Value | Required | Notes |
|----------|--------------|----------|-------|
| `DATABASE_URL` | `postgresql://postgres:password@staging-db:5432/bikeyard_staging` | Yes | Separate from production DB |
| `NEXTAUTH_SECRET` | 32+ byte random string | Yes | `openssl rand -hex 32` — DIFFERENT from production |
| `NEXTAUTH_URL` | `https://staging.thebikeyard.local` | Yes | Staging URL only |
| `BASE_URL` | `https://staging.thebikeyard.local` | Yes | |
| `STORAGE_PROVIDER` | `local` or `s3` | No | `local` for staging |
| `S3_BUCKET_NAME` | `bikeyard-staging-dev` | No (if S3) | Separate from production bucket |
| `S3_ENDPOINT` | `http://localhost:9000` | No (if S3 local) | MinIO for local staging |
| `S3_ACCESS_KEY_ID` | `minioadmin` | No (if S3) | Never production credentials |
| `S3_SECRET_ACCESS_KEY` | `minioadmin` | No (if S3) | Never production credentials |
| `AI_PROVIDER` | `stub` | Yes | Never production AI provider |
| `AI_API_KEY` | `sk-test-key-do-not-use-in-production` | No | Never production key |
| `PAYMENT_PROVIDER` | `stub` | Yes | Never real payment provider |

**Validation:** Run `npm run env:validate` after populating `.env.staging`. Must exit 0.

---

## 5. Database Migration Testing

### 5.1 Prisma Schema Validation

```bash
npx prisma validate
```
**Expected:** "Prisma schema loaded from prisma/schema.prisma" with no errors.

### 5.2 Migration Deployment

```bash
DATABASE_URL="postgresql://postgres:password@staging-db:5432/bikeyard_staging" \
npx prisma migrate deploy
```

**Expected:** All migrations applied successfully, no errors.

### 5.3 Schema Drift Detection

```bash
npx prisma migrate diff --from-migrations prisma/migrations/ --to-datasource-database $DATABASE_URL --script
```

**Expected:** Empty output (no drift) or only expected differences.

### 5.4 Seed Data Verification

```bash
DATABASE_URL="postgresql://postgres@localhost:5432/bikeyard_staging" \
npx prisma db seed
```

**Expected:** Seed completes, creates dealership, 7 roles, super admin user.

### 5.5 Migration Rollback Test

1. Apply migration → verify schema
2. Simulate failed migration (e.g., introduce a bad migration)
3. Run `prisma migrate resolve --rolled-back <migration-name>`
4. Verify database is in consistent state
5. Re-apply correct migration

---

## 6. Backup & Restore Testing

### 6.1 Database Backup

```bash
pg_dump -h <host> -U <user> -d bikeyard_staging > backup_staging_$(date +%Y%m%d_%H%M%S).sql
```

**Expected:** Backup file created, non-zero size, contains `CREATE TABLE` statements.

### 6.2 Database Restore

```bash
pg_restore -h <host> -U <user> -d bikeyard_staging_restore < backup_staging_*.sql
```

**Expected:** Restore completes without errors, row counts match original.

### 6.3 Backup Verification Checklist

- [ ] Backup file created successfully
- [ ] Backup file size > 0
- [ ] Restore completes without errors
- [ ] Row counts match between source and restored DB
- [ ] Critical tables have data (Dealership, User, Role, StockUnit, Sale, Payment, Invoice, Refund)
- [ ] Backup restoration tested on a separate database instance

### 6.4 Storage Backup Verification

- Verify S3 bucket versioning is enabled (if using S3)
- Verify object versioning can restore a previous version of a document
- Verify soft-delete + retentionUntil logic works (documents not hard-deleted)

---

## 7. Playwright Browser E2E Testing

### 7.1 Test Suite Location

`tests/e2e/critical-scenarios.spec.ts`

### 7.2 Test Scenarios Covered

| Test ID | Scenario | Expected Result |
|---------|----------|-----------------|
| E2E-01 | Public homepage loads | 200 OK, "The Bike Yard" visible |
| E2E-02 | Public page does not expose internal cost | No "purchase cost" text visible |
| E2E-03 | Admin routes redirect unauthenticated to sign-in | 302/307 redirect |
| E2E-04 | Staff routes redirect unauthenticated to sign-in | 302/307 redirect |
| E2E-05 | Admin sign-in succeeds | Redirects to `/admin/dashboard` |
| E2E-06 | Invalid credentials rejected | Stays on sign-in page |
| E2E-07 | Admin dashboard loads after sign-in | `h1`/`h2` visible |
| E2E-08 | Admin pages load (stock, sales, payments, refunds, invoices, brands) | Each page loads with heading |
| E2E-09 | Staff login page is protected | 302/307 redirect |

### 7.3 Environment Limitation (Documented)

**Browser-based Playwright E2E tests cannot execute in this containerized environment** because:
- Playwright Chromium runs in a separate network namespace
- It cannot reach `localhost:3000` where the Next.js dev server runs
- `curl` and Node's `fetch` can reach the server from the host context, but the browser cannot

**Mitigation:** E2E test suite is written and ready. Execute in a non-containerized staging environment where Playwright can reach `localhost:3000`.

**Verification:** `npx playwright test --project=chromium` — verify all scenarios pass in staging environment with network access.

---

## 8. Role-Based Access Control (RBAC) Testing

### 8.1 Role Matrix (API.md §9)

| Role | Can Access | Cannot Access |
|------|-----------|---------------|
| Super Admin | All routes | None |
| Owner | All except Super Admin mgmt | Super Admin account |
| Manager | Admin dashboard, sales, stock, payments, refunds, invoices, staff mgmt | Settings, Super Admin account |
| Sales Exec | Enquiries, leads, bookings, test rides, sales | Payments, invoices, staff mgmt |
| Accountant | Payments, invoices, refunds (request), finance, stock movements (read) | Sales mutation, stock mutation, staff mgmt |
| Insurance Staff | Insurance applications (read/write) | Sales, payments, RTO mutations |
| RTO Staff | RTO applications (read/write) | Sales, payments, insurance mutations |

### 8.2 RBAC Test Cases

| Test ID | Scenario | Expected |
|---------|----------|----------|
| RBAC-01 | Unauthenticated access to `/admin/*` | Redirect to sign-in (302) |
| RBAC-02 | Unauthenticated access to `/staff/*` | Redirect to sign-in (302) |
| RBAC-03 | Sales Exec → `POST /api/admin/payments` | 403 Forbidden |
| RBAC-04 | Accountant → `POST /api/admin/stock/inward` | 403 Forbidden |
| RBAC-05 | Insurance Staff → `POST /api/admin/rto` | 403 Forbidden |
| RBAC-06 | RTO Staff → `POST /api/admin/insurance` | 403 Forbidden |
| RBAC-07 | Manager → `PUT /api/admin/settings` | 403 Forbidden |
| RBAC-08 | Manager → `POST /api/admin/staff` (create Owner) | 403 Forbidden |
| RBAC-09 | Accountant → `POST /api/admin/sales` | 403 Forbidden |
| RBAC-10 | Any staff → permitted Finance/Insurance/RTO lists | 200 OK (read-only) |
| RBAC-11 | Requester → `PUT /api/admin/refunds/{id}` (approve own) | 403 Forbidden |
| RBAC-12 | Super Admin → all endpoints | 200 OK |
| RBAC-13 | Inactive user sign-in | Denied |
| RBAC-14 | Expired session | 401 |
| RBAC-15 | Revoked session | 401 |

### 8.3 Tenant Isolation Testing

| Test ID | Scenario | Expected |
|---------|----------|----------|
| TI-01 | User from Dealership A cannot see Dealership B's data | 404 or empty result set |
| TI-02 | Staff from Dealership A cannot access Dealership B's admin routes | 403 Forbidden |
| TI-03 | Customer data is scoped to dealership | Cross-dealership customer not visible |
| TI-04 | Stock units are dealership-scoped | Other dealership's stock units not visible |

---

## 9. Dealership Business Workflow Testing

### 9.1 Stock Inward → Outward → Sale Workflow

| Step | Action | Expected |
|------|--------|----------|
| BW-01 | Stock inward (create StockUnit with chassis/engine) | Unit created, status = "available", StockMovement record created |
| BW-02 | Stock reservation (create Reservation) | Unit status = "reserved", active reservation exists |
| BW-03 | Duplicate reservation on same unit | 409 RESERVATION_CONFLICT |
| BW-04 | Cancel reservation | Unit status = "available", reservation status = "released" |
| BW-05 | Stock outward (mark unit sold) | Unit status = "sold", Sale record created, StockMovement recorded |
| BW-06 | Sold bike cannot be reserved again | Reservation rejected |
| BW-07 | Stock adjustment/return | Movement recorded, status reconciled |

### 9.2 Booking → Sale Workflow

| Step | Action | Expected |
|------|--------|----------|
| BW-08 | Create booking with advance | Booking created, unit reserved, Payment + PaymentAllocation created |
| BW-09 | Cancel booking | Reservation released, unit available, refund processed |
| BW-10 | Convert booking to sale | Advance allocation carried to sale exactly once, outstanding amount correct |
| BW-11 | Double allocation check | Payment allocation targets exactly one of sale/booking |

### 9.3 Payment → Refund Workflow

| Step | Action | Expected |
|------|--------|----------|
| BW-12 | Record payment | Payment created, PaymentAllocation created |
| BW-13 | Request refund | Refund created with status "pending" |
| BW-14 | Approve refund (different user) | Status → "approved" |
| BW-15 | Complete refund | Status → "completed", original payment unchanged |
| BW-16 | Refund self-approval | 403 Forbidden |
| BW-17 | Refund exceeds balance | Rejected |

### 9.4 Invoice Generation Workflow

| Step | Action | Expected |
|------|--------|----------|
| BW-18 | Issue GST invoice | Invoice created with CGST/SGST/IGST split |
| BW-19 | GST split validation | CGST + SGST + IGST = GST Amount |
| BW-20 | Invoice immutability | Issued invoice cannot be edited (void + reissue only) |

---

## 10. Security Testing

### 9.1 Authentication & Session

| Test | Expected |
|------|----------|
| Database-backed sessions (not JWT) | `session.strategy = "database"` |
| Session cookie is HttpOnly, Secure (prod), SameSite=lax | Verified in browser dev tools |
| Session expiry 8 hours | Session expires after 8 hours idle |
| Session revocation | Revoked session returns 401 |
| Inactive user cannot sign in | Denied |

### 9.2 API Security

| Test | Expected |
|------|----------|
| Unauthenticated API calls | 401 |
| Unauthorized role API calls | 403 |
| No secrets in client bundle | None found |
| SQL injection attempt | Prisma parameterizes; no injection |
| XSS attempt | User content escaped; CSP blocks |
| CSRF attempt | Auth.js protection blocks |

### 9.3 File Upload Security

| Test | Expected |
|------|----------|
| Valid image (JPEG < 10MB) | Success |
| Invalid type (executable) | Rejected |
| Oversized file (> 10MB) | Rejected |
| Unauthorized role downloads customer document | 403 |
| Authorized role downloads document | Signed URL returned |
| Document not accessible via public URL | 404/403 |

### 9.4 Webhook Security

| Test | Expected |
|------|----------|
| Valid webhook signature | Accepted |
| Invalid signature | Rejected with 400 |
| Duplicate webhook (same event ID) | Idempotent |
| Replayed webhook | Ignored |
| Malformed payload | Rejected with 400 |

---

## 11. Performance Testing

| Route | Target | Test Method |
|-------|--------|-------------|
| Homepage | < 3s on 4G | Lighthouse / Playwright trace |
| Bike listing | < 3s | Load test with 50 concurrent users |
| Dashboard | < 2s | Load test with 20 concurrent staff |
| API endpoints | < 500ms p95 | k6 or similar |

**Note:** Performance tests run against staging, not production.

---

## 12. Rollback Procedures

### 12.1 Application Rollback (Vercel)

```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### 12.2 Database Rollback

1. Restore database from backup (`pg_restore`)
2. Verify data integrity
3. Verify application functionality

### 12.3 Rollback Checklist

- [ ] Identify last known good commit
- [ ] Revert or `git revert` offending commit
- [ ] Deploy rollback
- [ ] Verify application functionality
- [ ] Verify database integrity
- [ ] Verify no data loss

---

## 12. Test Results Log

| Test ID | Test Name | Status | Evidence | Notes |
|---------|-----------|--------|----------|-------|
| TypeScript | `npx tsc --noEmit` | PASS | 0 errors | |
| Build | `npx next build` | PASSED | No ignored errors | |
| ESLint | `npx eslint .` | PASSED | 0 errors, 5 warnings | |
| Unit tests | `npx vitest run` | 88/88 PASSED | | |
| Integration (DB) | `vitest run` | 11 PASSED | Real PostgreSQL | |
| Accessibility | `a11y.test.ts` | PASSED | DOM-based | |
| Security review | `security.test.ts` | PASSED | 11 tests | |
| Backup/Restore | `pg_dump`/`pg_restore` | PASSED | 42 tables, 118 KB | |
| E2E (Playwright) | `playwright test` | BLOCKED | Container network isolation | |
| Role-based authz | Unit-level | PASSED | API routes guarded | |

---

## 13. Defect Tracking

| Defect ID | Severity | Description | Status | Fix Applied |
|-----------|----------|-------------|--------|-------------|
| | | | | |

*(Add defects as found during staging validation)*

---

## 14. Sign-off Criteria

| Criterion | Status |
|-----------|--------|
| All MVP features implemented and tested | Partial (core implemented; payments/invoices stubbed) |
| Unit, integration, E2E tests pass | Partial (E2E blocked by container) |
| Role-based authorization verified | ✅ Unit-level |
| Security review complete | ✅ Review performed |
| Accessibility review complete | ✅ DOM-based audit passed |
| Production build succeeds | ✅ Zero TypeScript errors |
| GST/invoice settings verified by owner | ❌ Pending owner decision |
| Refund approval policy confirmed | ❌ Pending owner decision |
| Document retention policy confirmed | ❌ Pending owner decision |
| Chatbot grounded in data only | ✅ Stub with guardrails |
| UAT sign-off | ❌ Pending owner |
| Deployment configuration documented | ✅ vercel.json created |
| Rollback plan prepared | ❌ Not prepared |

**Final Gate:** Do not deploy to production until all owner decisions are resolved and a qualified security review is complete.

---

**End of STAGING_VALIDATION_PLAN.md**
