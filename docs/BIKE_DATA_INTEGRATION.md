# BIKE_DATA_INTEGRATION.md — Motorcycle Data Integration Engine

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform
**Status:** Implementation — pending authorized provider credentials
**Follows:** PRD.md, ARCHITECTURE.md, DATABASE.md, API.md, AUTH_SECURITY.md, INTEGRATIONS.md, AGENTS.md

---

## 1. Purpose & Guiding Rule

The Motorcycle Data Integration Engine imports motorcycle **information** (brand, model,
variants, engine/power/torque/mileage, transmission, braking/ABS, dimensions/weight,
features, colours, descriptions, licensed images) from authorised external providers and
keeps it synchronised.

> **Final business rule:** External providers manage motorcycle **information**.
> Authorised backend staff **exclusively** control all motorcycle **pricing**.
> Synchronisation never creates, edits, approves or deletes a price.

---

## 2. Separation of Concerns

| Entity | Owner | Contains |
|--------|-------|----------|
| `Brand` | shared | Manufacturer / brand identity |
| `BikeModel` | provider sync (information) | model, category, descriptions, images, provider + last-sync metadata |
| `BikeVariant` | provider sync (information) | engine, power, torque, mileage, transmission, brakes/ABS, dimensions, weight, features, specifications |
| `BikeColour` | provider sync (information) | colour name, hex, image |
| `BikeImage` | provider sync (information) | licensed image URL + licence/attribution |
| `BikePricing` | **staff only** | ex-showroom, on-road, insurance, RTO, accessories, dealer offer, final selling price |
| `BikePriceHistory` | **staff only** | immutable audit trail (staff id, previous value, new value, timestamp) |
| `DataProvider` | admin | provider registry, enablement, attribution, rate limit, last sync |
| `BikeSyncRun` / `BikeSyncLog` / `BikeProviderRequest` | system | sync status, errors, request log |

The existing `Model` / `Variant` / `Colour` tables and stock/sales flows are **untouched**;
the integration engine uses its own `BikeModel` / `BikeVariant` / `BikeColour` layer.

---

## 3. Provider Architecture

```
src/services/bike-provider/
├── types.ts                 # MotorcycleDataProvider interface + normalised DTOs
├── errors.ts                # ProviderNotConfiguredError, ProviderAuthorizationPendingError, ...
├── rate-limiter.ts          # token-bucket + DB-backed request log check
├── registry.ts              # register / resolve providers by code
├── providers/
│   ├── mock.provider.ts     # deterministic development/test fixture (clearly non-live)
│   └── bikewale.provider.ts # official BikeWale provider — REQUIRES authorised credentials
└── index.ts
```

Any new authorised provider only implements `MotorcycleDataProvider` and registers itself;
no application code changes are required.

### 3.1 Adding a provider

1. Create `providers/<code>.provider.ts` implementing `MotorcycleDataProvider`.
2. Register it in `registry.ts`.
3. Insert a `DataProvider` row (code, name, attribution, docs URL, rate limit, enable).
4. Add credential env vars to `.env.example` and `scripts/validate-env.js`.

---

## 4. BikeWale status

**Not operational.** The provider interface is implemented and wired, but official BikeWale
API access / commercial permission has **not** been confirmed by the dealership. No endpoint
is hard-coded and no scraping is performed.

`BikeWaleProvider` is `isConfigured() === false` until **all** of the following env vars are
supplied from an official agreement:

| Variable | Purpose |
|----------|---------|
| `BIKEWALE_API_BASE_URL` | Official API base URL from the commercial agreement |
| `BIKEWALE_API_KEY` | Official API key / token |
| `BIKEWALE_API_CATALOG_PATH` | Catalogue endpoint path **documented by BikeWale** |

If any is missing the provider refuses to run and records a `ProviderAuthorizationPendingError`.
The application must never be described as "BikeWale integrated" until real credentials are
present and a real response has been verified. See §9 for the onboarding checklist.

---

## 5. Synchronisation Engine

`src/services/bike-sync.service.ts`:

- **Triggers:** scheduled (`GET /api/cron/bike-sync`, `CRON_SECRET` protected) and manual
  (`POST /api/admin/bike-sync`).
- **Duplicate detection / unique identification:** by `(providerId, externalId)` first,
  falling back to a canonical slug; a slug owned by another provider is logged and skipped
  rather than duplicated.
- **Field-level updates:** only changed columns are written; unchanged items are counted and
  skipped.
- **Transactions:** each model+variants+colours+images group is applied in one
  `prisma.$transaction`, so a partial failure rolls back only that model.
- **Retry:** transient provider failures retried with exponential backoff
  (`BIKE_SYNC_MAX_RETRIES`, default 3) before the run is marked failed.
- **Rate limiting:** token bucket per provider plus a DB check of recent
  `BikeProviderRequest` rows (`rateLimitPerMinute`).
- **Request logging:** every provider call recorded in `BikeProviderRequest`.
- **Attribution / last sync:** stored on `DataProvider.attributionText`,
  `DataProvider.lastSyncAt`, `BikeModel.lastSyncedAt`, `BikeVariant.lastSyncedAt`.
- **Never deletes** existing records; **never touches** `BikePricing` / `BikePriceHistory`.
  Provider DTOs contain no price fields at all.

---

## 6. Pricing Protection

`src/services/bike-pricing.service.ts`:

- All writes require an authorised staff role (`Super Admin`, `Owner`, `Manager`) enforced
  **server-side** in both the route handler and the service.
- Server-side Zod validation of every price field.
- Every create/update/approve writes an immutable `BikePriceHistory` row capturing staff id,
  staff name, previous values, new values, changed fields, reason, IP and timestamp.
- Synthetic staff action is written to `AuditLog`.
- External sync code has no import of, or path to, the pricing service.
- The pricing UI/API cannot modify API-managed specification fields — only price fields are
  accepted (`exShowroomPricePaise`, `onRoadPricePaise`, `insurancePaise`, `rtoPaise`,
  `accessoriesPaise`, `dealerOfferPaise`, `finalSellingPricePaise`, `isPublished`, `notes`).
- Public `GET /api/public/bike-catalogue*` returns pricing **read-only** and only when
  `isPublished = true`; always staff-managed values.

---

## 7. API surface

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/admin/bike-catalogue` | staff read | search by brand/model/variant, provider, sync status |
| GET | `/api/admin/bike-catalogue/[id]` | staff read | specs, colours, images, provider, sync status, pricing |
| GET | `/api/admin/bike-pricing` | staff read | list pricing |
| PUT | `/api/admin/bike-pricing` | pricing roles | create/update price (audited) |
| POST | `/api/admin/bike-pricing/publish` | pricing roles | approve/publish price (audited) |
| GET | `/api/admin/bike-pricing/[variantId]/history` | staff read | price history |
| POST | `/api/admin/bike-sync` | sync roles | manual sync |
| GET | `/api/admin/bike-sync/runs` | staff read | sync runs + provider status |
| GET | `/api/admin/bike-sync/errors` | staff read | sync error log |
| GET | `/api/admin/data-providers` | admin | provider registry/status |
| GET | `/api/cron/bike-sync` | `CRON_SECRET` | scheduled sync |
| GET | `/api/public/bike-catalogue` | public | published catalogue (read-only) |
| GET | `/api/public/bike-catalogue/[slug]` | public | published detail (read-only) |

All admin endpoints follow the `{ data }` / `{ error: { code, message, details? } }` contract.

---

## 8. Admin dashboard

- `/admin/bike-catalogue` — search by brand/model/variant; provider, sync status columns.
- `/admin/bike-catalogue/[modelId]` — specifications, colours, images, provider attribution,
  last sync, linked pricing (read-only here; edit via pricing page).
- `/admin/bike-pricing` — manage prices + view price history.
- `/admin/bike-sync` — provider status, manual sync trigger, run history, error log.

The pricing screen only exposes price fields; specification edits are not possible from it.

---

## 9. BikeWale authorisation onboarding checklist

- [ ] Confirm official API / commercial data licence with BikeWale in writing.
- [ ] Receive documented base URL, authentication scheme and catalogue endpoint path.
- [ ] Obtain API key; store in the platform secret manager (never commit).
- [ ] Set `BIKEWALE_API_BASE_URL`, `BIKEWALE_API_KEY`, `BIKEWALE_API_CATALOG_PATH`.
- [ ] Confirm the response field mapping in `providers/bikewale.provider.ts`.
- [ ] Run a manual sync in staging; verify `BikeProviderRequest` log and `BikeSyncLog`.
- [ ] Verify images are licensed for display and attribution text is correct.
- [ ] Only then may the integration be described as operational.

---

## 10. Environment variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `BIKE_SYNC_CRON_SECRET` / `CRON_SECRET` | scheduled sync | bearer secret for `/api/cron/bike-sync` |
| `BIKE_PROVIDER_MOCK_ENABLED` | no | enable the deterministic mock provider for dev/test |
| `BIKE_SYNC_MAX_RETRIES` | no | transient retry count (default 3) |
| `BIKEWALE_API_BASE_URL` | BikeWale | official base URL (pending agreement) |
| `BIKEWALE_API_KEY` | BikeWale | official API key (pending agreement) |
| `BIKEWALE_API_CATALOG_PATH` | BikeWale | documented catalogue path (pending agreement) |

No credential is ever stored in the database or committed to the repository.
