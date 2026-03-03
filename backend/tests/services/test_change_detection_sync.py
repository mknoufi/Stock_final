import sys
from unittest.mock import MagicMock
import unittest
from datetime import datetime, timezone

# Mock pyodbc before importing anything that uses it
sys.modules["pyodbc"] = MagicMock()

from backend.services.change_detection_sync import ChangeDetectionSyncService
from backend.sql_server_connector import SQLServerConnector
from backend.utils.result import Result

class TestChangeDetectionSync(unittest.TestCase):
    def setUp(self):
        self.mock_sql_connector = MagicMock(spec=SQLServerConnector)
        self.mock_mongo_db = MagicMock()
        self.service = ChangeDetectionSyncService(
            sql_connector=self.mock_sql_connector,
            mongo_db=self.mock_mongo_db
        )

    def test_sql_injection_table_name_prevented(self):
        # Inject malicious mapping
        self.mock_sql_connector.mapping = {
            "tables": {
                "items": "items; DROP TABLE users; --"
            },
            "items_columns": {
                "id": "id",
                "name": "name"
            },
            "query_options": {}
        }

        # Call the method
        result = self.service._get_products_with_changes_query()

        # Check if injection was prevented
        self.assertTrue(result.is_err, f"Expected Error result, got {result}")
        error = result._error
        self.assertIn("Invalid table name", str(error))

    def test_sql_injection_column_prevented(self):
        # Inject malicious mapping
        self.mock_sql_connector.mapping = {
            "tables": {
                "items": "items"
            },
            "items_columns": {
                "id": "id",
                "name": "name; DELETE FROM logs; --"
            },
            "query_options": {}
        }

        # Call the method
        result = self.service._get_products_with_changes_query()

        # Check if injection was prevented
        self.assertTrue(result.is_err, f"Expected Error result, got {result}")
        error = result._error
        self.assertIn("Invalid column name", str(error))

    def test_valid_identifiers_allowed(self):
        # Valid mapping
        self.mock_sql_connector.mapping = {
            "tables": {
                "items": "items"
            },
            "items_columns": {
                "id": "item_id",
                "name": "item_name"
            },
            "query_options": {
                "modified_date_column": "last_modified"
            }
        }

        # Call the method
        result = self.service._get_products_with_changes_query(datetime.now(timezone.utc))

        # Check success
        self.assertTrue(result.is_ok, f"Expected OK result, got {result}")
        query = result.unwrap()

        self.assertIn("SELECT item_id as id, item_name as name", query)
        self.assertIn("FROM items", query)
        self.assertIn("WHERE last_modified >= ?", query)

if __name__ == "__main__":
    unittest.main()
