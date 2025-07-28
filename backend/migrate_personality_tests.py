"""
Migration script to update personality_tests table structure
This script will:
1. Add new columns: full_name, personality_result, first_test_date, retest_date
2. Migrate existing data where possible
3. Remove old columns: test_type, status, demographics, career_recommendations
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import text, MetaData, Table, Column, String, DateTime, Text, ForeignKey
from sqlalchemy.exc import SQLAlchemyError
from app.core.database import engine, SessionLocal
from app.models.user import User
from app.models.personality_test import PersonalityTest
from datetime import datetime
import json

def migrate_personality_tests():
    """Migrate personality_tests table to new structure"""
    
    print("Starting personality_tests table migration...")
    
    try:
        with engine.begin() as connection:
            # Check if table exists
            result = connection.execute(text("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='personality_tests'
            """))
            
            if not result.fetchone():
                print("personality_tests table doesn't exist. Creating new table...")
                from app.core.database import Base
                Base.metadata.create_all(bind=engine)
                print("New table created successfully!")
                return
            
            print("Backing up existing data...")
            
            # Get existing data
            existing_data = connection.execute(text("""
                SELECT id, user_id, answers, created_at, updated_at 
                FROM personality_tests
            """)).fetchall()
            
            print(f"Found {len(existing_data)} existing records")
            
            # Create backup table
            connection.execute(text("""
                CREATE TABLE IF NOT EXISTS personality_tests_backup AS 
                SELECT * FROM personality_tests
            """))
            
            print("Backup created. Dropping old table...")
            
            # Drop the old table
            connection.execute(text("DROP TABLE personality_tests"))
            
            print("Creating new table structure...")
            
            # Create new table with updated structure
            connection.execute(text("""
                CREATE TABLE personality_tests (
                    id VARCHAR(36) PRIMARY KEY,
                    user_id VARCHAR REFERENCES users(id) NOT NULL,
                    full_name VARCHAR NOT NULL,
                    answers TEXT,
                    personality_result VARCHAR,
                    first_test_date DATETIME,
                    retest_date DATETIME,
                    created_at DATETIME,
                    updated_at DATETIME
                )
            """))
            
            print("New table created. Migrating data...")
            
            # Get user data for full names
            db = SessionLocal()
            try:
                users = {user.id: user.full_name for user in db.query(User).all()}
            finally:
                db.close()
            
            # Migrate existing data
            for record in existing_data:
                user_id = record[1]
                full_name = users.get(user_id, "Unknown User")
                
                connection.execute(text("""
                    INSERT INTO personality_tests 
                    (id, user_id, full_name, answers, first_test_date, created_at, updated_at)
                    VALUES (:id, :user_id, :full_name, :answers, :first_test_date, :created_at, :updated_at)
                """), {
                    'id': record[0],
                    'user_id': user_id,
                    'full_name': full_name,
                    'answers': record[2],
                    'first_test_date': record[3],  # Use created_at as first_test_date
                    'created_at': record[3],
                    'updated_at': record[4]
                })
            
            print(f"Successfully migrated {len(existing_data)} records")
            print("Migration completed successfully!")
            
    except SQLAlchemyError as e:
        print(f"Migration failed: {e}")
        print("You may need to restore from backup manually")
        raise
    except Exception as e:
        print(f"Unexpected error during migration: {e}")
        raise

def rollback_migration():
    """Rollback migration by restoring from backup"""
    print("Rolling back migration...")
    
    try:
        with engine.begin() as connection:
            # Check if backup exists
            result = connection.execute(text("""
                SELECT name FROM sqlite_master 
                WHERE type='table' AND name='personality_tests_backup'
            """))
            
            if not result.fetchone():
                print("No backup found. Cannot rollback.")
                return
            
            # Drop current table and restore from backup
            connection.execute(text("DROP TABLE IF EXISTS personality_tests"))
            connection.execute(text("""
                CREATE TABLE personality_tests AS 
                SELECT * FROM personality_tests_backup
            """))
            
            print("Rollback completed successfully!")
            
    except SQLAlchemyError as e:
        print(f"Rollback failed: {e}")
        raise

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "rollback":
        rollback_migration()
    else:
        migrate_personality_tests()
