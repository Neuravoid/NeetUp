from app.core.database import Base, engine

# Import all models to ensure they are registered with SQLAlchemy
from app.models.user import User
from app.models.test import Test, Question, Answer, UserTestResult
from app.models.roadmap import CareerPath, UserRoadmap, RoadmapStep
from app.models.course import Course, UserCourse
from app.models.personality_test import PersonalityTest, PersonalityQuestion, PersonalityCoalition

print("Creating database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
