# PROJECT BUILD REQUEST: The Bike Yard — Motorcycle Dealership & Digital Showroom Platform

You are a senior full-stack engineer. Build a complete Next.js 16 application for "The Bike Yard", a motorcycle dealership in Khopat, Thane, Maharashtra, India.

## GOAL

Generate a complete, production-ready source code ZIP file containing:

1. Public website (digital showroom)
2. Admin dashboard (dealership management)
3. Staff portal (daily operations)
4. Backend API routes with server-side authorization
5. Prisma PostgreSQL schema (~50 models)
6. All validation, services, utilities, and tests

## TECH STACK (STRICT — DO NOT SUBSTITUTE)

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS 4 + PostCSS
- **ORM/Database:** Prisma 6.12.0 + PostgreSQL
- **Authentication:** NextAuth (Auth.js) v4 with Prisma adapter — DATABASE-BACKED sessions (NOT JWT)
- **Validation:** Zod 4.x (shared client/server schemas)
- **UI Components:** shadcn/ui-style primitives (@radix-ui dialog, dropdown-menu, slot), lucide-react icons, clsx, tailwind-merge, class-variance-authority
- **Language:** TypeScript strict mode (`exactOptionalPropertyTypes`, `noUncheckedIndexedAccess`)
- **Money:** Integer paise stored as BIGINT — NEVER floating-point for currency
- **Time:** UTC storage, Asia/Kolkata (+05:30) display
- **Testing:** Vitest + Playwright (E2E scaffold)
- **Lint:** ESLint flat config with eslint-config-next

## THREE INTERFACES TO BUILD

### 1. PUBLIC WEBSITE (`/app/(public)/`)

- `/` — Homepage: hero, featured bikes, trust badges, contact info, opening hours
- `/new-bikes` — New motorcycle & scooter catalogue with filters (brand, price, colour, variant)
- `/used-bikes` — Used/second-hand catalogue with year, km, price filters
- `/bikes/[id]` — Bike detail page
- `/about` — Dealership story, location, team
- `/contact` — Contact form, showroom address, phone
- `/finance` — Finance application intake
- `/insurance` — Insurance application intake
- `/rto` — RTO registration application intake
- `/test-ride` — Test ride booking form
- `/blogs` — Blog listing
- `/blogs/[slug]` — Blog detail
- `/faqs` — FAQ listing
- `/chatbot` — AI chatbot widget (stub, grounded responses only — NO hallucinated prices/stock)
- `/privacy`, `/terms` — Legal pages

### 2. ADMIN DASHBOARD (`/app/(admin)/`)

Protected by middleware + `requireAuth`/`requireRole` on every API route.

- `/admin/dashboard` — Overview cards, sales/revenue charts
- `/admin/brands` — CRUD brands
- `/admin/inventory` / `/admin/stock/units` — Stock units (chassis, engine, variant, colour, status)
- `/admin/stock/inward` — Stock inward recording
- `/admin/stock/movements` — Stock movement history
- `/admin/customers` — Customer management
- `/admin/sales` — Sale completion, sale listing
- `/admin/bookings` — Booking/advance management
- `/admin/payments` — Payment recording & allocation
- `/admin/refunds` — Refund lifecycle (pending → approved → completed), requester cannot self-approve
- `/admin/invoices` — GST invoices with CGST/SGST/IGST split
- `/admin/finance` — Finance applications
- `/admin/insurance` — Insurance applications
- `/admin/rto` — RTO applications
- `/admin/service-requests` — Service requests
- `/admin/settings` — Dealership settings (invoice prefix, GST default rate, theme)
- `/admin/blogs` — Blog CMS
- `/admin/social` — Social media links
- `/admin/faq` — FAQ CMS
- `/admin/staff` — Staff management
- `/admin/audit-logs` — Audit log view
- `/admin/reports` — Reports & analytics

### 3. STAFF PORTAL (`/app/staff/`)

- `/staff/login` — Staff sign-in
- `/staff/dashboard` — Daily tasks, leads, enquiries
- `/staff/leads` — Lead management
- `/staff/enquiries` — Public enquiries
- `/staff/bookings` — Booking follow-ups
- `/staff/test-rides` — Test ride scheduling
- `/staff/service` — Service requests
- `/staff/insurance` — Insurance follow-ups
- `/staff/registration` — RTO registration follow-ups
- `/staff/finance` — Finance follow-ups
- `/staff/tasks` — Daily task board
- `/staff/performance` — Salesperson performance

## DATABASE SCHEMA (PRISMA — ~50 MODELS)

Build `prisma/schema.prisma` with these models and relations:

**Core:** Dealership, User, Role, Permission, RolePermission, Session, Account, VerificationToken

**Catalogue:** Brand, Model, Variant, Colour

**Stock/Booking/Sale:** StockUnit, Reservation, Booking, Sale

**Financial:** Payment, PaymentAllocation, Invoice, Refund

**Applications:** FinanceApplication, InsuranceApplication, RTOApplication

**CRM/Service:** Customer, Lead, LeadActivity, TestRide, ServiceRequest, StaffTask

**System:** AuditLog, Document, StockMovement, Settings, Notification, Blog, Faq, SocialLink, Banner, ChatbotKnowledgeSource, ChatbotFeedback, Expense

**Key fields:**

- Money fields: BigInt (paise) — exShowroomPrice, onRoadPrice, finalSellingPrice, gstAmount, cgstAmount, sgstAmount, igstAmount, totalAmount, amountPaid, outstandingAmount, purchasePrice, advanceAmount
- GST: gstRate (Int, basis points), placeOfSupply, hsnCode, gstin, customerGstin
- Status enums: StockUnitStatus, ReservationStatus, StockMovementType, BookingStatus, SaleStatus, PaymentStatus, RefundStatus
- UUIDs with `@db.Uuid`, `@default(uuid())`
- Soft deletes: `deletedAt DateTime?` on Customer, ServiceRequest, Document, User
- Indexes on frequently queried fields

## AUTHORIZATION (AUTH_SECURITY §4.3, API.md §9)

- Database-backed sessions via NextAuth Prisma adapter (`session.strategy = "database"`)
- Middleware reads NextAuth session cookie via `getToken()`, NOT custom headers
- Roles: Super Admin, Owner, Manager, Sales Exec, Accountant, Insurance Staff, RTO Staff
- `requireAuth()` throws 401 if unauthenticated; `requireRole([roles])` throws 403 if insufficient
- All 27 API routes must call `requireAuth()` or `requireRole()`
- Refund self-approval blocked (requester !== approver)
- Server recalculates all financial values; never trust client-supplied totals

## BUSINESS RULES

- Stock inward → reservation → sale flow in `prisma.$transaction()`
- Unit cannot be sold if already reserved for another booking
- Booking advance carried to sale exactly once; outstanding recalculated
- Refund cannot exceed unrefunded payment balance
- Invoice CGST+SGST+IGST = gstAmount (intra-state Maharashtra: cgst=sgst=gst/2, igst=0; inter-state: igst=gst)
- Chassis number and engine number unique constraints
- GST rate validation: integer basis points 0–10000
- Phone validation: 10–15 digits
- AI chatbot: NEVER invent prices or stock availability; decline if unknown

## FILE STRUCTURE TO GENERATE

```
prisma/
  schema.prisma
  migrations/20261103000000_init/migration.sql
  seed.ts
src/
  app/
    layout.tsx                 # Root layout with Inter font
    (public)/                  # Public website pages
    (admin)/                   # Admin dashboard pages
    staff/                     # Staff portal pages
    api/
      public/                  # Public API routes (no auth)
      admin/                   # Admin API routes (requireAuth/requireRole)
      webhooks/                # Webhook endpoints
    auth/[...nextauth]/route.ts # NextAuth handler
  components/
    public/                    # HeroSection, Navbar, Footer, BikeCard, BikeListing, FilterBar, EMICalculator, PricingBreakdown, SpecTable
    admin/                     # Admin UI components
    staff/                     # Staff UI components
    ui/                        # shadcn/ui primitives (Button, Input, Card, Badge, Table, Dialog, DropdownMenu, StatusChip, LoadingState, Form)
  lib/
    auth.ts                    # NextAuth config (database sessions)
    api-auth.ts                # requireAuth, requireRole, AuthError
    prisma.ts                  # Prisma client singleton
    currency.ts                # formatInr, toPaise, toRupees, splitGst, isValidGstRate
    date.ts                    # toKolkataString, formatDisplayDate, parseDisplayDate, startOfDayUtc, endOfDayUtc
    validations/index.ts       # All Zod schemas
    ai.ts, pdf.ts, storage.ts, notifications.ts  # Stub providers
  services/
    sales.service.ts           # completeSale in transaction
    payment.service.ts         # recordPayment, createRefund, updateRefundStatus
    invoice.service.ts         # createInvoice with GST split
    stock.service.ts           # createStockUnit, createReservation, createStockMovement
    customer.service.ts, finance.service.ts, insurance.service.ts, rto.service.ts, chatbot.service.ts
  types/
    metadata.ts
  middleware.ts                # Route protection
tests/
  integration/business-flows.test.ts   # Real PostgreSQL integration tests
  accessibility/a11y.test.ts           # WCAG 2.1 AA checks
  security/security.test.ts            # Auth, RBAC, API guards
  lib/__tests__/*.test.ts              # Unit tests (currency, GST, validation, date, RBAC)
vitest.config.ts
eslint.config.js
next.config.mjs                  # Security headers (HSTS, CSP, X-Frame-Options, etc.)
package.json
tsconfig.json
tailwind.config.js
postcss.config.js
vercel.json
.env.example
README.md
```

## SECURITY HEADERS (next.config.mjs)

- Strict-Transport-Security
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Permissions-Policy: camera=(), microphone=(), geolocation=()
- Content-Security-Policy: restrictive

## DELIVERABLE

Export the complete project as a **ZIP file** with:

- All source files listed above
- `package.json` with all dependencies and scripts (`dev`, `build`, `start`, `lint`, `test`)
- `prisma/schema.prisma` and migration SQL
- `.env.example` with placeholder values (NO real secrets)
- `README.md` with setup instructions

Do NOT include `node_modules`, `.next`, `dist`, or `.env` with real credentials.

Do NOT use floating-point for money. Do NOT hardcode passwords. Do NOT invent GSTIN, tax rates, finance partners, or insurance providers.

All code must be TypeScript strict and pass `tsc --noEmit` with zero errors.

Please generate this complete codebase now and provide it as a downloadable ZIP.
