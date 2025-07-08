from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime
from enum import Enum


class StepStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class CareerPathBase(BaseModel):
    """Base schema for career paths."""
    title: str
    description: str
    skills_required: Dict[str, Any]
    avg_salary: float


class CareerPathCreate(CareerPathBase):
    """Schema for creating a career path."""
    pass


class CareerPathResponse(CareerPathBase):
    """Schema for career path response."""
    id: int
    
    class Config:
        orm_mode = True


class RoadmapStepBase(BaseModel):
    """Base schema for roadmap steps."""
    title: str
    description: str
    order: int
    status: StepStatus = StepStatus.NOT_STARTED
    completion_date: Optional[datetime] = None


class RoadmapStepCreate(RoadmapStepBase):
    """Schema for creating a roadmap step."""
    pass


class RoadmapStepResponse(RoadmapStepBase):
    """Schema for roadmap step response."""
    id: int
    roadmap_id: int
    
    class Config:
        orm_mode = True


class UserRoadmapBase(BaseModel):
    """Base schema for user roadmaps."""
    career_path_id: int
    progress_percentage: float = 0.0


class UserRoadmapCreate(UserRoadmapBase):
    """Schema for creating a user roadmap."""
    steps: List[RoadmapStepCreate] = []


class UserRoadmapResponse(UserRoadmapBase):
    """Schema for user roadmap response."""
    id: int
    user_id: int
    created_date: datetime
    last_updated: datetime
    steps: List[RoadmapStepResponse] = []
    career_path: CareerPathResponse
    
    class Config:
        orm_mode = True
