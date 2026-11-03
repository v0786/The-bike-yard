# TEST_REPORT — The Bike Yard

**Generated:** 2026-11-03  
**Build:** `npx next build` — PASSED  
**Type check:** `npx tsc --noEmit` — pre-existing errors in inherited pages (Next.js/@types version mismatch, Prisma BigInt types); all JSX and logic errors fixed  
**Lint:** not yet configured  

## Test Summary

| Suite | File | Tests | Status |
|-------|------|-------|--------|
| Currency | `src/lib/__tests__/currency.test.ts` | 8 | PASSED |
| GST calculation | `src/lib/__tests__/gst.test.ts` | 6 | PASSED |
| Validation schemas | `src/lib/__tests__/validation.test.ts` | 16 | PASSED |
| Date utilities | `src/lib/__tests__/date.test.ts` | 10 | PASSED |
| Authorization (RBAC) | `src/lib/__tests__/authz.test.ts` | 14 | PASSED |
| **Total** | **5 files** | **54** | **ALL PASSED** |

## Coverage by TESTING.md category

### Unit tests (TESTING.md §2)
- Money calculations: formatInr, toPaise, toRupees ✅
- GST calculation: CGST/SGST/IGST split, intra/inter-state, odd amounts ✅
- GST rate validation (basis points 0-10000) ✅
- Validators: chassis/engine format, money, GST rate, phone, enquiry ✅
- Date utilities: DD/MM/YYYY formatting, UTC→Kolkata conversion, day boundaries ✅

### Integration tests
- Prisma Client generation ✅
- Prisma schema validation (34+ models, relations) ✅

### Authorization tests (TESTING.md §5)
- Unauthenticated → 401 ✅
- Role matrix: Super Admin/Owner/Manager/Sales Exec/Accountant/Insurance Staff/RTO Staff ✅
- Refund self-approval blocked (Accountant not in Manager/Owner/Super Admin) ✅
- Cross-role blocking: Insurance Staff cannot access RTO write, and vice versa ✅

## Known gaps (not yet implemented)

| Test type | TESTING.md ref | Status | Blocker |
|-----------|---------------|--------|---------|
| Integration tests (API + DB transactions) | §3 | Not started | Needs database (DATABASE_URL) |
| E2E tests (Playwright) | §4 | Scaffold created (`tests/e2e/critical-scenarios.spec.ts`) | Needs Playwright + running server |
| Role-based authz API tests | §5 | Unit-level only | Needs Supertest + running server |
| Upload/document access tests | §6 | Not started | Needs storage provider |
| Webhook idempotency tests | §7 | Not started | Needs payment provider |
| Responsive/a11y tests | §8 | Not started | Needs Playwright + axe-core |
| Performance tests | §9 | Not started | Needs k6/staging |
| Security tests | §10 | Partial (headers, RBAC unit) | Needs penetration scan |
| Backup/restore verification | §11 | Not started | Needs managed DB |

## CI gates (TESTING.md §15)
- Lint: Not configured (eslint installed, no config)
- Type check: Pre-existing errors in inherited pages; build passes with ignoreBuildErrors
- Unit tests: 54/54 PASSED
- Integration tests: Not run (no DB)
- E2E tests: Not run (no Playwright/server)
- Build: PASSED
- Security checks: Headers present; no secrets in bundle
- Accessibility: Not audited

## Release criteria (TESTING.md §16)
| Criterion | Status |
|-----------|--------|
| All MVP features implemented and tested | Partial (core implemented; payments/invoices stubbed) |
| Unit tests pass | ✅ 54/54 |
| Role-based authorization verified | ✅ Unit-level |
| Security review complete | ❌ Not performed |
| Accessibility review complete | ❌ Not performed |
| Production build succeeds | ✅ |
| GST/invoice settings verified by owner | ❌ Pending owner decision |
| Refund approval policy confirmed | ❌ Pending owner decision |
| Document retention policy confirmed | ❌ Pending owner decision |
| Chatbot grounded in data only | ✅ Stub with guardrails |
| UAT sign-off | ❌ Pending owner |
| Deployment configuration documented | ❌ vercel.json missing |
| Rollback plan prepared | ❌ Not prepared |

## Critical blockers (must resolve before production)
1. GST configuration and HSN/place-of-supply verified by owner (blocks live invoicing)
2. Payment gateway provider selected (blocks live payments)
3. Security review / penetration test
4. Accessibility audit (WCAG 2.1 AA)
5. Integration + E2E tests against staging database
6. vercel.json / deployment configuration
