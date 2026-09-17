from fastapi import APIRouter, Depends, Query
from app.models import User
from app.auth.dependencies import get_current_user
from app.services.sports_service import sports_service

router = APIRouter(prefix="/api/sports", tags=["Sports Intelligence"])


@router.get("")
async def get_sports(
    category: str = Query("cricket", description="Category: cricket, football, f1, tennis, basketball"),
    tab: str = Query("live", description="Tab: live, upcoming, recent"),
    current_user: User = Depends(get_current_user)
):
    result = await sports_service.get_sports(category=category, tab=tab)
    return result
