import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import List, Optional, Any, Dict

from app.database import get_db
from app.models import (
    User, Session as UserSession, Conversation, Message, Task, Memory,
    ActivityLog, AuditLog, SecurityEvent, SystemSetting
)
from app.schemas import (
    UserOut, AdminUserDetail, AdminAnalytics, AuditLogAdminOut,
    SecurityEventOut, SystemSettingOut, SystemSettingUpdate, ActivityLogOut
)
from app.auth.dependencies import get_current_admin
from app.services.activity_service import activity_service
from app.services.audit_service import audit_service

router = APIRouter(prefix="/api/admin", tags=["Admin Terminal"])


class AdminUserUpdate(BaseModel):
    is_active: Optional[bool] = None
    role: Optional[str] = None
    status: Optional[str] = None


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
    if payload.status is not None:
        if payload.status.upper() in ["PENDING_VERIFICATION", "VERIFIED", "SUSPENDED", "DISABLED"]:
            user.status = payload.status.upper()
            if user.status in ["SUSPENDED", "DISABLED"]:
                user.is_active = False
            elif user.status == "VERIFIED":
                user.is_active = True

    db.commit()
    db.refresh(user)

    audit_service.log_audit(
        db,
        action="USER_STATUS_UPDATED",
        actor_id=admin_user.id,
        actor_username=admin_user.username,
        target_type="USER",
        target_id=str(id),
        details=f"Updated role={user.role}, status={user.status}, is_active={user.is_active}"
    )

    return user


@router.get("/users/{id}", response_model=AdminUserDetail)
def get_user_detail(
    id: int,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    conv_count = db.query(Conversation).filter(Conversation.user_id == id).count()
    msg_count = db.query(Message).filter(Message.user_id == id).count()
    task_count = db.query(Task).filter(Task.user_id == id).count()
    mem_count = db.query(Memory).filter(Memory.user_id == id).count()
    session_count = db.query(UserSession).filter(UserSession.user_id == id, UserSession.is_active == True).count()
    
    recent_acts = db.query(ActivityLog).filter(ActivityLog.user_id == id).order_by(ActivityLog.timestamp.desc()).limit(10).all()
    recent_sec = db.query(SecurityEvent).filter(
        (SecurityEvent.user_id == id) | (SecurityEvent.identifier == user.email) | (SecurityEvent.identifier == user.username)
    ).order_by(SecurityEvent.timestamp.desc()).limit(10).all()

    sec_dicts = [
        {
            "id": s.id,
            "event_type": s.event_type,
            "severity": s.severity,
            "ip_address": s.ip_address,
            "details": s.details,
            "timestamp": s.timestamp.isoformat()
        } for s in recent_sec
    ]

    return AdminUserDetail(
        user=UserOut.model_validate(user),
        conversations_count=conv_count,
        messages_count=msg_count,
        tasks_count=task_count,
        memories_count=mem_count,
        active_sessions_count=session_count,
        recent_activities=[ActivityLogOut.model_validate(a) for a in recent_acts],
        recent_security_events=sec_dicts
    )


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

    username = user.username
    db.delete(user)
    db.commit()

    audit_service.log_audit(
        db,
        action="USER_DELETED",
        actor_id=admin_user.id,
        actor_username=admin_user.username,
        target_type="USER",
        target_id=str(id),
        details=f"Purged user account @{username}."
    )

    return {"status": "SUCCESS", "message": f"User account #{id} deleted."}


@router.get("/analytics", response_model=AdminAnalytics)
def get_analytics(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(User).count()
    verified_users = db.query(User).filter(User.status == "VERIFIED").count()
    pending_users = db.query(User).filter(User.status == "PENDING_VERIFICATION").count()
    suspended_users = db.query(User).filter(User.status.in_(["SUSPENDED", "DISABLED"])).count()
    active_sessions = db.query(UserSession).filter(UserSession.is_active == True).count()
    total_convs = db.query(Conversation).count()
    total_msgs = db.query(Message).count()
    total_tasks = db.query(Task).count()
    completed_tasks = db.query(Task).filter(Task.completed == True).count()
    sec_count = db.query(SecurityEvent).count()

    # Generate daily timeline based on real data for last 7 days
    now = datetime.datetime.utcnow()
    timeline = []
    ai_timeline = []
    for i in range(6, -1, -1):
        day_start = (now - datetime.timedelta(days=i)).replace(hour=0, minute=0, second=0, microsecond=0)
        day_end = day_start + datetime.timedelta(days=1)
        day_label = day_start.strftime("%a %d")
        
        reg_count = db.query(User).filter(User.created_at >= day_start, User.created_at < day_end).count()
        timeline.append({"date": day_label, "registrations": reg_count})

        msg_count = db.query(Message).filter(Message.created_at >= day_start, Message.created_at < day_end).count()
        ai_timeline.append({"date": day_label, "messages": msg_count})

    return AdminAnalytics(
        total_users=total_users,
        verified_users=verified_users,
        pending_users=pending_users,
        suspended_users=suspended_users,
        active_sessions=active_sessions,
        total_conversations=total_convs,
        total_messages=total_msgs,
        total_tasks=total_tasks,
        completed_tasks=completed_tasks,
        security_incidents_count=sec_count,
        registration_timeline=timeline,
        ai_activity_timeline=ai_timeline
    )


@router.get("/audit-logs", response_model=List[AuditLogAdminOut])
def list_audit_logs(
    limit: int = 50,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs


@router.get("/security/events", response_model=List[SecurityEventOut])
def list_security_events(
    limit: int = 50,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    events = db.query(SecurityEvent).order_by(SecurityEvent.timestamp.desc()).limit(limit).all()
    return events


@router.get("/settings", response_model=List[SystemSettingOut])
def list_settings(
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    # Ensure default system settings exist
    defaults = [
        ("otp_length", "6", "security", "Length of OTP clearance digits"),
        ("otp_expiration_minutes", "10", "security", "Clearance code expiration in minutes"),
        ("otp_max_attempts", "5", "security", "Maximum failed validation attempts"),
        ("otp_resend_cooldown_sec", "60", "security", "Cooldown period between OTP resend transmissions"),
        ("ai_provider", "Google Gemini 2.5", "ai", "Primary active artificial intelligence provider"),
        ("ai_default_model", "gemini-2.5-flash", "ai", "Default neural model identifier"),
        ("ai_temperature", "0.7", "ai", "Neural randomness and creativity parameter"),
        ("voice_enabled", "true", "voice", "Browser speech synthesis system status"),
        ("voice_default_rate", "1.0", "voice", "Audio synthesis playback speed"),
        ("ui_3d_effects", "true", "ui", "3D WebGL particle fields and holographic reactor status"),
        ("ui_particle_density", "normal", "ui", "Stardust particle system density (low/normal/ultra)")
    ]
    for key, val, cat, desc in defaults:
        existing = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        if not existing:
            db.add(SystemSetting(key=key, value=val, category=cat, description=desc))
    db.commit()

    return db.query(SystemSetting).order_by(SystemSetting.category.asc(), SystemSetting.key.asc()).all()


@router.put("/settings", response_model=SystemSettingOut)
def update_setting(
    payload: SystemSettingUpdate,
    admin_user: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    setting = db.query(SystemSetting).filter(SystemSetting.key == payload.key).first()
    if not setting:
        setting = SystemSetting(key=payload.key, value=payload.value, category="general")
        db.add(setting)
    else:
        setting.value = payload.value
    db.commit()
    db.refresh(setting)

    audit_service.log_audit(
        db,
        action="SYSTEM_SETTING_UPDATED",
        actor_id=admin_user.id,
        actor_username=admin_user.username,
        target_type="SETTING",
        target_id=payload.key,
        details=f"Updated setting '{payload.key}' to '{payload.value}'."
    )

    return setting
