# AUTH_SECURITY.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Draft — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md, AGENTS.md, PLAN.md, SETUP.md, FEATURES.md  
**Version:** 1.1  
**Source of Truth:** Yes — Authentication and security specification  
**Change history:** v1.1 — fixed duplicate section numbering; corrected API.md cross-reference to §9; resolved password-reset contradiction; aligned role summaries with the API.md §9 matrix; expanded audit entity types; marked retention durations as owner decisions.

---

## 1. Sign-In, Sign-Out, Password Reset

| Feature | Description |
|---------|-------------|
| **Sign-in** | Credentials provider (email + password). Form validates on client; verified server-side. |
| **Sign-out** | Invalidates server-side session; clears Auth.js cookie. User redirected to public login page. |
| **Password reset** | **No self-service email reset in MVP.** A Super Admin or Owner can trigger an admin-initiated password reset (temporary password issued out-of-band; user must change it at next sign-in). Email-based self-service reset is a later enhancement. |
| **Account invitation** | Super Admin can invite new staff; temporary password issued out-of-band; user must set a new password on first sign-in. |

---

## 2. Session Strategy

- **Provider:** Auth.js (NextAuth) with database-backed sessions.
- **Session storage:** PostgreSQL via Prisma.
- **Cookie:** `next-auth.session-token` — `HttpOnly`, `Secure` (prod), `SameSite=lax`.
- **Expiry:** 8 hours idle; refresh on activity. Configurable via `session.maxAge`.
- **Concurrent sessions:** One session per user; signing in from a new device signs out the previous session.

---

## 3. JWT Use

- **Not used** for this architecture. Session-based auth (database-backed) chosen over JWTs for simpler revocation and server-side control of financial operations. JWTs would add complexity for token storage, rotation, and revocation without significant benefit for this use case.

---

## 4. Role-Based & Permission-Based Authorization

### 4.1 Roles (7 defined)

| Role | Description |
|------|-------------|
| **Super Admin** | Complete application access; can manage all settings, users, and data. |
| **Owner** | Business reports and management; near-full access including settings; cannot alter the Super Admin account or bypass audit logging. |
| **Manager** | Sales, stock, payments/receipts, invoices, expenses, service-request assignment, refund approval, and staff oversight. |
| **Sales Executive** | Enquiries, bookings, sales and test rides; can create leads, bookings, record sales. |
| **Accountant** | Payments, receipts, invoices, expenses, refund requests, and read-only finance/stock-movement visibility. |
| **Insurance Staff** | Insurance applications; can create/update insurance cases and documents. |
| **RTO Staff** | Registration management; can create/update RTO cases and documents. |

### 4.2 Permission Matrix

See **API.md §9** for detailed endpoint-by-endpoint authorization. That matrix is authoritative; this summary must match it.

- **Super Admin** can perform any action.
- **Owner** has near-full access including settings and reports; cannot alter the Super Admin account or bypass audit logging.
- **Manager** has sales, stock, customer, payment/receipt, invoice, expense, service-request assignment and refund-approval access, plus staff oversight; cannot change system settings or manage the Super Admin account.
- **Sales Executive** has lead/booking/sales/test-ride scope only.
- **Accountant** has payment, receipt, invoice, expense, refund-request and read-only finance/stock-movement scope; no stock or sales mutation.
- **Insurance Staff** can write insurance cases and read finance/RTO where the matrix allows; cannot mutate sales, payments or RTO.
- **RTO Staff** can write RTO cases and read finance/insurance where the matrix allows; cannot mutate sales, payments or insurance.

> **Refund separation of duties:** the user who requests a refund cannot approve it. Manager/Owner/Super Admin may approve, subject to the matrix.

### 4.3 Enforcement

- **Middleware** (`src/middleware.ts`): Checks session + role before rendering any `/admin/` or `/staff/` route.
- **Service layer**: Every API endpoint and Server Action verifies permissions against the user's role.
- **UI hiding** is supplementary only; server must always verify.

---

## 5. Staff Onboarding, Deactivation & Access Removal

| Action | Process |
|--------|---------|
| **Onboard new staff** | Super Admin, Owner, or Manager creates the user via the Admin UI; assigns role; issues a temporary password out-of-band. Manager cannot create or modify Owner/Super Admin accounts. |
| **Deactivate staff** | Super Admin/Owner (and Manager for non-privileged staff) sets `isActive = false`; current sessions are invalidated. |
| **Remove access** | Revoke role or specific permissions; audit log entry created. |
| **Session removal** | Super Admin can revoke all user sessions from the admin dashboard. |

---

## 6. Optional MFA for Privileged Accounts

- **Not required for MVP.** May be added in Phase 2+ for Super Admin and Owner roles.
- If implemented: TOTP-based (Google Authenticator, Authy) via third-party library.
- Backup codes stored encrypted.

---

## 7. Password Policy & Secure Hashing

- **Minimum length:** 8 characters.
- **Complexity:** At least 1 lowercase, 1 uppercase, 1 number, 1 special character.
- **Hashing:** bcrypt with `cost factor = 12` (or Argon2 if library available).
- **Never store** passwords in plain text.
- **Password reset (MVP):** Admin-initiated only. Super Admin/Owner issues a temporary password out-of-band; the user must change it at next sign-in. No self-service email link in MVP.
- **Password reset (later):** Single-use, time-limited email link; token hashed at rest; new password hashed before storage.

---

## 8. Brute-Force Protection & Rate Limiting

- **Auth.js built-in:** Max 5 failed sign-in attempts per 15-minute window per IP.
- **Subsequent attempts:** Exponential backoff delays.
- **Middleware:** Additional rate limiting on admin/staff routes (10 requests/minute per IP unauthenticated).
- **CAPTCHA:** Not required for MVP; may add later.

---

## 9. CSRF, XSS, SQL Injection, SSRF & Upload Security

| Threat | Control |
|--------|---------|
| **CSRF** | Auth.js includes CSRF protection for sign-in/up forms; Next.js middleware validates session on state-changing requests. |
| **XSS** | Tailwind CSS with sanitization; all user-generated content escaped on render; CSP header recommended. |
| **SQL injection** | Prisma ORM uses parameterized queries; no raw SQL in application code. |
| **SSRF** | No user-supplied URLs fetched server-side in MVP. |
| **File upload** | - Type validation: `image/jpeg`, `image/png`, `image/webp`, `application/pdf`<br>- Size limit: 10MB max<br>- Virus scanning recommended for production<br>- Private bucket; signed URLs only<br>- Customer documents accessible only by authorized roles |

---

## 10. Secure Cookies, CORS & Security Headers

| Header | Value (recommended) |
|--------|---------------------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` (or `SAMEORIGIN` for embeds) |
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; font-src 'self';` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

---

## 11. Audit Logs for Privileged & Financial Actions

| Field | Description |
|-------|-------------|
| `entityType` | `user`, `role`, `staff`, `customer`, `stockUnit`, `stockMovement`, `reservation`, `booking`, `sale`, `payment`, `paymentAllocation`, `refund`, `receipt`, `invoice`, `financeApplication`, `insuranceApplication`, `rtoApplication`, `serviceRequest`, `document`, `settings` |
| `entityId` | The UUID of the affected record |
| `action` | `create`, `update`, `delete`, `status_change`, `price_change`, `refund` |
| `oldValues` | JSON of fields before change |
| `newValues` | JSON of fields after change |
| `ipAddress` | Client IP at time of action |
| `userId` | The user who performed the action |
| `createdAt` | Timestamp |

- Logged for: price changes, stock inward/adjustment/return, reservation changes, booking cancellation, payment recording/allocation, refund request/approval/completion, invoice issuance/void, service-request assignment/closure, staff role changes, settings changes, customer document upload/access/download.
- All privileged actions (role changes, financial transactions) must have an audit entry.
- Retention duration is **Pending Owner Approval**; logs are not hard-deleted through normal application flows and are exportable for compliance review.

---

## 12. Privacy, Consent, Data Minimization & Retention

| Principle | Application |
|-----------|-------------|
| **Data minimization** | Collect only what is needed: name, phone, email for customers; chassis/engine numbers for stock; essential financial data. |
| **Consent** | Enquiry form submits only with user acknowledgment; cookie consent banner for analytics. |
| **Retention** | Customer records and identity documents retained for a duration **Pending Owner Approval** (subject to tax/privacy advice); financial records retained per applicable tax law; audit logs retained per policy and never hard-deleted via normal flows. |
| **Deletion workflow** | Customer can request deletion via contact form. Super Admin reviews; financial records that must be retained by law are not deleted. Where permitted, personal data is anonymized and documents are purged only after the retention policy is approved and the action is audited. |
| **Privacy by design** | No card numbers, CVV, or raw passwords stored; documents stored privately with access control. |

---

## 13. Backup Encryption & Incident Response Basics

- **Database backups:** Managed provider automated daily backups; point-in-time recovery enabled.
- **Storage backups:** S3 bucket versioning enabled; cross-region replication recommended.
- **Incident response:** If breach suspected — revoke sessions, rotate secrets, notify owner, forensic review, notify affected users if required.
- **Security team contact:** Owner + qualified security consultant (engaged as needed).

---

## 14. Test Requirements

### 14.1 Positive Tests

- Sign in with valid credentials.
- Sign out; session invalidated.
- Each role can access its permitted endpoints and cannot access restricted endpoints.
- Payment recording requires correct role; lower roles receive 403.
- Refund requester cannot approve their own refund.
- Reservation: a second active reservation on the same unit is rejected (409), while historical reservations remain readable.
- Document upload restricted by file type and size.
- Audit log entries created for all financial and privileged actions.

### 14.2 Negative Tests

- Direct API requests cannot bypass UI restrictions (e.g., curl to `/api/admin/invoices` without auth).
- Inactive user cannot sign in.
- Expired session redirects to login.
- Revoked session returns 401.
- User attempts to access another role's restricted data → 403.
- Public pages never leak internal cost or customer documents.
- Chatbot does not fabricate stock, price, or finance approval.
- File upload with invalid type/size rejected.
- Brute-force attempts rate-limited.

---

## 15. Security Test Checklist

- [ ] Sign-in with valid credentials works.
- [ ] Sign-out invalidates session.
- [ ] Each role accesses its permitted endpoints only.
- [ ] Unauthenticated access to `/admin/*` or `/staff/*` redirects to login.
- [ ] Payment recording requires correct role.
- [ ] Refund self-approval is blocked.
- [ ] Reservation active-uniqueness enforced; history preserved.
- [ ] Document upload restricted by type/size/role.
- [ ] Audit log entries for all financial/privileged actions.
- [ ] Expired session behavior.
- [ ] Revoked session behavior.
- [ ] Role-based data isolation.
- [ ] No secrets in client bundle.
- [ ] CSP, security headers present.
- [ ] File type/size validation on upload.
- [ ] Brute-force rate limiting.

---

## 16. Professional Review Required

- **Privacy, tax, and regulatory obligations** must be reviewed by qualified professionals before launch.
- GST/invoice compliance must be verified against Indian tax law.
- Data retention and deletion workflows must align with applicable privacy regulations.
- This specification does not constitute legal advice.

---

**Verification:** AUTH_SECURITY.md v1.1 is complete and consistent with PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md v1.1, API.md v1.1, AGENTS.md v1.1, PLAN.md, SETUP.md, and FEATURES.md v1.1. Section numbering is unique, the permission summary matches API.md §9, password reset is unambiguous, and retention is explicitly an owner decision. No dealership information, prices, GST details, or finance partners invented.

**Next:** Proceed to 12_MCP_PROMPT.md to generate MCP.md (then reconcile with AUTH_SECURITY.md v1.1).