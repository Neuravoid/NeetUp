from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class WeeklyTaskBase(BaseModel):
    day: str
    text: str
    category: str
    completed: bool = False

class WeeklyTaskCreate(WeeklyTaskBase):
    pass

class WeeklyTaskUpdate(BaseModel):
    day: Optional[str] = None
    text: Optional[str] = None
    category: Optional[str] = None
    completed: Optional[bool] = None

class WeeklyTask(WeeklyTaskBase):
    id: int
    owner_id: UUID

    class Config:
        from_attributes = True
