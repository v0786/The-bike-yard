# The Bike Yard — Microtask Roadmap

This roadmap is derived from the uploaded project checklist. It is not a fresh source-code audit. Verify every task against the current repository and source documents before implementation.

## Order and task candidates

### 0. Repository reconnaissance — audit only
- [ ] Read all project instructions and source-of-truth documents.
- [ ] Check Git status, branch, scripts and baseline tests.
- [ ] Map tracker IDs to real code, routes, schema and tests.
- [ ] Produce evidence-based gap matrix.
- [ ] Ask owner to approve first implementation task.

### 1. Financial and service interfaces — high risk
- [ ] PHASE-5-01: audit payment recording/allocation; split into one path/validation/test per microtask.
- [ ] PHASE-5-02: audit GST invoice flow; implement only logic supported by approved requirements.
- [ ] PHASE-5-03: audit refund transitions and enforce requester cannot self-approve.
- [ ] Obtain owner decisions for gateway, GSTIN/rates/HSN-SAC, invoice numbering and refund policy before live use.

### 2. Website and admin catalogue
- [ ] PHASE-2-07: audit one public page at a time for mobile/responsive defects.
- [ ] PHASE-3-05: complete one catalogue entity form at a time (brand, model, variant, colour).
- [ ] Verify validation, permissions, persistence and downstream display.

### 3. Staff portal
- [ ] P8-3: inspect P8-2 and requirements first; implement one required notification event/path at a time.

### 4. Reports and analytics
- [ ] P9-2: complete sales/revenue charts (IP; depends P5-5, P6-1).
- [ ] P9-3: best-selling variants (NS; depends P5-5).
- [ ] P9-4: stock ageing (NS; depends P4-3).
- [ ] P9-5: salesperson performance (NS; depends P5-5, P1-1).
- [ ] P9-6: report exports (NS; depends P9-1 through P9-5).
- [ ] Confirm report definitions and export formats in source docs before coding.

### 5. Blogs, social and FAQs
- [ ] P10-1: blogs management (IP; depends P1-2).
- [ ] P10-2: social links (IP; depends P1-2).
- [ ] P10-3: FAQ management (IP; depends P1-2).
- [ ] P10-5: public social/FAQ display (NS; depends P10-2, P10-3).

### 6. AI chatbot
- [ ] P11-1: knowledge source (IP; depends P3-1, P10-3).
- [ ] P11-2: responses (IP; depends P11-1).
- [ ] P11-4: no-hallucination guard (IP; depends P11-2).
- [ ] P11-3: enquiry collection (NS; depends P11-2, P5-2).
- [ ] Do not invent vehicle stock, prices, finance, insurance, policy or delivery facts.

### 7. QA and release preparation
- [ ] P12-3: execute Playwright E2E in an environment where browser can reach the app.
- [ ] P12-8: deployment configuration (NS; depends P12-7).
- [ ] Configure staging environment variables securely.
- [ ] Complete qualified penetration test.
- [ ] Prepare and test rollback.
- [ ] Complete staging, migrations, integration/E2E tests and owner UAT.
- [ ] Obtain all required owner decisions.
- [ ] Production remains blocked until release gates pass.

## Owner decisions listed by source checklist
- [ ] D1 GSTIN and applicable GST rates.
- [ ] D3 invoice numbering prefix/sequence.
- [ ] D4 payment gateway provider.
- [ ] D5 finance partners.
- [ ] D6 insurance providers.
- [ ] D7 WhatsApp Business API availability/templates.
- [ ] Document retention durations.
- [ ] Refund approval policy thresholds.

Source checklist says D2 dealership type and D8 dark mode can proceed independently and are not blockers.

## Production blockers listed by source checklist
- [ ] GST configuration verified.
- [ ] Payment gateway selected.
- [ ] Qualified penetration test performed.
- [ ] Deployment environment variables configured.
- [ ] Rollback plan documented and tested.
- [ ] Refund approval policy confirmed.
- [ ] Document retention durations confirmed.

## Baseline results reported in source checklist (must be re-run after changes)
- TypeScript: 0 errors.
- Production build: passed.
- ESLint: 0 errors, 5 warnings.
- Unit + integration tests: 88/88 passed.
- PostgreSQL integration: 11 passed.
- WCAG 2.1 AA audit: passed.
- Security review: passed.
- Backup/restore: verified.
- Playwright suite written, but browser execution blocked by container network isolation.

## Cycle rule
One microtask per approval cycle, target 5–6 minutes. Split larger work. After one task, report evidence and stop with: **"Can we move to the next task?"**
