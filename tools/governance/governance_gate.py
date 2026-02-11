#!/usr/bin/env python3
"""
Governance gate for PR/release control.

Fails when high-impact code surfaces change without required governance artifacts.
"""

from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from fnmatch import fnmatch
from pathlib import PurePosixPath
from typing import Iterable


REQUIRED_DOCS = [
    "docs/CODE_DERIVED_USER_WORKFLOW_DIAGRAMS.md",
    "docs/GOVERNANCE_ACCEPTANCE_CRITERIA.md",
    "docs/GOVERNANCE_STATE_MACHINES.md",
    "docs/GOVERNANCE_ROLE_AUTHORITY_MATRIX.md",
    "docs/GOVERNANCE_OFFLINE_SYNC_INVARIANTS.md",
    "docs/GOVERNANCE_FAILURE_PATHS.md",
    "docs/GOVERNANCE_API_DB_ENFORCEMENT_MAP.md",
    "docs/GOVERNANCE_AUDIT_TRACEABILITY.md",
    "docs/GOVERNANCE_SQL_ERP_SURFACES.md",
    "docs/GOVERNANCE_RELEASE_CHECKLIST.md",
]

ROUTE_DIFF_PATTERNS = [
    re.compile(r"^\s*@\w*router\.(get|post|put|patch|delete|websocket)\("),
    re.compile(r"^\s*app\.include_router\("),
    re.compile(r"^\s*router\.include_router\("),
    re.compile(r"^\s*APIRouter\("),
]


def _run_git(args: list[str]) -> str:
    result = subprocess.run(
        ["git", *args],
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
        check=False,
    )
    if result.returncode != 0:
        raise RuntimeError(f"git {' '.join(args)} failed: {result.stderr.strip()}")
    return result.stdout


def _normalize(path: str) -> str:
    return str(PurePosixPath(path.replace("\\", "/")))


def _changed_files(base: str, head: str) -> list[str]:
    out = _run_git(["diff", "--name-only", "--diff-filter=ACMR", base, head])
    files = [_normalize(line.strip()) for line in out.splitlines() if line.strip()]
    return files


def _diff_patch(base: str, head: str) -> str:
    return _run_git(["diff", "-U0", base, head])


def _contains_any(changed: Iterable[str], patterns: Iterable[str]) -> bool:
    paths = list(changed)
    for path in paths:
        for pattern in patterns:
            if fnmatch(path, pattern):
                return True
    return False


def _added_route_surface(patch: str) -> bool:
    for raw in patch.splitlines():
        if not raw.startswith("+") or raw.startswith("+++"):
            continue
        line = raw[1:]
        if any(p.search(line) for p in ROUTE_DIFF_PATTERNS):
            return True
    return False


def _doc_changed(changed: set[str], path: str) -> bool:
    return _normalize(path) in changed


def _missing_paths(paths: Iterable[str]) -> list[str]:
    missing: list[str] = []
    for p in paths:
        if not PurePosixPath(p).as_posix() or not os.path.exists(p):
            missing.append(p)
    return missing


def _require_docs(
    *,
    condition: bool,
    changed: set[str],
    docs: list[str],
    reason: str,
    violations: list[str],
) -> None:
    if not condition:
        return
    missing_updates = [d for d in docs if not _doc_changed(changed, d)]
    if missing_updates:
        violations.append(
            f"{reason}: missing required governance doc updates: {', '.join(missing_updates)}"
        )


def _state_tests_touched(changed: set[str]) -> bool:
    test_patterns = [
        "backend/tests/**/*state*.py",
        "backend/tests/**/*transition*.py",
        "backend/tests/**/governance/*.py",
    ]
    return _contains_any(changed, test_patterns)


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run governance gate checks.")
    parser.add_argument("--base", default=os.getenv("GITHUB_BASE_SHA", "HEAD~1"))
    parser.add_argument("--head", default=os.getenv("GITHUB_SHA", "HEAD"))
    return parser.parse_args()


def main() -> int:
    args = _parse_args()
    base = args.base
    head = args.head

    try:
        changed_files = _changed_files(base, head)
        patch = _diff_patch(base, head)
    except RuntimeError as exc:
        print(f"::error::{exc}")
        return 2

    changed = set(changed_files)
    violations: list[str] = []

    missing_docs = _missing_paths(REQUIRED_DOCS)
    if missing_docs:
        violations.append(f"missing required governance documents: {', '.join(missing_docs)}")

    route_surface_changed = _contains_any(
        changed,
        [
            "backend/api/*.py",
            "backend/api/**/*.py",
            "backend/server.py",
            "frontend/app/**/*.ts",
            "frontend/app/**/*.tsx",
            "frontend/src/components/auth/*.tsx",
            "frontend/src/utils/roleNavigation.ts",
        ],
    ) or _added_route_surface(patch)

    _require_docs(
        condition=route_surface_changed,
        changed=changed,
        docs=[
            "docs/CODE_DERIVED_USER_WORKFLOW_DIAGRAMS.md",
            "docs/GOVERNANCE_ACCEPTANCE_CRITERIA.md",
            "docs/GOVERNANCE_API_DB_ENFORCEMENT_MAP.md",
        ],
        reason="workflow/api surface changed",
        violations=violations,
    )

    state_surface_changed = _contains_any(
        changed,
        [
            "backend/services/count_state_machine.py",
            "backend/services/session_state_machine.py",
            "backend/services/transition_gateway.py",
            "backend/services/transition_request_repository.py",
            "backend/api/count_lines_api.py",
            "backend/api/session_management_api.py",
            "backend/api/v1/inventory/*.py",
        ],
    )

    _require_docs(
        condition=state_surface_changed,
        changed=changed,
        docs=["docs/GOVERNANCE_STATE_MACHINES.md"],
        reason="state transition surface changed",
        violations=violations,
    )
    if state_surface_changed and not _state_tests_touched(changed):
        violations.append(
            "state transition surface changed: missing test updates in backend/tests/*state*|*transition*|governance/"
        )

    role_surface_changed = _contains_any(
        changed,
        [
            "backend/auth/*.py",
            "backend/auth/**/*.py",
            "backend/api/user_management_api.py",
            "backend/api/permissions_api.py",
            "frontend/src/components/auth/*.tsx",
            "frontend/src/hooks/usePermission.ts",
            "frontend/app/admin/_layout.tsx",
            "frontend/app/supervisor/_layout.tsx",
            "frontend/app/staff/_layout.tsx",
        ],
    )
    _require_docs(
        condition=role_surface_changed,
        changed=changed,
        docs=["docs/GOVERNANCE_ROLE_AUTHORITY_MATRIX.md"],
        reason="role authority surface changed",
        violations=violations,
    )

    offline_surface_changed = _contains_any(
        changed,
        [
            "frontend/src/services/offline/*.ts",
            "frontend/src/services/offline/**/*.ts",
            "frontend/src/services/sync*.ts",
            "frontend/src/services/sync/**/*.ts",
            "backend/api/sync_batch_api.py",
            "backend/api/sync_conflicts_api.py",
        ],
    )
    _require_docs(
        condition=offline_surface_changed,
        changed=changed,
        docs=[
            "docs/GOVERNANCE_OFFLINE_SYNC_INVARIANTS.md",
            "docs/GOVERNANCE_FAILURE_PATHS.md",
        ],
        reason="offline/sync surface changed",
        violations=violations,
    )

    sql_surface_changed = _contains_any(
        changed,
        [
            "backend/services/sql_sync_service.py",
            "backend/services/sql_verification_service.py",
            "backend/sql_server_connector.py",
            "backend/api/sql_connection_api.py",
            "backend/api/v2/items.py",
            "backend/api/enhanced_item_api.py",
        ],
    )
    _require_docs(
        condition=sql_surface_changed,
        changed=changed,
        docs=["docs/GOVERNANCE_SQL_ERP_SURFACES.md"],
        reason="sql/erp integration surface changed",
        violations=violations,
    )

    audit_surface_changed = _contains_any(
        changed,
        [
            "backend/services/transition_gateway.py",
            "backend/services/transition_request_repository.py",
            "backend/domain_events/*.py",
            "backend/domain_events/**/*.py",
            "backend/api/supervisor_workflow_api.py",
            "backend/api/sync_conflicts_api.py",
            "backend/api/admin_control_api.py",
            "backend/api/sql_connection_api.py",
        ],
    )
    _require_docs(
        condition=audit_surface_changed,
        changed=changed,
        docs=["docs/GOVERNANCE_AUDIT_TRACEABILITY.md"],
        reason="audit-critical surface changed",
        violations=violations,
    )

    if violations:
        print("Governance gate failed.")
        for issue in violations:
            print(f"::error::{issue}")
        return 1

    print("Governance gate passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
