# Import all the models, so that Base has them before being imported by Alembic
from app.db.base_class import Base
from app.models.user import User
from app.models.test import Test, Question, Answer, TestSubmission, TestResult
from app.models.roadmap import CareerPath, Roadmap, RoadmapStep, UserRoadmap
from app.models.course import Course, UserCourse
from app.models.achievement import Achievement, UserAchievement
from app.models.job_listing import JobListing
from app.models.chat import ChatConversation, ChatMessage
from app.models.business_plan import BusinessPlan
from app.models.project import Project, UserProject
from app.models.user_settings import UserSettings
