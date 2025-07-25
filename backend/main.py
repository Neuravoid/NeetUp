from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from jose.exceptions import JWTError

from app.core.config import settings
from app.api.routes import auth, tests, roadmaps, courses, users, admin, personality_test
from app.middleware.error_handlers import (
    sqlalchemy_exception_handler,
    jwt_exception_handler,
    validation_exception_handler,
    general_exception_handler
)

app = FastAPI(title=settings.PROJECT_NAME)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(SQLAlchemyError, sqlalchemy_exception_handler)
app.add_exception_handler(JWTError, jwt_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, general_exception_handler)

# Include routers
app.include_router(auth.router, prefix="/api/auth")
app.include_router(tests.router, prefix="/api/tests")
app.include_router(roadmaps.router, prefix="/api/roadmaps")
app.include_router(courses.router, prefix="/api/recommendations")
app.include_router(courses.router_courses, prefix="/api/courses")
app.include_router(users.router, prefix="/api/users")
app.include_router(admin.router, prefix="/api/admin")
app.include_router(personality_test.router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Career Development API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
