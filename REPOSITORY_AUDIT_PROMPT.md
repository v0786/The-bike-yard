# Repository Audit Prompt — The Bike Yard

Act as the Repository Analyst and QA Lead. Perform a read-only audit before implementation.

1. Identify the project root, branch, Git status and existing user changes.
2. Read applicable project instructions and all available source-of-truth documents, including tracker, decisions, readiness report, documentation status and relevant `docs/` files.
3. Inspect the real codebase, routes/pages, components, API handlers, database schema/migrations, authentication/authorization, integrations and tests.
4. Compare each unfinished/in-progress checklist item with actual code and tests.
5. Classify each requirement:
   - `IMPLEMENTED_AND_VERIFIED`
   - `IMPLEMENTED_NOT_VERIFIED`
   - `PARTIALLY_IMPLEMENTED`
   - `NOT_IMPLEMENTED`
   - `BROKEN`
   - `BLOCKED_BY_OWNER_DECISION`
   - `BLOCKED_BY_DEPENDENCY`
   - `NOT_ENOUGH_EVIDENCE`
6. For each gap, list evidence: file paths, symbols/routes, test names and missing acceptance criteria. Do not infer completion from filenames or UI appearance alone.
7. Identify dependency order and the smallest useful 5–6 minute microtasks.
8. Report baseline checks that were actually run. Do not claim old checklist results are current.
9. Identify missing tests, security-sensitive areas and environment limitations.
10. Do not edit code, install skills/packages, alter tracker statuses, run migrations or deploy.

Output:
- Executive status.
- Git and environment baseline.
- Document inventory and any missing documents.
- Feature-by-feature evidence matrix.
- Confirmed gaps and blockers.
- Suggested microtask queue with dependencies and acceptance criteria.
- Commands used and actual results.
- Risks and unresolved owner decisions.

End by asking the user to approve the first microtask. Do not begin implementation.
