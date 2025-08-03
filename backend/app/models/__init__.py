# Import all models to ensure they are registered with SQLAlchemy
from .base import BaseModel
from .user import User
from .weekly_plan import WeeklyTask
from .course import Course, UserCourse
from .roadmap import CareerPath, UserRoadmap, RoadmapStep
from .test import Test, Question, Answer, UserTestResult
from .personality_test import PersonalityTest, PersonalityQuestion
from .chat import ChatSession, ChatMessage


__all__ = [
    "BaseModel",
    "User", 
    "Course", 
    "UserCourse",
    "CareerPath", 
    "UserRoadmap", 
    "RoadmapStep",
    "Test", 
    "Question", 
    "Answer", 
    "UserTestResult",
    "PersonalityTest",
    "PersonalityQuestion",
    "ChatSession",
    "ChatMessage"
]
