from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Conversation, Message
from app.schemas import (
    ConversationCreate, ConversationUpdate, ConversationOut,
    ConversationSummary, MessageCreate, MessageOut
)
from app.auth.dependencies import get_current_user

router = APIRouter(prefix="/api/conversations", tags=["Conversations"])


@router.get("", response_model=List[ConversationSummary])
def list_conversations(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convos = (
        db.query(Conversation)
        .filter(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )
    result = []
    for c in convos:
        count = db.query(Message).filter(Message.conversation_id == c.id).count()
        result.append(
            ConversationSummary(
                id=c.id,
                title=c.title,
                created_at=c.created_at,
                updated_at=c.updated_at,
                message_count=count
            )
        )
    return result


@router.post("", response_model=ConversationOut, status_code=status.HTTP_201_CREATED)
def create_conversation(
    payload: ConversationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    convo = Conversation(user_id=current_user.id, title=payload.title or "New Mission")
    db.add(convo)
    db.commit()
    db.refresh(convo)
    return convo


@router.get("/{id}", response_model=ConversationOut)
def get_conversation(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convo = db.query(Conversation).filter(
        Conversation.id == id,
        Conversation.user_id == current_user.id
    ).first()
    if not convo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    return convo


@router.put("/{id}", response_model=ConversationOut)
def update_conversation(
    id: int,
    payload: ConversationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    convo = db.query(Conversation).filter(
        Conversation.id == id,
        Conversation.user_id == current_user.id
    ).first()
    if not convo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    
    convo.title = payload.title.strip()
    db.commit()
    db.refresh(convo)
    return convo


@router.delete("/{id}")
def delete_conversation(id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    convo = db.query(Conversation).filter(
        Conversation.id == id,
        Conversation.user_id == current_user.id
    ).first()
    if not convo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    db.delete(convo)
    db.commit()
    return {"status": "SUCCESS", "message": "Conversation purged."}


@router.post("/{id}/messages", response_model=MessageOut)
def add_message(
    id: int,
    payload: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    convo = db.query(Conversation).filter(
        Conversation.id == id,
        Conversation.user_id == current_user.id
    ).first()
    if not convo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")

    msg = Message(
        conversation_id=convo.id,
        user_id=current_user.id,
        role=payload.role,
        content=payload.content
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
