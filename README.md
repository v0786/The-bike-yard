# The Bike Yard — AI Development Execution Pack

This pack is designed for OpenCode, Claude Code, or another coding agent that supports repository inspection and (optionally) multi-agent/subagent workflows.

## Files

- `MASTER_EXECUTION_PROMPT.md` — the main prompt. Run this first. It governs the full one-task-at-a-time workflow and requires the agent to stop after each task and ask whether to continue.
- `AGENTS.md` — persistent project-level rules for agents. Copy it to the repository root after reviewing it against any existing `AGENTS.md` or `CLAUDE.md`; do not overwrite existing instructions blindly.
- `REPOSITORY_AUDIT_PROMPT.md` — first-run audit prompt. Use it to establish the real code baseline before implementation.
- `TASK_EXECUTION_PROMPT.md` — reusable prompt for each 5–6 minute microtask.
- `QA_REVIEW_PROMPT.md` — independent QA prompt.
- `DOCUMENTATION_UPDATE_PROMPT.md` — update tracker/checklist/docs only after evidence exists.
- `TASK_ROADMAP.md` — source-derived task sequence and release gates.
- `SOURCE_CHECKLIST.md` — uploaded checklist snapshot, when included.
- `DEVELOPMENT_QA_ROADMAP.md` — detailed plan prepared from the checklist, when included.

## Recommended use

1. Put this pack in the project workspace or copy the relevant files into the repository.
2. Review existing repository instructions before adding `AGENTS.md`.
3. Run `REPOSITORY_AUDIT_PROMPT.md` first. Audit only; do not start implementation.
4. Review the audit findings and approve the first task.
5. Run `MASTER_EXECUTION_PROMPT.md` for the controlled workflow.
6. For each task, use `TASK_EXECUTION_PROMPT.md`, followed by `QA_REVIEW_PROMPT.md`.
7. The agent must stop after one task, report evidence and ask: **"Can we move to the next task?"**
8. Continue only after you explicitly approve.

## 5–6 minute rule

The 5–6 minutes is a target time-box for one small, independently verifiable task, not a promise that a whole module can be completed in that time. If a task is too large, split it into smaller tasks. Do not rush, skip tests, fake completion, or leave the repository in a broken state merely to meet the time-box.

## Source-of-truth rule

The project repository's current source-of-truth documents take precedence for product requirements, architecture, API contracts, database schema, decisions and tracker status. The included checklist and roadmap are planning aids. If they conflict with current source documents or code, stop and report the conflict; do not silently reconcile it.

## Safety

- Do not deploy to production.
- Do not enable live payments, invoices, refunds, finance, insurance or WhatsApp integrations without the required owner decisions and approvals.
- Do not install GitHub skills, packages, plugins or external tools without explaining the need, source and risk and receiving approval.
- Do not overwrite user changes, reset databases, run destructive commands, or commit/push/merge without explicit authorization.
