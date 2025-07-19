#!/usr/bin/env python3
"""
Simple script to fix password hash for users with bcrypt compatibility issues.
This script uses raw SQL to avoid SQLAlchemy relationship issues.
"""

import sqlite3
import sys
import os
from passlib.context import CryptContext

# Initialize password context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    """Hash a password using the current bcrypt configuration"""
    return pwd_context.hash(password)

def fix_user_password(email: str, password: str, db_path: str = "career_dev.db"):
    """Fix password hash for a specific user using direct SQL"""
    
    try:
        # Connect to SQLite database
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute("SELECT id, email FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        
        if not user:
            print(f"❌ User with email {email} not found!")
            return False
        
        user_id, user_email = user
        print(f"✅ Found user: {user_email} (ID: {user_id})")
        
        # Generate new password hash
        new_hash = get_password_hash(password)
        print(f"✅ Generated new password hash")
        
        # Update the password hash
        cursor.execute(
            "UPDATE users SET password_hash = ? WHERE email = ?", 
            (new_hash, email)
        )
        
        # Commit changes
        conn.commit()
        
        print(f"✅ Successfully updated password hash for {email}")
        return True
        
    except Exception as e:
        print(f"❌ Error updating password: {e}")
        return False
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    # Fix password for the problematic user
    email = "alkanumut848@gmail.com"
    password = "Umuttekke29?"  # The same password they're trying to use
    
    print(f"Fixing password hash for {email}...")
    success = fix_user_password(email, password)
    
    if success:
        print("🎉 Password hash fixed! User should now be able to log in.")
        print("💡 Try logging in again with the same credentials.")
    else:
        print("💥 Password fix failed!")
