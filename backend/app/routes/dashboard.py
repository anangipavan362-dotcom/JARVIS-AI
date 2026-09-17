from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models import User, Conversation, Message, Task, Memory, Notification
from app.schemas import DashboardData, ConversationSummary, TaskOut, MemoryOut, UserOut
from app.auth.dependencies import get_current_user
from app.config import settings

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])


@router.get("", response_model=DashboardData)
def get_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # User's recent conversations
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .limit(5)
        .all()
    )
    
    convo_summaries = []
    for c in conversations:
        msg_count = db.query(Message).filter(Message.conversation_id == c.id).count()
        convo_summaries.append(
            ConversationSummary(
                id=c.id,
                title=c.title,
                created_at=c.created_at,
                updated_at=c.updated_at,
                message_count=msg_count
            )
        )

    # User's urgent or incomplete tasks
    tasks = (
        db.query(Task)
        .filter(Task.user_id == current_user.id, Task.completed == False)
        .order_by(Task.priority.desc(), Task.created_at.desc())
        .limit(5)
        .all()
    )

    # User's recent memories
    memories = (
        db.query(Memory)
        .filter(Memory.user_id == current_user.id)
        .order_by(Memory.updated_at.desc())
        .limit(5)
        .all()
    )

    # Unread notifications
    unread_notifs = (
        db.query(Notification)
        .filter(Notification.user_id == current_user.id, Notification.read == False)
        .count()
    )

    is_demo = settings.is_demo_mode
    ai_status = "JARVIS DEMO MODE" if is_demo else "AI CORE ACTIVE"

    return DashboardData(
        ai_status=ai_status,
        is_demo=is_demo,
        voice_ready=True,
        network_connected=True,
        database_connected=True,
        recent_conversations=convo_summaries,
        urgent_tasks=[TaskOut.model_validate(t) for t in tasks],
        recent_memories=[MemoryOut.model_validate(m) for m in memories],
        unread_notifications_count=unread_notifs,
        system_health_score=98,
        user=UserOut.model_validate(current_user)
    )
