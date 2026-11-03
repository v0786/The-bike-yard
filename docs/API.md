# API.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Draft — Pending Dealership Owner Review  
**Version:** 1.1  
**Source of Truth:** Yes — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md  
**Previous Documents:** PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md  
**Next Document:** AGENTS.md (Prompt 06)  
**Change history:** v1.1 — unified success/error response contract; fixed §10 example numbering; added refund, receipt, service-request, test-ride, stock-movement and expense endpoints; documented booking-advance allocation; aligned insurance/RTO/finance role rules with §9 matrix; changed GST rate to basis points; corrected cross-references.

---

## 1. API Conventions

| Convention | Specification |
|------------|---------------|
| Protocol | HTTPS |
| Format | JSON |
| Versioning | URL path versioning not used (single version, Next.js App Router) |
| Base URL | `https://api.thebikeyard.local` (local: `http://localhost:3000`) |
| Timestamps | ISO 8601 UTC |
| Money | Integer paise (no decimals, no floating point) |
| Pagination | `?page=1&pageSize=20` |
| Filtering | `?status=available&variantId=uuid` |
| Sorting | `?sort=createdAt:desc` |
| Search | `?q=search term` |
| Rate limit | 100 requests/minute per IP (authenticated); 20/minute (unauthenticated) |

---

## 2. Response & Error Format

This is the single canonical envelope used by every endpoint. Downstream documents (AGENTS.md, FEATURES.md, TESTING.md) must match it.

**Success response (2xx):**
```json
{
  "data": { ... } | [ ... ],
  "meta": { "page": 1, "pageSize": 20, "total": 150 }
}
```
- `meta` is present for list responses and may be omitted for single-resource responses.
- Success responses never include an `error` key.

**Error response (4xx/5xx):**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-safe message",
    "field": "chassisNumber",
    "details": [{ "field": "amount", "message": "Must be a positive integer in paise" }]
  }
}
```
- Error responses never include a `data` key.
- `details` is optional and used for multi-field validation.
- Error codes never leak stack traces, internal IDs, or personal data.

> **Rule:** a response contains exactly one of `data` or `error`. There is no `{ data, error, meta }` shape.

---

## 3. Authentication & Authorization

- All admin (`/admin/*`) and staff (`/staff/*`) endpoints require a valid session cookie.
- Public endpoints (`/api/public/*`) require no auth.
- Authorization checked server-side on every request; UI hiding is supplementary only.
- Role-based permission matrix enforced in service layer.

---

## 4. Public Endpoints (No Auth)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/public/bikes` | List bikes with filters, pagination | No |
| GET | `/api/public/bikes/[id]` | Bike detail with specs, pricing, images | No |
| GET | `/api/public/brands` | List brands | No |
| GET | `/api/public/faqs` | List active FAQs | No |
| GET | `/api/public/blogs` | List published blogs | No |
| GET | `/api/public/blogs/[slug]` | Blog detail | No |
| GET | `/api/public/settings` | Public-facing settings (branding, social links) | No |
| GET | `/api/public/showroom` | Showroom location, contact, hours | No |
| POST | `/api/public/enquiries` | Submit customer enquiry | No |
| POST | `/api/public/test-rides` | Book test ride | No |
| POST | `/api/public/contact` | Contact form submission | No |

---

## 5. Admin Endpoints (Auth + RBAC)

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/admin/dashboard/overview` | Dashboard cards | All staff |
| GET | `/api/admin/dashboard/analytics` | Sales, revenue, charts | Owner, Manager, Super Admin |
| GET | `/api/admin/bikes` | List catalogue bikes | All staff (read) |
| POST | `/api/admin/bikes` | Create bike | Manager, Super Admin, Owner |
| PUT | `/api/admin/bikes/[id]` | Update bike | Manager, Super Admin, Owner |
| DELETE | `/api/admin/bikes/[id]` | Soft-delete bike | Super Admin, Owner |
| GET | `/api/admin/stock/inward` | List inward records | Manager, Super Admin, Owner |
| POST | `/api/admin/stock/inward` | Record stock inward | Manager, Super Admin, Owner |
| GET | `/api/admin/stock/outward` | List outward records | Manager, Super Admin, Owner |
| POST | `/api/admin/stock/outward` | Record stock outward (sale) | Manager, Super Admin, Owner |
| GET | `/api/admin/stock/units` | List all stock units | Manager, Super Admin, Owner |
| GET | `/api/admin/stock/movements` | List stock movement history | Manager, Super Admin, Owner, Accountant |
| POST | `/api/admin/stock/adjustments` | Record stock adjustment/return | Manager, Super Admin, Owner |
| GET | `/api/admin/customers` | List customers | All staff |
| POST | `/api/admin/customers` | Create customer | All staff |
| GET | `/api/admin/enquiries` | List enquiries/leads | All staff |
| PUT | `/api/admin/enquiries/[id]` | Update enquiry/lead | Sales Exec, Manager, Super Admin, Owner |
| GET | `/api/admin/test-rides` | List test rides | All staff |
| POST | `/api/admin/test-rides` | Schedule test ride | Sales Exec, Manager, Super Admin, Owner |
| PUT | `/api/admin/test-rides/[id]` | Update test ride | Sales Exec, Manager, Super Admin, Owner |
| GET | `/api/admin/bookings` | List bookings | All staff |
| POST | `/api/admin/bookings` | Create booking | Sales Exec, Manager, Super Admin, Owner |
| PUT | `/api/admin/bookings/[id]` | Update/cancel booking | Sales Exec, Manager, Super Admin, Owner |
| GET | `/api/admin/sales` | List sales | All staff |
| POST | `/api/admin/sales` | Record sale | Sales Exec, Manager, Super Admin, Owner |
| PUT | `/api/admin/sales/[id]` | Update sale / mark delivered | Sales Exec, Manager, Super Admin, Owner |
| GET | `/api/admin/payments` | List payments | Accountant, Manager, Super Admin, Owner |
| POST | `/api/admin/payments` | Record payment (sale or booking) | Accountant, Manager, Super Admin, Owner |
| GET | `/api/admin/receipts` | List receipts | Accountant, Manager, Super Admin, Owner |
| GET | `/api/admin/refunds` | List refunds | Accountant, Manager, Super Admin, Owner |
| POST | `/api/admin/refunds` | Request refund | Accountant, Manager, Super Admin, Owner |
| PUT | `/api/admin/refunds/[id]` | Approve/reject/complete refund | Manager, Super Admin, Owner (requester cannot self-approve) |
| GET | `/api/admin/invoices` | List invoices | Accountant, Manager, Super Admin, Owner |
| POST | `/api/admin/invoices` | Issue invoice for a sale | Accountant, Manager, Super Admin, Owner |
| GET | `/api/admin/finance` | List finance applications | All staff (read) |
| POST | `/api/admin/finance` | Create finance application | Sales Exec, Manager, Super Admin, Owner |
| PUT | `/api/admin/finance/[id]` | Update finance application | Sales Exec, Manager, Super Admin, Owner |
| GET | `/api/admin/insurance` | List insurance applications | All staff (read) |
| POST | `/api/admin/insurance` | Create insurance application | Insurance Staff, Super Admin, Owner |
| PUT | `/api/admin/insurance/[id]` | Update insurance application | Insurance Staff, Super Admin, Owner |
| GET | `/api/admin/rto` | List RTO applications | All staff (read) |
| POST | `/api/admin/rto` | Create RTO application | RTO Staff, Super Admin, Owner |
| PUT | `/api/admin/rto/[id]` | Update RTO application | RTO Staff, Super Admin, Owner |
| GET | `/api/admin/service-requests` | List service requests | All staff |
| POST | `/api/admin/service-requests` | Create service request | All staff |
| PUT | `/api/admin/service-requests/[id]` | Update/assign/close service request | Manager, Super Admin, Owner, assigned staff |
| GET | `/api/admin/expenses` | List expenses | Accountant, Manager, Super Admin, Owner |
| POST | `/api/admin/expenses` | Record expense | Accountant, Manager, Super Admin, Owner |
| GET | `/api/admin/staff` | List staff | Super Admin, Owner, Manager |
| POST | `/api/admin/staff` | Create staff | Super Admin, Owner, Manager |
| PUT | `/api/admin/staff/[id]` | Update staff / deactivate | Super Admin, Owner, Manager |
| GET | `/api/admin/settings` | Get settings | Super Admin, Owner |
| PUT | `/api/admin/settings` | Update settings | Super Admin, Owner |
| GET | `/api/admin/audit-logs` | List audit logs | Super Admin, Owner |
| GET | `/api/admin/reports` | Generate reports | Owner, Manager, Accountant, Super Admin |
| GET | `/api/admin/blogs` | List blogs | All staff |
| POST | `/api/admin/blogs` | Create blog | Manager, Super Admin, Owner |
| GET | `/api/admin/social` | List social links | All staff |
| PUT | `/api/admin/social` | Update social links | Manager, Super Admin, Owner |
| GET | `/api/admin/faq` | List FAQs | All staff |
| POST | `/api/admin/faq` | Create FAQ | Manager, Super Admin, Owner |
| GET | `/api/admin/chatbot-knowledge` | List chatbot knowledge sources | Manager, Super Admin, Owner |
| POST | `/api/admin/chatbot-knowledge` | Create/update chatbot knowledge source | Manager, Super Admin, Owner |

> **Role-model note:** "All staff (read)" means every authenticated dealership role may read, but only the listed write roles may mutate. This resolves the earlier contradiction where the endpoint table said "All staff read" while the §9 matrix denied Accountant access to Insurance/RTO rows. The §9 matrix is authoritative.

---

## 6. Staff Endpoints (Role-Scoped)

| Method | Endpoint | Description | Required Role |
|--------|----------|-------------|---------------|
| GET | `/api/staff/dashboard` | My dashboard metrics | All staff |
| GET | `/api/staff/enquiries` | Assigned enquiries | Sales Exec |
| PUT | `/api/staff/enquiries/[id]` | Update enquiry | Sales Exec |
| GET | `/api/staff/leads` | My leads | Sales Exec |
| GET | `/api/staff/bookings` | My bookings | Sales Exec |
| GET | `/api/staff/test-rides` | My test rides | Sales Exec |
| GET | `/api/staff/finance` | Finance applications (assigned) | All staff (read) |
| GET | `/api/staff/insurance` | Insurance applications | Insurance Staff |
| GET | `/api/staff/rto` | RTO applications | RTO Staff |
| GET | `/api/staff/service-requests` | Service requests assigned to me | All staff |
| PUT | `/api/staff/service-requests/[id]` | Update assigned service request | Assigned staff |
| GET | `/api/staff/tasks` | My tasks | All staff |
| PUT | `/api/staff/tasks/[id]` | Update task status | All staff |
| GET | `/api/staff/performance` | My performance | All staff |

> **Staff scope:** staff routes only expose records assigned to, or readable by, the signed-in user. Staff cannot escalate their own role or permission set.

---

## 7. Upload/Download Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/upload/document` | Upload customer/finance/insurance/RTO document | Auth + role |
| GET | `/api/download/document/[id]` | Download signed document URL | Auth + role |
| POST | `/api/upload/bike-image` | Upload bike image | Admin roles |

---

## 8. Webhook Endpoints

| Method | Endpoint | Description | Security |
|--------|----------|-------------|----------|
| POST | `/api/webhooks/payment` | Payment provider callback | Signature verification |
| POST | `/api/webhooks/messaging` | WhatsApp/SMS status callback | Signature verification |
| POST | `/api/webhooks/ai` | AI provider callback (if used) | Signature verification |

Webhook signatures verified server-side. Duplicate processing prevented via idempotency key.

---

## 9. Authorization Matrix (Summary)

| Endpoint Group | Super Admin | Owner | Manager | Sales Exec | Accountant | Insurance Staff | RTO Staff |
|----------------|-------------|-------|---------|------------|------------|-----------------|-----------|
| Dashboard overview | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Bikes (read) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Bikes (write/delete) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Stock inward/outward/adjustment | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Stock movements (read) | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Customers | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Enquiries/leads (write) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Test rides (write) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Bookings (write) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Sales (write) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Payments/Receipts | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Refunds (request) | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Refunds (approve) | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Invoices | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Finance (read) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Finance (write) | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Insurance (read) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Insurance (write) | ✓ | ✓ | ✗ | ✗ | ✗ | ✓ | ✗ |
| RTO (read) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| RTO (write) | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ |
| Service requests (read) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Service requests (create) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Service requests (update/assign/close) | ✓ | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ |
| Expenses | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Staff management | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Settings | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Reports | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |
| Blogs/Social/FAQ/Chatbot knowledge | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |

**Notes:**
- This matrix is canonical and matches the endpoint table above and AUTH_SECURITY.md §4.2. If business reality differs, update this matrix, the endpoint table, and AUTH_SECURITY.md together.
- Refund approval requires a user other than the requester.
- Accountant has read access to stock movements and finance for reconciliation but cannot mutate stock.
- Service-request creation is open to all staff; assignment/closure/status changes follow the update row and the assigned-staff rule.

---

## 10. Request/Response Examples

### 10.1 List bikes (public)
```
GET /api/public/bikes?status=available&page=1&pageSize=12
```
Response:
```json
{
  "data": [
    {
      "id": "uuid",
      "brand": "Hero",
      "model": "Splendor",
      "variant": "Drum",
      "colour": "Black",
      "exShowroomPrice": 7500000,
      "onRoadPrice": 8900000,
      "availabilityStatus": "available",
      "imageUrl": "/images/bike-1.jpg",
      "specifications": { "engineCC": 125, "mileage": "60 kmpl" }
    }
  ],
  "meta": { "page": 1, "pageSize": 12, "total": 45 }
}
```

### 10.2 Stock inward (admin)
```
POST /api/admin/stock/inward
Body: {
  "chassisNumber": "ME4JC654K98765432",
  "engineNumber": "JC65E98765432",
  "variantId": "uuid",
  "colourId": "uuid",
  "purchasePrice": 6500000,
  "purchaseInvoiceNumber": "INV-2025-001",
  "supplierName": "Hero Motors Pvt Ltd",
  "receivedDate": "2025-01-15T10:00:00Z"
}
```

### 10.3 Record payment allocated to a sale (admin)
```
POST /api/admin/payments
Body: {
  "customerId": "uuid",
  "saleId": "uuid",
  "amount": 2000000,
  "method": "upi",
  "referenceId": "UPI1234567890",
  "notes": "Balance payment"
}
```

### 10.4 Record a booking advance (admin)
```
POST /api/admin/payments
Body: {
  "customerId": "uuid",
  "bookingId": "uuid",
  "amount": 500000,
  "method": "upi",
  "referenceId": "UPI9876543210",
  "notes": "Booking advance"
}
```
Server creates a `payment` plus a `paymentAllocation` targeting the **booking**. On booking→sale conversion, the allocation is re-pointed/carried to the sale inside the same transaction; the advance is never counted twice.

### 10.5 Request and approve a refund (admin)
```
POST /api/admin/refunds
Body: {
  "paymentId": "uuid",
  "saleId": "uuid",
  "amount": 500000,
  "reason": "Booking cancelled before allocation"
}
```
```
PUT /api/admin/refunds/{id}
Body: { "action": "approve" }
```
Only an approver other than the requester may approve. Completing the refund does not edit the original payment.

### 10.6 Issue a GST invoice (admin)
```
POST /api/admin/invoices
Body: {
  "saleId": "uuid",
  "type": "tax_invoice",
  "gstRate": 2800,
  "placeOfSupply": "27",
  "hsnCode": "8711"
}
```
Response includes the server-computed split:
```json
{
  "data": {
    "invoiceNumber": "TBY/2026/0001",
    "subtotal": 7000000,
    "gstAmount": 1960000,
    "cgstAmount": 980000,
    "sgstAmount": 980000,
    "igstAmount": 0,
    "total": 8960000,
    "gstRate": 2800,
    "placeOfSupply": "27"
  }
}
```
> The rate, HSN code and split above are **illustrative only**; actual values require owner/tax-advisor approval.

### 10.7 Create a service request (admin/staff)
```
POST /api/admin/service-requests
Body: {
  "customerId": "uuid",
  "saleId": "uuid",
  "stockUnitId": "uuid",
  "requestType": "service",
  "description": "First free service request",
  "priority": "normal"
}
```

---

## 11. Validation Rules

- Chassis number: required, unique, max 50 chars
- Engine number: required, unique, max 50 chars
- Money fields: integer paise, non-negative
- Email: valid format when provided
- Phone: required for customers, 10-15 digits
- Date: ISO 8601 UTC
- File upload: max 10MB, types: image/jpeg, image/png, image/webp, application/pdf
- GST rate: integer **basis points**, 0–10000 (0.00%–100.00%); actual applicable rate is Pending Owner Approval
- Reservation: a unit may have at most one `active` reservation; creating a second returns `409 RESERVATION_CONFLICT`
- Payment allocation: exactly one of `saleId` or `bookingId`; allocation total must equal payment amount (no over-allocation)
- Refund: positive integer paise, must not exceed the unrefunded balance of the original payment; approver ≠ requester
- Invoice: `gstAmount = cgstAmount + sgstAmount + igstAmount`; issued invoices are immutable (void + reissue, never edit)

Server recalculates all financial values; client-supplied totals are ignored.

---

## 12. Idempotency & Concurrency

- Idempotency key header: `Idempotency-Key` for POST/PUT/PATCH
- Stock reservation uses `SELECT ... FOR UPDATE` row locking plus the partial unique active-reservation index
- Payment allocation within transaction; booking→sale conversion is atomic
- Refund state transitions are transactional and re-check the approved balance
- Webhook idempotency via processed event ID storage
- Invoice numbering is sequential inside a transaction; gaps are investigated, never hidden

---

## 13. Audit Events

Logged for: price changes, stock inward/adjustment/return, reservation create/release, booking cancellation, payment recording, payment allocation, refund request/approval/completion, invoice issuance/void, staff role changes, settings changes, customer document upload/access/download, service-request assignment/closure.

Fields: userId, action, entityType, entityId, oldValues, newValues, ipAddress, timestamp.

Audit `entityType` values include: `user`, `role`, `staff`, `customer`, `stockUnit`, `stockMovement`, `reservation`, `booking`, `sale`, `payment`, `paymentAllocation`, `refund`, `receipt`, `invoice`, `financeApplication`, `insuranceApplication`, `rtoApplication`, `serviceRequest`, `document`, `settings`.

---

## 14. Data Exposure Rules

**Never exposed publicly:**
- Internal purchase cost
- Customer identity documents
- Admin-only data
- Staff personal data beyond name/role
- Stack traces or error internals
- Retention/purge metadata

**Exposed publicly:**
- Bike catalogue, variants, prices (ex-showroom, on-road)
- FAQs, blogs, showroom contact, social links

**Document access:**
- Documents are served only through short-lived signed URLs after a server-side role check.
- `accessLevel` on `document` limits visibility by module.
- Soft-deleting a document does not make its storage object public; purge requires an approved procedure.
- Retention durations are Pending Owner Approval; until approved, documents are retained and no automated deletion runs.

---

**Verification:** API.md v1.1 is complete and consistent with PRD.md, DESIGN.md, ARCHITECTURE.md, and DATABASE.md v1.1. All endpoints map to defined entities and workflows. Response envelope, role rules, refund lifecycle, booking-advance allocation, GST basis points and document access are aligned with §9 and DATABASE.md. No new features invented. No dealership information, prices, GST details, or finance partners invented.

**Next:** Proceed to 06_AGENTS_PROMPT.md to generate AGENTS.md (then reconcile with API.md v1.1).