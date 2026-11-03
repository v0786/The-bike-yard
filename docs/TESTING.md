# TESTING.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Draft — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md, AGENTS.md, PLAN.md, SETUP.md, FEATURES.md, AUTH_SECURITY.md, MCP.md, INTEGRATIONS.md  
**Version:** 1.1  
**Source of Truth:** Yes — Testing strategy  
**Change history:** v1.1 — added reservation-history, booking-advance allocation, refund-lifecycle, stock-movement, service-request and GST-split scenarios; aligned role tests with API.md §9.

---

## 1. Test Pyramid

```
        ┌─────────────┐
        │  E2E Tests  │  (Playwright) — Full user journeys
        ├─────────────┤
        │ Integration │  (Vitest + Supertest) — API, DB, adapters
        ├─────────────┤
        │  Unit Tests │  (Vitest) — Calculations, validators, state
        └─────────────┘
```

| Level | Tool | Coverage Target | Speed |
|-------|------|-----------------|-------|
| Unit | Vitest | 80%+ on utilities, validators, calculations | Fast (< 5s) |
| Integration | Vitest + Supertest | Critical API paths, DB transactions | Medium (< 30s) |
| E2E | Playwright | Full user journeys | Slow (minutes) |

---

## 2. Unit Test Scope

| Area | Examples |
|------|----------|
| **Money calculations** | Price breakdown (ex-showroom + insurance + RTO + accessories − discount = final selling price in paise) |
| **EMI calculator** | Loan amount, interest rate, tenure → monthly EMI (rounded paise, labeled estimate) |
| **GST calculation** | Tax amount from subtotal + rate; CGST/SGST split for intra-state; IGST for inter-state; basis-point conversion (2800 = 28.00%) |
| **Allocation math** | Payment split across sale/booking; refundable balance after partial refunds |
| **Validators** | Chassis/engine uniqueness, phone format, email format, date validity, file type/size, exactly-one allocation target |
| **State transitions** | Stock unit: available → reserved → sold → delivered; booking: pending → confirmed → delivered; refund: pending → approved → completed; reservation: active → released/expired/converted; service request: open → acknowledged → in_progress → resolved → closed |
| **Permissions** | Role-permission matrix enforcement (pure functions) matching API.md §9 |
| **Date utilities** | UTC storage → Asia/Kolkata display conversion |

---

## 3. Integration Test Scope

| Area | Examples |
|------|----------|
| **Database transactions** | Stock inward creates unit atomically; sale completion updates stock atomically; booking→sale advance carry-forward atomic; rollback on failure |
| **API handlers** | Public bike listing, admin stock inward, payment recording, invoice generation, refund lifecycle, service requests |
| **Provider adapters** | Storage upload/download, payment webhook signature verification, messaging stub |
| **Authorization** | Every endpoint returns 401/403 for unauthorized roles; refund self-approval rejected |
| **Idempotency** | Duplicate webhook rejected; duplicate payment idempotency key handled |
| **Reservation history** | Multiple historical reservations per unit allowed; second `active` reservation rejected (409) |

---

## 4. E2E Test Scenarios

| Scenario | Steps | Assertions |
|----------|-------|-----------|
| **Public enquiry** | Visit bike detail → submit enquiry form → verify lead created in admin | Lead exists with customer details |
| **Test ride booking** | Book test ride → verify test ride record | Test ride scheduled, assignable; **no stock reservation created** |
| **Stock inward** | Admin records inward → verify unit available | Unit exists with unique chassis/engine; movement row written |
| **Reservation** | Create booking → verify unit reserved | Unit status = reserved; cannot be sold |
| **Reservation history** | Cancel booking, then re-book same unit | Old reservation retained (released/cancelled); new active reservation succeeds |
| **Sale completion** | Complete sale → verify stock status, invoice created | Unit status = sold; invoice exists; payment recorded |
| **Booking advance** | Record advance against booking, then convert booking to sale | Advance allocation carried to sale exactly once; outstanding correct |
| **Payment recording** | Record payment → verify allocated to sale | Outstanding amount updated |
| **Refund** | Request → approve (different user) → complete | Refund traceable; original payment unchanged; balance reduced |
| **Refund self-approval** | Requester tries to approve own refund | Rejected (403) |
| **Invoice generation** | Generate GST invoice → verify tax snapshot immutable | Invoice totals correct; CGST+SGST+IGST = GST; rate in basis points |
| **Delivery** | Mark sale delivered → verify status | Sale/unit delivered; delivery movement row |
| **Stock adjustment** | Record adjustment/return with reason | Movement row written; unit status reconciled |
| **Finance application** | Submit finance application → verify status tracking | Application visible with document upload |
| **Insurance application** | Submit insurance → verify provider/policy fields | Application tracked |
| **RTO application** | Submit RTO → verify registration tracking | Application status tracked |
| **Service request** | Create → assign → resolve → close | Status transitions valid; audit entries written |
| **Chatbot** | Ask bike price → verify response from dealership data | No hallucinated price/stock |

---

## 5. Role-Based Authorization Tests

| Test | Expected |
|------|----------|
| Unauthenticated access to `/admin/*` | Redirect to login |
| Unauthenticated access to `/staff/*` | Redirect to login |
| Sales Executive calls `POST /api/admin/payments` | 403 Forbidden |
| Accountant calls `POST /api/admin/stock/inward` | 403 Forbidden |
| Insurance Staff calls `POST /api/admin/rto` | 403 Forbidden |
| RTO Staff calls `POST /api/admin/insurance` | 403 Forbidden |
| Manager calls `PUT /api/admin/settings` | 403 Forbidden |
| Manager calls `POST /api/admin/staff` to create an Owner | 403 Forbidden |
| Accountant calls `POST /api/admin/sales` | 403 Forbidden |
| Any staff reads permitted Finance/Insurance/RTO lists | 200 OK (read-only) |
| Requester calls `PUT /api/admin/refunds/{id}` to approve own refund | 403 Forbidden |
| Super Admin accesses all endpoints | 200 OK |
| Inactive user signs in | Denied |
| Expired session | 401 |
| Revoked session | 401 |

**Direct API test:** Use `curl` or Supertest to bypass UI; verify server returns 401/403 as appropriate.

---

## 6. Upload & Document Access Tests

| Test | Expected |
|------|----------|
| Upload valid image (JPEG < 10MB) | Success |
| Upload invalid type (executable) | Rejected |
| Upload oversized file (> 10MB) | Rejected |
| Unauthorized role downloads customer document | 403 |
| Authorized role downloads document | Signed URL returned |
| Document not accessible via public URL | 404/403 |

---

## 7. Webhook Signature, Replay & Idempotency Tests

| Test | Expected |
|------|----------|
| Valid webhook signature | Accepted, payment status updated |
| Invalid signature | Rejected with 400 |
| Duplicate webhook (same event ID) | Idempotent; no double payment |
| Replayed webhook after processing | Ignored |
| Malformed payload | Rejected with 400 |

---

## 8. Responsive UI & Accessibility Tests

| Test | Expected |
|------|----------|
| Mobile (375px) | Layout stacks correctly; hamburger menu works |
| Tablet (768px) | Two-column grids; sidebar collapses |
| Desktop (1280px) | Full layout; hover states work |
| Keyboard navigation | All interactive elements reachable via Tab |
| Focus rings | Visible on all focusable elements |
| Contrast | Meets WCAG 2.1 AA (4.5:1 normal text) |
| Screen reader | ARIA landmarks, labels present |
| Reduced motion | Animations disabled when `prefers-reduced-motion` |
| Touch targets | ≥ 44px on mobile |

**Tool:** axe-core (Playwright integration) or manual audit.

---

## 9. Performance & Load Tests

| Route | Target | Test |
|-------|--------|------|
| Homepage | < 3s on 4G | Lighthouse / Playwright trace |
| Bike listing | < 3s | Load test with 50 concurrent users |
| Dashboard | < 2s | Load test with 20 concurrent staff |
| API endpoints | < 500ms p95 | k6 or similar |

**Note:** Performance tests run against staging, not production.

---

## 10. Security Tests

| Test | Expected |
|------|----------|
| SQL injection attempt | Prisma parameterizes; no injection |
| XSS attempt | User content escaped; CSP blocks |
| CSRF attempt | Auth.js protection blocks |
| Unauthenticated API calls | 401 |
| Unauthorized role API calls | 403 |
| Secrets in client bundle | None found |
| Security headers present | HSTS, CSP, X-Content-Type-Options, etc. |
| File upload bypass | Invalid file rejected |

---

## 11. Backup & Restore Verification

| Test | Expected |
|------|----------|
| Database backup taken | Backup file exists, restorable |
| Restore from backup | Data intact, application functions |
| Storage backup (S3 versioning) | Previous version retrievable |
| Test cadence | Quarterly, on staging copy |

---

## 12. User Acceptance Testing (UAT)

| Test | With |
|------|------|
| Walk through public site as customer | Owner + sample customer |
| Create lead, booking, sale as Sales Executive | Sales staff |
| Record payment, generate invoice as Accountant | Accountant |
| Process insurance application | Insurance staff |
| Process RTO application | RTO staff |
| View reports and dashboard | Owner/Manager |

**Sign-off:** Owner approves UAT before production launch.

---

## 13. Critical Business Scenarios (Must Pass)

- [ ] Same physical bike cannot be reserved/sold twice.
- [ ] Only one **active** reservation exists per unit, while reservation history is preserved.
- [ ] Failed/cancelled booking releases reservation correctly.
- [ ] Booking advance is allocated to the booking and carried to the sale exactly once.
- [ ] Payment duplicates not applied twice; over-allocation rejected.
- [ ] Refunds require proper permission and traceability; requester cannot self-approve.
- [ ] Invoice totals use correct immutable snapshots and approved tax configuration; CGST+SGST+IGST = GST.
- [ ] Stock movements are written for inward/reservation/release/sale/return/adjustment/delivery.
- [ ] Staff cannot access another role's restricted data.
- [ ] Public pages never leak internal cost or customer documents.
- [ ] Chatbot does not fabricate stock, price, or finance approval.

---

## 14. Test Data & Environments

| Environment | Data | Purpose |
|-------------|------|---------|
| Local | Synthetic seed data | Developer testing |
| Test/Staging | Synthetic/anonymized data | Integration + E2E |
| Production | Real customer data | Never run destructive tests |

**Fixtures & Factories:**
- `prisma/seed.ts` — fictional catalogue, one dealership, roles, super admin
- Test factories for customers, stock units, sales (generated per test)
- Database reset between test suites (transaction rollback where possible)

**Safety:**
- Never use real customer data in local/staging.
- Never run destructive tests against production.
- Backup before restore tests.

---

## 15. CI Gates

| Gate | Requirement |
|------|-------------|
| Lint | No errors |
| Type check | `tsc --noEmit` passes |
| Unit tests | All pass; 80%+ coverage |
| Integration tests | All pass |
| E2E tests | Critical scenarios pass |
| Build | `npm run build` succeeds |
| Security checks | No critical vulnerabilities |
| Accessibility | No critical axe-core violations |

PRs cannot merge if any gate fails.

---

## 16. Release Criteria

- [ ] All MVP features implemented and tested.
- [ ] Unit, integration, E2E tests pass.
- [ ] Role-based authorization verified.
- [ ] Security review complete.
- [ ] Accessibility review complete.
- [ ] Production build succeeds.
- [ ] GST/invoice settings verified by owner (GSTIN, rate, HSN, place of supply).
- [ ] Refund approval policy confirmed by owner.
- [ ] Document retention policy confirmed and implemented.
- [ ] Chatbot grounded in dealership data only.
- [ ] UAT sign-off from owner.
- [ ] Deployment configuration documented.
- [ ] Rollback plan prepared.

---

## 17. Defect Severity Definitions

| Severity | Definition | SLA |
|----------|-----------|-----|
| **Critical** | Data loss, security breach, app unavailable, incorrect financial totals | Fix before release |
| **High** | Broken core workflow (sale, payment, invoice), permission bypass | Fix before release |
| **Medium** | Non-core feature broken, poor UX, minor data issue | Fix in next sprint |
| **Low** | Cosmetic issue, typo, non-blocking UX | Backlog |

---

## 18. Test Tooling Recommendations

| Tool | Purpose |
|------|---------|
| **Vitest** | Unit + integration tests |
| **Playwright** | E2E + accessibility + responsive |
| **Supertest** | API endpoint testing |
| **axe-core** | Accessibility audit |
| **Prisma test helpers** | Database transaction isolation |
| **k6** (optional) | Load testing |

---

**Verification:** TESTING.md v1.1 is complete and consistent with all previous documents (DATABASE.md v1.1, API.md v1.1, FEATURES.md v1.1, AUTH_SECURITY.md v1.1). Acceptance criteria are not weakened. Reservation history, booking advances, refunds, GST split and service requests are covered. No dealership information, prices, GST details, or finance partners invented.

**Next:** Proceed to 15_DEBUGGING_PROMPT.md to generate DEBUGGING.md (then reconcile with TESTING.md v1.1).