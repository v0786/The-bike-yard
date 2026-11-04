# The Bike Yard — Team Development & QA Execution Plan

**Source basis:** Uploaded `CHECKLIST.md` for The Bike Yard, based on `tracker.md`, `PRODUCTION_READINESS_REPORT.md`, `DECISIONS.md`, `DOCUMENTATION_STATUS.md`, and `docs/` v1.1.

**Planning rule:** Each execution cycle targets one small, verifiable microtask and approximately 3–4 minutes of implementation plus targeted testing. This is a time-box, not a guarantee that a complete feature can be built in four minutes. If a task is too large, the team must split it into smaller tasks and stop at a safe checkpoint.

## 1. Team structure

Use the agent-team or subagent capability available in the coding environment. Do not assume a particular framework is installed.

| Role | Responsibility | Permission / boundary |
|---|---|---|
| Team Lead / Orchestrator | Reads project instructions, selects one task, assigns work, resolves dependencies, integrates results | Owns task status and final acceptance |
| Repository Analyst | Reads source code, tracker, architecture, API and database contracts; identifies exact implementation gap | Read-only unless explicitly assigned |
| Frontend Engineer | Implements UI, responsive behaviour, forms and client-side validation | Owns assigned frontend files only |
| Backend Engineer | Implements APIs, business rules, persistence and server-side validation | Owns assigned backend files only |
| QA Engineer | Defines acceptance checks, runs targeted tests, regression checks and reports defects | Independently reviews; does not approve its own implementation |
| Security Reviewer | Reviews auth, permissions, validation, secrets, sensitive data and auditability | Reviews high-risk changes; does not invent business policy |
| Documentation / Tracker Agent | Updates tracker, checklist, changelog and relevant technical docs after verified completion | Never marks a task complete without evidence |

**Small-team mode:** If the tool cannot run all roles as separate agents, the Team Lead should simulate the roles sequentially. Keep QA independent from implementation review.

## 2. Rules for parallel work

Parallelise only tasks with separate files and no unresolved dependency.

- Do not let two agents edit the same file or shared schema at the same time.
- Repository Analyst maps files and dependencies before implementation.
- Frontend and Backend can work in parallel only after the API contract is agreed.
- QA prepares acceptance tests in parallel, but executes final verification against the integrated change.
- Security Reviewer reviews payment, invoice, refund, authentication, permissions and data-retention changes.
- Team Lead integrates changes and resolves conflicts.
- If a dependency is incomplete, do not work around it by inventing data, APIs, policies or placeholder business rules.

## 3. Task roadmap

Statuses below reflect the uploaded checklist: **NS = Not Started**, **IP = In Progress**. An IP task is not complete; inspect the repository to determine its exact remaining work.

### Sprint 0 — Repository reconnaissance and task setup

**Goal:** Confirm the current code state before editing.

- [ ] Read `AGENTS.md`, `CLAUDE.md`, `README`, project scripts and relevant architecture docs if present.
- [ ] Inspect `tracker.md`, `CHECKLIST.md`, `DECISIONS.md` and the relevant v1.1 docs.
- [ ] Check Git status and current branch; preserve existing user changes.
- [ ] Map each selected tracker item to actual source files, tests and dependencies.
- [ ] Confirm package scripts and the fastest targeted test commands.
- [ ] Create a task branch or follow the repository's existing branch policy.
- [ ] Record baseline build/test status before changes.

**Deliverable:** A short task map with exact files, acceptance criteria, dependencies and test commands. Do not start a broad rewrite.

### Sprint 1 — Finish in-progress financial work (high risk; owner decisions gate live use)

#### Task 1A — Payment recording and allocations (PHASE-5-01, IP)
- [ ] Compare implementation with API and database contracts.
- [ ] Identify one missing or defective payment-recording path.
- [ ] Implement only that path, including server-side validation and permissions.
- [ ] Add or update focused tests for allocation correctness and failure handling.
- [ ] QA the assigned path.
- [ ] Keep live payment processing disabled until the payment provider and required owner decisions are approved.

#### Task 1B — GST invoice generation (PHASE-5-02, IP)
- [ ] Audit invoice implementation against API/database v1.1 contracts.
- [ ] Identify missing calculation, validation or invoice-generation behaviour.
- [ ] Implement only behaviour supported by approved project requirements.
- [ ] Add tests for CGST/SGST/IGST calculation and invalid input where the approved rates are available.
- [ ] Obtain owner and qualified tax-professional approval for GSTIN, rates and HSN/SAC codes before enabling live invoice generation.
- [ ] Do not invent GST values or enable `POST /api/admin/invoices` for live use before approval.

#### Task 1C — Refund lifecycle (PHASE-5-03, IP)
- [ ] Audit pending → approved → completed/rejected transitions.
- [ ] Verify the requester cannot self-approve.
- [ ] Implement one missing transition or permission check at a time.
- [ ] Add tests for allowed and rejected transitions.
- [ ] Verify audit history and failure handling.
- [ ] Keep live refund processing gated until the owner approves thresholds and policy.

**Sprint exit:** Payment, invoice and refund code matches the approved contracts and tests. Business decisions remain explicit blockers; code completion does not imply permission to process live transactions.

### Sprint 2 — Public website and catalogue administration

#### Task 2A — Responsive website and mobile testing (PHASE-2-07, NS)
- [ ] Identify public pages and existing responsive breakpoints.
- [ ] Test one page at a time at mobile, tablet and desktop widths.
- [ ] Fix the highest-impact overflow, navigation or form issue.
- [ ] Add or update a focused regression check where supported.
- [ ] QA keyboard navigation and primary customer enquiry journeys.

#### Task 2B — Admin catalogue forms (PHASE-3-05, NS)
- [ ] Inspect existing admin patterns and PHASE-3-03 dependency.
- [ ] Build or complete one entity form at a time: brand, model, variant, colour.
- [ ] Add required-field and invalid-input validation.
- [ ] Verify create/edit behaviour and permission checks.
- [ ] Test persistence and error states.
- [ ] Verify catalogue changes appear in dependent screens.

**Sprint exit:** Public pages work at supported screen sizes; authorised staff can maintain the required catalogue entities.

### Sprint 3 — Staff portal notifications

#### Task 3A — Notifications (P8-3, NS; depends on P8-2)
- [ ] Inspect P8-2 and the notification requirements before coding.
- [ ] Identify the required notification events and delivery channels from project docs.
- [ ] Implement one event and delivery path at a time.
- [ ] Add tests for recipient permissions and delivery failure behaviour.
- [ ] Verify read/unread behaviour only if specified by the project contract.
- [ ] Do not invent channels, event types or notification policies.

**Sprint exit:** Required notification events work for the correct staff roles and have tests.

### Sprint 4 — Reports and analytics

Complete dependencies before dependent reports.

#### Task 4A — Sales/revenue charts (P9-2, IP; depends on P5-5 and P6-1)
- [ ] Inspect current chart implementation and data sources.
- [ ] Verify date filtering, aggregation and empty states.
- [ ] Fix one discrepancy at a time.
- [ ] Test totals against source sales records.

#### Task 4B — Best-selling variants (P9-3, NS; depends on P5-5)
- [ ] Define ranking from the existing sales contract.
- [ ] Implement aggregation and period filtering.
- [ ] Test ordering, ties, empty periods and data accuracy.

#### Task 4C — Stock ageing (P9-4, NS; depends on P4-3)
- [ ] Confirm the stock-entry date field from the schema.
- [ ] Implement ageing calculation and display.
- [ ] Test boundary dates and missing/invalid dates.

#### Task 4D — Salesperson performance (P9-5, NS; depends on P5-5 and P1-1)
- [ ] Confirm salesperson attribution rules from existing contracts.
- [ ] Implement aggregation using approved data.
- [ ] Test attribution, date filters and role permissions.

#### Task 4E — Report exports (P9-6, NS; depends on P9-1 through P9-5)
- [ ] Confirm supported export formats and permissions from project docs.
- [ ] Implement one report export at a time.
- [ ] Test exported values against the on-screen report.
- [ ] Verify access control and safe handling of exported data.

**Sprint exit:** Reports reconcile to source records; exports match visible report data.

### Sprint 5 — Blogs, social links, FAQs and public display

#### Task 5A — Blogs management (P10-1, IP; depends on P1-2)
- [ ] Audit create/edit/publish behaviour against requirements.
- [ ] Complete one missing workflow at a time.
- [ ] Test validation, permissions and public visibility rules.

#### Task 5B — Social links management (P10-2, IP; depends on P1-2)
- [ ] Audit save/edit and URL validation.
- [ ] Complete the missing path.
- [ ] Test malformed URLs and authorised access.

#### Task 5C — FAQ management (P10-3, IP; depends on P1-2)
- [ ] Audit create/edit/publish behaviour.
- [ ] Complete missing validation or workflow.
- [ ] Test public/private visibility as specified.

#### Task 5D — Public social/FAQ display (P10-5, NS; depends on P10-2 and P10-3)
- [ ] Display approved social links and FAQs on the public website.
- [ ] Test empty, unpublished, removed and populated states.
- [ ] Check responsive behaviour and accessible labels.

**Sprint exit:** Admin-managed content appears correctly on the public website according to publication rules.

### Sprint 6 — AI chatbot

#### Task 6A — Knowledge source (P11-1, IP; depends on P3-1 and P10-3)
- [ ] Identify approved dealership knowledge sources.
- [ ] Verify freshness and source boundaries.
- [ ] Complete one missing source integration or retrieval path.
- [ ] Test missing and conflicting information.

#### Task 6B — Chatbot responses (P11-2, IP; depends on P11-1)
- [ ] Audit response behaviour against the knowledge source.
- [ ] Test common supported questions.
- [ ] Test unknown questions and unsupported claims.
- [ ] Make the bot defer to dealership staff when reliable information is unavailable.

#### Task 6C — No-hallucination guard (P11-4, IP; depends on P11-2)
- [ ] Test questions for which no source answer exists.
- [ ] Test conflicting or stale facts.
- [ ] Implement one guardrail improvement at a time.
- [ ] Verify the bot does not invent prices, stock, finance, insurance, policies or delivery promises.

#### Task 6D — Enquiry collection (P11-3, NS; depends on P11-2 and P5-2)
- [ ] Confirm required enquiry fields, consent text and routing rules from project docs.
- [ ] Implement collection and validation.
- [ ] Persist or route enquiries according to the approved workflow.
- [ ] Test duplicate submissions, invalid details and permission boundaries.

**Sprint exit:** Chatbot answers from approved information, declines to guess, and collects enquiries through the specified workflow.

### Sprint 7 — QA, security and release preparation

#### Task 7A — Browser E2E (P12-3, IP)
- [ ] Run Playwright in a normal environment where the browser can reach the app.
- [ ] Run critical customer and admin journeys.
- [ ] Capture failures and fix one defect per cycle.
- [ ] Re-run affected tests and the full E2E suite.

#### Task 7B — Deployment configuration (P12-8, NS; depends on P12-7)
- [ ] Verify `vercel.json` and deployment settings.
- [ ] Configure required staging variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STORAGE_PROVIDER`, and applicable `S3_*`.
- [ ] Keep secrets out of Git and logs.
- [ ] Deploy to staging, not production.
- [ ] Run migrations, seed and verification according to project docs.

#### Task 7C — Production gates
- [ ] Owner approves GSTIN, rates and HSN/SAC details with qualified tax review.
- [ ] Owner selects payment gateway.
- [ ] Owner approves refund thresholds and policy.
- [ ] Owner approves document retention durations.
- [ ] Owner confirms finance partners, insurance providers and WhatsApp Business API/templates if those modules are to be enabled.
- [ ] Qualified consultant performs penetration testing.
- [ ] Prepare and test rollback plan.
- [ ] Complete owner UAT and obtain sign-off.
- [ ] Assign named owners to the seven roles or explicitly combine roles for the small team.
- [ ] Re-run release verification.

**Release gate:** No production deployment until all applicable blockers are resolved and staging/UAT sign-off is complete.

## 4. Standard 3–4 minute microtask cycle

Every task must follow this sequence:

1. **Inspect (30–45 sec):** Read the exact implementation, contracts and tests. Check Git status.
2. **Plan (15–30 sec):** State one small change and its acceptance criteria.
3. **Implement (1–2 min):** Change the smallest possible surface area.
4. **Test (45–60 sec):** Run the narrowest relevant test, typecheck/lint if practical.
5. **QA and report (30–45 sec):** Review diff, test output, risks and tracker status.

If the task cannot be completed safely within the time-box:
- Stop at a safe checkpoint.
- Do not leave broken or half-integrated code.
- Report what is done and what remains.
- Split the remainder into the next microtask.
- Never claim success without test evidence.

## 5. Verification commands

Use the package manager and scripts actually defined by the repository. The source checklist reports these commands/results:

```bash
npx tsc --noEmit
npx eslint .
npx vitest run
npx next build
```

For each microtask:
- Run the narrowest relevant unit/integration test first.
- Run typecheck and lint when the changed code warrants it.
- Run the full test suite and production build at integration/release checkpoints.
- Run Playwright in a non-restricted environment; do not report it as passed merely because the suite is written.

Baseline reported by the source checklist:
- TypeScript: 0 errors.
- ESLint: 0 errors, 5 warnings.
- Unit + integration: 88/88 passed.
- PostgreSQL integration: 11 passed.
- Production build: passed.
- WCAG 2.1 AA audit: passed.
- Security review: passed.
- Backup/restore: verified.
- Playwright: suite written, execution still outstanding.

Re-run checks after changes; old results are not proof that new code passes.

## 6. Git and change safety

- Start by checking `git status`; never overwrite or discard user changes.
- Keep each microtask small and reviewable.
- Do not run destructive database, migration-reset, cleanup or deployment commands without explicit approval.
- Do not commit, push, merge or deploy unless the user/project instructions authorise it.
- Do not modify source-of-truth contracts merely to make tests pass.
- Do not introduce fake integrations or mark stubs as live.
- Do not expose secrets in output, tests, logs or documentation.
- If a test fails before the change, record the baseline failure separately.

## 7. Agent-skills / GitHub installation policy

Do not install a GitHub skill just because one might be useful.

1. Inspect existing repository instructions, installed agent skills and the coding environment's available team/subagent tools.
2. Decide whether a specific capability is genuinely missing (for example, Playwright QA or security review).
3. If a skill is needed, search for a reputable and maintained source, preferably the official publisher.
4. Review its README, license, install instructions and scripts before running anything.
5. Install only the specific skill needed; avoid broad/unreviewed bundles.
6. Pin or record the repository URL and commit/version, and document what was installed.
7. Do not grant secrets or broad permissions to a skill.
8. If no trustworthy skill is necessary, use the project's existing tools and continue without installation.

The agent must report the proposed skill and why it is needed before installing it. Do not silently install packages, skills or GitHub repositories.

## 8. Definition of Done for every microtask

A microtask can be marked complete only when:

- [ ] The task matches a real tracker/checklist requirement.
- [ ] Dependencies and API/database contracts were respected.
- [ ] Implementation is limited to the agreed scope.
- [ ] Relevant tests were added or updated.
- [ ] Relevant tests pass.
- [ ] Typecheck/lint/build checks appropriate to the change pass.
- [ ] QA reviewed the diff and acceptance criteria.
- [ ] No secrets, unrelated changes or unexplained regressions were introduced.
- [ ] Documentation and tracker/checklist statuses are updated with evidence.
- [ ] Remaining risks and owner decisions are clearly recorded.

## 9. Required report after every cycle

```text
TASK:
TRACKER ID:
STATUS: DONE / PARTIAL / BLOCKED

WHAT WAS INSPECTED:
FILES CHANGED:
IMPLEMENTATION:
TESTS RUN:
TEST RESULTS:
QA REVIEW:
BUILD / TYPECHECK / LINT:
DEPENDENCIES OR OWNER DECISIONS:
RISKS:
NEXT SMALLEST TASK:
```

## 10. First recommended execution order

Start with repository reconnaissance, then choose one task at a time in this order:

1. Audit PHASE-5-01 payment recording and allocations.
2. Audit PHASE-5-02 invoice generation and identify owner-approved inputs required.
3. Audit PHASE-5-03 refund lifecycle and self-approval protection.
4. Complete PHASE-3-05 catalogue forms in small entity-by-entity tasks.
5. Complete PHASE-2-07 responsive testing page by page.
6. Complete P8-3 notifications after verifying P8-2.
7. Complete report tasks in dependency order.
8. Complete P10 content management and public display.
9. Complete chatbot safeguards before enquiry collection.
10. Run browser E2E, deployment preparation and release gates.

This order is a practical recommendation, not a replacement for tracker dependencies. If repository inspection reveals a prerequisite is incomplete, resolve that prerequisite first.

---

**Current release decision from the source checklist: NOT READY FOR PRODUCTION.**
