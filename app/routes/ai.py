import json
import asyncio
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User, Conversation, Message, Memory
from app.schemas import AIChatRequest, AIChatResponse, AISummarizeRequest
from app.auth.dependencies import get_current_user
from app.services.ai_service import ai_service
from app.services.activity_service import activity_service

router = APIRouter(prefix="/api/ai", tags=["AI Core"])


@router.post("/chat", response_model=AIChatResponse)
async def chat(
    payload: AIChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    convo = None
    if payload.conversation_id:
        convo = db.query(Conversation).filter(
            Conversation.id == payload.conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        if not convo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    else:
        # Generate initial title from first words
        title_snippet = payload.message[:30].strip() or "Mission Consultation"
        convo = Conversation(user_id=current_user.id, title=title_snippet)
        db.add(convo)
        db.commit()
        db.refresh(convo)

    # Fetch prior history for this conversation
    history_records = (
        db.query(Message)
        .filter(Message.conversation_id == convo.id)
        .order_by(Message.created_at.asc())
        .limit(payload.context_window)
        .all()
    )
    history = [{"role": m.role, "content": m.content} for m in history_records]

    # Fetch user memories
    memory_records = db.query(Memory).filter(Memory.user_id == current_user.id).all()
    memories = [{"key": m.key, "value": m.value} for m in memory_records]

    # Generate response
    ai_result = await ai_service.generate_response(
        message=payload.message,
        history=history,
        memories=memories
    )

    # Save User message
    user_msg = Message(
        conversation_id=convo.id,
        user_id=current_user.id,
        role="user",
        content=payload.message
    )
    db.add(user_msg)

    # Save Assistant message
    assistant_msg = Message(
        conversation_id=convo.id,
        user_id=current_user.id,
        role="assistant",
        content=ai_result["response"]
    )
    db.add(assistant_msg)
    db.commit()

    activity_service.log(db, current_user.id, "AI_CHAT_COMPLETED", f"Conversation {convo.id} exchange.")

    return AIChatResponse(
        response=ai_result["response"],
        conversation_id=convo.id,
        is_demo=ai_result["is_demo"],
        model=ai_result["model"]
    )


@router.post("/stream")
async def chat_stream(
    payload: AIChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    convo = None
    if payload.conversation_id:
        convo = db.query(Conversation).filter(
            Conversation.id == payload.conversation_id,
            Conversation.user_id == current_user.id
        ).first()
        if not convo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    else:
        title_snippet = payload.message[:30].strip() or "Mission Consultation"
        convo = Conversation(user_id=current_user.id, title=title_snippet)
        db.add(convo)
        db.commit()
        db.refresh(convo)

    history_records = (
        db.query(Message)
        .filter(Message.conversation_id == convo.id)
        .order_by(Message.created_at.asc())
        .limit(payload.context_window)
        .all()
    )
    history = [{"role": m.role, "content": m.content} for m in history_records]
    memory_records = db.query(Memory).filter(Memory.user_id == current_user.id).all()
    memories = [{"key": m.key, "value": m.value} for m in memory_records]

    # Save user message
    user_msg = Message(
        conversation_id=convo.id,
        user_id=current_user.id,
        role="user",
        content=payload.message
    )
    db.add(user_msg)
    db.commit()

    ai_result = await ai_service.generate_response(
        message=payload.message,
        history=history,
        memories=memories
    )

    assistant_msg = Message(
        conversation_id=convo.id,
        user_id=current_user.id,
        role="assistant",
        content=ai_result["response"]
    )
    db.add(assistant_msg)
    db.commit()

    async def sse_generator():
        # Stream response word by word for futuristic typewriter effect
        text = ai_result["response"]
        words = text.split(" ")
        for i, word in enumerate(words):
            chunk = word + (" " if i < len(words) - 1 else "")
            payload_data = {
                "chunk": chunk,
                "conversation_id": convo.id,
                "is_demo": ai_result["is_demo"],
                "model": ai_result["model"]
            }
            yield f"data: {json.dumps(payload_data)}\n\n"
            await asyncio.sleep(0.02)
        yield "data: [DONE]\n\n"

    return StreamingResponse(sse_generator(), media_type="text/event-stream")


@router.post("/summarize")
async def summarize(payload: AISummarizeRequest, current_user: User = Depends(get_current_user)):
    summary_prompt = f"Provide a crisp, tactical military-style executive summary of this content in 2-3 sentences:\n\n{payload.text}"
    result = await ai_service.generate_response(
        message=summary_prompt,
        history=[],
        memories=[]
    )
    return {"summary": result["response"], "is_demo": result["is_demo"]}
