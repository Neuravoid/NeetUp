#!/usr/bin/env python3

from app.core.database import engine
from sqlalchemy import text

def check_database():
    with engine.connect() as conn:
        # Check table structure
        print("=== PERSONALITY_TESTS TABLE STRUCTURE ===")
        result = conn.execute(text("PRAGMA table_info(personality_tests)"))
        for row in result:
            print(f"Column: {row[1]}, Type: {row[2]}, NotNull: {row[3]}, Default: {row[4]}")
        
        print("\n=== SAMPLE DATA ===")
        try:
            result = conn.execute(text("SELECT id, user_id, first_test_date, retest_date, created_at, updated_at FROM personality_tests LIMIT 3"))
            rows = result.fetchall()
            if rows:
                for row in rows:
                    print(f"ID: {row[0]}")
                    print(f"  user_id: {row[1]}")
                    print(f"  first_test_date: {row[2]} (type: {type(row[2])})")
                    print(f"  retest_date: {row[3]} (type: {type(row[3])})")
                    print(f"  created_at: {row[4]} (type: {type(row[4])})")
                    print(f"  updated_at: {row[5]} (type: {type(row[5])})")
                    print("---")
            else:
                print("No data found in personality_tests table")
        except Exception as e:
            print(f"Error querying data: {e}")

if __name__ == "__main__":
    check_database()
