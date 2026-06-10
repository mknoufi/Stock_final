import asyncio
import time
from backend.api.admin_dashboard_api import get_dashboard_summary

async def mock_get_dashboard_kpis(user):
    await asyncio.sleep(0.5)
    class KPI:
        def model_dump(self): return {}
    return KPI()

async def mock_get_system_status(user):
    await asyncio.sleep(0.5)
    class Sys:
        def model_dump(self): return {}
    return Sys()

async def mock_get_active_users(user):
    await asyncio.sleep(0.5)
    class User:
        def model_dump(self): return {}
    return [User()]

class MockDB:
    class error_logs:
        @staticmethod
        async def count_documents(*args, **kwargs):
            await asyncio.sleep(0.5)
            return 0

from unittest.mock import patch

async def main():
    import backend.api.admin_dashboard_api as module
    module.get_db = lambda: MockDB()
    module.get_dashboard_kpis = mock_get_dashboard_kpis
    module.get_system_status = mock_get_system_status
    module.get_active_users = mock_get_active_users

    start = time.time()
    await module.get_dashboard_summary({})
    end = time.time()
    print(f"Time taken: {end - start:.2f}s")

asyncio.run(main())
