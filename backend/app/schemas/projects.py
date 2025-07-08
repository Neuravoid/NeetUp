from pydantic import BaseModel, Field, HttpUrl
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum
from .courses import DifficultyLevel


class ProjectStatus(str, Enum):
    SUBMITTED = "submitted"
    APPROVED = "approved"
    REJECTED = "rejected"


class ProjectBase(BaseModel):
    """Base schema for projects."""
    title: str
    description: str
    difficulty_level: DifficultyLevel
    skills_required: List[str]


class ProjectCreate(ProjectBase):
    """Schema for creating a project."""
    pass


class ProjectResponse(ProjectBase):
    """Schema for project response."""
    id: int
    
    class Config:
        orm_mode = True


class UserProjectBase(BaseModel):
    """Base schema for user projects."""
    project_id: int
    submission_url: Optional[HttpUrl] = None
    feedback: Optional[str] = None
    status: ProjectStatus = ProjectStatus.SUBMITTED
    submission_date: datetime = Field(default_factory=datetime.now)


class UserProjectCreate(UserProjectBase):
    """Schema for creating a user project."""
    pass


class UserProjectResponse(UserProjectBase):
    """Schema for user project response."""
    id: int
    user_id: int
    project: ProjectResponse
    
    class Config:
        orm_mode = True


class PortfolioResponse(BaseModel):
    """Schema for portfolio response."""
    user_id: int
    projects: List[UserProjectResponse]
    total_projects: int
    completed_projects: int
    skills_demonstrated: List[str]
    
    class Config:
        orm_mode = True
