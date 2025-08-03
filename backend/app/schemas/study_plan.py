from pydantic import BaseModel
from typing import List, Optional, Any

class SubTask(BaseModel):
    text: str
    completed: bool

class UserTaskBase(BaseModel):
    track_name: str
    stage_name: str
    ai_summary: Optional[str] = None
    progress: Optional[float] = 0.0

class UserTaskResponse(UserTaskBase):
    id: int
    user_id: str
    sub_tasks: List[SubTask]
    
    class Config:
        from_attributes = True

class UserTaskCreate(BaseModel):
    track_name: str
    stage_name: str
    answers: List[str]

class UserTaskUpdate(BaseModel):
    sub_task_index: int
    completed: bool

class UserTask(UserTaskBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
