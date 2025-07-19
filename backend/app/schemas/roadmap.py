from pydantic import BaseModel, Field
from typing import List, Optional
from uuid import UUID
from datetime import datetime

from app.models.roadmap import StepStatus


class CareerPathBase(BaseModel):
    title: str
    description: Optional[str] = None
    skills_required: List[str] = []
    avg_salary: Optional[float] = None


class CareerPathCreate(CareerPathBase):
    pass


class CareerPathResponse(CareerPathBase):
    id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class RoadmapStepBase(BaseModel):
    title: str
    description: Optional[str] = None
    order: int
    status: StepStatus = StepStatus.NOT_STARTED
    completion_date: Optional[datetime] = None


class RoadmapStepCreate(RoadmapStepBase):
    pass


class RoadmapStepResponse(RoadmapStepBase):
    id: UUID
    roadmap_id: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserRoadmapBase(BaseModel):
    career_path_id: UUID
    progress_percentage: float = 0.0


class UserRoadmapCreate(UserRoadmapBase):
    pass


class UserRoadmapResponse(UserRoadmapBase):
    id: UUID
    user_id: UUID
    created_date: datetime
    last_updated: datetime
    steps: List[RoadmapStepResponse]
    career_path: CareerPathResponse

    class Config:
        from_attributes = True
