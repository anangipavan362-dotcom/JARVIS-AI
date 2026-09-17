from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Task
from app.schemas import TaskCreate, TaskUpdate, TaskOut
from app.auth.dependencies import get_current_user
from app.services.activity_service import activity_service

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])


@router.get("", response_model=List[TaskOut])
def get_tasks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.id)
        .order_by(Task.completed.asc(), Task.priority.desc(), Task.created_at.desc())
        .all()
    )
    return tasks


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = Task(
        user_id=current_user.id,
        title=payload.title.strip(),
        description=payload.description or "",
        priority=payload.priority.upper(),
        due_date=payload.due_date,
        category=payload.category or "General",
        completed=False
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    activity_service.log(db, current_user.id, "TASK_CREATED", f"Task '{task.title}' logged with priority {task.priority}.")

    return task


@router.put("/{id}", response_model=TaskOut)
def update_task(
    id: int,
    payload: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    task = db.query(Task).filter(
        Task.id == id,
        Task.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")

    if payload.title is not None:
        task.title = payload.title.strip()
    if payload.description is not None:
        task.description = payload.description
    if payload.priority is not None:
        task.priority = payload.priority.upper()
    if payload.due_date is not None:
        task.due_date = payload.due_date
    if payload.category is not None:
        task.category = payload.category
    if payload.completed is not None:
        task.completed = payload.completed

    db.commit()
    db.refresh(task)

    activity_service.log(db, current_user.id, "TASK_UPDATED", f"Task '{task.title}' updated.")

    return task


@router.delete("/{id}")
def delete_task(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = db.query(Task).filter(
        Task.id == id,
        Task.user_id == current_user.id
    ).first()
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found.")

    db.delete(task)
    db.commit()

    activity_service.log(db, current_user.id, "TASK_DELETED", f"Task '{task.title}' removed from manifest.")

    return {"status": "SUCCESS", "message": "Task dismissed from mission log."}
