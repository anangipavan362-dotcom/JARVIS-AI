import os
import sys
import json
import traceback

# Determine paths
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
backend_dir = os.path.join(root_dir, "web", "backend")
backend_root_dir = os.path.join(root_dir, "backend")

for p in [root_dir, backend_root_dir, backend_dir, current_dir]:
    if p and os.path.exists(p) and p not in sys.path:
        sys.path.insert(0, p)

_init_error = None
_init_traceback = None
fastapi_app = None

try:
    from app.main import app as _fastapi_app
    fastapi_app = _fastapi_app
except BaseException as e:
    _init_error = str(e)
    _init_traceback = traceback.format_exc()


async def app(scope, receive, send):
    """
    Bulletproof ASGI entrypoint for Vercel Serverless Function runtime.
    Handles ASGI lifespan and HTTP requests with comprehensive error trapping.
    """
    scope_type = scope.get("type")

    # 1. Handle Lifespan protocol safely
    if scope_type == "lifespan":
        while True:
            message = await receive()
            if message["type"] == "lifespan.startup":
                await send({"type": "lifespan.startup.complete"})
            elif message["type"] == "lifespan.shutdown":
                await send({"type": "lifespan.shutdown.complete"})
                return

    # 2. Handle HTTP protocol
    if scope_type == "http":
        if _init_error or fastapi_app is None:
            resp_data = {
                "status": "BACKEND_STARTUP_ERROR",
                "message": "JARVIS AI backend encountered an error loading application modules on Vercel.",
                "error": _init_error,
                "traceback": _init_traceback.splitlines() if _init_traceback else [],
                "sys_path": sys.path,
                "cwd": os.getcwd(),
                "files_in_cwd": os.listdir(os.getcwd()) if os.path.exists(os.getcwd()) else []
            }
            body = json.dumps(resp_data, indent=2).encode("utf-8")
            await send({
                "type": "http.response.start",
                "status": 500,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"content-length", str(len(body)).encode("utf-8")),
                    (b"access-control-allow-origin", b"*"),
                ]
            })
            await send({
                "type": "http.response.body",
                "body": body,
                "more_body": False
            })
            return

        try:
            await fastapi_app(scope, receive, send)
        except BaseException as exc:
            err_data = {
                "status": "APPLICATION_RUNTIME_ERROR",
                "message": "JARVIS FastAPI application encountered an unhandled exception.",
                "error": str(exc),
                "traceback": traceback.format_exc().splitlines()
            }
            body = json.dumps(err_data, indent=2).encode("utf-8")
            await send({
                "type": "http.response.start",
                "status": 500,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"content-length", str(len(body)).encode("utf-8")),
                    (b"access-control-allow-origin", b"*"),
                ]
            })
            await send({
                "type": "http.response.body",
                "body": body,
                "more_body": False
            })
            return

    # 3. For any other scope type (e.g. websocket, etc.)
    if fastapi_app is not None:
        await fastapi_app(scope, receive, send)


# Export handler as well for Vercel discovery
handler = app
