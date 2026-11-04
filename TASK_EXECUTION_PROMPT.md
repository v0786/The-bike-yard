# Reusable 5–6 Minute Task Prompt — The Bike Yard

Use this prompt only after the owner approves the task.

Execute exactly ONE microtask.

**Task ID:** [TRACKER ID]
**Task:** [ONE SMALL CHANGE]
**Source requirement:** [DOCUMENT + SECTION]
**Acceptance criteria:** [CLEAR, TESTABLE CONDITIONS]
**Allowed scope:** [FILES/MODULES]
**Out of scope:** [WHAT MUST NOT CHANGE]

Before editing:
- Read project instructions and the relevant source documents.
- Check Git status and preserve user changes.
- Verify dependencies and current implementation.
- Confirm this task is small enough for a 5–6 minute cycle. If not, propose smaller subtasks and stop for approval.

During execution:
- Assign the appropriate specialised agent if available.
- Agree contracts before parallel work.
- Implement the smallest safe change.
- Add/update focused tests.
- Run the narrowest relevant tests, then appropriate typecheck/lint/build checks.
- Ask QA to independently inspect the diff and acceptance criteria.
- Fix failures caused by the change and retest.
- Do not change unrelated files or weaken existing safeguards.

Completion:
- Update tracker/checklist/docs only when evidence supports the status.
- Report actual commands and outputs; do not fabricate test results.
- If blocked or time-box exceeded, leave a safe state and report PARTIAL/BLOCKED.
- Do not start another task.

Finish with:
1. Task ID and status.
2. Files changed and what changed.
3. Acceptance criteria results.
4. Tests and actual results.
5. QA findings.
6. Typecheck/lint/build result.
7. Risks/blockers and Git status.
8. Next recommended microtask.

Then ask exactly: **"Can we move to the next task?"**
