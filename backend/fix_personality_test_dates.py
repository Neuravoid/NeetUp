#!/usr/bin/env python3

from app.core.database import engine, SessionLocal
from app.models.personality_test import PersonalityTest
from datetime import datetime
import traceback

def fix_personality_test_dates():
    """
    Fix datetime fields in personality_tests table
    This script ensures that first_test_date and retest_date are properly stored as datetime objects
    """
    
    db = SessionLocal()
    
    try:
        print("Checking personality test datetime fields...")
        
        # Get all personality tests
        personality_tests = db.query(PersonalityTest).all()
        
        fixed_count = 0
        for test in personality_tests:
            needs_update = False
            
            # Check first_test_date
            if test.first_test_date is not None:
                if isinstance(test.first_test_date, str):
                    try:
                        # Convert string to datetime
                        test.first_test_date = datetime.fromisoformat(test.first_test_date)
                        needs_update = True
                        print(f"Converting first_test_date for test ID: {test.id}")
                    except Exception as e:
                        # If conversion fails, set to created_at or current time
                        test.first_test_date = test.created_at or datetime.utcnow()
                        needs_update = True
                        print(f"Failed to convert first_test_date for test ID: {test.id}, using created_at instead")
            
            # Check retest_date
            if test.retest_date is not None:
                if isinstance(test.retest_date, str):
                    try:
                        # Convert string to datetime
                        test.retest_date = datetime.fromisoformat(test.retest_date)
                        needs_update = True
                        print(f"Converting retest_date for test ID: {test.id}")
                    except Exception as e:
                        # If conversion fails, set to updated_at or current time
                        test.retest_date = test.updated_at or datetime.utcnow()
                        needs_update = True
                        print(f"Failed to convert retest_date for test ID: {test.id}, using updated_at instead")
            
            # Update if needed
            if needs_update:
                fixed_count += 1
                db.add(test)
        
        # Commit changes
        if fixed_count > 0:
            db.commit()
            print(f"Fixed datetime fields for {fixed_count} personality tests")
        else:
            print("No datetime fields needed fixing")
        
        return True
        
    except Exception as e:
        db.rollback()
        print(f"Error fixing datetime fields: {e}")
        traceback.print_exc()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    print("Starting datetime field fix...")
    if fix_personality_test_dates():
        print("Datetime field fix completed successfully!")
    else:
        print("Datetime field fix failed!")
