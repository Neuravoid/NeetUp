#!/usr/bin/env python3

from app.core.database import engine, SessionLocal
from sqlalchemy import text
import subprocess
import sys

def run_migration():
    """Add new columns to existing tables"""
    
    db = SessionLocal()
    
    try:
        print("Running database migration...")
        
        # Add difficulty column to questions table if it doesn't exist
        try:
            db.execute(text("ALTER TABLE questions ADD COLUMN difficulty VARCHAR(10)"))
            print("Added 'difficulty' column to questions table")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("'difficulty' column already exists in questions table")
            else:
                print(f"Error adding difficulty column: {e}")
        
        # Add is_correct column to answers table if it doesn't exist
        try:
            db.execute(text("ALTER TABLE answers ADD COLUMN is_correct BOOLEAN DEFAULT 0"))
            print("Added 'is_correct' column to answers table")
        except Exception as e:
            if "duplicate column name" in str(e).lower() or "already exists" in str(e).lower():
                print("'is_correct' column already exists in answers table")
            else:
                print(f"Error adding is_correct column: {e}")
        
        db.commit()
        print("Migration completed successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Migration failed: {e}")
        return False
    finally:
        db.close()
    
    return True

def run_seed():
    """Run the seed script"""
    
    print("\nRunning seed script...")
    
    try:
        result = subprocess.run([sys.executable, "seed_knowledge_tests.py"], 
                              capture_output=True, text=True, cwd=".")
        
        if result.returncode == 0:
            print(result.stdout)
            return True
        else:
            print(f"Seed script failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"Error running seed script: {e}")
        return False

if __name__ == "__main__":
    print("Starting database migration and seeding process...\n")
    
    # Step 1: Run migration
    if run_migration():
        # Step 2: Run seed script
        if run_seed():
            print("\nDatabase migration and seeding completed successfully!")
        else:
            print("\nSeeding failed!")
            sys.exit(1)
    else:
        print("\nMigration failed!")
        sys.exit(1)
