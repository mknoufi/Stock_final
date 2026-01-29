import sys
import os

# Add project root to path
sys.path.insert(0, os.getcwd())

from backend.sql_server_connector import SQLServerConnector
from backend.config import settings


def test():
    print("Testing SQL Server Connection...")
    print(f"Host: {settings.SQL_SERVER_HOST}")
    print(f"Port: {settings.SQL_SERVER_PORT}")
    print(f"Database: {settings.SQL_SERVER_DATABASE}")

    if not settings.SQL_SERVER_HOST:
        print("❌ SQL_SERVER_HOST is not set in configuration.")
        return

    connector = SQLServerConnector()
    try:
        # Use the synchronous connect method with arguments
        success = connector.connect(
            host=settings.SQL_SERVER_HOST,
            port=settings.SQL_SERVER_PORT,
            database=settings.SQL_SERVER_DATABASE,
            user=settings.SQL_SERVER_USER,
            password=settings.SQL_SERVER_PASSWORD,
        )
        if success:
            print("✅ Successfully connected to SQL Server!")
            connector.disconnect()
        else:
            print("❌ Connection failed (returned False).")

    except Exception as e:
        print(f"❌ Connection failed with error: {e}")


if __name__ == "__main__":
    test()
