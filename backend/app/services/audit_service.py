import datetime
from typing import Optional
from sqlalchemy.orm import Session
from app.models import AuditLog, SecurityEvent


class AuditService:
    @staticmethod
    def log_audit(
        db: Session,
        action: str,
        actor_id: Optional[int] = None,
        actor_username: Optional[str] = None,
        target_type: Optional[str] = None,
        target_id: Optional[str] = None,
        details: Optional[str] = None,
        ip_address: Optional[str] = None,
        status: str = "SUCCESS"
    ) -> AuditLog:
        """Records an administrative or governance action to the AuditLog table."""
        entry = AuditLog(
            actor_id=actor_id,
            actor_username=actor_username or ("SYSTEM" if not actor_id else f"User#{actor_id}"),
            action=action,
            target_type=target_type,
            target_id=str(target_id) if target_id else None,
            details=details,
            ip_address=ip_address or "127.0.0.1",
            status=status,
            timestamp=datetime.datetime.utcnow()
        )
        db.add(entry)
        try:
            db.commit()
            db.refresh(entry)
        except Exception as e:
            db.rollback()
            print(f"[AUDIT LOGGING ERROR] Failed to record audit log: {e}")
        return entry

    @staticmethod
    def log_security_event(
        db: Session,
        event_type: str,
        severity: str = "MEDIUM",
        user_id: Optional[int] = None,
        identifier: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        details: Optional[str] = None
    ) -> SecurityEvent:
        """Records an authentication, OTP, or security violation incident."""
        entry = SecurityEvent(
            event_type=event_type,
            severity=severity,
            user_id=user_id,
            identifier=identifier,
            ip_address=ip_address or "127.0.0.1",
            user_agent=user_agent[:250] if user_agent else None,
            details=details,
            timestamp=datetime.datetime.utcnow()
        )
        db.add(entry)
        try:
            db.commit()
            db.refresh(entry)
        except Exception as e:
            db.rollback()
            print(f"[SECURITY EVENT ERROR] Failed to record security incident: {e}")
        return entry


audit_service = AuditService()
