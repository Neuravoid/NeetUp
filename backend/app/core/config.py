import os
from typing import List, Optional, Union

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Career Development API"
    API_V1_STR: str = "/api"
    PORT: int = 8080  # Default port for the application
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8080"]
    
    # SQLite Database Configuration
    SQLITE_DB: str = os.getenv("SQLITE_DB", "career_dev.db")
    SQLALCHEMY_DATABASE_URI: str = f"sqlite:///{SQLITE_DB}"
    
    # Google API Configuration
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
