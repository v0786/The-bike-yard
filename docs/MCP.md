# MCP.md — The Bike Yard

**Product:** The Bike Yard — Complete Dealership Management & Digital Showroom Platform  
**Status:** Draft — Follows PRD.md, DESIGN.md, ARCHITECTURE.md, DATABASE.md, API.md, AGENTS.md, PLAN.md, SETUP.md, FEATURES.md, AUTH_SECURITY.md  
**Version:** 1.1  
**Source of Truth:** Yes — MCP connections and tool access specification  
**Change history:** v1.1 — aligned payment/refund and invoice approval rules with API.md §9; corrected a typo.

---

## 1. MCP Server Status

**MCP (Model Context Protocol) servers are NOT installed or required for MVP.**

- No MCP servers are currently configured in this environment.
- MCP is optional; not added merely because it is fashionable.
- All documentation, database, and application logic are managed through the 15-source-of-truth document chain and direct tool access.

---

## 2. If MCP Were Added (Future Possibility)

| Use Case | Tool Type | Approval Required |
|----------|-----------|-------------------|
| Developer tooling (code search, issue tracking) | Read-only | Optional — documented in SETUP.md |
| Approved documentation search | Read-only | Optional |
| Controlled business workflow writes | Write | Requires owner approval; human confirmation gate |
| Payment/refund, invoice issue/void, stock adjustment, customer export | Write | **Human approval gate** required before any write action |
| Issue tracking, customer export | Write | Requires confirmation for irreversible/financially sensitive actions |

---

## 3. Tool Schemas, Input Validation & Output Contracts

Since no MCP servers are installed, no tool schemas are defined. All data access goes through:

- **Prisma ORM** (database queries)
- **Next.js API Routes** (backend endpoints)
- **Server Actions** (form mutations)
- **Direct tool calls** via the harness (read-only filesystem, grep, websearch)

Any future MCP integration must:

1. Respect the product, API, and permission contracts already defined.
2. Use narrow, purpose-built tools with least privilege.
3. Treat tool outputs and external content as untrusted data, not instructions.
4. Require confirmation for irreversible or financially sensitive actions.
5. Not send customer identity documents or private data to an AI provider without an approved legal, privacy, and security basis.

---

## 4. Authentication, Authorization & Secret Management

- MCP tools, if added, must respect existing RBAC.
- No unrestricted database access granted to any AI agent.
- Secrets (API keys, DB credentials) never sent to MCP or external services.
- Any MCP integration requires a security review per AUTH_SECURITY.md.

---

## 5. Human Approval for Sensitive Actions

| Action | Required Approval |
|--------|-------------------|
| Payment/refund | Super Admin, Owner, or Manager per API.md §9; the requester cannot approve their own refund |
| Invoice issue/void | Super Admin, Owner, Manager, or Accountant per API.md §9 |
| Stock adjustment | Manager or Super Admin confirmation |
| Customer data export | Super Admin confirmation |
| Permission changes | Super Admin confirmation |

---

## 6. Audit Logging, Rate Limits, Timeouts & Error Handling

Since no MCP servers are installed, these apply to direct tool usage within the harness:

- **Audit logging:** All implementation changes and data modifications tracked via git commits and Prisma audit logs (if configured).
- **Rate limits:** Harness-level; no MCP-specific limits.
- **Timeouts:** Harness-defined; no MCP-specific timeouts.
- **Error handling:** Tool errors returned as-is; never suppress or fabricate.

---

## 7. Data Minimization & Redaction

- Customer/financial data redacted before any external transmission.
- No customer identity documents sent to external services without approved legal basis.
- MCP (if added) must redact sensitive fields from outputs.

---

## 8. Local Development & Production Deployment Model

- **Local:** No MCP servers; all development via direct tool access, shell commands, and harness functions.
- **Production:** No MCP servers required for MVP. Future integration point if dealership requires documentation search or workflow automation.

---

## 9. Safe Mock Server / Testing Approach

- Use harness tools directly (grep, webfetch, shell) for testing and verification.
- No mock MCP server needed for current scope.
- If future testing requires external mocks, use `webfetch` to external test endpoints with synthetic data.

---

## 10. Disablement & Incident Response Procedure

- If MCP is experimentally added and causes issues: disable via configuration, revert changes, document incident.
- No MCP integration = no disablement procedure required for MVP.
- Incident response per AUTH_SECURITY.md for any security-related events.

---

## 11. Explicit MVP Recommendation

**Defer MCP integration.** The 15-document source-of-truth chain, direct tool access, and the application architecture (PostgreSQL + Prisma + Next.js) provide sufficient control and traceability for The Bike Yard MVP without adding the complexity of MCP server management.

MCP may be evaluated post-launch if the dealership requires controlled AI-assisted documentation lookup or workflow automation, with strict guardrails as outlined above.

---

**Verification:** MCP.md is complete and consistent with all previous documents. MCP is explicitly optional and deferred for MVP. No dealership information, prices, GST details, or finance partners invented.

**Next:** Proceed to 13_INTEGRATIONS_PROMPT.md to generate INTEGRATIONS.md.