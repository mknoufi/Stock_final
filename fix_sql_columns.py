#!/usr/bin/env python3
"""
Fix SQL Server column mapping issues
"""

import logging
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

from backend.db_mapping_config import get_active_mapping
from backend.sql_server_connector import SQLServerConnector

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def check_sql_columns():
    """Check which columns exist in the SQL Server database"""
    connector = SQLServerConnector()
    
    try:
        # Connect to database
        connector.connect()
        logger.info("✓ Connected to SQL Server")
        
        # Check key tables and columns
        tables_to_check = [
            "Products",
            "ProductBatches", 
            "UnitOfMeasures",
            "Warehouses",
            "Shelfs",
            "Zone"
        ]
        
        columns_to_check = [
            "WarehouseID",
            "UnitName", 
            "UnitCode",
            "WarehouseName",
            "ShelfID",
            "ZoneID"
        ]
        
        for table in tables_to_check:
            try:
                query = f"""
                SELECT COLUMN_NAME 
                FROM INFORMATION_SCHEMA.COLUMNS 
                WHERE TABLE_NAME = '{table}'
                ORDER BY COLUMN_NAME
                """
                
                cursor = connector.connection.cursor()
                cursor.execute(query)
                columns = [row[0] for row in cursor.fetchall()]
                
                logger.info(f"\n📋 Table: {table}")
                logger.info(f"   Columns: {', '.join(columns)}")
                
                # Check for specific columns we need
                missing = [col for col in columns_to_check if col in columns]
                if missing:
                    logger.info(f"   ✓ Found: {', '.join(missing)}")
                
            except Exception as e:
                logger.error(f"   ❌ Error checking {table}: {e}")
        
        # Test a simple query
        try:
            query = """
            SELECT TOP 5 
                P.ProductCode,
                P.ProductName,
                CASE WHEN W.WarehouseID IS NOT NULL THEN 'YES' ELSE 'NO' END as has_warehouse
            FROM dbo.Products P
            LEFT JOIN dbo.ProductBatches PB ON P.ProductID = PB.ProductID
            LEFT JOIN dbo.Warehouses W ON PB.WarehouseID = W.WarehouseID
            WHERE P.IsActive = 1
            """
            
            cursor = connector.connection.cursor()
            cursor.execute(query)
            results = cursor.fetchall()
            
            logger.info(f"\n✓ Test query successful - {len(results)} rows returned")
            for row in results[:3]:
                logger.info(f"   {row}")
                
        except Exception as e:
            logger.error(f"❌ Test query failed: {e}")
            
    except Exception as e:
        logger.error(f"❌ Database connection failed: {e}")
    finally:
        connector.disconnect()

if __name__ == "__main__":
    check_sql_columns()
