# Pull Request

## Summary
Describe the business and technical change in 3-6 lines.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Refactor
- [ ] Security fix
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## Governance Impact
- [ ] This PR changes route/API/role/state/offline/sync/audit behavior
- [ ] This PR does not change governance-controlled behavior

If governance behavior changed, complete all relevant checks below.

## Governance Evidence Checklist
- [ ] `docs/CODE_DERIVED_USER_WORKFLOW_DIAGRAMS.md` updated for route/API/role flow changes
- [ ] `docs/GOVERNANCE_ACCEPTANCE_CRITERIA.md` updated with Given/When/Then for changed behavior
- [ ] `docs/GOVERNANCE_STATE_MACHINES.md` updated for state/transition changes
- [ ] Transition tests updated for state changes
- [ ] `docs/GOVERNANCE_ROLE_AUTHORITY_MATRIX.md` updated for auth/permission changes
- [ ] `docs/GOVERNANCE_OFFLINE_SYNC_INVARIANTS.md` updated for offline/sync changes
- [ ] `docs/GOVERNANCE_FAILURE_PATHS.md` updated for new failure handling
- [ ] `docs/GOVERNANCE_API_DB_ENFORCEMENT_MAP.md` updated for guard/constraint changes
- [ ] `docs/GOVERNANCE_AUDIT_TRACEABILITY.md` updated for critical action logging changes
- [ ] `docs/GOVERNANCE_SQL_ERP_SURFACES.md` updated for SQL/ERP integration changes
- [ ] `docs/GOVERNANCE_RELEASE_CHECKLIST.md` reviewed before merge

## Tests and Validation
List exact commands and outcomes.

## Risk and Rollback
- Risk level: Low / Medium / High
- Rollback plan:

## Security and Data Integrity
- [ ] No secrets committed
- [ ] No unauthorized privilege expansion
- [ ] Data mutation paths are idempotent or guarded where required
- [ ] Audit-critical actions remain actor-attributed and timestamped
