#!/usr/bin/env python3
"""
Diagnose SQL Server connection and column issues
"""

import os
import sys
import logging
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent / "backend"))

# Load environment
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / ".env")

import pyodbc

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
logger = logging.getLogger(__name__)

def test_sql_connection():
    """Test SQL Server connection and check columns"""
    
    # Get connection details from env
    host = os.getenv('SQL_SERVER_HOST', '192.168.1.109')
    port = os.getenv('SQL_SERVER_PORT', '1433')
    database = os.getenv('SQL_SERVER_DATABASE', 'E_MART_KITCHEN_CARE')
    username = os.getenv('SQL_SERVER_USER', 'stockapp')
    password = os.getenv('SQL_SERVER_PASSWORD', 'StockApp@2025!')
    driver = os.getenv('SQL_SERVER_DRIVER', 'SQL Server')
    
    logger.info("🔍 Testing SQL Server connection...")
    logger.info(f"   Host: {host}:{port}")
    logger.info(f"   Database: {database}")
    logger.info(f"   User: {username}")
    logger.info(f"   Driver: {driver}")
    
    try:
        # Build connection string
        conn_str = f"DRIVER={{{driver}}};SERVER={host},{port};DATABASE={database};UID={username};PWD={password};TrustServerCertificate=yes"
        
        # Connect
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        
        logger.info("✅ Successfully connected to SQL Server!")
        
        # Check tables
        tables_to_check = [
            "Products",
            "ProductBatches", 
            "UnitOfMeasures",
            "Warehouses",
            "Shelfs",
            "Zone"
        ]
        
        for table in tables_to_check:
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                logger.info(f"📋 {table}: {count} rows")
                
                # Get columns
                cursor.execute(f"""
                    SELECT COLUMN_NAME 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = '{table}'
                    ORDER BY COLUMN_NAME
                """)
                columns = [row[0] for row in cursor.fetchall()]
                logger.info(f"   Columns: {', '.join(columns[:10])}{'...' if len(columns) > 10 else ''}")
                
            except Exception as e:
                logger.error(f"❌ Error checking {table}: {e}")
        
        # Test the problematic query
        logger.info("\n🔍 Testing problematic query...")
        try:
            test_query = """
            SELECT TOP 3 
                P.ProductCode,
                P.ProductName,
                CASE WHEN W.WarehouseID IS NOT NULL THEN CAST(W.WarehouseID AS VARCHAR) ELSE 'NULL' END as warehouse_id,
                CASE WHEN UOM.UnitName IS NOT NULL THEN UOM.UnitName ELSE 'NULL' END as unit_name
            FROM dbo.Products P
            LEFT JOIN dbo.ProductBatches PB ON P.ProductID = PB.ProductID
            LEFT JOIN dbo.Warehouses W ON PB.WarehouseID = W.WarehouseID
            LEFT JOIN dbo.UnitOfMeasures UOM ON P.BasicUnitID = UOM.UnitID
            WHERE P.IsActive = 1
            """
            
            cursor.execute(test_query)
            results = cursor.fetchall()
            
            logger.info("✅ Test query successful!")
            for i, row in enumerate(results):
                logger.info(f"   Row {i+1}: {row}")
                
        except Exception as e:
            logger.error(f"❌ Test query failed: {e}")
            
            # Try simpler query to isolate the issue
            logger.info("\n🔍 Testing simpler queries...")
            
            # Test 1: Just Products table
            try:
                cursor.execute("SELECT TOP 3 ProductCode, ProductName FROM dbo.Products WHERE IsActive = 1")
                results = cursor.fetchall()
                logger.info("✅ Products table query works")
                for row in results:
                    logger.info(f"   {row}")
            except Exception as e:
                logger.error(f"❌ Products table query failed: {e}")
            
            # Test 2: Products + ProductBatches join
            try:
                cursor.execute("""
                    SELECT TOP 3 P.ProductCode, PB.Stock 
                    FROM dbo.Products P 
                    LEFT JOIN dbo.ProductBatches PB ON P.ProductID = PB.ProductID 
                    WHERE P.IsActive = 1
                """)
                results = cursor.fetchall()
                logger.info("✅ Products + ProductBatches join works")
            except Exception as e:
                logger.error(f"❌ Products + ProductBatches join failed: {e}")
            
            # Test 3: Check if Warehouses table exists and has WarehouseID
            try:
                cursor.execute("SELECT TOP 3 WarehouseID, WarehouseName FROM dbo.Warehouses")
                results = cursor.fetchall()
                logger.info("✅ Warehouses table works")
                for row in results:
                    logger.info(f"   {row}")
            except Exception as e:
                logger.error(f"❌ Warehouses table query failed: {e}")
            
            # Test 4: Check if UnitOfMeasures table exists and has UnitName
            try:
                cursor.execute("SELECT TOP 3 UnitID, UnitName FROM dbo.UnitOfMeasures")
                results = cursor.fetchall()
                logger.info("✅ UnitOfMeasures table works")
                for row in results:
                    logger.info(f"   {row}")
            except Exception as e:
                logger.error(f"❌ UnitOfMeasures table query failed: {e}")
        
        conn.close()
        
    except Exception as e:
        logger.error(f"❌ Connection failed: {e}")
        
        # Check if it's a driver issue
        if "DRIVER" in str(e):
            logger.info("\n💡 Available ODBC drivers:")
            drivers = pyodbc.drivers()
            for driver in drivers:
                if "SQL" in driver:
                    logger.info(f"   - {driver}")

if __name__ == "__main__":
    test_sql_connection()
