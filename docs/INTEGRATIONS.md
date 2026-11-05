# INTEGRATIONS.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Draft — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md, AGENTS.md, PLAN.md, SETUP.md, FEATURES.md, AUTH_SECURITY.md, MCP.md  
**Version:** 1.1  
**Source of Truth:** Yes — External integrations specification (provider-neutral)  
**Change history:** v1.1 — corrected manual-vs-gateway payment status flow; added payment allocation and refund lifecycle; noted document retention as an owner decision.

---

## 1. Integration Priority Matrix

| Integration | Business Purpose | MVP Priority | Provider Selected? |
|-------------|------------------|--------------|-------------------|
| Payment gateway (UPI/QR/card/bank) | Digital payment collection | Later (stub for MVP) | No — pending owner selection |
| WhatsApp Business messaging | Booking confirmations, receipts, updates | Later (stub for MVP) | No — pending owner selection |
| Email notifications | Transactional emails, receipts | MVP (in-app first) | No — pending selection |
| SMS notifications | OTP, updates, reminders | Later | No — pending selection |
| Object/file storage | Bike images, invoices, documents | MVP | Yes — S3-compatible (abstracted) |
| Maps/location embed | Showroom location display | MVP (link embed) | Google Maps link only (no API key needed for basic embed) |
| AI chatbot provider | Showroom assistant | MVP (stub provider) | No — pending selection |
| Analytics & error monitoring | Usage tracking, error reporting | Later | No — pending selection |

---

## 2. Payment Gateway Integration

### Purpose
Enable digital payment collection via UPI, QR code, cards, and bank transfer.

### Provider Selection Criteria (not yet selected)
- Supports Indian UPI and cards
- PCI-DSS compliance
- Webhook support with signature verification
- Sandbox environment for testing
- Reasonable transaction fees
- Settlement reports for reconciliation

**MVP Approach:** Use `PAYMENT_PROVIDER=stub` adapter. Payments recorded manually in admin; no live gateway. Integration added after owner approval.

### Data Exchanged
- Amount, currency (INR), payment reference, customer identifier
- Webhook: status, transaction ID, amount

### Credential Handling
- API keys stored server-side in `.env.local` (never client-side)
- Webhook secret used for signature verification

### API/Webhook Flow
1. Admin records a cash/UPI/bank payment → creates a `payment` record with status `completed` (manual, verified by staff).
2. (Future gateway) Payment intent created with provider → user redirected to UPI/card flow; record starts as `pending`.
3. Provider sends webhook → server verifies signature → updates payment status to `completed`.
4. Receipt generated on success; a `paymentAllocation` targets the sale **or** booking per API.md §10.4.
5. Refunds are requested against the original payment and follow `pending → approved → completed` (or `rejected`); the original payment is never edited or deleted.

### Idempotency & Retry
- `Idempotency-Key` header on payment creation.
- Webhook event IDs stored to prevent duplicate processing.
- Retry with exponential backoff for transient failures.

### Fallback
- If gateway unavailable: manual payment recording still works. No fake success.
- Reconciliation job matches provider settlement reports to internal records.

### Financial Safeguard
- Payment status verified server-side from provider callbacks **or** trusted reconciliation — **never** from browser redirect alone.
- Never store card CVV or raw card credentials.

---

## 3. WhatsApp Business Messaging

### Purpose
Send booking confirmations, payment receipts, and status updates.

### Provider Selection Criteria
- WhatsApp Business API access
- Template message approval
- Sandbox/testing environment
- Webhook for delivery status

**MVP Approach:** `MESSAGING_PROVIDER=stub` adapter. Notifications recorded in DB; no live messages. Real integration post-launch.

### Data Exchanged
- Customer phone (E.164), template name, template variables (name, bike, amount)

### Consent Basis
- Customer consent required for WhatsApp messaging; captured on enquiry/booking form.
- Verify compliance with WhatsApp Business policy and TRAI regulations.

### Fallback
- In-app and email notifications remain functional even if WhatsApp unavailable.

---

## 4. Email & SMS Notifications

### Purpose
Transactional emails (receipts, invoices) and SMS (OTP, reminders).

### Provider Selection Criteria
- Reliable deliverability in India
- Template support
- Webhook delivery status

**MVP Approach:** In-app notifications functional. Email/SMS adapters stubbed; provider added later.

### Data Exchanged
- Recipient email/phone, subject, body, attachments (PDF receipts)

### Fallback
- In-app notifications are primary; email/SMS supplementary.

---

## 5. Object/File Storage

### Purpose
Store bike images, customer documents, invoices, and branding assets.

### Provider
- **Development:** Local filesystem or MinIO (S3-compatible)
- **Production:** AWS S3 or Cloudflare R2 (S3-compatible)
- **Abstraction:** `src/lib/storage.ts` interface

### Data Exchanged
- Binary data (images, PDFs), storage keys, signed URL expiry

### Security
- Private bucket; no public read
- Signed URLs, time-limited (e.g., 15 minutes)
- File type/size validation server-side
- Customer documents access-restricted by role and `document.accessLevel`
- Retention durations are **Pending Owner Approval**; no automated purge in MVP. Soft-deleting a document row does not delete the stored object until an approved purge procedure runs.

---

## 6. Maps/Location Embed

### Purpose
Display showroom location on contact page and footer.

**MVP Approach:** Static map embed via Google Maps `iframe` with a public place link (no API key required for basic embed). Or link to Google Maps directions.

### Data Exchanged
- Address string only; no customer data.

---

## 7. AI Chatbot Provider

### Purpose
Dealership-grounded assistant for bike info, variants, pricing, EMI estimates, finance/insurance FAQs, enquiry collection.

### Provider Selection Criteria
- Supports retrieval over dealership knowledge sources
- Reasonable cost and rate limits
- API available
- Data privacy terms acceptable

**MVP Approach:** `AI_PROVIDER=stub` adapter with rule-based responses from dealership data (no external LLM call). Real provider integrated post-launch.

### Data Exchanged
- User message, dealership knowledge chunks (catalogue, FAQs, pricing)
- **No** customer identity documents or payment data sent to provider

### Safeguards
- Chatbot answers must use approved current catalogue, pricing, and FAQ data.
- Never invent availability, discounts, lender approval, or policy coverage.
- Provide human handoff for uncertain or sensitive questions.
- EMI labeled as estimate with assumptions disclosed.

---

## 8. Analytics & Error Monitoring

### Purpose
Usage analytics, error tracking, performance monitoring.

**MVP Approach:** Platform-provided uptime monitoring; structured logs. Optional Sentry/Sentry-like integration later.

### Data Exchanged
- Anonymized usage events; error stack traces (no personal data)

### Privacy
- No customer identity data sent to analytics.
- Consent banner for analytics cookies (if added).

---

## 9. Provider-Neutral Adapter Pattern

All integrations use a common interface pattern:

```ts
interface IntegrationAdapter {
  send(payload: unknown): Promise<IntegrationResult>
  verifyWebhook(signature: string, body: Buffer): boolean
  healthCheck(): Promise<boolean>
}
```

This allows swapping providers (payment, messaging, AI, storage) without changing application code.

---

## 10. Sequence Diagram (Payment Flow)

```mermaid
sequenceDiagram
    participant Admin
    participant App
    participant Provider
    participant DB

    Admin->>App: Record payment (amount, method)
    App->>DB: Create payment (manual → completed; gateway → pending)
    App->>DB: Create paymentAllocation (sale or booking)
    App->>Provider: Create payment intent (future gateway only)
    Provider-->>App: Payment ID
    Admin->>Provider: Complete payment (UPI/card)
    Provider->>App: Webhook (status: completed)
    App->>App: Verify signature
    App->>DB: Update payment status → completed
    App->>DB: Create receipt
    App-->>Admin: Payment confirmed
```

---

## 11. Launch Checklist

- [ ] Owner selects payment gateway provider
- [ ] Owner selects WhatsApp/SMS provider
- [ ] Owner selects AI provider
- [ ] Sandbox credentials configured for each integration
- [ ] Webhook signature verification tested
- [ ] Idempotency tested (duplicate webhook rejected)
- [ ] Fallback paths tested (provider unavailable → manual flow works)
- [ ] Data privacy review completed for each integration
- [ ] Provider terms accepted by owner
- [ ] Production credentials rotated and stored securely

---

## 12. Outage & Manual Fallback

| Integration | Outage Fallback |
|-------------|-----------------|
| Payment gateway | Manual payment recording (cash/UPI reference) continues |
| WhatsApp/SMS | In-app notifications continue |
| Email | In-app notifications continue |
| File storage | Document upload temporarily blocked; queue retries |
| AI chatbot | Static FAQ page and contact form available |

---

**Verification:** INTEGRATIONS.md v1.1 is complete and consistent with all previous documents. No provider is claimed to be selected until owner approval. Payment status verified server-side only. No card CVV stored. EMI labeled as estimate. Retention is an owner decision. No dealership information, prices, GST details, or finance partners invented.

**Next:** Proceed to 14_TESTING_PROMPT.md to generate TESTING.md.
---

## Addendum v1.2 — Motorcycle Data Provider Integration

The platform integrates authorised motorcycle-information providers through the
`MotorcycleDataProvider` interface (`src/services/bike-provider/`). See
`docs/BIKE_DATA_INTEGRATION.md`.

- Providers registered: `bikewale` (official — **awaiting authorised credentials**) and
  `mock` (development/test fixture, disabled unless `BIKE_PROVIDER_MOCK_ENABLED=true`).
- No endpoint is hard-coded and no scraping is performed. The BikeWale adapter refuses to run
  until `BIKEWALE_API_BASE_URL`, `BIKEWALE_API_KEY` and `BIKEWALE_API_CATALOG_PATH` are supplied
  from an official agreement.
- Provider DTOs contain no pricing fields; synchronisation can never create or alter prices.
- Credentials are read from environment variables only and are never stored in the database.
- Every provider HTTP request is logged (`BikeProviderRequest`) and rate limited.
