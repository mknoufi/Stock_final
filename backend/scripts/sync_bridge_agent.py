import json
import logging
import os
import sys
import time
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any, Callable, TypeVar

import requests
from tenacity import (
    Retrying,
    before_sleep_log,
    retry_if_exception_type,
    stop_after_attempt,
    wait_exponential,
)

# Add project root to path
PROJECT_ROOT = Path(__file__).parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

# Dedicated log target for agent process visibility.
LOG_DIR = PROJECT_ROOT / "backend" / "logs"
LOG_DIR.mkdir(parents=True, exist_ok=True)

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(LOG_DIR / "sync_bridge_agent.log"),
    ],
)
logger = logging.getLogger("SyncBridgeAgent")

try:
    from backend.config import settings
    from backend.services.sql_sync_service import _build_new_item_dict
    from backend.sql_server_connector import SQLServerConnector
except ImportError as e:
    logger.error(f"Failed to import backend modules: {e}")
    sys.exit(1)

T = TypeVar("T")


class DateTimeEncoder(json.JSONEncoder):
    """JSON encoder for datetime objects"""

    def default(self, obj):
        if isinstance(obj, (datetime, date)):
            return obj.isoformat()
        return super().default(obj)


def _get_retry_attempts() -> int:
    return max(1, int(os.getenv("SYNC_RETRY_ATTEMPTS", "3")))


def _get_retry_min_seconds() -> int:
    return max(0, int(os.getenv("SYNC_RETRY_MIN_SECONDS", "1")))


def _get_retry_max_seconds() -> int:
    min_seconds = _get_retry_min_seconds()
    max_seconds = int(os.getenv("SYNC_RETRY_MAX_SECONDS", "30"))
    return max(min_seconds, max_seconds)


def _run_with_retry(
    operation: Callable[[], T],
    retry_exceptions: tuple[type[BaseException], ...],
) -> T:
    retrying = Retrying(
        stop=stop_after_attempt(_get_retry_attempts()),
        wait=wait_exponential(
            multiplier=1,
            min=_get_retry_min_seconds(),
            max=_get_retry_max_seconds(),
        ),
        retry=retry_if_exception_type(retry_exceptions),
        before_sleep=before_sleep_log(logger, logging.WARNING),
        reraise=True,
    )
    for attempt in retrying:
        with attempt:
            return operation()

    raise RuntimeError("Retry loop exited unexpectedly")


def _connect_with_retry(
    connector: Any,
    host: str,
    port: int,
    database: str,
    user: str,
    password: str,
) -> bool:
    def _connect() -> bool:
        connected = connector.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password,
        )
        if not connected:
            raise RuntimeError("SQL connector returned unsuccessful connection status")
        return True

    return _run_with_retry(_connect, (Exception,))


def _post_batch_with_retry(api_url: str, json_data: str, sync_key: str) -> requests.Response:
    def _post() -> requests.Response:
        response = requests.post(
            api_url,
            data=json_data,
            headers={"Content-Type": "application/json", "X-Sync-Token": sync_key},
            timeout=300,
        )
        if response.status_code >= 500:
            raise RuntimeError(f"Sync endpoint unavailable: HTTP {response.status_code}")
        return response

    return _run_with_retry(_post, (requests.RequestException, RuntimeError))


def run_sync_loop():
    """Main sync loop"""
    logger.info("Initializing Sync Bridge Agent...")

    sql_host = settings.SQL_SERVER_HOST
    sql_db = settings.SQL_SERVER_DATABASE

    if not sql_host or not sql_db:
        logger.error(
            "SQL Server not configured. Please set SQL_SERVER_HOST and SQL_SERVER_DATABASE."
        )
        sys.exit(1)

    connector = SQLServerConnector()

    # API Target
    api_url = f"http://localhost:{settings.PORT}/api/erp/sync/batch"
    sync_key = settings.SYNC_API_KEY

    logger.info(f"Target API: {api_url}")

    while True:
        try:
            logger.info("Connecting to SQL Server...")
            _connect_with_retry(
                connector=connector,
                host=sql_host,
                port=settings.SQL_SERVER_PORT,
                database=sql_db,
                user=settings.SQL_SERVER_USER,
                password=settings.SQL_SERVER_PASSWORD,
            )

            logger.info("Fetching items from SQL Server...")
            start_time = time.time()
            rows = connector.get_all_items()
            logger.info(f"Fetched {len(rows)} items in {time.time() - start_time:.2f}s")

            # Transform to ERPItem schema structure
            batch_payload = []
            now = datetime.now(timezone.utc).replace(tzinfo=None)

            for row in rows:
                try:
                    qty = float(row.get("stock_qty", 0.0))
                    # Use the shared logic to map fields
                    item_dict = _build_new_item_dict(row, qty, now)
                    batch_payload.append(item_dict)
                except Exception as e:
                    logger.warning(f"Skipping malformed item: {e}")

            # Send Batch to API
            logger.info(f"Pushing {len(batch_payload)} items to Cloud API...")

            # Serialize manually to handle datetimes
            json_data = json.dumps(batch_payload, cls=DateTimeEncoder)

            resp = _post_batch_with_retry(api_url=api_url, json_data=json_data, sync_key=sync_key)

            if resp.status_code == 200:
                data = resp.json()
                logger.info(f"Sync Success! Stats: {data.get('stats')}")
            else:
                logger.error(f"Sync Failed: {resp.status_code} - {resp.text[:200]}")

        except Exception as e:
            logger.exception(f"Unexpected error in sync loop: {e}")
        finally:
            if getattr(connector, "connection", None):
                connector.disconnect()

        # Wait for next interval
        interval = settings.ERP_SYNC_INTERVAL
        logger.info(f"Sleeping for {interval}s...")
        time.sleep(interval)


if __name__ == "__main__":
    run_sync_loop()
