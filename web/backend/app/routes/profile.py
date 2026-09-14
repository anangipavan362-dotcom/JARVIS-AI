from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Dict, Any

from app.database import get_db
from app.models import User, UserSettings, Conversation, Message, Task, Memory, ActivityLog
from app.schemas import UserOut, UserProfileUpdate, UserSettingsOut, UserSettingsUpdate
from app.auth.dependencies import get_current_user
from app.services.activity_service import activity_service

router = APIRouter(prefix="/api/profile", tags=["Profile & Settings"])


@router.get("", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.put("", response_model=UserOut)
def update_profile(payload: UserProfileUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if payload.full_name is not None:
        current_user.full_name = payload.full_name.strip()
    if payload.avatar_url is not None:
        current_user.avatar_url = payload.avatar_url.strip()
    if payload.email is not None and payload.email != current_user.email:
        # Check uniqueness
        exists = db.query(User).filter(User.email == payload.email, User.id != current_user.id).first()
        if exists:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already taken.")
        current_user.email = payload.email

    db.commit()
    db.refresh(current_user)

    activity_service.log(db, current_user.id, "PROFILE_UPDATED", "User profile telemetry updated.")

    return current_user


@router.get("/settings", response_model=UserSettingsOut)
def get_user_settings(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    settings_obj = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings_obj:
        settings_obj = UserSettings(user_id=current_user.id)
        db.add(settings_obj)
        db.commit()
        db.refresh(settings_obj)
    return settings_obj


@router.put("/settings", response_model=UserSettingsOut)
def update_user_settings(
    payload: UserSettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    settings_obj = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    if not settings_obj:
        settings_obj = UserSettings(user_id=current_user.id)
        db.add(settings_obj)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(settings_obj, field, value)

    db.commit()
    db.refresh(settings_obj)

    activity_service.log(db, current_user.id, "SETTINGS_UPDATED", "HUD and system configuration parameters updated.")

    return settings_obj


@router.get("/export")
def export_user_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    DOWNLOAD MY DATA:
    Exports all personal conversations, tasks, memories, and settings in compliance with privacy regulations.
    Only returns current user's records.
    """
    user_settings = db.query(UserSettings).filter(UserSettings.user_id == current_user.id).first()
    tasks = db.query(Task).filter(Task.user_id == current_user.id).all()
    memories = db.query(Memory).filter(Memory.user_id == current_user.id).all()
    convos = db.query(Conversation).filter(Conversation.user_id == current_user.id).all()
    
    convo_data = []
    for c in convos:
        messages = db.query(Message).filter(Message.conversation_id == c.id).order_by(Message.created_at.asc()).all()
        convo_data.append({
            "id": c.id,
            "title": c.title,
            "created_at": str(c.created_at),
            "messages": [{"role": m.role, "content": m.content, "timestamp": str(m.created_at)} for m in messages]
        })

    activity_service.log(db, current_user.id, "DATA_EXPORTED", "Personal archive compiled.")

    return {
        "export_metadata": {
            "system": "J.A.R.V.I.S. Command Center",
            "version": "1.0",
            "user_id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "exported_at": str(datetime.datetime.utcnow())
        },
        "profile": {
            "full_name": current_user.full_name,
            "role": current_user.role,
            "created_at": str(current_user.created_at),
            "last_login": str(current_user.last_login)
        },
        "settings": {
            "theme": user_settings.theme if user_settings else "jarvis_dark",
            "hud_intensity": user_settings.hud_intensity if user_settings else "high",
            "voice_enabled": user_settings.voice_enabled if user_settings else True,
            "ai_personality": user_settings.ai_personality if user_settings else "jarvis"
        },
        "tasks": [{"id": t.id, "title": t.title, "priority": t.priority, "completed": t.completed, "category": t.category} for t in tasks],
        "memories": [{"id": m.id, "key": m.key, "value": m.value, "category": m.category} for m in memories],
        "conversations": convo_data
    }


@router.delete("")
def delete_account(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """
    DELETE JARVIS ACCOUNT:
    Permanently purges all user data across all tables with cascading deletion.
    """
    user_id = current_user.id
    db.delete(current_user)
    db.commit()
    return {"status": "SUCCESS", "message": f"Account #{user_id} and all related mission logs purged permanently."}
