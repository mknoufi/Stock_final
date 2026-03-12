"""Compatibility entrypoint for the backend FastAPI app.

Implementation moved to ``backend.app_factory`` to keep this module focused
on import/export stability for runtime and tests.
"""

from backend.app_factory import *  # noqa: F401,F403


if __name__ == "__main__":
    import runpy

    runpy.run_module("backend.app_factory", run_name="__main__")
