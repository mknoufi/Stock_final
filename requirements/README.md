# Enterprise Requirements Structure

This directory contains deterministic, enterprise-locked requirements with pinned versions for reproducible builds.

## Installation

Install runtime dependencies:
```bash
pip install -r requirements/requirements.txt
```

Install development dependencies:
```bash
pip install -r requirements/dev.txt
```

## Structure

- `requirements.txt` - Entry point that includes base, ai, and observability
- `base.txt` - Runtime and core platform dependencies
- `dev.txt` - Testing, linting, security scanning, and load testing
- `ai.txt` - AI/matching/embeddings dependencies
- `observability.txt` - OpenTelemetry tracing and monitoring

## Notes

- All versions are pinned to minimums for safety
- This provides clean separation of runtime vs dev vs AI vs observability
- For full supply-chain hardening, consider using `pip-tools` to generate `requirements.lock.txt` with hashes
