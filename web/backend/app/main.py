import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import engine, Base
from app.models import *  # Ensure all models are registered with Base

# Import all routers
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.ai import router as ai_router
from app.routes.conversations import router as conversations_router
from app.routes.tasks import router as tasks_router
from app.routes.memory import router as memory_router
from app.routes.news import router as news_router
from app.routes.sports import router as sports_router
from app.routes.weather import router as weather_router
from app.routes.search import router as search_router
from app.routes.notifications import router as notifications_router
from app.routes.profile import router as profile_router
from app.routes.system import router as system_router
from app.routes.admin import router as admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    try:
        Base.metadata.create_all(bind=engine)
        print(f"[{settings.APP_NAME}] Quantum Database Schemas Initialized.")
    except Exception as e:
        print(f"[{settings.APP_NAME}] Database init notice: {e}")
    print(f"[{settings.APP_NAME}] Operational Mode: {'DEMO MODE' if settings.is_demo_mode else 'LIVE AI CORE'}")
    yield
    print(f"[{settings.APP_NAME}] Systems shutting down gracefully.")


app = FastAPI(
    title=f"{settings.APP_NAME} AI Operating System",
    description="Just A Rather Very Intelligent System - Advanced Personal AI Command Center Backend",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For flexible local dev and staging access
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Security and Telemetry Middleware
@app.middleware("http")
async def security_and_telemetry_middleware(request: Request, call_next):
    start_time = time.time()
    
    # Process request
    response = await call_next(request)
    
    process_time = (time.time() - start_time) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    
    return response


# Global Exception Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[JARVIS CORE ERROR] Unhandled exception on {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "status": "SYSTEM_NOTICE",
            "message": "Internal JARVIS core error encountered. Subsystems remaining resilient.",
            "detail": str(exc) if settings.ENVIRONMENT == "development" else "Internal server fault"
        }
    )


# Register all routers
app.include_router(auth_router)
app.include_router(dashboard_router)
app.include_router(ai_router)
app.include_router(conversations_router)
app.include_router(tasks_router)
app.include_router(memory_router)
app.include_router(news_router)
app.include_router(sports_router)
app.include_router(weather_router)
app.include_router(search_router)
app.include_router(notifications_router)
app.include_router(profile_router)
app.include_router(system_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {
        "system": settings.APP_NAME,
        "status": "ONLINE",
        "mode": "DEMO" if settings.is_demo_mode else "LIVE",
        "version": settings.VERSION,
        "documentation": "/docs"
    }
