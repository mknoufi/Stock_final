#!/usr/bin/env bash
set -euo pipefail

# Ensure generated/runtime artifacts are not tracked in git.
BLOCKED_REGEX='^(frontend/playwright-report/|frontend/test-results/|backend/data/db_backup_[^/]+/|backend/data/db_failed_repair_[^/]+/|backend/data/db_seeded_archive_[^/]+/)'

# Only flag files that are both tracked and present in the working tree.
tracked_blocked="$(
  git ls-files \
    | grep -E "$BLOCKED_REGEX" \
    | while IFS= read -r path; do
        if [[ -e "$path" ]]; then
          echo "$path"
        fi
      done
)"

if [[ -n "$tracked_blocked" ]]; then
  echo "Repository hygiene check failed. Tracked artifacts detected:"
  echo "$tracked_blocked"
  echo
  echo "Remove these from git and keep them ignored."
  exit 1
fi

echo "Repository hygiene check passed."
