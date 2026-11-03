# PLAN.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Draft — Pending Dealership Owner Review  
**Version:** 1.1  
**Source of Truth:** Yes — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md, AGENTS.md, README.md  
**Previous Documents:** PRD.md through AGENTS.md  
**Next Document:** SETUP.md (Prompt 09)  
**Change history:** v1.1 — added service-request phase task, refund lifecycle, booking-advance allocation, reservation history, stock-movement tracking and GST-split acceptance criteria, aligned with DATABASE.md/API.md v1.1.

---

## 1. Implementation Approach

Modular monolith, single Next.js repository, one PostgreSQL database, three interfaces. Work broken into 8 phases with milestones, epics, and testable tasks. No feature planned that is absent from the PRD unless marked as a proposal.

MVP boundary: every feature listed in PRD.md §12 MVP (PLAN phases 0–11; Phase 12 is release hardening). **Reconciliation note:** PRD.md labels the MVP as "Phase 1–6" using a coarse product-phase scheme; this PLAN uses finer delivery phases. The feature list, not the number, defines MVP scope. Finance/insurance/RTO intake (Phase 7), staff portal (Phase 8) and the chatbot with stub provider (Phase 11) are MVP because PRD.md lists them as MVP.

---

## 2. Phase 0 — Repository & Environment Foundation

**Objective:** Establish repo, tooling, database connection, and core configuration before any feature work.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P0-1 | Initialize git repo | Create git repository, initial commit | None | .gitignore, README.md | Git repo initialized, initial commit | None | Low | High | Repo exists, clean status |
| P0-2 | Scaffold Next.js app | Next.js + TypeScript + Tailwind + shadcn/ui | P0-1 | package.json, next.config.js, tailwind.config.ts, tsconfig.json | `npm run dev` starts without errors | None | Low | High | Dev server runs |
| P0-3 | Configure Prisma + PostgreSQL | Connect Prisma to PostgreSQL, enable migrations | P0-2 | prisma/schema.prisma, .env.example | `npx prisma migrate dev` succeeds | Migration test | Medium | High | Migrations apply cleanly |
| P0-4 | Set up linting & typecheck | ESLint, Prettier, TypeScript strict | P0-2 | .eslintrc, .prettierrc | `npm run lint` and `npx tsc --noEmit` pass | None | Low | Medium | Checks pass |
| P0-5 | Configure Auth.js | Session-based auth, Credentials provider | P0-3 | src/lib/auth.ts, src/app/auth/ | Sign-in/sign-out flow works | Auth test | Medium | High | Auth flows work |
| P0-6 | Create design tokens | Tailwind config with DESIGN.md tokens | P0-2 | tailwind.config.ts, src/styles/ | Theme tokens compile, dark mode class works | Visual check | Low | Medium | Tokens applied |

**Milestone 0:** Repository foundation complete; dev environment runs; auth and design tokens configured.

---

## 3. Phase 1 — Authentication, Roles & Admin Dashboard Shell

**Objective:** Working auth, RBAC, and admin layout skeleton.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P1-1 | User, role, permission models | Prisma models for user/role/permission | P0-3 | prisma/schema.prisma | Migrations apply; roles seedable | Model test | Medium | High | Models correct |
| P1-2 | RBAC middleware | Route protection by role | P1-1, P0-5 | src/middleware.ts | Unauthorized routes redirect | Authz test | Medium | High | Middleware blocks access |
| P1-3 | Admin layout & sidebar | Collapsible sidebar, top bar, role-scoped items | P0-6, P1-2 | src/app/(admin)/layout.tsx | Sidebar renders, collapses, role items shown | Component test | Low | High | Layout works |
| P1-4 | Staff management | Create staff, assign roles, activate/deactivate | P1-1, P1-2 | src/app/(admin)/staff/ | Staff CRUD works, role assignment enforced | CRUD test | Medium | High | Staff CRUD works |
| P1-5 | Audit log | Record admin actions | P1-1 | src/services/audit.service.ts | Audit entries created on actions | Audit test | Low | Medium | Audit works |

**Milestone 1:** Auth + RBAC functional; admin shell navigable; staff can be created and assigned roles.

---

## 4. Phase 2 — Public Website Shell

**Objective:** Public-facing showroom pages with design system applied.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P2-1 | Public layout & navbar | Shared public layout, hero, footer | P0-6 | src/app/(public)/layout.tsx | Responsive navbar, hero renders | Component test | Low | High | Layout works |
| P2-2 | Homepage sections | Featured bikes, arrivals, offers, testimonials, blogs, contact | P2-1 | src/app/(public)/page.tsx | All sections render with real data | Component test | Low | High | Homepage complete |
| P2-3 | Bike listing page | Filterable catalogue grid | P0-3, P2-1 | src/app/(public)/bikes/page.tsx | Bikes list, filters work, pagination | Listing test | Low | High | Listing works |
| P2-4 | Bike detail page | Gallery, specs, pricing, EMI calculator, enquiry form | P2-3 | src/app/(public)/bikes/[slug]/page.tsx | Detail page loads, calculator computes | Detail test | Medium | High | Detail works |
| P2-5 | Content pages | About, contact, FAQ, blogs, privacy, terms | P2-1 | src/app/(public)/{about,contact,faq,blogs,...}/ | Pages render, forms submit | Page test | Low | Medium | Content pages work |
| P2-6 | AI chatbot widget | Floating widget, dealership-grounded responses | P2-1 | src/components/shared/chatbot/ | Widget opens, responds using knowledge source | Chatbot test | Medium | Medium | Chatbot responds |

**Milestone 2:** Public website browsable; bike catalogue and detail pages functional; enquiry/chatbot capture leads.

---

## 5. Phase 3 — Bike Catalogue, Variants & Pricing

**Objective:** Admin-side catalogue management with full pricing fields.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P3-1 | Brand/model/variant CRUD | Create/read/update/delete brands, models, variants | P1-1, P1-2 | src/app/(admin)/catalogue/ | CRUD operations work | CRUD test | Medium | High | Catalogue CRUD works |
| P3-2 | Colour management | Add colours to variants | P3-1 | src/app/(admin)/catalogue/colours/ | Colours attach to variants | CRUD test | Low | Medium | Colours work |
| P3-3 | Price list management | Ex-showroom, insurance, RTO, accessories, discount, on-road, final | P3-1 | src/app/(admin)/pricing/ | Prices save, final selling price computes | Price calc test | Medium | High | Pricing computes |
| P3-4 | Bike images | Upload and associate images with variants | P3-1, storage setup | src/app/(admin)/catalogue/images/ | Images upload, display on detail | Upload test | Medium | Medium | Image upload works |
| P3-5 | Availability status | Mark bikes available/unavailable | P3-1 | src/app/(admin)/catalogue/ | Status toggles, reflects on public site | Status test | Low | Medium | Status syncs |

**Milestone 3:** Full catalogue and pricing management; public site reflects admin changes.

---

## 6. Phase 4 — Stock Inward, Outward & Inventory

**Objective:** Physical bike tracking with chassis/engine uniqueness and automatic stock updates.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P4-1 | Stock unit model | Chassis/engine unique constraints | P3-1 | prisma/schema.prisma | Duplicate chassis rejected | Constraint test | High | High | Uniqueness enforced |
| P4-2 | Stock inward | Purchase entry, supplier, invoice, chassis, engine, price, date | P4-1 | src/app/(admin)/stock/inward/ | Inward creates available unit | Inward test | High | High | Inward works |
| P4-3 | Stock management | List all units, filter by status, search chassis/engine | P4-2 | src/app/(admin)/stock/units/ | Units list, filter, search work | List test | Low | High | Stock list works |
| P4-4 | Stock outward | Mark unit sold, decrement stock, record sale link | P4-2, P4-3 | src/app/(admin)/stock/outward/ | Outward decrements stock, blocks sold units | Outward test | High | High | Outward works |
| P4-5 | Reservations | Reserve unit for booking, release on cancellation; allow reservation history | P4-3 | src/services/stock.service.ts | One active reservation per unit; prior reservations retained | Reservation test | High | High | Reservations work |
| P4-6 | Stock movements | Append movement rows for inward/reservation/release/sale/return/adjustment/delivery | P4-2 | src/services/stock.service.ts | Every status change has a movement row | Movement test | High | High | Movements recorded |
| P4-7 | Stock adjustment & return | Record adjustment/return with reason | P4-6 | src/app/(admin)/stock/ | Adjustment/return recorded and auditable | Adjustment test | Medium | Medium | Adjustments work |

**Milestone 4:** Stock integrity maintained; no duplicate chassis; stock auto-updates on inward/outward.

---

## 7. Phase 5 — Customers, Enquiries, Bookings & Sales

**Objective:** CRM and sales workflow from enquiry to delivery.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P5-1 | Customer management | Create/read/update customers, view history | P1-2 | src/app/(admin)/customers/ | Customer CRUD works | CRUD test | Low | High | Customers work |
| P5-2 | Enquiries | Public enquiry creates lead, admin views/assigns | P2-6, P5-1 | src/app/(admin)/enquiries/ | Enquiry → lead created, assignable | Lead test | Low | High | Enquiries work |
| P5-3 | Test rides | Schedule, track status, complete/no-show | P5-2 | src/app/(admin)/test-rides/ | Test ride bookable, status trackable | Test ride test | Low | Medium | Test rides work |
| P5-4 | Bookings | Create booking, reserve unit, record advance, track status | P4-4, P5-1 | src/app/(admin)/bookings/ | Booking reserves unit; advance recorded and allocatable | Booking test | High | High | Bookings work |
| P5-5 | Sales | Record sale, link to booking, carry advance allocation, generate invoice | P5-4, P3-3 | src/app/(admin)/sales/ | Sale creates invoice; advance carried exactly once | Sale test | High | High | Sales work |
| P5-6 | Delivery | Mark sale delivered, set delivery date | P5-5 | src/app/(admin)/sales/[id]/ | Delivery date set, status delivered | Delivery test | Low | Medium | Delivery works |

**Milestone 5:** End-to-end sales workflow from enquiry to delivery; stock status updates on sale; booking advances carried to sale.

---

## 8. Phase 6 — Payments, Billing & Invoices

**Objective:** Payment recording, GST invoices, receipts, daily closing.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P6-1 | Payment recording | Cash, UPI, QR, bank, card, finance, partial methods; allocate to sale or booking | P5-5 | src/app/(admin)/payments/ | Payment recorded and allocated to exactly one target | Payment test | High | High | Payments work |
| P6-2 | Receipts | Booking receipt, advance receipt, payment receipt, refund receipt | P6-1 | src/app/(admin)/receipts/ | Receipts generate, PDF option | Receipt test | Medium | High | Receipts work |
| P6-3 | Tax invoices | GST invoice with immutable CGST/SGST/IGST split, place of supply, basis-point rate | P6-1, P3-3 | src/app/(admin)/invoices/ | Invoice generated; split equals total GST | Invoice test | High | High | Invoices work |
| P6-4 | Outstanding payments | Track unpaid balances per customer/sale | P6-1 | src/app/(admin)/payments/outstanding/ | Outstanding amounts accurate | Query test | Medium | Medium | Outstanding tracked |
| P6-5 | Daily closing | End-of-day reconciliation by payment method | P6-1 | src/app/(admin)/reports/daily-closing/ | Closing report reconciles collections | Closing test | Medium | Medium | Closing works |
| P6-6 | Expenses | Record and categorize expenses | P1-2 | src/app/(admin)/expenses/ | Expenses recorded, reportable | Expense test | Low | Medium | Expenses work |
| P6-7 | Refunds | Request → approve (different user) → complete; link to original payment | P6-1 | src/app/(admin)/refunds/ | Refund traceable; balance cannot be exceeded | Refund test | High | High | Refunds work |
| P6-8 | Booking advance allocation | Allocate advance to booking; carry to sale on conversion | P6-1, P5-4 | src/services/payment.service.ts | Advance not double-counted | Allocation test | High | High | Advances work |

**Milestone 6:** Payments, receipts, GST invoices, outstanding tracking, daily closing functional.

---

## 9. Phase 7 — Finance, Insurance & RTO

**Objective:** Application intake, document upload, status tracking.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P7-1 | Finance applications | Loan enquiry, lender, down payment, EMI, status | P5-5 | src/app/(admin)/finance/ | Application created, status tracked | App test | Medium | High | Finance works |
| P7-2 | Insurance applications | Provider, policy type, premium, expiry, documents | P5-5 | src/app/(admin)/insurance/ | Application created, policy tracked | App test | Medium | High | Insurance works |
| P7-3 | RTO applications | Registration form, documents, status, registration number | P5-5 | src/app/(admin)/rto/ | Application created, registration tracked | App test | Medium | High | RTO works |
| P7-4 | Document uploads | Secure upload, role-restricted access, retention metadata | P7-1, P7-2, P7-3 | src/lib/storage.ts | Documents upload, access restricted; retentionUntil nullable until policy approved | Upload test | Medium | High | Documents work |
| P7-5 | Staff portal views | Role-scoped finance/insurance/RTO forms | P7-1, P7-2, P7-3 | src/app/(staff)/ | Staff sees only assigned work or permitted read scope | Portal test | Low | Medium | Staff portal works |

**Milestone 7:** Finance, insurance, RTO workflows with document uploads and status tracking.

---

## 10. Phase 8 — Staff Portal, Tasks & Notifications

**Objective:** Staff-scoped dashboards and task management.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P8-1 | Staff dashboard | Assigned leads, bookings, tasks, performance | P1-2, P5-2 | src/app/(staff)/dashboard/ | Dashboard shows assigned items | Dashboard test | Low | High | Staff dashboard works |
| P8-2 | Daily tasks | Assign, update, complete tasks | P1-2 | src/app/(staff)/tasks/ | Tasks CRUD, status transitions | Task test | Low | High | Tasks work |
| P8-3 | Notifications | In-app notifications for assignments | P8-2 | src/services/notification.service.ts | Notifications created on assignment | Notification test | Low | Medium | Notifications work |
| P8-4 | My performance | Personal sales/activity metrics | P5-5, P6-1 | src/app/(staff)/performance/ | Metrics display correctly | Metric test | Low | Medium | Performance works |
| P8-5 | Service requests | Create, assign, track, resolve, close | P5-5 | src/app/(staff)/service-requests/ | Status transitions valid; history visible | Service test | Medium | High | Service requests work |

**Milestone 8:** Staff portal fully functional with role-scoped work.

---

## 11. Phase 9 — Reports & Analytics

**Objective:** Dashboard charts and exportable reports.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P9-1 | Dashboard overview cards | 10 metric cards | P5-5, P6-1, P4-3 | src/app/(admin)/dashboard/ | Cards show accurate counts | Card test | Low | High | Dashboard works |
| P9-2 | Sales/revenue charts | Daily, weekly, monthly sales; revenue trends | P5-5, P6-1 | src/app/(admin)/dashboard/analytics/ | Charts render with data | Chart test | Low | High | Charts work |
| P9-3 | Best-selling variants | Rank variants by sales volume | P5-5 | src/app/(admin)/reports/ | Report shows top variants | Report test | Low | Medium | Report works |
| P9-4 | Stock ageing | Units by days in stock | P4-3 | src/app/(admin)/reports/stock-ageing/ | Ageing report accurate | Report test | Low | Medium | Report works |
| P9-5 | Salesperson performance | Per-staff sales and revenue | P5-5, P1-1 | src/app/(admin)/reports/staff-performance/ | Performance report accurate | Report test | Low | Medium | Report works |
| P9-6 | Export reports | CSV/PDF export | P9-1 to P9-5 | src/app/(admin)/reports/ | Export generates file | Export test | Low | Medium | Export works |

**Milestone 9:** Reports and analytics dashboard functional with exports.

---

## 12. Phase 10 — Blogs, Social Media, FAQ, Settings

**Objective:** CMS and appearance customization.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P10-1 | Blogs management | Create/publish/archive blogs | P1-2 | src/app/(admin)/blogs/ | Blog CRUD works | CRUD test | Low | Medium | Blogs work |
| P10-2 | Social media links | Instagram, Facebook, YouTube, banners | P1-2 | src/app/(admin)/social/ | Links saved, display on public site | Link test | Low | Medium | Social works |
| P10-3 | FAQ management | Create/update FAQs, categories, order | P1-2 | src/app/(admin)/faq/ | FAQ CRUD works | CRUD test | Low | Medium | FAQ works |
| P10-4 | Settings | Theme, colours, fonts, branding, layout, invoice, business details | P0-6 | src/app/(admin)/settings/ | Settings save, apply app-wide | Settings test | Medium | High | Settings work |
| P10-5 | Public social/FAQ display | Show links and FAQs on public site | P10-2, P10-3 | src/app/(public)/ | Social links and FAQs visible | Public test | Low | Medium | Public display works |

**Milestone 10:** CMS and settings functional; changes apply consistently.

---

## 13. Phase 11 — AI Chatbot Integration

**Objective:** Dealership-grounded chatbot assistant.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P11-1 | Chatbot knowledge source | Catalogue, FAQ, policy content for bot | P3-1, P10-3 | src/services/chatbot.service.ts | Knowledge source queryable | Query test | Low | Medium | Knowledge works |
| P11-2 | Chatbot responses | Bike info, variants, comparison, pricing, EMI, finance, insurance | P11-1 | src/app/api/chatbot/ | Responses grounded in data | Response test | Medium | Medium | Chatbot responds |
| P11-3 | Chatbot enquiry collection | Collect name, phone, bike interest | P11-2, P5-2 | src/app/api/chatbot/ | Enquiry creates lead | Lead test | Low | Medium | Enquiry captured |
| P11-4 | No hallucination guard | Bot never invents prices/stock/approval | P11-2 | src/services/chatbot.service.ts | Bot declines unknown data | Guard test | Medium | High | Guard works |

**Milestone 11:** Chatbot functional, grounded in dealership data only.

---

## 14. Phase 12 — Testing, Security & Production Readiness

**Objective:** Verification, security review, launch preparation.

| Task ID | Title | Objective | Dependencies | Files | Acceptance Criteria | Tests | Risk | Priority | DoD |
|---------|-------|-----------|--------------|-------|---------------------|-------|------|----------|-----|
| P12-1 | Unit tests | Calculations, validators, state transitions | All phases | src/**/*.test.ts | 80%+ coverage on utilities | Unit tests | Low | High | Tests pass |
| P12-2 | Integration tests | DB transactions, API handlers, adapters | All phases | src/**/*.integration.test.ts | Critical paths pass | Integration tests | Medium | High | Tests pass |
| P12-3 | E2E tests | Enquiry, test ride, reservation history, stock adjustment, sale, booking advance, payment, refund, invoice, delivery, service request | All phases | e2e/**/*.spec.ts | Full flows pass | E2E tests | Medium | High | Tests pass |
| P12-4 | Role-based authz tests | Every protected endpoint, every role | P1-2 | src/**/*.authz.test.ts | Unauthorized access blocked | Authz tests | High | High | Tests pass |
| P12-5 | Security review | Secrets, headers, uploads, document access | All phases | — | No vulnerabilities found | Security audit | High | High | Review complete |
| P12-6 | Accessibility review | WCAG 2.1 AA, keyboard, contrast | All phases | — | Accessibility checks pass | A11y tests | Low | Medium | Review complete |
| P12-7 | Production build | `npm run build` succeeds | All phases | — | Build outputs generated | Build test | Low | High | Build succeeds |
| P12-8 | Deployment config | Vercel config, env vars, migration script | P12-7 | vercel.json, deployment docs | Deploy pipeline documented | Deploy check | Low | High | Config ready |

**Milestone 12:** All tests pass, security reviewed, production build succeeds, deployment documented.

---

## 15. Parallelizable Work

- P2 (Public website) can run in parallel with P3 (Catalogue) after P1 (Auth shell).
- P7 (Finance/Insurance/RTO) can run in parallel with P6 (Payments) after P5 (Sales).
- P8 (Staff portal) can run in parallel with P9 (Reports) after P5/P6.
- P10 (Blogs/Social/FAQ/Settings) can run in parallel with P11 (Chatbot) after P3.

---

## 16. Migration Checkpoints

| Checkpoint | Gate | Criteria |
|------------|------|----------|
| After Phase 0 | Dev environment | `npm run dev`, `prisma migrate dev`, auth all work |
| After Phase 4 | Stock integrity | No duplicate chassis; inward/outward transactional |
| After Phase 6 | Financial accuracy | Invoices, payments, receipts reconcile |
| After Phase 12 | Production readiness | Tests pass, security reviewed, build succeeds |

---

## 17. Owner Verification Tasks

- Verify GST configuration, HSN/SAC, place-of-supply rules and invoice numbering prefix before P6-3.
- Approve business details (address, contact, GSTIN) before P10-4.
- Approve payment methods and refund-approval policy before P6-1/P6-7.
- Select finance, insurance, RTO providers before P7.
- Assign staff member for catalogue data entry before P3.
- Approve document retention durations before production launch.
- Review and sign off PRD.md before Phase 1.

---

## 18. Release Checklist

- [ ] All MVP features implemented and tested
- [ ] Unit, integration, E2E tests pass
- [ ] Role-based authorization verified
- [ ] Security review complete
- [ ] Accessibility review complete
- [ ] Production build succeeds
- [ ] GST/invoice settings, HSN and place-of-supply verified by owner
- [ ] Refund approval and document retention policies approved
- [ ] Deployment configuration documented
- [ ] Rollback plan prepared

---

**Verification:** PLAN.md v1.1 is complete and consistent with PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md v1.1, API.md v1.1, AGENTS.md v1.1, and README.md. No features outside the PRD are planned unless marked as proposals. MVP boundary is defined and reconciled with PRD.md §12. Owner verification tasks identified.

**Next:** Proceed to 09_SETUP_PROMPT.md to generate SETUP.md.