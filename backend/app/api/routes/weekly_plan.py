from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import models, schemas
from app.core.database import get_db
from app.middleware.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[schemas.WeeklyTask])
def read_weekly_tasks(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """Retrieve all weekly tasks for the current user."""
    return db.query(models.WeeklyTask).filter(models.WeeklyTask.owner_id == current_user.id).all()

@router.post("/", response_model=schemas.WeeklyTask)
def create_weekly_task(
    *, 
    db: Session = Depends(get_db),
    task_in: schemas.WeeklyTaskCreate,
    current_user: models.User = Depends(get_current_active_user)
):
    """Create a new weekly task."""
    db_task = models.WeeklyTask(**task_in.model_dump(), owner_id=current_user.id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.put("/{task_id}", response_model=schemas.WeeklyTask)
def update_weekly_task(
    *, 
    db: Session = Depends(get_db),
    task_id: int,
    task_in: schemas.WeeklyTaskUpdate,
    current_user: models.User = Depends(get_current_active_user)
):
    """Update a weekly task."""
    db_task = db.query(models.WeeklyTask).filter(models.WeeklyTask.id == task_id, models.WeeklyTask.owner_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
        
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.delete("/{task_id}", response_model=schemas.WeeklyTask)
def delete_weekly_task(
    *, 
    db: Session = Depends(get_db),
    task_id: int,
    current_user: models.User = Depends(get_current_active_user)
):
    """Delete a weekly task."""
    db_task = db.query(models.WeeklyTask).filter(models.WeeklyTask.id == task_id, models.WeeklyTask.owner_id == current_user.id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    db.delete(db_task)
    db.commit()
    return db_task
