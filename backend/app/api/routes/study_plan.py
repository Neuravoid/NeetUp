import json
import importlib.util
import sys
from typing import List, Any

# Check if google-generativeai is installed
genai_installed = importlib.util.find_spec("google.generativeai") is not None
if genai_installed:
    import google.generativeai as genai
else:
    print("WARNING: google.generativeai package is not installed. AI features will use fallback data.")
    genai = None

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.orm.attributes import flag_modified

from app.core.database import get_db
from app.middleware.auth import get_current_active_user
from app.core.config import settings
from app.models.user import User
from app.models.study_plan import UserTask
from app.schemas.study_plan import UserTaskCreate, UserTaskResponse, UserTaskUpdate, SubTask
from app.data.study_data import study_data


def generate_fallback_data(track_name, stage_name, user_input=""):
    """
    Generates relevant fallback tasks based on track name, stage name, and user input.
    """
    fallback_summaries = {
        "Yazılım Geliştirme": {
            "Temel Programlama": "Temel programlama becerilerini geliştirmek için kişiselleştirilmiş çalışma planı",
            "Web Geliştirme": "Web geliştirme yeteneklerini ilerletmek için adım adım öğrenme planı",
            "Mobil Uygulama": "Mobil uygulama geliştirme konusunda uzmanlaşma yol haritası"
        },
        "Veri Bilimi": {
            "Temel İstatistik": "İstatistik temelleri konusunda kapsamlı çalışma programı",
            "Makine Öğrenmesi": "Makine öğrenmesi alanında ustalık kazanmak için çalışma planı",
            "Veri Görselleştirme": "Etkili veri görselleştirme teknikleri geliştirme planı"
        }
    }
    
    fallback_tasks = {
        "Yazılım Geliştirme": {
            "Temel Programlama": [
                "Algoritma mantığı üzerine online kurs tamamla",
                "Temel veri yapılarını uygulayarak öğren",
                "3 farklı programlama sorusu çöz",
                "GitHub hesabı oluştur ve kod örneklerini paylaş",
                "Bir mini proje geliştir"
            ],
            "Web Geliştirme": [
                "HTML/CSS temelleri için interaktif eğitim tamamla",
                "Frontend framework'ü öğrenmeye başla",
                "Basit bir landing page tasarla ve kodla",
                "API entegrasyonu içeren bir web sayfası oluştur",
                "Responsive tasarım prensiplerini uygula"
            ],
            "Mobil Uygulama": [
                "Mobil geliştirme ortamını kur",
                "Basit bir mobil uygulama arayüzü tasarla",
                "Temel navigasyon yapısını oluştur",
                "API'lerle veri alışverişi yap",
                "Uygulama mağazası için hazırlıkları tamamla"
            ]
        },
        "Veri Bilimi": {
            "Temel İstatistik": [
                "İstatistiksel dağılımları öğren",
                "Hipotez testlerini uygula",
                "Veri görselleştirme tekniklerini öğren",
                "İstatistiksel analiz araçlarını kullan",
                "Gerçek veri seti üzerinde analiz yap"
            ],
            "Makine Öğrenmesi": [
                "Veri ön işleme tekniklerini öğren", 
                "Supervised learning algoritmaları ile modeller oluştur", 
                "Unsupervised learning tekniklerini uygula", 
                "Model değerlendirme metriklerini analiz et", 
                "Hiperparametre optimizasyonu yap"
            ],
            "default": [
                "Alan için temel kavramları öğren",
                "Teorik bilgileri pratik uygulamalarla pekiştir",
                "Örnek projeler üzerinde çalış",
                "Kaynakları ve dokümantasyonu incele",
                "Edindiğin bilgileri uygulayarak bir proje geliştir"
            ]
        },
        "default": {
            "default": [
                "Alan için temel kavramları öğren",
                "Teorik bilgileri pratik uygulamalarla pekiştir",
                "Örnek projeler üzerinde çalış",
                "Kaynakları ve dokümantasyonu incele",
                "Edindiğin bilgileri uygulayarak bir proje geliştir"
            ]
        }
    }
    
    # Get track specific tasks or default
    track_tasks = fallback_tasks.get(track_name, fallback_tasks["default"])
    
    # Get stage specific tasks or default for that track
    stage_tasks = track_tasks.get(stage_name, track_tasks.get("default", fallback_tasks["default"]["default"]))
    
    # Format answer focus if provided
    answer_focus = "" if not user_input else f"({user_input} odaklı)"
    
    return {
        "summary": f"{stage_name} alanında ustalık kazanmak için çalışma planı {answer_focus}",
        "sub_tasks": stage_tasks  # Always returns exactly 5 tasks
    }


router = APIRouter()


@router.get("/tracks")
def get_tracks():
    """
    Returns the static list of study tracks and their stages.
    """
    return study_data


@router.get("/tasks", response_model=List[UserTaskResponse])
def get_user_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Retrieves all tasks for the currently authenticated user.
    Only returns tasks that are not 100% complete.
    """
    # Query tasks that belong to the current user and are not 100% complete
    tasks = db.query(UserTask).filter(
        UserTask.user_id == current_user.id,
        UserTask.progress < 100  # Filter out completed (100%) tasks
    ).all()
    
    # Convert old sub_tasks format ('task' key) to new format ('text' key)
    for task in tasks:
        if task.sub_tasks:
            for sub_task in task.sub_tasks:
                if 'task' in sub_task and 'text' not in sub_task:
                    sub_task['text'] = sub_task.pop('task')
    
    return tasks


@router.post("/tasks", response_model=UserTaskResponse)
def create_task(
    task_data: UserTaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Creates a new work plan by calling the Gemini API and storing the result.
    """
    print(f"Starting task creation for user_id: {current_user.id}")
    print(f"Task data: {task_data.dict()}")
    
    # Check if Gemini API is available
    if not genai_installed:
        print("google.generativeai package is not installed")
        print("Using fallback data for task creation")
        fallback_data = generate_fallback_data(
            task_data.track_name, 
            task_data.stage_name, 
            task_data.answers[0] if task_data.answers and len(task_data.answers) > 0 else ""
        )
        ai_response = fallback_data
        print(f"Using fallback data due to missing package: {json.dumps(ai_response)}")
        
    # Continue with Gemini API if available
    else:
        # Check for API key
        if not settings.GEMINI_API_KEY:
            print("GEMINI_API_KEY not found in environment")
            fallback_data = generate_fallback_data(
                task_data.track_name, 
                task_data.stage_name, 
                task_data.answers[0] if task_data.answers and len(task_data.answers) > 0 else ""
            )
            ai_response = fallback_data
            print(f"Using fallback data due to missing API key: {json.dumps(ai_response)}")
        
        else:
            # Initialize Gemini API
            try:
                print(f"Configuring Gemini API with key: {settings.GEMINI_API_KEY[:5]}...{settings.GEMINI_API_KEY[-5:]}")
                genai.configure(api_key=settings.GEMINI_API_KEY)
                
                # Try using standard Gemini models with fallbacks
                try:
                    # First try with gemini-1.5-pro
                    model = genai.GenerativeModel('gemini-1.5-pro')
                    print("Using gemini-1.5-pro model")
                except Exception as e:
                    print(f"Could not use gemini-1.5-pro: {str(e)}")
                    # Fallback to gemini-1.5-flash (smaller model with lower quota usage)
                    try:
                        model = genai.GenerativeModel('gemini-1.5-flash')
                        print("Using gemini-1.5-flash model")
                    except Exception as e:
                        print(f"Could not use gemini-1.5-flash: {str(e)}")
                        # Fallback to gemini-pro
                        try:
                            model = genai.GenerativeModel('gemini-pro')
                            print("Using gemini-pro model")
                        except Exception as e:
                            print(f"Could not use gemini-pro: {str(e)}")
                            # Final fallback to legacy model
                            try:
                                model = genai.GenerativeModel('gemini-1.0-pro')
                                print("Using gemini-1.0-pro model")
                            except Exception as e:
                                print(f"Could not use any Gemini model: {str(e)}")
                                # If all model attempts fail, use fallback data
                                raise Exception(f"Failed to initialize any Gemini AI model: {str(e)}")
                
                print("Gemini API configured successfully with model")
                
                # Create prompt for AI
                prompt = f"""'{task_data.stage_name}' alanında '{task_data.track_name}' dalında öğrenim gören bir öğrenci için detaylı bir yapılacaklar listesi oluştur. Öğrenci hedefleri ve tercihleri hakkında şu bilgileri verdi: {task_data.answers[0] if task_data.answers and len(task_data.answers) > 0 else ''} . Bu bilgiler doğrultusunda, kısa bir genel özet ve TAM OLARAK 5 tane (ne daha az, ne daha fazla) özel, uygulanabilir alt görev oluştur. Tüm içerik TAMAMEN TÜRKÇE olmalıdır. Çıktı, iki anahtara sahip geçerli bir JSON nesnesi olmalıdır: 'summary' (bir dize) ve 'sub_tasks' (TAM OLARAK 5 dizelik bir dizi)."""
                print(f"Generated prompt: {prompt}")
                
                # Call Gemini API with prompt
                print("Calling Gemini API...")
                # Set proper parameters for better results
                response = model.generate_content(
                    prompt,
                    generation_config={
                        "temperature": 0.7,
                        "top_p": 0.95,
                        "top_k": 40,
                        "max_output_tokens": 800,
                    },
                    safety_settings=[
                        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
                    ]
                )
                
                # Process the AI response
                if response.text:
                    result = response.text
                    print(f"AI Response received, length: {len(result)}")
                    
                    try:
                        # Clean the response - sometimes there might be markdown formatting
                        if '```json' in result:
                            result = result.split('```json', 1)[1]
                        elif '```' in result:
                            result = result.split('```', 1)[1]
                            
                        if '```' in result:
                            result = result.rsplit('```', 1)[0]
                            
                        # Remove any non-JSON content that might appear after the JSON
                        if '}' in result:
                            result = result.split('}', 1)[0] + '}'
                            
                        result = result.strip()
                        ai_response = json.loads(result)
                        print("Successfully parsed AI response to JSON")
                        
                        # Validate and ensure exactly 5 sub-tasks
                        if 'sub_tasks' in ai_response:
                            if len(ai_response['sub_tasks']) > 5:
                                ai_response['sub_tasks'] = ai_response['sub_tasks'][:5]  # Truncate to 5
                                print("Truncated tasks to exactly 5")
                            elif len(ai_response['sub_tasks']) < 5:
                                # If we have fewer than 5 tasks, add generic ones to reach exactly 5
                                additional_needed = 5 - len(ai_response['sub_tasks'])
                                for i in range(additional_needed):
                                    ai_response['sub_tasks'].append(f"{task_data.stage_name} için ek görev {i+1}")
                                print(f"Added {additional_needed} generic tasks to reach exactly 5")
                    except Exception as parsing_error:
                        print(f"JSON parsing error: {str(parsing_error)}")
                        raise Exception(f"Failed to parse AI response: {str(parsing_error)}")
                else:
                    raise Exception("Empty response from AI")
                    
            except Exception as e:
                print(f"Error in Gemini API processing: {str(e)}")
                # Generate better fallback data based on track and stage
                fallback_data = generate_fallback_data(
                    task_data.track_name, 
                    task_data.stage_name, 
                    task_data.answers[0] if task_data.answers and len(task_data.answers) > 0 else ""
                )
                ai_response = fallback_data
                print(f"Using fallback data due to API error: {json.dumps(ai_response)}")
            

    # No code needed here - AI response handling is now moved to the sections above

    # Create sub-tasks with status
    sub_tasks_with_status = [{'text': task, 'completed': False} for task in ai_response.get('sub_tasks', [])]
    print(f"Created sub_tasks_with_status: {json.dumps(sub_tasks_with_status)[:100]}...")

    # Create database entry
    try:
        print("Creating database entry...")
        db_task = UserTask(
            user_id=current_user.id,
            track_name=task_data.track_name,
            stage_name=task_data.stage_name,
            ai_summary=ai_response.get('summary', 'No summary provided.'),
            sub_tasks=sub_tasks_with_status,
            progress=0
        )
        print("Adding to database...")
        db.add(db_task)
        print("Committing to database...")
        db.commit()
        print("Refreshing database object...")
        db.refresh(db_task)
        print(f"Task created successfully with id: {db_task.id}")
    except Exception as e:
        db.rollback()
        print(f"Database error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    return db_task


@router.patch("/tasks/{task_id}", response_model=UserTaskResponse)
def update_task_progress(
    task_id: int,
    update_data: UserTaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user),
):
    """
    Updates the completion status of a sub-task and recalculates the overall progress.
    """
    db_task = db.query(UserTask).filter(UserTask.id == task_id, UserTask.user_id == current_user.id).first()

    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    sub_tasks = db_task.sub_tasks
    if not (0 <= update_data.sub_task_index < len(sub_tasks)):
        raise HTTPException(status_code=400, detail="Invalid sub-task index")

    sub_tasks[update_data.sub_task_index]['completed'] = update_data.completed

    completed_count = sum(1 for task in sub_tasks if task['completed'])
    total_count = len(sub_tasks)
    new_progress = (completed_count / total_count) * 100 if total_count > 0 else 0
    db_task.progress = new_progress

    # This is necessary to inform SQLAlchemy of the change in the JSON field
    flag_modified(db_task, "sub_tasks")
    
    # If task is 100% complete, delete it from the database
    if new_progress >= 100:
        task_copy = UserTaskResponse.from_orm(db_task)
        db.delete(db_task)
        db.commit()
        return task_copy
    
    db.commit()
    db.refresh(db_task)

    return db_task
