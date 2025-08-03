#!/usr/bin/env python3

from app.core.database import engine, SessionLocal
from app.models.test import Test, Question, Answer, TestType, QuestionType, DifficultyLevel
# Import all models to ensure SQLAlchemy relationships are properly initialized
from app.models.user import User
from app.models.study_plan import UserTask
from app.models.chat import ChatSession, ChatMessage
import uuid

def seed_knowledge_tests():
    """Seed knowledge tests for 4 career areas"""
    
    db = SessionLocal()
    
    try:
        # 1. UI/UX Designer Test
        uiux_test = Test(
            id=str(uuid.uuid4()),
            title="UI/UX Designer Bilgi Testi",
            description="Kullanıcı arayüzü ve deneyim tasarımı konularında bilgi seviyenizi ölçen test",
            test_type=TestType.SKILL_ASSESSMENT,
            duration_minutes=15
        )
        db.add(uiux_test)
        
        # UI/UX Questions (4 kolay, 4 orta, 2 zor)
        uiux_questions = [
            # KOLAY SORULAR
            {
                "text": "Kullanıcı arayüzü tasarımında 'affordance' ne anlama gelir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Renk uyumu", "correct": False},
                    {"text": "Bir nesnenin nasıl kullanılacağını gösteren ipuçları", "correct": True},
                    {"text": "Yazı tipi seçimi", "correct": False},
                    {"text": "Sayfa düzeni", "correct": False}
                ]
            },
            {
                "text": "Responsive tasarımda 'mobile-first' yaklaşımı ne demektir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Önce mobil cihazlar için tasarım yapıp sonra büyük ekranlara uyarlama", "correct": True},
                    {"text": "Sadece mobil cihazlar için tasarım yapma", "correct": False},
                    {"text": "Mobil uygulamaları öncelikli tutma", "correct": False},
                    {"text": "Mobil cihazları görmezden gelme", "correct": False}
                ]
            },
            {
                "text": "UX tasarımında 'wireframe' nedir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Renk paleti", "correct": False},
                    {"text": "Sayfanın iskelet yapısını gösteren basit çizim", "correct": True},
                    {"text": "Yazı tipi listesi", "correct": False},
                    {"text": "Fotoğraf koleksiyonu", "correct": False}
                ]
            },
            {
                "text": "Hangi renk kombinasyonu en iyi kontrast sağlar?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Siyah ve beyaz", "correct": True},
                    {"text": "Kırmızı ve pembe", "correct": False},
                    {"text": "Mavi ve yeşil", "correct": False},
                    {"text": "Sarı ve turuncu", "correct": False}
                ]
            },
            # ORTA SORULAR
            {
                "text": "Fitt's Law'a göre, bir butonun tıklanabilirliği neye bağlıdır?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Sadece rengine", "correct": False},
                    {"text": "Boyutu ve hedefe olan mesafesi", "correct": True},
                    {"text": "Sadece yazı tipine", "correct": False},
                    {"text": "Sadece konumuna", "correct": False}
                ]
            },
            {
                "text": "A/B testing'in amacı nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "İki farklı tasarım versiyonunu karşılaştırarak hangisinin daha etkili olduğunu bulmak", "correct": True},
                    {"text": "Sadece renk seçimi yapmak", "correct": False},
                    {"text": "Yazı tipi test etmek", "correct": False},
                    {"text": "Sadece hız testi yapmak", "correct": False}
                ]
            },
            {
                "text": "Information Architecture (Bilgi Mimarisi) nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Sadece görsel tasarım", "correct": False},
                    {"text": "İçeriğin organize edilmesi ve yapılandırılması", "correct": True},
                    {"text": "Sadece kodlama", "correct": False},
                    {"text": "Sadece renk seçimi", "correct": False}
                ]
            },
            {
                "text": "Hangi UX araştırm yöntemi kullanıcı davranışlarını gözlemlemek için kullanılır?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Sadece anket", "correct": False},
                    {"text": "Usability testing", "correct": True},
                    {"text": "Sadece görüşme", "correct": False},
                    {"text": "Sadece analitik", "correct": False}
                ]
            },
            # ZOR SORULAR
            {
                "text": "Gestalt prensiplerinden 'Law of Proximity' neyi ifade eder?",
                "difficulty": DifficultyLevel.ZOR,
                "answers": [
                    {"text": "Birbirine yakın öğelerin grup olarak algılanması", "correct": True},
                    {"text": "Sadece renk benzerliği", "correct": False},
                    {"text": "Sadece boyut benzerliği", "correct": False},
                    {"text": "Sadece şekil benzerliği", "correct": False}
                ]
            },
            {
                "text": "Design System'de 'Atomic Design' metodolojisinin temel bileşenleri nelerdir?",
                "difficulty": DifficultyLevel.ZOR,
                "answers": [
                    {"text": "Atoms, Molecules, Organisms, Templates, Pages", "correct": True},
                    {"text": "Sadece renkler ve yazı tipleri", "correct": False},
                    {"text": "Sadece butonlar ve formlar", "correct": False},
                    {"text": "Sadece grid sistemleri", "correct": False}
                ]
            }
        ]
        
        for i, q_data in enumerate(uiux_questions):
            question = Question(
                id=str(uuid.uuid4()),
                test_id=uiux_test.id,
                question_text=q_data["text"],
                question_type=QuestionType.MULTIPLE_CHOICE,
                order=i + 1,
                difficulty=q_data["difficulty"]
            )
            db.add(question)
            
            for answer_data in q_data["answers"]:
                answer = Answer(
                    id=str(uuid.uuid4()),
                    question_id=question.id,
                    answer_text=answer_data["text"],
                    score_value=10.0 if answer_data["correct"] else 0.0,
                    is_correct=answer_data["correct"]
                )
                db.add(answer)
        
        # 2. Backend Developer Test
        backend_test = Test(
            id=str(uuid.uuid4()),
            title="Backend Developer Bilgi Testi",
            description="Sunucu tarafı geliştirme konularında bilgi seviyenizi ölçen test",
            test_type=TestType.SKILL_ASSESSMENT,
            duration_minutes=15
        )
        db.add(backend_test)
        
        # Backend Questions (4 kolay, 4 orta, 2 zor)
        backend_questions = [
            # KOLAY SORULAR
            {
                "text": "HTTP status code 200 ne anlama gelir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Başarılı istek", "correct": True},
                    {"text": "Hata", "correct": False},
                    {"text": "Yönlendirme", "correct": False},
                    {"text": "Yetkisiz erişim", "correct": False}
                ]
            },
            {
                "text": "REST API'de GET metodu ne için kullanılır?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Veri silmek için", "correct": False},
                    {"text": "Veri okumak için", "correct": True},
                    {"text": "Veri güncellemek için", "correct": False},
                    {"text": "Veri oluşturmak için", "correct": False}
                ]
            },
            {
                "text": "SQL'de hangi komut veri seçmek için kullanılır?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "INSERT", "correct": False},
                    {"text": "SELECT", "correct": True},
                    {"text": "UPDATE", "correct": False},
                    {"text": "DELETE", "correct": False}
                ]
            },
            {
                "text": "JSON formatı ne anlama gelir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "JavaScript Object Notation", "correct": True},
                    {"text": "Java Standard Object Network", "correct": False},
                    {"text": "Just Simple Object Name", "correct": False},
                    {"text": "Joint System Object Node", "correct": False}
                ]
            },
            # ORTA SORULAR
            {
                "text": "RESTful API'lerde PUT ve PATCH metodları arasındaki fark nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "PUT tam güncelleme, PATCH kısmi güncelleme", "correct": True},
                    {"text": "Aynı işlevi görürler", "correct": False},
                    {"text": "PUT sadece oluşturma için kullanılır", "correct": False},
                    {"text": "PATCH daha hızlıdır", "correct": False}
                ]
            },
            {
                "text": "Database indexing'in amacı nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Veri güvenliğini artırmak", "correct": False},
                    {"text": "Sorgu performansını artırmak", "correct": True},
                    {"text": "Veri boyutunu küçültmek", "correct": False},
                    {"text": "Sadece görsel düzenleme", "correct": False}
                ]
            },
            {
                "text": "Microservices mimarisinin avantajı nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Sadece hız artışı", "correct": False},
                    {"text": "Bağımsız geliştirme ve deploy edilebilirlik", "correct": True},
                    {"text": "Sadece maliyet azalması", "correct": False},
                    {"text": "Sadece güvenlik artışı", "correct": False}
                ]
            },
            {
                "text": "JWT (JSON Web Token) ne için kullanılır?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Sadece veri depolama", "correct": False},
                    {"text": "Kimlik doğrulama ve yetkilendirme", "correct": True},
                    {"text": "Sadece şifreleme", "correct": False},
                    {"text": "Sadece veri sıkıştırma", "correct": False}
                ]
            },
            # ZOR SORULAR
            {
                "text": "CAP teoreminde hangi üç özellik yer alır?",
                "difficulty": DifficultyLevel.ZOR,
                "answers": [
                    {"text": "Consistency, Availability, Partition tolerance", "correct": True},
                    {"text": "Create, Access, Process", "correct": False},
                    {"text": "Cache, API, Performance", "correct": False},
                    {"text": "Code, Architecture, Pattern", "correct": False}
                ]
            },
            {
                "text": "Database sharding nedir?",
                "difficulty": DifficultyLevel.ZOR,
                "answers": [
                    {"text": "Veritabanını yatay olarak bölme", "correct": True},
                    {"text": "Sadece yedekleme", "correct": False},
                    {"text": "Sadece şifreleme", "correct": False},
                    {"text": "Sadece sıkıştırma", "correct": False}
                ]
            }
        ]
        
        # Backend sorularını ekle
        for i, q_data in enumerate(backend_questions):
            question = Question(
                id=str(uuid.uuid4()),
                test_id=backend_test.id,
                question_text=q_data["text"],
                question_type=QuestionType.MULTIPLE_CHOICE,
                order=i + 1,
                difficulty=q_data["difficulty"]
            )
            db.add(question)
            
            for answer_data in q_data["answers"]:
                answer = Answer(
                    id=str(uuid.uuid4()),
                    question_id=question.id,
                    answer_text=answer_data["text"],
                    score_value=10.0 if answer_data["correct"] else 0.0,
                    is_correct=answer_data["correct"]
                )
                db.add(answer)
        
        # 3. Data Science Test
        ds_test = Test(
            id=str(uuid.uuid4()),
            title="Data Science Bilgi Testi",
            description="Veri bilimi ve analizi konularında bilgi seviyenizi ölçen test",
            test_type=TestType.SKILL_ASSESSMENT,
            duration_minutes=15
        )
        db.add(ds_test)
        
        # Data Science Questions (4 kolay, 4 orta, 2 zor)
        ds_questions = [
            # KOLAY SORULAR
            {
                "text": "Python'da pandas kütüphanesi ne için kullanılır?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Veri manipülasyonu ve analizi", "correct": True},
                    {"text": "Sadece görselleştirme", "correct": False},
                    {"text": "Sadece web geliştirme", "correct": False},
                    {"text": "Sadece oyun geliştirme", "correct": False}
                ]
            },
            {
                "text": "CSV dosyası ne anlama gelir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Computer System Values", "correct": False},
                    {"text": "Comma Separated Values", "correct": True},
                    {"text": "Central Storage Variables", "correct": False},
                    {"text": "Code Structure Validation", "correct": False}
                ]
            },
            {
                "text": "Veri görselleştirmede hangi grafik türü kategorik verileri göstermek için uygundur?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Çizgi grafik", "correct": False},
                    {"text": "Bar grafik", "correct": True},
                    {"text": "Scatter plot", "correct": False},
                    {"text": "Histogram", "correct": False}
                ]
            },
            {
                "text": "Machine Learning'de 'supervised learning' nedir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Etiketli verilerle öğrenme", "correct": True},
                    {"text": "Etiketsiz verilerle öğrenme", "correct": False},
                    {"text": "Sadece görüntü işleme", "correct": False},
                    {"text": "Sadece metin işleme", "correct": False}
                ]
            },
            # ORTA SORULAR
            {
                "text": "Cross-validation'ın amacı nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Sadece veri temizleme", "correct": False},
                    {"text": "Model performansını güvenilir şekilde değerlendirme", "correct": True},
                    {"text": "Sadece veri görselleştirme", "correct": False},
                    {"text": "Sadece veri toplama", "correct": False}
                ]
            },
            {
                "text": "Feature engineering nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Yeni özellikler oluşturma ve mevcut özellikleri iyileştirme", "correct": True},
                    {"text": "Sadece veri silme", "correct": False},
                    {"text": "Sadece grafik çizme", "correct": False},
                    {"text": "Sadece rapor yazma", "correct": False}
                ]
            },
            {
                "text": "Overfitting problemi nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Modelin eğitim verisini ezberlemesi, yeni verilerde kötü performans göstermesi", "correct": True},
                    {"text": "Modelin çok hızlı çalışması", "correct": False},
                    {"text": "Veri boyutunun çok büyük olması", "correct": False},
                    {"text": "Sadece görselleştirme hatası", "correct": False}
                ]
            },
            {
                "text": "A/B testing'de p-value ne anlama gelir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Sadece veri boyutu", "correct": False},
                    {"text": "İstatistiksel anlamlılık olasılığı", "correct": True},
                    {"text": "Sadece hız ölçümü", "correct": False},
                    {"text": "Sadece maliyet hesabı", "correct": False}
                ]
            },
            # ZOR SORULAR
            {
                "text": "Gradient Descent algoritmasının amacı nedir?",
                "difficulty": DifficultyLevel.ZOR,
                "answers": [
                    {"text": "Cost function'ı minimize etmek", "correct": True},
                    {"text": "Sadece veri sıralama", "correct": False},
                    {"text": "Sadece veri filtreleme", "correct": False},
                    {"text": "Sadece grafik çizme", "correct": False}
                ]
            },
            {
                "text": "Ensemble learning'de bagging ve boosting arasındaki temel fark nedir?",
                "difficulty": DifficultyLevel.ZOR,
                "answers": [
                    {"text": "Bagging paralel, boosting sıralı öğrenme", "correct": True},
                    {"text": "Aynı yöntemlerdir", "correct": False},
                    {"text": "Sadece hız farkı vardır", "correct": False},
                    {"text": "Sadece veri türü farkı vardır", "correct": False}
                ]
            }
        ]
        
        # Data Science sorularını ekle
        for i, q_data in enumerate(ds_questions):
            question = Question(
                id=str(uuid.uuid4()),
                test_id=ds_test.id,
                question_text=q_data["text"],
                question_type=QuestionType.MULTIPLE_CHOICE,
                order=i + 1,
                difficulty=q_data["difficulty"]
            )
            db.add(question)
            
            for answer_data in q_data["answers"]:
                answer = Answer(
                    id=str(uuid.uuid4()),
                    question_id=question.id,
                    answer_text=answer_data["text"],
                    score_value=10.0 if answer_data["correct"] else 0.0,
                    is_correct=answer_data["correct"]
                )
                db.add(answer)
        
        # 4. Project Management Test
        pm_test = Test(
            id=str(uuid.uuid4()),
            title="Project Management Bilgi Testi",
            description="Proje yönetimi konularında bilgi seviyenizi ölçen test",
            test_type=TestType.SKILL_ASSESSMENT,
            duration_minutes=15
        )
        db.add(pm_test)
        
        # Project Management Questions (4 kolay, 4 orta, 2 zor)
        pm_questions = [
            # KOLAY SORULAR
            {
                "text": "Proje yönetiminde 'scope' ne anlama gelir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Sadece bütçe", "correct": False},
                    {"text": "Projenin kapsamı ve sınırları", "correct": True},
                    {"text": "Sadece zaman", "correct": False},
                    {"text": "Sadece takım üyeleri", "correct": False}
                ]
            },
            {
                "text": "Agile metodolojisinde 'sprint' nedir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Kısa süreli çalışma döngüsü", "correct": True},
                    {"text": "Sadece toplantı", "correct": False},
                    {"text": "Sadece rapor", "correct": False},
                    {"text": "Sadece test", "correct": False}
                ]
            },
            {
                "text": "Proje üçgeni (Project Triangle) hangi üç faktörü içerir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Zaman, Maliyet, Kalite", "correct": True},
                    {"text": "Sadece zaman ve para", "correct": False},
                    {"text": "Sadece takım ve araçlar", "correct": False},
                    {"text": "Sadece planlama", "correct": False}
                ]
            },
            {
                "text": "Scrum'da Product Owner'ın ana sorumluluğu nedir?",
                "difficulty": DifficultyLevel.KOLAY,
                "answers": [
                    {"text": "Sadece kodlama", "correct": False},
                    {"text": "Product backlog yönetimi ve önceliklendirme", "correct": True},
                    {"text": "Sadece test etme", "correct": False},
                    {"text": "Sadece dokümantasyon", "correct": False}
                ]
            },
            # ORTA SORULAR
            {
                "text": "Critical Path Method (CPM) ne için kullanılır?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Sadece maliyet hesaplama", "correct": False},
                    {"text": "En uzun süren görev zincirini belirleme", "correct": True},
                    {"text": "Sadece takım yönetimi", "correct": False},
                    {"text": "Sadece risk analizi", "correct": False}
                ]
            },
            {
                "text": "Kanban metodolojisinin temel prensibi nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "İş akışını görselleştirme ve WIP limitlerini belirleme", "correct": True},
                    {"text": "Sadece hızlı çalışma", "correct": False},
                    {"text": "Sadece toplantı yapma", "correct": False},
                    {"text": "Sadece rapor yazma", "correct": False}
                ]
            },
            {
                "text": "Risk yönetiminde 'risk mitigation' nedir?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Riskleri azaltma veya etkilerini minimize etme", "correct": True},
                    {"text": "Sadece riskleri görmezden gelme", "correct": False},
                    {"text": "Sadece riskleri listeleme", "correct": False},
                    {"text": "Sadece rapor yazma", "correct": False}
                ]
            },
            {
                "text": "Earned Value Management (EVM) ne ölçer?",
                "difficulty": DifficultyLevel.ORTA,
                "answers": [
                    {"text": "Sadece harcanan para", "correct": False},
                    {"text": "Proje performansını maliyet ve zaman açısından", "correct": True},
                    {"text": "Sadece takım memnuniyeti", "correct": False},
                    {"text": "Sadece müşteri memnuniyeti", "correct": False}
                ]
            },
            # ZOR SORULAR
            {
                "text": "PMBOK'ta yer alan 10 bilgi alanından 3 tanesini sayınız",
                "difficulty": DifficultyLevel.ZOR,
                "answers": [
                    {"text": "Integration, Scope, Schedule Management", "correct": True},
                    {"text": "Sadece planlama alanları", "correct": False},
                    {"text": "Sadece teknik alanlar", "correct": False},
                    {"text": "Sadece finansal alanlar", "correct": False}
                ]
            },
            {
                "text": "Monte Carlo simülasyonu proje yönetiminde ne için kullanılır?",
                "difficulty": DifficultyLevel.ZOR,
                "answers": [
                    {"text": "Risk analizi ve proje süresi tahmini", "correct": True},
                    {"text": "Sadece maliyet hesaplama", "correct": False},
                    {"text": "Sadece takım performansı", "correct": False},
                    {"text": "Sadece müşteri analizi", "correct": False}
                ]
            }
        ]
        
        # Project Management sorularını ekle
        for i, q_data in enumerate(pm_questions):
            question = Question(
                id=str(uuid.uuid4()),
                test_id=pm_test.id,
                question_text=q_data["text"],
                question_type=QuestionType.MULTIPLE_CHOICE,
                order=i + 1,
                difficulty=q_data["difficulty"]
            )
            db.add(question)
            
            for answer_data in q_data["answers"]:
                answer = Answer(
                    id=str(uuid.uuid4()),
                    question_id=question.id,
                    answer_text=answer_data["text"],
                    score_value=10.0 if answer_data["correct"] else 0.0,
                    is_correct=answer_data["correct"]
                )
                db.add(answer)
        
        db.commit()
        print("[SUCCESS] Knowledge tests seeded successfully!")
        print(f"   - UI/UX Designer Test: {len(uiux_questions)} questions")
        print(f"   - Backend Developer Test: {len(backend_questions)} questions")
        print(f"   - Data Science Test: {len(ds_questions)} questions")
        print(f"   - Project Management Test: {len(pm_questions)} questions")
        
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error seeding tests: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_knowledge_tests()
