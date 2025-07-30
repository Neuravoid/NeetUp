#!/usr/bin/env python3
"""
Fix datetime fields in personality_tests table that are stored as strings
"""

from app.core.database import engine
from sqlalchemy import text
from datetime import datetime
import sys

def fix_datetime_fields():
    """Convert string datetime fields to proper datetime format"""
    
    print("Starting datetime fields fix...")
    
    with engine.connect() as conn:
        # Start transaction
        trans = conn.begin()
        
        try:
            # First, let's check current data
            result = conn.execute(text("""
                SELECT id, first_test_date, retest_date, created_at, updated_at 
                FROM personality_tests
            """))
            
            rows = result.fetchall()
            print(f"Found {len(rows)} records to process")
            
            # Process each record
            for row in rows:
                record_id = row[0]
                first_test_date = row[1]
                retest_date = row[2] 
                created_at = row[3]
                updated_at = row[4]
                
                print(f"Processing record {record_id}")
                
                # Convert string dates to proper datetime format if needed
                # SQLite stores datetime as strings, so we need to ensure proper format
                
                # For first_test_date - if it's not None and looks like a datetime string
                if first_test_date and isinstance(first_test_date, str):
                    try:
                        # Try to parse and reformat
                        dt = datetime.fromisoformat(first_test_date.replace('Z', '+00:00'))
                        first_test_date = dt.strftime('%Y-%m-%d %H:%M:%S.%f')
                    except:
                        print(f"  Warning: Could not parse first_test_date: {first_test_date}")
                        first_test_date = None
                
                # For retest_date - if it's not None and looks like a datetime string  
                if retest_date and isinstance(retest_date, str):
                    try:
                        dt = datetime.fromisoformat(retest_date.replace('Z', '+00:00'))
                        retest_date = dt.strftime('%Y-%m-%d %H:%M:%S.%f')
                    except:
                        print(f"  Warning: Could not parse retest_date: {retest_date}")
                        retest_date = None
                
                # For created_at and updated_at - ensure proper format
                if created_at and isinstance(created_at, str):
                    try:
                        dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        created_at = dt.strftime('%Y-%m-%d %H:%M:%S.%f')
                    except:
                        print(f"  Warning: Could not parse created_at: {created_at}")
                        created_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
                
                if updated_at and isinstance(updated_at, str):
                    try:
                        dt = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                        updated_at = dt.strftime('%Y-%m-%d %H:%M:%S.%f')
                    except:
                        print(f"  Warning: Could not parse updated_at: {updated_at}")
                        updated_at = datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
                
                # Update the record with properly formatted datetime strings
                conn.execute(text("""
                    UPDATE personality_tests 
                    SET first_test_date = :first_test_date,
                        retest_date = :retest_date,
                        created_at = :created_at,
                        updated_at = :updated_at
                    WHERE id = :record_id
                """), {
                    'first_test_date': first_test_date,
                    'retest_date': retest_date,
                    'created_at': created_at,
                    'updated_at': updated_at,
                    'record_id': record_id
                })
                
                print(f"  Updated record {record_id}")
            
            # Commit transaction
            trans.commit()
            print("✅ Successfully fixed datetime fields!")
            
        except Exception as e:
            # Rollback on error
            trans.rollback()
            print(f"❌ Error fixing datetime fields: {e}")
            sys.exit(1)

if __name__ == "__main__":
    fix_datetime_fields()
