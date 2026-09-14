import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from app.database import get_db
from app.models import User, Session as UserSession
from app.schemas import UserOut
from app.auth.dependencies import get_current_admin
from app.services.activity_service import activity_service

router = APIRouter(prefix="/api/admin", tags=["Admin Terminal"])


class AdminUserUpdate(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[str] = None


class AdminStats(BaseModel):
    total_users: int
    active_users: int
    new_users_today: int
    active_sessions: int
    api_status: str
    error_rate: float
    system_health: str


@router.get("/stats", response_model=AdminStats)
def get_admin_stats(admin_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True).count()
    
    today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    new_users_today = db.query(User).filter(User.created_at >= today_start).count()
    active_sessions = db.query(UserSession).filter(UserSession.is_active == True).count()

    return AdminStats(
        total_users=total_users,
        active_users=active_users,
        new_users_today=new_users_today,
        active_sessions=active_sessions,
        api_status="NOMINAL",
        error_rate=0.02,
        system_health="OPTIMAL (100%)"
    )


@router.get("/users", response_model=List[UserOut])
def list_users(admin_user: User = Depends(get_current_admin), db: Session = Depends(get_db)):
    users = db.query(User).order_by(User.id.asc()).all()
    return users


@router.put("/users/{id}", response_model=UserOut)
def update_user_status(
    id: int,
    payload: AdminUserUpdate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    # Prevent admin from deactivating themselves
    if user.id == admin_user.id and payload.is_active is False:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot deactivate the executing admin account.")

    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.role is not None:
        if payload.role.upper() in ["USER", "ADMIN"]:
            user.role = payload.role.upper()

    db.commit()
    db.refresh(user)

    activity_service.log(db, admin_user.id, "ADMIN_USER_MODIFIED", f"Admin updated User #{id} parameters.")

    return user


@router.delete("/users/{id}")
def delete_user_by_admin(
    id: int,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if user.id == admin_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot purge currently authenticated admin account.")

    db.delete(user)
    db.commit()

    activity_service.log(db, admin_user.id, "ADMIN_USER_DELETED", f"User #{id} deleted by admin.")

    return {"status": "SUCCESS", "message": f"User account #{id} deleted."}
