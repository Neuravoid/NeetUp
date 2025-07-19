#!/usr/bin/env python3
"""
Script to reset a user's password hash in the database.
This fixes issues with incompatible bcrypt versions.
"""

import sys
import os
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine

# Add the app directory to the path so we can import our modules
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.core.database import get_db
from app.models.user import User
from app.core.security import get_password_hash
from app.core.config import settings

def reset_user_password(email: str, new_password: str):
    """Reset a user's password with a new hash"""
    
    # Create database engine and session
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Find the user
        user = db.query(User).filter(User.email == email).first()
        if not user:
            print(f"❌ User with email {email} not found!")
            return False
        
        # Generate new password hash
        new_hash = get_password_hash(new_password)
        print(f"✅ Generated new password hash for {email}")
        
        # Update the user's password hash
        user.password_hash = new_hash
        db.commit()
        
        print(f"✅ Successfully updated password hash for {email}")
        return True
        
    except Exception as e:
        print(f"❌ Error updating password: {e}")
        db.rollback()
        return False
    finally:
        db.close()

if __name__ == "__main__":
    # Reset password for the problematic user
    email = "alkanumut848@gmail.com"
    password = "Umuttekke29?"  # The same password they're trying to use
    
    print(f"Resetting password hash for {email}...")
    success = reset_user_password(email, password)
    
    if success:
        print("🎉 Password reset complete! User should now be able to log in.")
    else:
        print("💥 Password reset failed!")
