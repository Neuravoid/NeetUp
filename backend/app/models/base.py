import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, String


def generate_uuid():
    """Generate a string UUID"""
    return str(uuid.uuid4())


class BaseModel:
    """Base model with common columns for all tables"""
    id = Column(String(36), primary_key=True, default=generate_uuid)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
