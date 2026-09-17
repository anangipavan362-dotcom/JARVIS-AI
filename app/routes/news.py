from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.models import User
from app.auth.dependencies import get_current_user
from app.services.news_service import news_service

router = APIRouter(prefix="/api/news", tags=["News Intelligence"])


@router.get("")
async def get_news(
    category: str = Query("top", description="Category: top, india, world, technology, ai, business, science, education, entertainment"),
    query: Optional[str] = Query(None, description="Optional search term"),
    current_user: User = Depends(get_current_user)
):
    result = await news_service.get_news(category=category, query=query or "")
    return result
