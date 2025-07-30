#!/usr/bin/env python3

from app.core.database import engine
from sqlalchemy import text
from datetime import datetime

def fix_datetime_fields():
    """Fix datetime fields that are stored as strings in personality_tests table"""
    
    with engine.connect() as conn:
        # Start transaction
        trans = conn.begin()
        
        try:
            print("=== FIXING DATETIME FIELDS IN PERSONALITY_TESTS ===")
            
            # Get all records with string datetime fields
            result = conn.execute(text("""
                SELECT id, first_test_date, created_at, updated_at 
                FROM personality_tests 
                WHERE first_test_date IS NOT NULL 
                   OR created_at IS NOT NULL 
                   OR updated_at IS NOT NULL
            """))
            
            records = result.fetchall()
            print(f"Found {len(records)} records to fix")
            
            for record in records:
                record_id = record[0]
                first_test_date = record[1]
                created_at = record[2]
                updated_at = record[3]
                
                print(f"Fixing record {record_id}")
                
                # Convert string dates to proper datetime format for SQLite
                updates = []
                params = {"record_id": record_id}
                
                if first_test_date and isinstance(first_test_date, str):
                    try:
                        # Parse the datetime string and convert to SQLite format
                        dt = datetime.fromisoformat(first_test_date.replace('Z', '+00:00'))
                        updates.append("first_test_date = :first_test_date")
                        params["first_test_date"] = dt.strftime('%Y-%m-%d %H:%M:%S.%f')
                    except Exception as e:
                        print(f"  Error parsing first_test_date: {e}")
                        updates.append("first_test_date = NULL")
                
                if created_at and isinstance(created_at, str):
                    try:
                        dt = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                        updates.append("created_at = :created_at")
                        params["created_at"] = dt.strftime('%Y-%m-%d %H:%M:%S.%f')
                    except Exception as e:
                        print(f"  Error parsing created_at: {e}")
                        updates.append("created_at = NULL")
                
                if updated_at and isinstance(updated_at, str):
                    try:
                        dt = datetime.fromisoformat(updated_at.replace('Z', '+00:00'))
                        updates.append("updated_at = :updated_at")
                        params["updated_at"] = dt.strftime('%Y-%m-%d %H:%M:%S.%f')
                    except Exception as e:
                        print(f"  Error parsing updated_at: {e}")
                        updates.append("updated_at = NULL")
                
                if updates:
                    update_sql = f"UPDATE personality_tests SET {', '.join(updates)} WHERE id = :record_id"
                    conn.execute(text(update_sql), params)
                    print(f"  Updated record {record_id}")
            
            # Commit transaction
            trans.commit()
            print("=== DATETIME FIELDS FIXED SUCCESSFULLY ===")
            
            # Verify the fix
            print("\n=== VERIFICATION ===")
            result = conn.execute(text("""
                SELECT id, first_test_date, created_at, updated_at 
                FROM personality_tests 
                LIMIT 3
            """))
            
            for row in result:
                print(f"ID: {row[0]}")
                print(f"  first_test_date: {row[1]} (type: {type(row[1])})")
                print(f"  created_at: {row[2]} (type: {type(row[2])})")
                print(f"  updated_at: {row[3]} (type: {type(row[3])})")
                print("---")
                
        except Exception as e:
            trans.rollback()
            print(f"Error occurred: {e}")
            print("Transaction rolled back")
            raise

if __name__ == "__main__":
    fix_datetime_fields()
