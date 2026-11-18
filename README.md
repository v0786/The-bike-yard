# The Bike Yard — Motorcycle Dealership Platform

Premium multi-brand motorcycle dealership for **The Bike Yard** (Rutu Business Park, Khopat, Thane (W), Maharashtra — MH-04). Public showroom + certified pre-owned + staff operations, built as a fast React SPA and deployed to Vercel.

**Production:** https://the-bike-yard.vercel.app/

## What's inside

- **Public showroom** — hero, Honda / Suzuki / TVS authorised brand rails, featured & latest arrivals, offers, full catalogue with search, filters (brand / category / budget / engine capacity / stock), price & popularity sort, pagination, and side-by-side comparison.
- **Dedicated motorcycle pages** — `/bike/:id` with colour gallery, variant & colour selection, MH-04 on-road price breakup (11% RTO), EMI calculator, WhatsApp / call / test-ride / ₹10,000 booking CTAs, similar motorcycles, Product + Breadcrumb JSON-LD.
- **Conversion tooling** — WhatsApp deep links, instant-callback form, lead capture, test-ride scheduler, cart & ₹10,000 booking advance, 10+ lender EMI estimates.
- **Staff portal & admin dashboard** — RBAC (7 roles), inbound call queue, stock/VIN ledger, atomic sales + GST invoices, refunds with separation-of-duties, OLX posting, CSV catalogue upload.
- **Pricing & merchandising desk** — authorised staff (Super Admin / Owner / Manager) edit **ex-showroom prices only** (RTO auto-recomputes at 11%) and the homepage **Featured** flag. Factory specs & descriptions are read-only (central dataset). Staff-managed **Offers** and editable **dealership contact information**. Every change is audit-logged; overrides persist in the browser via localStorage.
- **SEO & performance** — per-route titles/descriptions/canonicals, Open Graph, `sitemap.xml`, `robots.txt`, AutoDealer/Product structured data, custom 404, code-split routes, lazy images.

## Tech stack

React 19 · Vite 8 · Tailwind CSS 4 · TypeScript · React Router 7 · Vitest · `backend/` contains a separate Next.js 16 + Prisma dealership backend (not part of the Vercel SPA deployment; see `backend/README.md`).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
```

## Verify

```bash
npm run lint       # tsc --noEmit (root app)
npm test           # vitest run (unit tests: emi, catalogue, currency, whatsapp)
npm run build      # production build → dist/
cd backend && npx tsc --noEmit && npx vitest run   # backend checks
```

## Project structure

```
src/
  components/        # shared UI (catalogue, modals, admin panels in components/admin/)
  views/             # ShowroomHome, BikeDetailPage, NotFound (route surfaces)
  data/              # dealershipData.ts — seed bikes, stock, leads, FAQ, DEALERSHIP_INFO
  services/          # dealershipStore (state + overrides), marketBikesDatabase (central dataset), cartStore
  lib/               # pure logic: emi, catalogue (filter/sort/paginate), currency (BigInt paise), rbac, whatsapp
public/              # robots.txt, sitemap.xml, favicon.svg, hero & bike photography
```

## Environment variables

The SPA runs fully client-side and needs **no secrets** to build or deploy. See root `.env.example`.

- `VITE_API_BASE_URL` (optional) — base URL of the separate `backend/` API (e.g. `https://your-backend.example.com`). When set, the SPA can call safe read-only endpoints: `GET /api/health` and `GET /api/catalog/bikewale` (used as a fallback for the BikeWale reference catalogue). The Admin → **Dealership Settings** tab shows backend connectivity/database status.
- `VITE_BIKEWALE_CATALOG_URL` (optional) — direct reference-catalog feed URL (takes precedence over the backend catalog route for that component).

Reference cards show the BikeWale listing URL and retrieval date when supplied by the approved feed (`sourceUrl` and optional ISO 8601 `retrievedAt`). The showroom’s own prices and booking advances are demo figures.

The approved BikeWale feed can supply stable `sourceId` values (one per variant), `photos`, `colors` with photo arrays, and `specifications` as label/value pairs. Set backend `BIKEWALE_APPROVED_IMAGE_HOSTS` to the comma-separated HTTPS image hostnames covered by your agreement, in addition to BikeWale hosts. The reference rail refreshes hourly while mounted and keeps its last successful result for that visit. Dealer demo prices are reviewed and confirmed in the existing pricing panel and are saved to browser storage. Global pricing needs a deployed authenticated backend and a shared catalogue.

Standalone policy routes are `/privacy-policy` and `/terms-and-conditions`. The preview records versioned acceptance with its in-memory lead, test-ride and booking records. Use sample details. Optional cookie permission gates the embedded map, and footer preferences can revoke it.

Never commit `.env*` files.

## Connect SPA to the backend API (`backend/`)

`backend/` is a separate Next.js 16 + Prisma (PostgreSQL) app with `/api/health`, `/api/auth/[...nextauth]`, `/api/catalog/bikewale`, `/api/sales`. **`POST /api/sales` is intentionally disabled (503)** until verified payments, tax configuration, and inventory concurrency controls are deployed — do not bypass this.

To connect:

1. Deploy `backend/` with a PostgreSQL database. Set `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET` (see `backend/.env.example`).
2. Set `CORS_ORIGINS` in the backend to include the SPA origin(s), e.g. `https://the-bike-yard.vercel.app,http://localhost:5173` (enables CORS for safe read-only routes).
3. Set `VITE_API_BASE_URL` in the SPA environment (Vercel project env or local `.env`) to the backend origin and rebuild/redeploy the SPA.

**Notes:** authenticated operations (NextAuth credentials, protected mutations) require the backend to be deployed and reachable with correct session/cookie/CORS configuration across origins; the SPA currently uses in-app demo RBAC for staff flows. Full server-backed auth/data sync is a follow-on integration beyond the safe connectivity wired here.

## Deployment

Vercel (framework: Vite). `vercel.json` rewrites all routes to `index.html` for client-side routing. Deploy with:

```bash
npx vercel --prod
```

## Business rules encoded in code

- Currency is BigInt **paise** end-to-end (`formatInr`, `splitGst`).
- Staff can edit **prices and dealership-specific fields only** — never factory specs.
- Enquiry leads always land in the staff call queue with an audit log entry.

## Customer service chat (Ask Bike Yard)

The public chat in the navigation is available without login. It answers customer
questions about the **published showroom catalogue only**. It does not expose
project code, staff activity, ledgers, customer records, bank details or internal
operations. It cannot execute actions, take payments or confirm bookings.

- `POST /api/customer-chat` is a root Vercel Node function, independent of `backend/`.
- The same endpoint works with `npm run dev` through a development-only middleware.
- Set **`OPENAI_API_KEY`** in Vercel → the-bike-yard → Settings → Environment
  Variables (Production and any desired Preview environments), then redeploy.
  Create the key in your own OpenAI API project. Never paste it into chat, commit
  it, or prefix it with `VITE_`. Configure provider-side quotas/spend controls.
- Optional `OPENAI_MODEL` defaults to `gpt-4.1-mini`. The model must support
  Responses API structured outputs. No new dependencies are required.
- With no key, provider errors, refusals or timeouts, the widget explicitly labels
  the response **Showroom help mode** and uses a small deterministic FAQ router.
  Semantic recommendations and context-aware follow-ups need a working API key.
- OpenAI selects a topic and up to three public bike IDs through strict JSON.
  Server validation and approved answer templates construct all customer text
  and links. Raw model prose is never displayed. Responses are currently English;
  routing may understand other languages but fallback keyword coverage is limited.
- Only allowlisted public fields from the committed catalogue reach the model.
  Browser localStorage overrides and unverified reference feeds are not trusted.
  Prices/offers are labelled demo figures. Live stock and approvals are never claimed.
- A consent checkbox applies equally to typed messages and suggested questions.
  The last six messages accompany AI requests; chats remain in page memory and
  are not saved by this endpoint. `store: false` is sent to OpenAI; provider and
  hosting operational retention policies still apply.
- Input/output sizes, timeouts, same-origin browser checks and a 12-request/minute
  hashed-IP, per-instance limiter reduce abuse. This memory limiter is **not a
  distributed quota or a global billing cap**. Add durable rate limits/WAF and
  provider quotas before a high-traffic production rollout. Origin checks alone
  do not authenticate direct HTTP callers.
- Verify with `npm run lint`, `npm test`, `npm run build`. Adapter tests mock OpenAI;
  live AI responses require a configured key and must be verified separately.
