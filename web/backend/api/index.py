import os
import sys
import traceback

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "web", "backend")

for p in [backend_dir, root_dir, current_dir]:
    if os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

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
                "cwd": os.getcwd(),
                "files_in_cwd": os.listdir(os.getcwd()) if os.path.exists(os.getcwd()) else []
            }
        )
