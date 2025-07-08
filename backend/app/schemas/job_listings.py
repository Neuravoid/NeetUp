from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime


class JobListingBase(BaseModel):
    """Base schema for job listings."""
    title: str
    company: str
    description: str
    location: str
    salary_range: str
    required_skills: List[str]
    posting_date: datetime = Field(default_factory=datetime.now)
    closing_date: Optional[datetime] = None


class JobListingCreate(JobListingBase):
    """Schema for creating a job listing."""
    pass


class JobListingResponse(JobListingBase):
    """Schema for job listing response."""
    id: int
    
    class Config:
        orm_mode = True


class JobListingSearchParams(BaseModel):
    """Schema for job listing search parameters."""
    title: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[str]] = None
    min_salary: Optional[float] = None
    max_salary: Optional[float] = None
    posted_after: Optional[datetime] = None


class JobListingSearchResponse(BaseModel):
    """Schema for job listing search response."""
    total: int
    jobs: List[JobListingResponse]
    matching_skills: Optional[Dict[str, int]] = None  # Skill -> Count of matching jobs
