from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import json

from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.models.user import User
from app.models.test import Test, Question, Answer, UserTestResult
from app.schemas.test import (
    TestResponse, 
    TestDetailResponse, 
    TestSubmission, 
    TestResultResponse
)

router = APIRouter(tags=["tests"])

@router.get("", response_model=List[TestResponse])
def get_tests(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
) -> Any:
    """
    Retrieve all available tests
    """
    tests = db.query(Test).offset(skip).limit(limit).all()
    return tests

@router.get("/{test_id}", response_model=TestDetailResponse)
def get_test_details(
    test_id: str, 
    db: Session = Depends(get_db)
) -> Any:
    """
    Get detailed information about a specific test
    """
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test not found"
        )
    
    return test

@router.post("/{test_id}/submit", response_model=TestResultResponse)
def submit_test_answers(
    test_id: str,
    submission: TestSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Submit test answers and calculate the score
    """
    # Verify that test exists
    test = db.query(Test).filter(Test.id == test_id).first()
    if not test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test not found"
        )
    
    # Calculate test results
    total_score = 0
    result_data = []
    
    for answer in submission.user_answers:
        question = db.query(Question).filter(Question.id == answer.question_id).first()
        if not question:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Question {answer.question_id} not found"
            )
            
        if question.question_type == "multiple_choice":
            selected_answer = db.query(Answer).filter(Answer.id == answer.selected_answer_id).first()
            if not selected_answer:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Answer {answer.selected_answer_id} not found"
                )
                
            total_score += selected_answer.score_value
            result_data.append({
                "question_id": str(question.id),
                "selected_answer_id": str(selected_answer.id),
                "score": selected_answer.score_value
            })
        elif question.question_type == "free_text":
            # For free-text questions, you might implement a simple scoring mechanism
            # or mark for manual review. Here, we'll just store the answer.
            result_data.append({
                "question_id": str(question.id),
                "text_answer": answer.text_answer,
                "score": 0  # No automatic scoring for text answers
            })
    
    # Normalize score if needed (e.g., convert to percentage)
    # This depends on how you want to score tests
    max_possible_score = db.query(Answer).filter(
        Answer.question_id.in_([q.id for q in test.questions])
    ).count()
    
    if max_possible_score > 0:
        normalized_score = (total_score / max_possible_score) * 100
    else:
        normalized_score = 0
    
    # Save test result
    test_result = UserTestResult(
        user_id=current_user.id,
        test_id=test_id,
        completion_date=datetime.utcnow(),
        score=normalized_score,
        result_data=result_data
    )
    
    db.add(test_result)
    db.commit()
    db.refresh(test_result)
    
    return test_result

@router.get("/{test_id}/result", response_model=TestResultResponse)
def get_test_result(
    test_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve a user's specific test result
    """
    test_result = db.query(UserTestResult).filter(
        UserTestResult.test_id == test_id,
        UserTestResult.user_id == current_user.id
    ).first()
    
    if not test_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Test result not found"
        )
        
    return test_result
