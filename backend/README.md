# Career Development Platform API

A robust backend API for a career development platform built with FastAPI and SQLite.

## Features

- User Authentication with JWT
- Skill Assessment Tests
- Personalized Career Roadmaps
- Course Recommendations
- User Progress Tracking
- Admin Reporting

## Tech Stack

- **Framework**: FastAPI
- **Database**: SQLite
- **ORM**: SQLAlchemy
- **Authentication**: JWT (JSON Web Tokens)

## Project Structure

```
backend/
│
├── app/                    # Application package
│   ├── api/                # API endpoints
│   │   └── routes/         # Route definitions
│   ├── core/               # Core modules (config, db)
│   ├── middleware/         # Middleware components
│   ├── models/             # SQLAlchemy models
│   ├── schemas/            # Pydantic schemas
│   └── utils/              # Utility functions
│
├── .env                    # Environment variables (create from .env.example)
├── .env.example            # Example environment variables
├── main.py                 # Application entry point
├── README.md               # This file
└── requirements.txt        # Dependencies
```

## Setup Instructions

### Prerequisites

- Python 3.8+
- Python 3.8+

### Installation

1. **Clone the repository**

2. **Create a virtual environment**
   ```bash
   cd NeetUp/backend
   python -m venv venv
   ```

3. **Activate the virtual environment**
   - On Windows:
     ```bash
     .\venv\Scripts\activate
     ```
   - On Unix or MacOS:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your settings
   # Particularly update the database connection details
   ```

6. **Database Setup**
   - SQLite database will be automatically created when you first run the application
   - Database file location is configured in your .env file

7. **Initialize the database**
   ```bash
   # Run the following Python script to create the tables
   python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
   ```

8. **Run the server**
   ```bash
   # Development server with auto-reload
   uvicorn main:app --reload
   
   # Or use the script in main.py
   python main.py
   ```

## API Documentation

Once the server is running, you can access the automatic interactive API documentation:

- Swagger UI: http://localhost:8080/docs
- ReDoc: http://localhost:8080/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user profile

### Tests
- `GET /api/tests` - List all tests
- `GET /api/tests/{testId}` - Get test details with questions
- `POST /api/tests/{testId}/submit` - Submit test answers
- `GET /api/tests/{testId}/result` - Get test results

### Roadmaps
- `GET /api/roadmaps/personal` - Get personal career roadmap

### Courses
- `GET /api/recommendations/courses` - Get recommended courses
- `GET /api/courses` - List all courses
- `GET /api/courses/{courseId}` - Get course details

### User Progress
- `GET /api/user/progress` - Get user progress summary
- `GET /api/user/stats` - Get user statistics
- `GET /api/user/achievements` - Get user achievements

### Admin Reports
- `GET /api/admin/reports/usage` - Get platform usage statistics
- `GET /api/admin/reports/users` - Get user report
- `GET /api/admin/reports/tests` - Get test statistics

## License

This project is proprietary and confidential.
