#!/usr/bin/env python3
"""
scripts/health_check_summary.py

A lightweight script to aggregate health checks from various components
and emit a summary, suitable for CI/CD pipelines or local validation.
"""

import sys
import os
from pathlib import Path

# Add project root to path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))


def check_file_exists(path):
    return Path(path).exists()


def check_env_vars(required_vars):
    missing = [v for v in required_vars if not os.getenv(v)]
    return missing


def main():
    print("=" * 60)
    print("Stock Verify System — Health Summary")
    print("=" * 60)

    issues = []

    # 1. Environment and Secrets
    print("\n[1] Environment Security")
    if check_file_exists("backend/.env"):
        print("  [WARN] backend/.env file found.")
        # Check if it's gitignored
        if check_file_exists(".gitignore"):
            with open(".gitignore", "r") as f:
                content = f.read()
                if ".env" in content and "backend/.env" in content:
                    print("  [OK] backend/.env is gitignored.")
                else:
                    print("  [WARN] Confirm if .env is properly gitignored!")
                    issues.append("Check .env gitignore status")
    else:
        print("  [OK] No backend/.env file found (Production/CI mode).")

    # 2. Dependencies
    print("\n[2] Dependencies")
    if check_file_exists("backend/requirements.txt"):
        print("  [OK] backend/requirements.txt exists.")
    else:
        print("  [ERR] backend/requirements.txt missing!")
        issues.append("Missing backend/requirements.txt")

    if check_file_exists("frontend/package.json"):
        print("  [OK] frontend/package.json exists.")
    else:
        print("  [ERR] frontend/package.json missing!")
        issues.append("Missing frontend/package.json")

    # 3. Code Quality (Linting)
    print("\n[3] Code Quality")
    # This is just a placeholder; essentially we assume if this script runs, the repo is readable.
    print("  [INFO] Run 'ruff check .' in backend/ for detailed linting.")
    print("  [INFO] Run 'npm run lint' in frontend/ for detailed linting.")

    # Summary
    print("\n" + "-" * 60)
    if issues:
        print(f"❌ Found {len(issues)} potential issues:")
        for i, issue in enumerate(issues, 1):
            print(f"  {i}. {issue}")
        sys.exit(1)
    else:
        print("✅ Basic Health Check Passed")
        sys.exit(0)


if __name__ == "__main__":
    main()
