import os
import sys
import traceback

_current_dir = os.path.dirname(os.path.abspath(__file__))
_frontend_dir = os.path.dirname(_current_dir)
_app_dir = os.path.join(_frontend_dir, "app")

for _p in [_frontend_dir, _app_dir, _current_dir]:
    if _p and os.path.exists(_p) and _p not in sys.path:
        sys.path.insert(0, _p)

try:
    from app.main import app
except Exception as e:
    err_tb = traceback.format_exc()
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    
    app = FastAPI()
    
    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD", "PATCH"])
    async def catch_all(full_path: str = ""):
        return JSONResponse(
            status_code=500,
            content={
                "status": "ERROR",
                "error": "Backend initialization encountered an exception on Vercel Serverless runtime.",
                "exception": str(e),
                "traceback": err_tb.splitlines(),
                "sys_path": sys.path,
                "cwd": os.getcwd()
            }
        )
