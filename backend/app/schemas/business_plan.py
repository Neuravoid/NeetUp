from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum


class BusinessPlanBase(BaseModel):
    """Base schema for business plans."""
    title: str
    content: Dict[str, Any]  # JSON structure for business plan
    created_date: datetime = Field(default_factory=datetime.now)
    last_updated: datetime = Field(default_factory=datetime.now)


class BusinessPlanCreate(BaseModel):
    """Schema for generating a business plan."""
    title: str
    industry: str
    target_market: str
    problem_statement: str
    solution_description: str
    business_model: str
    competition_analysis: Optional[List[str]] = None
    funding_requirements: Optional[str] = None
    team_description: Optional[str] = None


class BusinessPlanResponse(BusinessPlanBase):
    """Schema for business plan response."""
    id: int
    user_id: int
    
    class Config:
        orm_mode = True


class BusinessPlanDownloadFormat(str, Enum):
    PDF = "pdf"
    DOCX = "docx"
    TXT = "txt"


class BusinessPlanDownloadResponse(BaseModel):
    """Schema for business plan download response."""
    plan_id: int
    download_url: str
    format: BusinessPlanDownloadFormat
    expiration: datetime
