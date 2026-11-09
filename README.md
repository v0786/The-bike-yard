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

The SPA runs fully client-side and needs **no secrets** to build or deploy. See `.env.example` for optional `GEMINI_API_KEY` (AI Studio integration). Never commit `.env*` files.

## Deployment

Vercel (framework: Vite). `vercel.json` rewrites all routes to `index.html` for client-side routing. Deploy with:

```bash
npx vercel --prod
```

## Business rules encoded in code

- Currency is BigInt **paise** end-to-end (`formatInr`, `splitGst`).
- Staff can edit **prices and dealership-specific fields only** — never factory specs.
- Enquiry leads always land in the staff call queue with an audit log entry.
