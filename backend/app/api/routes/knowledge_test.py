from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime
import json

from app.core.database import get_db
from app.models.test import Test, Question, Answer, UserTestResult, TestType
from app.models.user import User
from app.middleware.auth import get_current_user
from pydantic import BaseModel

router = APIRouter()

# Pydantic models for request/response
class KnowledgeTestResponse(BaseModel):
    id: str
    title: str
    description: str
    duration_minutes: int
    question_count: int

class QuestionResponse(BaseModel):
    id: str
    question_text: str
    order: int
    difficulty: str
    answers: List[Dict[str, Any]]

class TestStartResponse(BaseModel):
    test_id: str
    title: str
    duration_minutes: int
    total_questions: int

class AnswerSubmission(BaseModel):
    question_id: str
    answer_id: str

class TestSubmission(BaseModel):
    test_id: str
    answers: List[AnswerSubmission]

class TestResultResponse(BaseModel):
    test_id: str
    test_title: str
    score: float
    total_questions: int
    correct_answers: int
    skill_level: str
    completion_date: datetime

@router.get("/", response_model=List[KnowledgeTestResponse])
async def get_knowledge_tests(db: Session = Depends(get_db)):
    """Get all available knowledge tests"""
    
    tests = db.query(Test).filter(
        Test.test_type == TestType.SKILL_ASSESSMENT
    ).all()
    
    result = []
    for test in tests:
        question_count = db.query(Question).filter(Question.test_id == test.id).count()
        result.append(KnowledgeTestResponse(
            id=test.id,
            title=test.title,
            description=test.description,
            duration_minutes=test.duration_minutes,
            question_count=question_count
        ))
    
    return result

@router.post("/{test_id}/start", response_model=TestStartResponse)
async def start_knowledge_test(
    test_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Start a knowledge test"""
    
    # Check if test exists
    test = db.query(Test).filter(
        Test.id == test_id,
        Test.test_type == TestType.SKILL_ASSESSMENT
    ).first()
    
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge test not found"
        )
    
    # Get question count
    question_count = db.query(Question).filter(Question.test_id == test_id).count()
    
    return TestStartResponse(
        test_id=test.id,
        title=test.title,
        duration_minutes=test.duration_minutes,
        total_questions=question_count
    )

@router.get("/{test_id}/questions", response_model=List[QuestionResponse])
async def get_test_questions(
    test_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all questions for a knowledge test"""
    
    # Check if test exists
    test = db.query(Test).filter(
        Test.id == test_id,
        Test.test_type == TestType.SKILL_ASSESSMENT
    ).first()
    
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge test not found"
        )
    
    # Get questions with answers
    questions = db.query(Question).filter(
        Question.test_id == test_id
    ).order_by(Question.order).all()
    
    result = []
    for question in questions:
        answers = db.query(Answer).filter(Answer.question_id == question.id).all()
        
        question_data = QuestionResponse(
            id=question.id,
            question_text=question.question_text,
            order=question.order,
            difficulty=question.difficulty or "orta",
            answers=[
                {
                    "id": answer.id,
                    "text": answer.answer_text
                }
                for answer in answers
            ]
        )
        result.append(question_data)
    
    return result

@router.post("/{test_id}/submit", response_model=TestResultResponse)
async def submit_knowledge_test(
    test_id: str,
    submission: TestSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit knowledge test answers and calculate results"""
    
    # Check if test exists
    test = db.query(Test).filter(
        Test.id == test_id,
        Test.test_type == TestType.SKILL_ASSESSMENT
    ).first()
    
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Knowledge test not found"
        )
    
    # Calculate score
    total_questions = len(submission.answers)
    correct_answers = 0
    detailed_results = []
    
    for answer_submission in submission.answers:
        # Get the submitted answer
        answer = db.query(Answer).filter(Answer.id == answer_submission.answer_id).first()
        if answer and answer.is_correct:
            correct_answers += 1
        
        # Store detailed result
        question = db.query(Question).filter(Question.id == answer_submission.question_id).first()
        detailed_results.append({
            "question_id": answer_submission.question_id,
            "question_text": question.question_text if question else "",
            "answer_id": answer_submission.answer_id,
            "answer_text": answer.answer_text if answer else "",
            "is_correct": answer.is_correct if answer else False,
            "difficulty": question.difficulty if question else "orta"
        })
    
    # Calculate final score (0-100)
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
    
    # Determine skill level
    if score >= 71:
        skill_level = "İleri"
    elif score >= 41:
        skill_level = "Orta"
    else:
        skill_level = "Başlangıç"
    
    # Save result to database
    result_data = {
        "score": score,
        "correct_answers": correct_answers,
        "total_questions": total_questions,
        "skill_level": skill_level,
        "detailed_results": detailed_results
    }
    
    user_result = UserTestResult(
        user_id=current_user.id,
        test_id=test_id,
        completion_date=datetime.now(),
        score=score,
        result_data=json.dumps(result_data)
    )
    
    db.add(user_result)
    db.commit()
    
    return TestResultResponse(
        test_id=test_id,
        test_title=test.title,
        score=score,
        total_questions=total_questions,
        correct_answers=correct_answers,
        skill_level=skill_level,
        completion_date=user_result.completion_date
    )

@router.get("/{test_id}/result", response_model=TestResultResponse)
async def get_test_result(
    test_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's latest result for a knowledge test"""
    
    # Get latest result for this user and test
    result = db.query(UserTestResult).filter(
        UserTestResult.user_id == current_user.id,
        UserTestResult.test_id == test_id
    ).order_by(UserTestResult.completion_date.desc()).first()
    
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test result not found"
        )
    
    # Get test info
    test = db.query(Test).filter(Test.id == test_id).first()
    
    # Parse result data
    result_data = json.loads(result.result_data) if result.result_data else {}
    
    return TestResultResponse(
        test_id=test_id,
        test_title=test.title if test else "Unknown Test",
        score=result.score or 0,
        total_questions=result_data.get("total_questions", 0),
        correct_answers=result_data.get("correct_answers", 0),
        skill_level=result_data.get("skill_level", "Başlangıç"),
        completion_date=result.completion_date
    )
