import httpx
from typing import Dict, Any, Optional

WEATHER_CODES = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}

class WeatherService:
    async def get_weather(self, city: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None) -> Dict[str, Any]:
        target_city = city or "San Francisco"
        latitude = lat
        longitude = lon

        # If city is supplied or coordinates are missing, geocode city
        if (city or latitude is None or longitude is None) and target_city:
            try:
                async with httpx.AsyncClient(timeout=6.0) as client:
                    geo_res = await client.get(
                        f"https://geocoding-api.open-meteo.com/v1/search?name={target_city}&count=1&language=en&format=json"
                    )
                    if geo_res.status_code == 200:
                        geo_data = geo_res.json()
                        results = geo_data.get("results")
                        if results and len(results) > 0:
                            latitude = results[0].get("latitude")
                            longitude = results[0].get("longitude")
                            target_city = results[0].get("name", target_city)
            except Exception:
                pass

        if latitude is None or longitude is None:
            latitude, longitude = 37.7749, -122.4194

        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                url = (
                    f"https://api.open-meteo.com/v1/forecast"
                    f"?latitude={latitude}&longitude={longitude}"
                    f"&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m"
                    f"&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto"
                )
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    current = data.get("current", {})
                    daily = data.get("daily", {})
                    
                    code = current.get("weather_code", 0)
                    condition = WEATHER_CODES.get(code, "Clear atmospheric conditions")

                    forecast_days = []
                    dates = daily.get("time", [])
                    max_temps = daily.get("temperature_2m_max", [])
                    min_temps = daily.get("temperature_2m_min", [])
                    codes = daily.get("weather_code", [])

                    for i in range(min(5, len(dates))):
                        forecast_days.append({
                            "date": dates[i],
                            "max_temp": max_temps[i] if i < len(max_temps) else 25,
                            "min_temp": min_temps[i] if i < len(min_temps) else 15,
                            "condition": WEATHER_CODES.get(codes[i] if i < len(codes) else 0, "Clear")
                        })

                    return {
                        "city": target_city,
                        "latitude": latitude,
                        "longitude": longitude,
                        "temperature": current.get("temperature_2m", 22.0),
                        "feels_like": current.get("apparent_temperature", 22.0),
                        "humidity": current.get("relative_humidity_2m", 50),
                        "wind": current.get("wind_speed_10m", 12.0),
                        "condition": condition,
                        "forecast": forecast_days,
                        "is_live": True
                    }
        except Exception:
            pass

        # Fallback if external API unreachable
        return {
            "city": target_city or "Demo Metropolis",
            "temperature": 21.5,
            "feels_like": 22.0,
            "humidity": 48,
            "wind": 14.2,
            "condition": "Mainly clear (Offline Cached Model)",
            "forecast": [
                {"date": "Day 1", "max_temp": 24, "min_temp": 16, "condition": "Sunny"},
                {"date": "Day 2", "max_temp": 22, "min_temp": 15, "condition": "Partly Cloudy"},
                {"date": "Day 3", "max_temp": 20, "min_temp": 14, "condition": "Mild Rain"},
            ],
            "is_live": False
        }


weather_service = WeatherService()
