from fastapi import APIRouter, Depends, Query
from app.models import User
from app.auth.dependencies import get_current_user
from app.services.search_service import search_service

router = APIRouter(prefix="/api/search", tags=["Search"])


@router.get("")
def search(
    q: str = Query(..., description="Search query string"),
    category: str = Query("google", description="Category: google, youtube, news, technology, academic"),
    current_user: User = Depends(get_current_user)
):
    result = search_service.perform_search(query=q, category=category)
    return result
