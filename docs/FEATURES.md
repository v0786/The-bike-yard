# FEATURES.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Draft — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md, AGENTS.md, PLAN.md, SETUP.md  
**Version:** 1.1  
**Source of Truth:** Yes — Implementation guide, not a new PRD. Open product decisions listed at end.  
**Change history:** v1.1 — removed duplicate F-CMS-03; clarified F-PUB-06 vs F-CAT-06 EMI scopes; corrected test-ride workflow (no stock reservation); added service-request, stock-movement and refund/advance-allocation features; added chatbot and service requests to the MVP list; aligned roles with API.md §9.

---

## 1. Public Website Features

| Feature ID | Purpose | User Roles | State Transitions |
|------------|---------|------------|-------------------|
| F-PUB-01 | Homepage with hero section | All visitors | N/A |
| F-PUB-02 | Featured motorcycles carousel | All visitors | N/A |
| F-PUB-03 | Latest arrivals grid | All visitors | N/A |
| F-PUB-04 | Popular bikes list | All visitors | N/A |
| F-PUB-05 | Special offers (CMS-driven) | All visitors | Content updates via admin |
| F-PUB-06 | EMI calculator (site-wide, finance page) | All visitors | Computes estimate; labeled as estimate |
| F-PUB-07 | Finance information | All visitors | N/A |
| F-PUB-08 | Insurance information | All visitors | N/A |
| F-PUB-09 | Registration/RTO information | All visitors | N/A |
| F-PUB-10 | Services page | All visitors | N/A |
| F-PUB-11 | Blogs & news listing | All visitors | Blog posts published via admin |
| F-PUB-12 | About us page | All visitors | N/A |
| F-PUB-13 | Contact us page | All visitors | Enquiry form → lead created |
| F-PUB-14 | FAQ page | All visitors | FAQs managed via admin |
| F-PUB-15 | Privacy policy | All visitors | Static content |
| F-PUB-16 | Terms and conditions | All visitors | Static content |
| F-PUB-17 | AI chatbot widget (stub provider in MVP) | All visitors | Responses grounded in dealership data |
| F-PUB-18 | Instagram/Facebook links | All visitors | Social links from admin settings |
| F-PUB-19 | Showroom location/contact | All visitors | Static + map embed |
| F-PUB-20 | Test ride booking | All visitors | Request → lead + test ride; **no stock reservation** |

> **F-PUB-06 vs F-CAT-06:** both are EMI calculators, but F-PUB-06 is the standalone finance-page calculator with editable loan assumptions, while F-CAT-06 is the bike-detail calculator prefilled from that variant's price. They share one calculation utility; they are not duplicate features.

---

## 2. Bike Catalogue Features

| Feature ID | Purpose | User Roles | State Transitions |
|------------|---------|------------|-------------------|
| F-CAT-01 | Brand, model, variant, colour catalogue | All visitors (read); Admin (CRUD) | Variants/colours added/updated |
| F-CAT-02 | Filter by brand, model, variant, colour, price, availability | All visitors | Filters narrow results |
| F-CAT-03 | Bike detail page with image gallery | All visitors | Image gallery opens on thumbnail click |
| F-CAT-04 | Specifications table | All visitors | Two-column spec display |
| F-CAT-05 | Pricing breakdown (ex-showroom, insurance, RTO, accessories, discount, final) | All visitors | Snapshot from admin price list |
| F-CAT-06 | EMI calculator | All visitors | Computes estimate with disclaimer |
| F-CAT-07 | Available colours swatches | All visitors | Clickable; updates main image |
| F-CAT-08 | Stock availability status | All visitors | Available/Reserved/Sold chip |

---

## 3. CRM & Sales Features

| Feature ID | Purpose | User Roles | State Transitions |
|------------|---------|------------|-------------------|
| F-CRM-01 | Customer creation and history | All staff | Customer created; linked to enquiries/sales |
| F-CRM-02 | Lead management from enquiries | Sales Executive | Enquiry → lead → assigned → qualified/lost/converted |
| F-CRM-03 | Follow-up activities | Sales Executive | Lead activity logged; next follow-up dated |
| F-CRM-04 | Test ride scheduling | Sales Executive | Test ride booked → scheduled/completed/cancelled |
| F-CRM-05 | Booking creation and reservation | Sales Executive | Booking → unit reserved → confirmed/cancelled |
| F-CRM-06 | Sales pipeline (pending → confirmed → delivered) | Sales Executive, Manager | Booking → sale → delivery |
| F-CRM-07 | Delivery tracking | All staff | Sale marked delivered; date set |

---

## 4. Inventory & Stock Features

| Feature ID | Purpose | User Roles | State Transitions |
|------------|---------|------------|-------------------|
| F-STK-01 | Stock inward (bike receipt) | Manager, Super Admin, Owner | Purchase entry → unit available |
| F-STK-02 | Stock management (list, filter, search) | Manager, Super Admin, Owner | Units listed by status/colour/chassis |
| F-STK-03 | Stock reservation (booking) | Sales Executive | Unit reserved → released on cancellation/expiry |
| F-STK-04 | Stock outward (sale) | Manager, Super Admin, Owner | Unit sold → status changed |
| F-STK-05 | Stock movement history per unit | Manager, Super Admin, Owner, Accountant (read) | inward/reservation/release/sale/return/adjustment/delivery |
| F-STK-06 | Stock adjustment & return | Manager, Super Admin, Owner | Adjustment recorded with reason; unit status reconciled |
| F-STK-07 | Reservation history | Manager, Super Admin, Owner | Prior reservations retained; only one active per unit |

---

## 5. Payment & Billing Features

| Feature ID | Purpose | User Roles | State Transitions |
|------------|---------|------------|-------------------|
| F-PAY-01 | Payment recording (cash, UPI, QR, bank, card, finance, partial) | Accountant, Manager, Super Admin, Owner | Payment recorded; allocated to sale or booking |
| F-PAY-02 | Booking receipt generation | Accountant, Manager, Super Admin, Owner | Receipt issued on advance payment |
| F-PAY-03 | Advance payment receipt | Accountant, Manager, Super Admin, Owner | Receipt for advance amount |
| F-PAY-04 | Sales invoice (GST-compliant, CGST/SGST/IGST split) | Accountant, Manager, Super Admin, Owner | Invoice with immutable tax snapshot |
| F-PAY-05 | Payment receipt | Accountant, Manager, Super Admin, Owner | Receipt for partial/full payment |
| F-PAY-06 | Refund request, approval and receipt | Request: Accountant, Manager, Super Admin, Owner; Approve: Manager, Super Admin, Owner (not requester) | pending → approved → completed / rejected |
| F-PAY-07 | Outstanding payment statement | Accountant, Manager, Super Admin, Owner | Per-customer/sale unpaid balance |
| F-PAY-08 | Daily closing reconciliation | Accountant, Manager, Super Admin, Owner | End-of-day collections by method |
| F-PAY-09 | Booking advance allocation and carry-forward | Accountant, Manager, Super Admin, Owner | Advance allocated to booking → carried to sale on conversion |

---

## 6. Finance, Insurance & RTO Features

| Feature ID | Purpose | User Roles | State Transitions |
|------------|---------|------------|-------------------|
| F-FIN-01 | Finance application (loan enquiry) | Sales Exec, Manager, Super Admin, Owner (read: all staff) | Submitted → under review → approved/rejected → disbursed |
| F-FIN-02 | Down payment, EMI, tenure tracking | Sales Exec, Manager, Super Admin, Owner (read: all staff) | Application includes rates; estimate labeled |
| F-FIN-03 | Insurance application | Insurance Staff, Super Admin, Owner (read: all staff) | Submitted → quoted → bound/expired/cancelled |
| F-FIN-04 | RTO/registration application | RTO Staff, Super Admin, Owner (read: all staff) | Submitted → under processing → number assigned → delivered/rejected |
| F-FIN-05 | Document upload (finance/insurance/RTO) | Relevant staff only | File uploaded; role-restricted access |
| F-FIN-06 | Status tracking per case | All staff (read) | Case status visible in dashboard |

> **Naming note:** F-FIN-03 and F-FIN-04 keep their existing IDs for reference stability even though they cover insurance and RTO. Future revisions may split them into F-INS-* / F-RTO-* IDs; do not renumber silently.

---

## 7. Service Request Features

| Feature ID | Purpose | User Roles | State Transitions |
|------------|---------|------------|-------------------|
| F-SRV-01 | Create service request / complaint | All staff | open |
| F-SRV-02 | Assign request to staff member | Manager, Super Admin, Owner | open → acknowledged → in_progress |
| F-SRV-03 | Track and update request status | Assigned staff, Manager, Super Admin, Owner | in_progress → resolved → closed |
| F-SRV-04 | Cancel request | Manager, Super Admin, Owner | open/acknowledged/in_progress → cancelled |
| F-SRV-05 | Service request history per customer/bike | All staff (read) | N/A |

> **Scope boundary:** MVP captures/tracks service requests only. Workshop job cards, parts inventory, and service billing are explicitly out of scope and remain later-phase work.

---

## 8. Staff Management Features

| Feature ID | Purpose | User Roles | State Transitions |
|------------|---------|------------|-------------------|
| F-STAFF-01 | Role-based access (RBAC) | Super Admin, Owner | 7 roles with specific permissions |
| F-STAFF-02 | Staff creation and activation | Super Admin, Owner | Staff created; role assigned; activated |
| F-STAFF-03 | Daily task assignment and tracking | Manager, Super Admin | Task assigned; status updated; completed |
| F-STAFF-04 | My performance dashboard | All staff | Personal sales/activity metrics |

---

## 9. Content Management Features

| Feature ID | Purpose | User Roles | State Transitions |
|------------|---------|------------|-------------------|
| F-CMS-01 | Blogs management (create/publish/archive) | Manager, Super Admin, Owner | Blog posted; status updated |
| F-CMS-02 | Social media links (Instagram, Facebook, YouTube) | Manager, Super Admin, Owner | Links saved; displayed on public site |
| F-CMS-03 | FAQ management (question/answer, category, order) | Manager, Super Admin, Owner | FAQ created/updated; order changed |
| F-CMS-04 | Requirements tracking | Super Admin, Owner | Customer/supplier requirements logged |

> F-CMS-04 replaces the previously duplicated second `F-CMS-03`. Any downstream reference to "Requirements tracking" must use `F-CMS-04`.

---

## 10. Appearance & Settings Features

| Feature ID | Purpose | Options | Persistence |
|------------|---------|---------|-------------|
| F-SET-01 | Theme | Light / Dark / System | Central settings table |
| F-SET-02 | Primary colour | Approved accent colours only | Central settings table |
| F-SET-03 | Secondary colour | Approved accent colours only | Central settings table |
| F-SET-04 | Font family | Inter, Outfit, Roboto, Open Sans, System UI | Central settings table |
| F-SET-05 | Font size | Small / Medium / Large | Central settings table |
| F-SET-06 | Website branding (logo, favicon) | Upload files | Storage + settings reference |
| F-SET-07 | Dashboard layout (customizable widgets) | Widget drag-drop | Central settings table |
| F-SET-08 | Sidebar (expanded/collapsed) | Expanded / Collapsed | Local storage + settings |
| F-SET-09 | Currency | INR (fixed) | Central settings table |
| F-SET-10 | Date format | DD/MM/YYYY (fixed) | Central settings table |
| F-SET-11 | Notifications | Email / In-app | Central settings table |
| F-SET-12 | Language | English initially | Central settings table |
| F-SET-13 | Invoice settings (prefix, numbering, GST) | Configurable inputs | Central settings table |
| F-SET-14 | Business details (address, contact, GSTIN) | Configurable inputs | Central settings table |

---

## 11. AI Chatbot Features

| Feature ID | Purpose | Data Source | Guardrail |
|------------|---------|-------------|-----------|
| F-CHAT-01 | Answer bike-related questions | Dealership catalogue | Never invent prices/offers/stock |
| F-CHAT-02 | Explain bike variants | Dealership-managed variant data | Use approved data only |
| F-CHAT-03 | Compare two motorcycles | Dealership spec data | No fabricated comparisons |
| F-CHAT-04 | Explain pricing | Ex-showroom/on-road snapshots | No invented discounts |
| F-CHAT-05 | Calculate estimated EMI | Configurable rates (labeled estimate) | Assumptions disclosed |
| F-CHAT-06 | Answer finance FAQs | FAQ database | No lender approval invented |
| F-CHAT-07 | Explain insurance types | Insurance application data | No policy coverage invented |
| F-CHAT-08 | Collect customer enquiries | Form input → lead creation | Name, phone, bike interest |
| F-CHAT-09 | Share showroom contact | Static data from settings | Fixed details |
| F-CHAT-10 | Direct to correct page/application | Knowledge source routing | Human handoff for uncertainty |

---

## 12. Required Feature Dependencies

| Feature | Dependent On |
|---------|-------------|
| Public bike catalogue (F-PUB-02 to F-PUB-03) | F-CAT-01 to F-CAT-08 (admin catalogue) |
| EMI calculator (F-PUB-06, F-CAT-06, F-CHAT-05) | F-CAT-05 (price list), F-FIN-02 (rates) |
| Finance/insurance/RTO applications (F-FIN-01 to F-FIN-06) | F-CRM-01 (customers), F-STK-01 (stock units) |
| AI chatbot (F-CHAT-01 to F-CHAT-10) | F-CAT-01 to F-CAT-08, F-FIN-01 to F-FIN-06, F-CMS-03 (FAQs) |
| GST invoices (F-PAY-04) | F-PAY-01 (payments), F-PAY-03 (receipts), F-PAY-07 (outstanding) |
| Booking advance handling (F-PAY-09) | F-CRM-05 (booking), F-PAY-01 (payments), DATABASE.md `paymentAllocation` |
| Refunds (F-PAY-06) | F-PAY-01 (payments), F-PAY-09 (advance allocation) |
| Reservation history (F-STK-07) | F-STK-03, DATABASE.md partial unique active index |
| Service requests (F-SRV-01 to F-SRV-05) | F-CRM-01 (customers), F-CRM-06 (sales) |
| RBAC (F-STAFF-01) | AUTH_SECURITY.md role definitions and API.md §9 |
| Activity logging (AUTH_SECURITY.md) | All financial and privileged actions |

---

## 13. MVP vs Later Enhancements

### MVP (all functional phases — PRD.md §12)
- Public website: homepage, bike listing, bike detail, enquiry, test ride, contact, about, FAQ, blogs, privacy/terms
- AI chatbot with a **stub provider** grounded in dealership data (no external LLM dependency)
- Admin dashboard: overview, bike catalogue, pricing, stock inward/outward/adjustment, stock movement history, customers, bookings, sales, payments, booking advances, refunds, invoices, staff management, settings
- Staff portal: my dashboard, enquiries, leads, bookings, test rides, service requests, daily tasks, performance
- Finance, insurance, RTO: application intake and status tracking (staff-managed)
- Service request intake and tracking (no workshop job cards)
- RBAC, activity log, GST invoice generation with CGST/SGST/IGST split
- India-specific: INR, Asia/Kolkata, UPI payment method

### Later Enhancements (PRD.md §12, after MVP)
- Customer login and order tracking
- Real payment gateway integration
- Real WhatsApp/SMS notifications
- Real AI provider integration (replacing stub)
- Used bike trade-in workflow
- Workshop/service job cards, parts inventory, service billing
- Multi-dealership architecture
- Mobile native apps
- Advanced reporting exports
- Stock alerts and follow-up reminders automation
- Daily closing automation

---

## 14. Open Product Decisions

The following remain open and will be resolved by dealership owner before corresponding phases:

1. **Dealership type:** Multi-brand / Single-brand / Used & New (affects catalogue structure) — needed before Phase 3
2. **Payment gateway provider:** Which provider for UPI/card/bank transfer? — needed before Phase 6
3. **GST configuration:** GSTIN, applicable rates, HSN/SAC codes — needed before Phase 6 (invoice generation)
4. **Finance partners:** Which banks/NBFCs for loan applications? — needed before Phase 7
5. **Insurance providers:** Which companies to integrate? — needed before Phase 7
6. **WhatsApp Business API:** Available? Templates approved? — needed before Phase 7 notifications
7. **Chatbot AI provider:** OpenAI/Anthropic/other? (MVP uses a stub) — needed before Phase 11
8. **Customer login:** Required in v1? Currently non-goal — needed before any auth expansion
9. **Pricing data responsibility:** Who inputs/verifies bike prices? — needed before Phase 3
10. **Document retention durations:** How long to keep customer ID/finance documents? — needed before production launch
11. **Refund approval policy:** Is Manager approval sufficient, or does Owner approval always apply? — needed before Phase 6

---

## 15. Feature Acceptance Checklist (Per Feature)

- [ ] User story written and approved
- [ ] UI screens designed per DESIGN.md
- [ ] Data entities and state transitions defined
- [ ] API endpoints or Server Actions identified
- [ ] Validation and business rules defined
- [ ] Permission requirements documented
- [ ] Notifications and audit events defined
- [ ] Unit, integration, and E2E test scenarios written
- [ ] Acceptance criteria met
- [ ] Definition of done completed

---

**Verification:** FEATURES.md v1.1 is complete and consistent with PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md v1.1, API.md v1.1, AGENTS.md v1.1, PLAN.md, and SETUP.md. Feature IDs are unique (F-CMS-03 FAQ, F-CMS-04 Requirements). No features outside the PRD are documented unless clearly mapped. MVP boundary is defined. Open product decisions listed for owner resolution.

**Next:** Proceed to 11_AUTH_SECURITY_PROMPT.md to generate AUTH_SECURITY.md (then reconcile with FEATURES.md v1.1).