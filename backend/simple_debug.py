from app.core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    # Check if table exists and its structure
    result = conn.execute(text("SELECT sql FROM sqlite_master WHERE name='personality_tests'"))
    row = result.fetchone()
    if row:
        print("Table creation SQL:")
        print(row[0])
    
    # Check data types in actual data
    result = conn.execute(text("SELECT first_test_date, created_at FROM personality_tests LIMIT 1"))
    row = result.fetchone()
    if row:
        print(f"\nSample data types:")
        print(f"first_test_date: '{row[0]}' (Python type: {type(row[0])})")
        print(f"created_at: '{row[1]}' (Python type: {type(row[1])})")
