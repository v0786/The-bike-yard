# PRD.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Location:** Khopat, Thane, Maharashtra, India  
**Status:** Draft — Pending Dealership Owner Review  
**Version:** 1.1  
**Source of Truth:** Yes — This is the first document in the source-of-truth chain.  
**Next Document:** DESIGN.md (Prompt 02)  
**Change history:** v1.1 — clarified bike/booking/finance/insurance/RTO state transitions; removed out-of-scope loan-repayment state; added refunds and service requests to the MVP feature list; noted coarse-vs-delivery phase mapping.

---

## 1. Business Problem

The Bike Yard is a motorcycle dealership in Khopat, Thane, Maharashtra, India. Currently, dealership operations — bike inventory, sales, customer enquiries, finance, insurance, RTO registration, payments, invoicing, and staff management — are managed through disconnected manual or semi-digital processes. Customers browsing bikes have no dedicated digital showroom to explore models, pricing, finance options, or book test rides online.

There is no single source of truth for stock availability, no automated tracking of individual motorcycle units by chassis and engine number, no centralised customer relationship management, and no digital billing with GST-compliant invoices. This leads to:

- Stock discrepancies and duplicate sales of the same physical unit
- Manual reconciliation of payments and invoices
- No visibility into pending finance, insurance, or RTO applications
- Poor customer experience — no online catalogue, EMI calculator, or enquiry tracking
- No audit trail for price changes, stock movements, or customer records

The product is a single integrated web application with three interfaces: a public customer-facing showroom website, a private admin ERP dashboard, and a staff portal.

---

## 2. Goals & Objectives

| Goal | Objective |
|------|-----------|
| Unified digital showroom | Customers can explore bikes, view pricing, calculate EMI, enquire, and book test rides online |
| Inventory integrity | Every physical motorcycle is tracked by unique chassis number and engine number; stock updates automatically on inward/outward |
| Sales & CRM | Manage customers, enquiries, bookings, sales, and deliveries from first contact to delivery |
| Finance, insurance & RTO | Digital workflows for loan applications, insurance policies, and registration cases with document uploads and status tracking |
| Billing & payments | GST-configurable invoicing, multiple payment methods (cash, UPI, QR, bank transfer, card, finance/loan, partial), receipts, and daily closing |
| Staff & role management | Role-based access control (RBAC) with activity logging for all staff actions |
| Reporting & analytics | Sales trends, revenue, best-selling variants, stock ageing, salesperson performance, payment collection |
| Content management | Blogs, FAQs, offers, social media links, and appearance settings managed from admin |
| AI chatbot | Dealership-grounded assistant for bike info, variants, pricing, EMI estimates, finance FAQs, insurance, and enquiry collection |

---

## 3. Non-Goals

The following are explicitly out of scope for the initial build:

- **Multi-dealership SaaS** — The application is built exclusively for The Bike Yard initially. Multi-tenancy architecture may be designed for future readiness but is not an active requirement.
- **Customer login and tracking portal** — Customers browse publicly; no customer authentication or order-tracking login is included in MVP.
- **Real payment processing integration** — Payment methods are recorded and tracked; actual payment gateway integration is a later enhancement pending provider selection.
- **Real WhatsApp/SMS integration** — Messaging templates and triggers are defined; actual provider integration is a later enhancement.
- **Mobile native apps** — Web application only (responsive design for mobile browsers).
- **Used bike trade-in valuation** — Catalogue and stock cover new motorcycles; used bike workflows are not specified.
- **Parts and service workshop management** — Service requests are captured; full workshop job-card and parts inventory is out of scope.

---

## 4. Personas

| Persona | Role | Primary Needs |
|---------|------|---------------|
| Walk-in Customer | Visits showroom | Browse bikes, compare variants, get pricing, book test ride, enquire about finance/insurance |
| Online Customer | Visits website | Explore catalogue, calculate EMI, submit enquiry, book test ride, contact showroom |
| Sales Executive | Staff | Manage enquiries, leads, bookings, test rides, and sales; follow up with customers |
| Accountant | Staff | Record payments, generate invoices, track outstanding amounts, daily closing |
| Insurance Staff | Staff | Process insurance applications, track policies, manage documents |
| RTO Staff | Staff | Process registration applications, track registration numbers, manage customer documents |
| Manager | Staff | Overview dashboard, stock inward/outward approval, reports, staff management |
| Owner | Business | Business reports, revenue, profit, settings, overall control |
| Super Admin | System | Complete application access, user management, system configuration |

---

## 5. User Journeys

### 5.1 Customer — Browse and Enquire
1. Customer visits public website, views hero banner and featured motorcycles
2. Customer filters bike catalogue by brand, model, variant, colour, price
3. Customer views bike detail page with image gallery, specifications, pricing breakdown, EMI calculator
4. Customer submits enquiry or books a test ride
5. Staff receives enquiry/lead in admin/staff portal and follows up

### 5.2 Customer — Purchase Path
1. Customer enquires about a specific bike
2. Sales Executive creates a lead and booking; bike is reserved by chassis number
3. Customer pays advance; booking receipt is issued
4. Finance/insurance/RTO applications are initiated (optional)
5. Final payment is collected; sales invoice (GST-compliant) is generated
6. Bike is marked as sold (stock outward); delivery is scheduled

### 5.3 Staff — Stock Inward
1. New bike arrives from supplier
2. Staff records purchase entry: supplier, invoice number, chassis number, engine number, model/variant, colour, purchase price, received date
3. System validates chassis/engine number uniqueness
4. Bike unit is added to available stock

### 5.4 Staff — Stock Outward (Sale)
1. Sales Executive selects an available bike unit (by chassis number) for a confirmed sale
2. System verifies bike is not already reserved or sold
3. Customer details, payment info, insurance details, registration details, and delivery date are recorded
4. Bike unit status changes to "sold"; stock decrements automatically
5. Sales invoice is generated; payment is allocated

### 5.5 Admin — Dashboard Review
1. Owner/Manager logs into admin dashboard
2. Views overview cards: today's sales, revenue, available stock, bookings, inward/outward, pending payments, finance applications, insurance, RTO registrations
3. Views charts: daily/weekly/monthly sales, revenue trends, best-selling variants, stock ageing

---

## 6. Functional Requirements

### 6.1 Public Website

| ID | Requirement |
|----|-------------|
| PUB-01 | Homepage with premium hero banner, featured motorcycles, latest arrivals, popular bikes, special offers, finance options, insurance/RTO assistance, testimonials, blogs, showroom location/contact |
| PUB-02 | Bike listing page with product cards: photograph, manufacturer, model/variant, ex-showroom price, on-road price, available colours, specifications, View Details, Enquire Now, Book Test Ride |
| PUB-03 | Bike detail page with image gallery, specifications, technical details, pricing breakdown, EMI calculator, finance information, insurance details, FAQs, enquiry form, WhatsApp contact |
| PUB-04 | Finance & Loan information page (informational; applications handled via staff) |
| PUB-05 | Insurance information page |
| PUB-06 | Registration (RTO) information page |
| PUB-07 | Services page |
| PUB-08 | Blogs & News listing and detail pages |
| PUB-09 | About Us, Contact Us, FAQ, Privacy Policy, Terms pages |
| PUB-10 | AI chatbot widget accessible from public pages |
| PUB-11 | Enquiry form submission (no customer login required) |
| PUB-12 | Test ride booking form submission |
| PUB-13 | Responsive design for mobile, tablet, desktop |

### 6.2 Admin Dashboard

| ID | Requirement |
|----|-------------|
| ADM-01 | Overview dashboard with 10 cards: today's sales, total revenue, available stock, bookings, stock inward, stock outward, pending payments, finance applications, insurance, RTO registration |
| ADM-02 | Analytics charts: daily/weekly/monthly sales, revenue trends, best-selling variants, stock ageing, salesperson performance, payment collection, profit and expense reports |
| ADM-03 | Bike catalogue management: create/read/update/delete brands, models, variants, colours, specifications, price lists, images, availability status |
| ADM-04 | Pricing management: ex-showroom, on-road, insurance, RTO charges, accessories, discount, final selling price |
| ADM-05 | Stock inward: purchase entry, supplier details, invoice number, chassis number, engine number, model/variant, colour, purchase price, received date, stock status |
| ADM-06 | Stock outward: customer details, bike details, chassis number, engine number, sales invoice, payment info, insurance details, registration details, delivery date |
| ADM-07 | Stock management: view all units, filter by status (available/reserved/sold), search by chassis/engine number |
| ADM-08 | Customer management: create/read/update/delete customer records, view enquiry and purchase history |
| ADM-09 | Booking management: create bookings, track status, assign sales executive |
| ADM-10 | Sales management: record sales, generate invoices, track deliveries |
| ADM-11 | Finance management: loan applications, bank/NBFC selection, down payment, EMI, application status |
| ADM-12 | Insurance management: provider, policy type, premium, expiry, documents |
| ADM-13 | RTO/Registration: registration form, customer documents, application status, registration number |
| ADM-14 | Payments: record payments by method (cash, UPI, QR, bank transfer, card, finance/loan, partial), track outstanding |
| ADM-15 | Bills & Invoices: booking receipt, advance payment receipt, sales invoice, tax invoice, payment receipt, refund receipt, outstanding statement |
| ADM-16 | Staff management: create staff, assign roles, RBAC permissions |
| ADM-17 | Daily tasks: assign and track staff tasks |
| ADM-18 | Reports & analytics: export sales, stock, payment reports |
| ADM-19 | Blogs management: create/publish blog posts and news |
| ADM-20 | Social media: Instagram, Facebook, YouTube links, banners, posts, campaigns |
| ADM-21 | FAQ management: create/update FAQs |
| ADM-22 | Requirements: track customer/supplier requirements |
| ADM-23 | Settings: theme, colours, fonts, branding, layout, currency, date format, notifications, language, invoice settings, business details |

### 6.3 Staff Portal

| ID | Requirement |
|----|-------------|
| STF-01 | My Dashboard: assigned leads, bookings, tasks, performance metrics |
| STF-02 | Customer Enquiries: view and respond to assigned enquiries |
| STF-03 | Sales Leads: manage lead pipeline and activities |
| STF-04 | Bookings: view and update assigned bookings |
| STF-05 | Insurance Forms: process insurance applications (Insurance Staff role) |
| STF-06 | Registration Forms: process RTO applications (RTO Staff role) |
| STF-07 | Finance Applications: process loan applications (Finance role) |
| STF-08 | Service Requests: view and update service requests |
| STF-09 | Daily Tasks: view assigned tasks, mark complete |
| STF-10 | My Performance: personal sales and activity metrics |

### 6.4 AI Chatbot

| ID | Requirement |
|----|-------------|
| CHAT-01 | Answer bike-related questions using dealership-managed catalogue data |
| CHAT-02 | Explain bike variants and differences |
| CHAT-03 | Compare two motorcycles |
| CHAT-04 | Explain pricing (ex-showroom, on-road, breakup) |
| CHAT-05 | Calculate estimated EMI based on dealership-provided rates |
| CHAT-06 | Answer finance FAQs |
| CHAT-07 | Explain insurance coverage types |
| CHAT-08 | Collect customer enquiries (name, phone, bike interest) |
| CHAT-09 | Share showroom contact details and location |
| CHAT-10 | Direct customers to correct application or page |
| CHAT-11 | Never invent prices, offers, stock availability, lender approval, or policy coverage |

---

## 7. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| Performance | Public pages load under 3 seconds on 4G; dashboard loads under 2 seconds |
| Security | Server-side authorization enforcement; no client-side trust of prices/permissions/stock; audit logs for financial and privileged actions |
| Data Integrity | Chassis number and engine number uniqueness enforced at database level; stock updates in transactions; immutable price/tax snapshots on invoices |
| Money Handling | All monetary values stored as integer paise or fixed-precision decimal; no floating-point arithmetic for money |
| Timezones | Timestamps stored in UTC; displayed in Asia/Kolkata |
| Currency | INR (Indian Rupee) |
| Accessibility | WCAG 2.1 AA compliance; keyboard navigation; colour contrast; screen reader labels; reduced motion support |
| Responsive | Mobile, tablet, desktop breakpoints |
| Reliability | Database transactions for stock reservation, sale completion, payment allocation |
| Maintainability | Modular monolith; shared business logic across public site, admin, staff portal |
| Auditability | Activity log tracking who changed prices, stock, payments, customer records |

---

## 8. Acceptance Criteria

### 8.1 Public Website
- [ ] Homepage hero section renders with correct heading, subheading, CTAs, and showroom location
- [ ] Bike listing displays at least one bike card with photograph, manufacturer, model/variant, prices, colours, specifications
- [ ] Bike detail page loads with image gallery, specifications, pricing breakdown, EMI calculator, enquiry form, WhatsApp contact
- [ ] Enquiry form submission creates a lead record in the system
- [ ] Test ride booking form submission creates a booking record
- [ ] AI chatbot responds using dealership-managed data only

### 8.2 Admin Dashboard
- [ ] Overview dashboard shows all 10 cards with accurate counts
- [ ] Analytics charts render with sample/realtime data
- [ ] Bike can be added to catalogue with all required fields
- [ ] Stock inward record creates an available stock unit with unique chassis number
- [ ] Stock outward record decrements stock and marks unit as sold
- [ ] Duplicate chassis number entry is rejected
- [ ] GST invoice is generated with correct tax breakdown
- [ ] Staff role permissions restrict access appropriately
- [ ] Activity log records administrative actions

### 8.3 Staff Portal
- [ ] Staff sees only assigned leads, bookings, and tasks
- [ ] Staff can update task status and lead activity
- [ ] Role-restricted screens (insurance, RTO, finance) are hidden from unauthorised staff

### 8.4 Data Integrity
- [ ] No two physical bikes share the same chassis number
- [ ] No two physical bikes share the same engine number (where applicable)
- [ ] Stock count cannot go negative
- [ ] A sold bike cannot be reserved again

### 8.5 Payments & Billing
- [ ] Payment methods: cash, UPI, QR, bank transfer, card, finance/loan, partial payment
- [ ] Invoice numbering follows configured prefix and sequence
- [ ] GST configuration is applied to tax invoices
- [ ] Daily closing report reconciles collections by payment method

---

## 9. Edge Cases

| Edge Case | Expected Behaviour |
|-----------|-------------------|
| Duplicate chassis number on stock inward | Rejected at database level; error shown to staff |
| Bike sold while reserved | System prevents sale; shows reservation conflict |
| Payment recorded but bike already sold | Payment allocated to existing sale; no duplicate stock outward |
| Failed/cancelled booking | Reservation released; bike returns to available stock |
| EMI calculator with missing interest rate | Shows estimate with disclaimer; uses default configurable rate |
| Chatbot asked about unlisted bike price | Responds that price is not available; directs to enquire |
| Staff deactivated mid-session | Session invalidated on next request; access removed |
| Document upload exceeds size limit | Rejected with clear error message |
| Network failure during payment recording | Transaction rolled back; no partial state |
| GST rate change after invoice issued | Existing invoice retains immutable tax snapshot |

---

## 10. Dependencies

| Dependency | Purpose | Status |
|------------|---------|--------|
| PostgreSQL database | Primary data store | To be provisioned |
| S3-compatible storage | Bike images, customer documents, invoices | To be provisioned |
| Authentication provider | Staff login and sessions | Auth.js (planned) |
| Payment gateway | UPI, card, bank transfer processing | TBD — provider not selected |
| WhatsApp Business API | Booking confirmations, receipts, updates | TBD — provider not selected |
| SMS/Email provider | Notifications | TBD — provider not selected |
| AI provider | Chatbot responses | TBD — pluggable provider |
| PDF library | Invoice and receipt generation | To be selected |
| Charts library | Dashboard analytics | Recharts (planned) |
| Domain & SSL | Public website hosting | To be provisioned |
| Vercel or similar | Deployment | Planned |

---

## 11. Launch Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| GST/tax compliance not verified | Legal/financial exposure | Professional tax review before production invoice generation |
| Payment provider not selected | Delayed digital payments | Record payments manually; integrate gateway later |
| Chassis/engine number duplicates in source data | Stock integrity issues | Validate and clean source data before migration |
| Staff training gap | Low adoption | Role-based training and supervised rollout |
| No real-time inventory sync with supplier | Stock discrepancies | Manual inward entry with supplier invoice verification |
| AI chatbot hallucinates prices/stock | Customer misinformation | Ground responses in dealership data; human handoff for uncertainty |
| Document storage security | Privacy breach | Restrict access to customer/finance documents; server-side only |

---

## 12. MVP vs Later Enhancements

### MVP (Phase 1–6 coarse product phases; see PLAN.md for delivery-phase mapping)
- Public website: homepage, bike listing, bike detail, enquiry, test ride booking, contact, about, FAQ, blogs
- Admin dashboard: overview, bike catalogue, pricing, stock inward/outward, stock management, customers, bookings (with advances), sales, payments, refunds, invoices, service requests, staff management, settings
- Staff portal: my dashboard, customer enquiries, sales leads, bookings, test rides, service requests, daily tasks
- Finance, insurance, RTO: application intake and status tracking (staff-managed)
- AI chatbot: basic dealership-grounded responses
- RBAC, activity log, GST invoice generation
- India-specific: INR, Asia/Kolkata, UPI payment method, GST-configurable invoices

### Later Enhancements (Phase 7–12+)
- Customer login and order tracking
- Real payment gateway integration (UPI, card, bank transfer)
- Real WhatsApp/SMS/Email notifications
- Used bike trade-in workflow
- Workshop/service job cards and parts inventory
- Multi-dealership (tenant) architecture
- Mobile native apps
- Advanced reporting exports
- Stock alerts and follow-up reminders automation
- Daily closing automation

---

## 13. Workflows & State Transitions

### 13.1 Bike Unit Lifecycle
```
Available → Reserved (booking) → Sold (outward) → Delivered (handover)
Available → Sold (direct sale) → Delivered
Reserved → Available (cancelled/expired booking)
```

### 13.2 Booking Lifecycle
```
Pending → Confirmed (advance recorded) → Delivered (converted to sale and handed over)
Pending / Confirmed → Cancelled (reservation released; advance refund path applies)
```

### 13.3 Finance Application Lifecycle
```
Submitted → Under Review → Approved → Disbursed
Submitted / Under Review → Rejected
```
> Loan repayment tracking is out of scope; the lifecycle ends at disbursed.

### 13.4 Insurance Application Lifecycle
```
Submitted → Quoted → Bound (policy issued) → Expired
Submitted / Quoted / Bound → Cancelled
```

### 13.5 RTO Registration Lifecycle
```
Submitted → Under Processing → Registration Number Assigned → Delivered
Submitted / Under Processing → Rejected
```

---

## 14. India-Specific Considerations

| Consideration | Requirement |
|---------------|-------------|
| Currency | INR; all prices in Indian Rupees |
| Timezone | Asia/Kolkata for display; UTC for storage |
| GST | Configurable GSTIN, GST rates, HSN/SAC codes; tax invoice generation |
| Payment methods | UPI, QR, cash, bank transfer, card, finance/loan, partial payment |
| Location context | Khopat, Thane, Maharashtra; RTO jurisdiction handled accordingly |
| Chassis/Engine number | Mandatory unique identifiers for every physical motorcycle |
| Professional verification | Tax/legal/GST details must be verified by qualified professionals before production |
| No fake data | No invented prices, brands, GSTIN, phone numbers, or finance partners |

---

## 15. Measurable Success Metrics

| Metric | Target |
|--------|--------|
| Bikes listed online | 100% of available stock |
| Stock accuracy (system vs physical) | 100% reconciliation weekly |
| Enquiry-to-lead conversion | Measured post-launch |
| Invoice generation time | Under 2 minutes per sale |
| Daily closing reconciliation | Completed same day |
| Staff onboarding time | Under 1 hour per role |
| Chatbot response accuracy | Based on dealership data only; no hallucinated prices |

---

## 16. Open Questions

1. **Dealership type:** Multi-brand, single-brand, or used+new? (Affects catalogue structure)
2. **Payment gateway:** Which provider for UPI/card/bank transfer? (Pending owner selection)
3. **WhatsApp Business:** Is API access available? (Pending provider selection)
4. **GSTIN and GST rates:** What GSTIN and applicable rates should be configured? (Pending owner/tax advisor input)
5. **Finance partners:** Which banks/NBFCs for loan applications? (Pending owner selection)
6. **Insurance providers:** Which insurance companies to integrate? (Pending owner selection)
7. **Document storage:** Local storage or S3-compatible? (Pending infrastructure decision)
8. **Chatbot provider:** Which AI provider for the showroom assistant? (Pending selection)
9. **Customer login:** Will customers need accounts for order tracking in v1? (Currently non-goal)
10. **Pricing data:** Who will input and verify bike prices before launch? (Pending owner assignment)

---

## 17. Decisions Required from Dealership Owner

1. Confirm dealership type: Multi-brand / Single-brand / Used & New
2. Confirm access model: Public website + private admin + staff portal (recommended)
3. Confirm business model: Exclusive for The Bike Yard initially, multi-dealership-ready architecture (recommended)
4. Provide business details: address, contact, GSTIN for invoice settings
5. Approve payment methods to enable at launch
6. Select finance, insurance, and RTO partners/providers
7. Approve GST configuration and invoice numbering prefix
8. Assign staff member responsible for inputting and verifying bike catalogue data
9. Approve chatbot scope and knowledge sources
10. Confirm whether the Manager role may record payments, issue invoices, and approve refunds (current draft grants these; refunds still require a second user)
11. Approve refund approval policy (who may approve, amount thresholds) and document retention durations
12. Review and sign off on this PRD before design/implementation work proceeds

---

**Verification:** PRD.md is complete and consistent with the requirements in 01_PRD_PROMPT.md. No dealership information, prices, GST details, or finance partners have been invented. All TBD items are marked as open questions or owner decisions.

**Next:** Proceed to 02_DESIGN_PROMPT.md to generate DESIGN.md.