from fastapi import Request, status
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError
from jose.exceptions import JWTError

async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """
    Handle SQLAlchemy exceptions
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Database error occurred", "type": "database_error"}
    )

async def jwt_exception_handler(request: Request, exc: JWTError):
    """
    Handle JWT exceptions
    """
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "Invalid authentication credentials", "type": "authentication_error"},
        headers={"WWW-Authenticate": "Bearer"}
    )

async def validation_exception_handler(request: Request, exc: Exception):
    """
    Handle validation exceptions
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": str(exc), "type": "validation_error"}
    )

async def general_exception_handler(request: Request, exc: Exception):
    """
    Handle general exceptions
    """
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An unexpected error occurred", "type": "server_error"}
    )
