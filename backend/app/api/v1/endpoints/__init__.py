"""
API endpoints modülü.
Bu klasör, FastAPI API endpoint fonksiyonlarını içerir.
Her bir endpoint, belirli bir işlemi gerçekleştirmek için HTTP isteklerini işler.
"""

from fastapi import APIRouter

from .auth import router as auth_router
from .tests import router as tests_router
from .roadmaps import router as roadmaps_router
from .courses import router as courses_router
from .dashboard import router as dashboard_router
from .admin import router as admin_router
from .job_listings import router as job_listings_router
from .chat import router as chat_router
from .business_plan import router as business_plan_router
from .projects import router as projects_router
from .user_settings import router as user_settings_router

api_router = APIRouter()

# Sprint 1 (MVP Core) Endpoints
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(tests_router, prefix="/tests", tags=["tests"])
api_router.include_router(roadmaps_router, prefix="/roadmaps", tags=["roadmaps"])

# Sprint 2 (MVP Development) Endpoints
api_router.include_router(courses_router, prefix="/courses", tags=["courses"])
api_router.include_router(dashboard_router, prefix="/user", tags=["dashboard"])
api_router.include_router(admin_router, prefix="/admin", tags=["admin"])

# Sprint 3 (Interaction Phase) Endpoints
api_router.include_router(job_listings_router, prefix="/job-listings", tags=["job-listings"])
api_router.include_router(chat_router, prefix="/chat", tags=["chat"])
api_router.include_router(business_plan_router, prefix="/business-plan", tags=["business-plan"])
api_router.include_router(projects_router, prefix="/projects", tags=["projects"])
api_router.include_router(user_settings_router, prefix="/user", tags=["user-settings"])
