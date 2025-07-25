from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

from app.core.config import settings

# Create the SQLite database file directory if it doesn't exist
os.makedirs(os.path.dirname(os.path.abspath(settings.SQLITE_DB)), exist_ok=True)

# Use SQLite with foreign key constraints enabled
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URI, 
    connect_args={"check_same_thread": False},
    # Enable foreign key constraints in SQLite
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get the DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
