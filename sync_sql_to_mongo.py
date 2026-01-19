"""
SQL Server to MongoDB Sync Script

This script:
1. Tests SQL Server connectivity
2. Syncs all items from SQL Server to MongoDB
3. Reports sync statistics

Usage:
    python sync_sql_to_mongo.py

Environment Variables Required:
    SQL_SERVER_HOST - SQL Server hostname/IP
    SQL_SERVER_PORT - Port (default: 1433)
    SQL_SERVER_DATABASE - Database name (e.g., E_MART_KITCHEN_CARE)
    SQL_SERVER_USER - Username (or empty for Windows Auth)
    SQL_SERVER_PASSWORD - Password (or empty for Windows Auth)
"""

import asyncio
import os
import sys
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv

load_dotenv()

from motor.motor_asyncio import AsyncIOMotorClient
from backend.sql_server_connector import SQLServerConnector
from backend.services.sql_sync_service import SQLSyncService
from backend.config import settings


async def main():
    print("=" * 60)
    print("SQL Server to MongoDB Sync Script")
    print("=" * 60)
    print(f"Started at: {datetime.now().isoformat()}")
    print()

    # 1. Check SQL Server configuration
    print("1. Checking SQL Server configuration...")
    sql_host = getattr(settings, "SQL_SERVER_HOST", None)
    sql_port = getattr(settings, "SQL_SERVER_PORT", 1433)
    sql_database = getattr(settings, "SQL_SERVER_DATABASE", None)
    sql_user = getattr(settings, "SQL_SERVER_USER", None)
    sql_password = getattr(settings, "SQL_SERVER_PASSWORD", None)

    print(f"   Host: {sql_host}")
    print(f"   Port: {sql_port}")
    print(f"   Database: {sql_database}")
    print(f"   User: {sql_user or '(Windows Auth)'}")
    print()

    if not sql_host or not sql_database:
        print("ERROR: SQL Server not configured!")
        print()
        print("Please set the following environment variables in .env:")
        print("  SQL_SERVER_HOST=<your-sql-server-ip>")
        print("  SQL_SERVER_DATABASE=<your-database-name>")
        print("  SQL_SERVER_USER=<username>       # Optional for Windows Auth")
        print("  SQL_SERVER_PASSWORD=<password>   # Optional for Windows Auth")
        return

    # 2. Test SQL Server connection
    print("2. Connecting to SQL Server...")
    sql_connector = SQLServerConnector()

    try:
        sql_connector.connect(
            host=sql_host,
            port=sql_port,
            database=sql_database,
            user=sql_user,
            password=sql_password,
        )
        print("   [OK] SQL Server connection successful!")
    except Exception as e:
        print(f"   [FAILED] SQL Server connection failed: {e}")
        print()
        print("Troubleshooting:")
        print("  - Verify SQL Server is running and accessible")
        print("  - Check firewall allows port 1433")
        print("  - Verify credentials are correct")
        print("  - For Windows Auth, run from a domain-joined machine")
        return

    # 3. Test SQL query
    print()
    print("3. Testing SQL query (fetching sample items)...")
    try:
        items = sql_connector.get_all_items()
        item_count = len(items) if items else 0
        print(f"   [OK] Found {item_count} items in SQL Server")

        if items and len(items) > 0:
            sample = items[0]
            print(
                f"   Sample item: {sample.get('item_name', 'N/A')} (Code: {sample.get('item_code', 'N/A')})"
            )
    except Exception as e:
        print(f"   [FAILED] SQL query failed: {e}")
        return

    # 4. Connect to MongoDB
    print()
    print("4. Connecting to MongoDB...")
    mongo_url = settings.MONGO_URL
    db_name = settings.DB_NAME

    try:
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        await db.command("ping")
        print(f"   [OK] MongoDB connected: {db_name}")
    except Exception as e:
        print(f"   [FAILED] MongoDB connection failed: {e}")
        return

    # 5. Perform sync
    print()
    print("5. Starting sync from SQL Server to MongoDB...")
    sync_service = SQLSyncService(sql_connector, db)

    try:
        # Use nightly_full_sync for initial full sync
        stats = await sync_service.nightly_full_sync()

        print()
        print("   [OK] Sync completed!")
        print(f"   Items synced: {stats.get('synced', 0)}")
        print(f"   Items created: {stats.get('created', 0)}")
        print(f"   Items updated: {stats.get('updated', 0)}")
        print(f"   Items skipped: {stats.get('skipped', 0)}")
        print(f"   Errors: {stats.get('errors', 0)}")
        print(f"   Duration: {stats.get('duration', 'N/A')} seconds")
    except Exception as e:
        print(f"   [FAILED] Sync failed: {e}")
        import traceback

        traceback.print_exc()
        return

    # 6. Verify MongoDB data
    print()
    print("6. Verifying MongoDB data...")
    try:
        mongo_count = await db.erp_items.count_documents({})
        print(f"   Total items in MongoDB: {mongo_count}")

        # Get sample item
        sample = await db.erp_items.find_one({})
        if sample:
            print(
                f"   Sample: {sample.get('item_name', 'N/A')} (Barcode: {sample.get('barcode', 'N/A')})"
            )
    except Exception as e:
        print(f"   [FAILED] MongoDB verification failed: {e}")

    print()
    print("=" * 60)
    print("Sync complete!")
    print(f"Finished at: {datetime.now().isoformat()}")
    print("=" * 60)

    # Cleanup
    sql_connector.disconnect()
    client.close()


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
    asyncio.run(main())
