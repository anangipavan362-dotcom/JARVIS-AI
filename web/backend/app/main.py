import os
import sys

# Ensure parent directories are on sys.path for direct Vercel imports
_file_dir = os.path.dirname(os.path.abspath(__file__))
_parent_dir = os.path.dirname(_file_dir)
_grandparent_dir = os.path.dirname(_parent_dir)

for _p in [_parent_dir, _grandparent_dir, _file_dir]:
    if _p and os.path.exists(_p) and _p not in sys.path:
        sys.path.insert(0, _p)

import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

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


# Locate frontend build directory if present
_dist_candidates = [
    os.path.join(_parent_dir, "web", "frontend", "dist"),
    os.path.join(_file_dir, "..", "web", "frontend", "dist"),
    os.path.join(os.getcwd(), "web", "frontend", "dist"),
    os.path.join(_file_dir, "dist"),
]
dist_dir = next((d for d in _dist_candidates if os.path.isdir(d)), None)

if dist_dir:
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.isdir(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static-assets")


@app.get("/")
def root(request: Request):
    accept = request.headers.get("accept", "")
    if "text/html" in accept and dist_dir:
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
    return {
        "system": settings.APP_NAME,
        "status": "ONLINE",
        "mode": "DEMO" if settings.is_demo_mode else "LIVE",
        "version": settings.VERSION,
        "documentation": "/docs"
    }


@app.get("/health")
@app.get("/api/health")
def health():
    return {
        "system": settings.APP_NAME,
        "status": "ONLINE",
        "mode": "DEMO" if settings.is_demo_mode else "LIVE",
        "version": settings.VERSION,
        "documentation": "/docs"
    }


if dist_dir:
    @app.get("/{full_path:path}")
    async def serve_spa(request: Request, full_path: str = ""):
        if full_path.startswith("api") or full_path in ("docs", "redoc", "openapi.json"):
            return JSONResponse(status_code=404, content={"detail": "Not Found"})
        target = os.path.join(dist_dir, full_path)
        if full_path and os.path.isfile(target):
            return FileResponse(target)
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        return JSONResponse(status_code=404, content={"detail": "Not Found"})
