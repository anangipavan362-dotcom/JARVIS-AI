from sqlalchemy.orm import Session
from app.models import ActivityLog
from typing import Optional

class ActivityService:
    @staticmethod
    def log(db: Session, user_id: int, action: str, details: Optional[str] = None, ip_address: Optional[str] = None):
        try:
            log_entry = ActivityLog(
                user_id=user_id,
                action=action,
                details=details,
                ip_address=ip_address
            )
            db.add(log_entry)
            db.commit()
        except Exception:
            db.rollback()


activity_service = ActivityService()
