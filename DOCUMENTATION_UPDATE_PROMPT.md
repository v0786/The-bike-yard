# Documentation Update Prompt — The Bike Yard

Update project tracking documentation only after implementation and QA evidence are available.

1. Read the current tracker, checklist, decisions and relevant documentation.
2. Confirm the task ID and evidence from the completed task report.
3. Update only the relevant task status and concise implementation notes.
4. Mark `DONE` only when acceptance criteria and required tests passed and QA approved.
5. Use `PARTIAL` for incomplete work, `BLOCKED` for external/dependency blockers, and `FAILED` for unsuccessful implementation.
6. Do not alter owner decisions, product requirements, API contracts, database contracts or security policy without explicit owner approval.
7. Do not delete historical notes or overwrite unrelated progress.
8. Keep `tracker.md` and `CHECKLIST.md` consistent; update related docs only when the implementation genuinely changes them.
9. Include test evidence and remaining work.
10. Review the diff to ensure documentation changes are accurate.

Report every file updated and the reason. If evidence is insufficient, do not change the status; explain what evidence is missing.
