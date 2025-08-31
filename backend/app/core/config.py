import os
from typing import List, Optional

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Career Development API"
    API_V1_STR: str = "/api"
    PORT: int = 8080  # Default port for the application
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8080"]
    
    # Database configuration
    SQLITE_DB: str = os.getenv("SQLITE_DB", "career_dev.db")
    # Allow an explicit DATABASE_URL (Postgres) to override SQLite for containers
    DATABASE_URL: Optional[str] = None
    SQLALCHEMY_DATABASE_URI: Optional[str] = None

    def __init__(self, **values):
        # Initialize BaseSettings then derive SQLALCHEMY_DATABASE_URI
        super().__init__(**values)
        # prefer DATABASE_URL if provided, else use sqlite file
        if self.DATABASE_URL:
            self.SQLALCHEMY_DATABASE_URI = self.DATABASE_URL
        else:
            self.SQLALCHEMY_DATABASE_URI = f"sqlite:///{self.SQLITE_DB}"
    
    # Google API Configuration (optional for local dev)
    GOOGLE_API_KEY: Optional[str] = None
    GEMINI_API_KEY: Optional[str] = None

    class Config:
        case_sensitive = True
        env_file = ".env"


settings = Settings()
