from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.models import User
from app.auth.dependencies import get_current_user
from app.services.weather_service import weather_service

router = APIRouter(prefix="/api/weather", tags=["Weather"])


@router.get("")
async def get_weather(
    city: Optional[str] = Query(None, description="City name"),
    lat: Optional[float] = Query(None, description="Latitude"),
    lon: Optional[float] = Query(None, description="Longitude"),
    current_user: User = Depends(get_current_user)
):
    result = await weather_service.get_weather(city=city, lat=lat, lon=lon)
    return result
