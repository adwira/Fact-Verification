from fastapi import Request
from fastapi.responses import JSONResponse

class AppBaseException(Exception):
    """Base class untuk semua error di aplikasi kita"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

class CacheException(AppBaseException):
    """Error khusus untuk masalah pada ChromaDB/Cache"""
    pass

class AgentException(AppBaseException):
    """Error khusus untuk kegagalan Agent crewAI"""
    pass

async def app_exception_handler(request: Request, exc: AppBaseException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.message,
            "path": request.url.path
        },
    )