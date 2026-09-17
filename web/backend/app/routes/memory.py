from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Memory
from app.schemas import MemoryCreate, MemoryUpdate, MemoryOut
from app.auth.dependencies import get_current_user
from app.services.activity_service import activity_service

router = APIRouter(prefix="/api/memory", tags=["Memory"])


@router.get("", response_model=List[MemoryOut])
def get_memories(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    memories = (
        db.query(Memory)
        .filter(Memory.user_id == current_user.id)
        .order_by(Memory.updated_at.desc())
        .all()
    )
    return memories


@router.post("", response_model=MemoryOut, status_code=status.HTTP_201_CREATED)
def create_memory(payload: MemoryCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Check if key exists for user
    existing = db.query(Memory).filter(
        Memory.user_id == current_user.id,
        Memory.key == payload.key.strip()
    ).first()
    if existing:
        existing.value = payload.value.strip()
        existing.category = payload.category or existing.category
        db.commit()
        db.refresh(existing)
        activity_service.log(db, current_user.id, "MEMORY_UPDATED", f"Memory key '{existing.key}' updated.")
        return existing

    memory = Memory(
        user_id=current_user.id,
        key=payload.key.strip(),
        value=payload.value.strip(),
        category=payload.category or "general"
    )
    db.add(memory)
    db.commit()
    db.refresh(memory)

    activity_service.log(db, current_user.id, "MEMORY_STORED", f"New memory key '{memory.key}' committed.")

    return memory


@router.put("/{id}", response_model=MemoryOut)
def update_memory(
    id: int,
    payload: MemoryUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    memory = db.query(Memory).filter(
        Memory.id == id,
        Memory.user_id == current_user.id
    ).first()
    if not memory:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Memory item not found.")

    if payload.key is not None:
        memory.key = payload.key.strip()
    if payload.value is not None:
        memory.value = payload.value.strip()
    if payload.category is not None:
        memory.category = payload.category

    db.commit()
    db.refresh(memory)

    activity_service.log(db, current_user.id, "MEMORY_UPDATED", f"Memory item #{id} edited.")

    return memory


@router.delete("/{id}")
def delete_memory(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    memory = db.query(Memory).filter(
        Memory.id == id,
        Memory.user_id == current_user.id
    ).first()
    if not memory:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Memory item not found.")

    db.delete(memory)
    db.commit()

    activity_service.log(db, current_user.id, "MEMORY_DELETED", f"Memory item #{id} purged from banks.")

    return {"status": "SUCCESS", "message": "Memory erased from database."}
