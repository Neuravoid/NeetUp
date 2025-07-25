#!/usr/bin/env python3
"""
Comprehensive Skill Assessment Tests for All Major Tech Fields
"""
from app.core.database import SessionLocal
from app.models.test import Test, Question, Answer, TestType, QuestionType
from app.models.course import Course
from app.models.roadmap import CareerPath
import uuid

def create_comprehensive_tests():
    db = SessionLocal()
    
    try:
        existing_tests = db.query(Test).count()
        if existing_tests > 0:
            print(f"Database already has {existing_tests} tests. Clearing and recreating...")
            # Clear existing tests
            db.query(Answer).delete()
            db.query(Question).delete()
            db.query(Test).delete()
            db.commit()
        
        # Test definitions with questions
        tests_data = [
            {
                "title": "Yapay Zeka ve Machine Learning",
                "description": "AI, ML algoritmaları ve deep learning temel kavramları",
                "duration": 35,
                "questions": [
                    {"text": "Machine Learning'de 'supervised learning' nedir?", "answers": [
                        {"text": "Etiketli verilerle öğrenme", "is_correct": True},
                        {"text": "Etiketsiz verilerle öğrenme", "is_correct": False},
                        {"text": "Ödül-ceza sistemli öğrenme", "is_correct": False},
                        {"text": "İnsan denetimi altında öğrenme", "is_correct": False}
                    ]},
                    {"text": "Neural Network'te 'backpropagation' ne işe yarar?", "answers": [
                        {"text": "Veri ön işleme", "is_correct": False},
                        {"text": "Ağırlıkları güncelleme", "is_correct": True},
                        {"text": "Veri görselleştirme", "is_correct": False},
                        {"text": "Model değerlendirme", "is_correct": False}
                    ]},
                    {"text": "Hangi Python kütüphanesi ML için yaygın kullanılır?", "answers": [
                        {"text": "Django", "is_correct": False},
                        {"text": "Scikit-learn", "is_correct": True},
                        {"text": "Flask", "is_correct": False},
                        {"text": "Requests", "is_correct": False}
                    ]},
                    {"text": "Overfitting nedir?", "answers": [
                        {"text": "Model çok basit", "is_correct": False},
                        {"text": "Model eğitim verisini ezberler", "is_correct": True},
                        {"text": "Veri çok az", "is_correct": False},
                        {"text": "Algoritma yavaş", "is_correct": False}
                    ]},
                    {"text": "Deep Learning'de 'CNN' neyin kısaltmasıdır?", "answers": [
                        {"text": "Computer Neural Network", "is_correct": False},
                        {"text": "Convolutional Neural Network", "is_correct": True},
                        {"text": "Complex Neural Network", "is_correct": False},
                        {"text": "Cognitive Neural Network", "is_correct": False}
                    ]},
                    {"text": "TensorFlow nedir?", "answers": [
                        {"text": "Veri tabanı", "is_correct": False},
                        {"text": "Machine learning kütüphanesi", "is_correct": True},
                        {"text": "Web framework", "is_correct": False},
                        {"text": "Oyun motoru", "is_correct": False}
                    ]},
                    {"text": "NLP hangi alanda kullanılır?", "answers": [
                        {"text": "Görüntü işleme", "is_correct": False},
                        {"text": "Metin analizi", "is_correct": True},
                        {"text": "Ses tanıma", "is_correct": False},
                        {"text": "Veri görselleştirme", "is_correct": False}
                    ]},
                    {"text": "Hangi algoritma sınıflandırma için kullanılır?", "answers": [
                        {"text": "K-Means", "is_correct": False},
                        {"text": "Random Forest", "is_correct": True},
                        {"text": "PCA", "is_correct": False},
                        {"text": "DBSCAN", "is_correct": False}
                    ]}
                ]
            },
            {
                "title": "Siber Güvenlik",
                "description": "Ağ güvenliği, kriptografi ve güvenlik temel kavramları",
                "duration": 30,
                "questions": [
                    {"text": "SQL Injection saldırısı neyi hedefler?", "answers": [
                        {"text": "Web sunucusu", "is_correct": False},
                        {"text": "Veritabanı", "is_correct": True},
                        {"text": "DNS sunucusu", "is_correct": False},
                        {"text": "Email sunucusu", "is_correct": False}
                    ]},
                    {"text": "HTTPS'te 'S' harfi neyi ifade eder?", "answers": [
                        {"text": "Server", "is_correct": False},
                        {"text": "Secure", "is_correct": True},
                        {"text": "System", "is_correct": False},
                        {"text": "Standard", "is_correct": False}
                    ]},
                    {"text": "Firewall'un temel amacı nedir?", "answers": [
                        {"text": "Performans artırma", "is_correct": False},
                        {"text": "Ağ trafiğini kontrol etme", "is_correct": True},
                        {"text": "Veri yedekleme", "is_correct": False},
                        {"text": "Sistem güncellemesi", "is_correct": False}
                    ]},
                    {"text": "Phishing saldırısı nedir?", "answers": [
                        {"text": "Sistem virüsü", "is_correct": False},
                        {"text": "Sahte kimlik ile bilgi çalma", "is_correct": True},
                        {"text": "Ağ trafiği engelleme", "is_correct": False},
                        {"text": "Sunucu çökertme", "is_correct": False}
                    ]},
                    {"text": "Hangi port HTTPS için kullanılır?", "answers": [
                        {"text": "80", "is_correct": False},
                        {"text": "443", "is_correct": True},
                        {"text": "21", "is_correct": False},
                        {"text": "22", "is_correct": False}
                    ]},
                    {"text": "DDoS saldırısının amacı nedir?", "answers": [
                        {"text": "Veri çalma", "is_correct": False},
                        {"text": "Servisi kullanılamaz hale getirme", "is_correct": True},
                        {"text": "Şifre kırma", "is_correct": False},
                        {"text": "Malware yükleme", "is_correct": False}
                    ]},
                    {"text": "Penetration Testing nedir?", "answers": [
                        {"text": "Sistem performans testi", "is_correct": False},
                        {"text": "Güvenlik açığı testi", "is_correct": True},
                        {"text": "Kullanıcı deneyimi testi", "is_correct": False},
                        {"text": "Veri yedekleme testi", "is_correct": False}
                    ]},
                    {"text": "RSA hangi tür şifreleme algoritmasıdır?", "answers": [
                        {"text": "Simetrik", "is_correct": False},
                        {"text": "Asimetrik", "is_correct": True},
                        {"text": "Hash", "is_correct": False},
                        {"text": "Hibrit", "is_correct": False}
                    ]}
                ]
            },
            {
                "title": "Oyun Geliştirme",
                "description": "Unity, Unreal Engine, oyun tasarımı temel kavramları",
                "duration": 30,
                "questions": [
                    {"text": "Unity'de hangi programlama dili kullanılır?", "answers": [
                        {"text": "Java", "is_correct": False},
                        {"text": "C#", "is_correct": True},
                        {"text": "Python", "is_correct": False},
                        {"text": "JavaScript", "is_correct": False}
                    ]},
                    {"text": "Game Loop nedir?", "answers": [
                        {"text": "Oyun hikayesi", "is_correct": False},
                        {"text": "Sürekli çalışan ana döngü", "is_correct": True},
                        {"text": "Oyuncu kontrolü", "is_correct": False},
                        {"text": "Grafik render", "is_correct": False}
                    ]},
                    {"text": "Collision Detection ne işe yarar?", "answers": [
                        {"text": "Ses efektleri", "is_correct": False},
                        {"text": "Nesnelerin çarpışmasını algılama", "is_correct": True},
                        {"text": "Grafik kalitesi", "is_correct": False},
                        {"text": "Oyuncu puanı", "is_correct": False}
                    ]},
                    {"text": "Sprite nedir?", "answers": [
                        {"text": "3D model", "is_correct": False},
                        {"text": "2D görüntü/animasyon", "is_correct": True},
                        {"text": "Ses dosyası", "is_correct": False},
                        {"text": "Kod scripti", "is_correct": False}
                    ]},
                    {"text": "Level Design ne demektir?", "answers": [
                        {"text": "Karakter tasarımı", "is_correct": False},
                        {"text": "Harita/bölüm tasarımı", "is_correct": True},
                        {"text": "Ses tasarımı", "is_correct": False},
                        {"text": "UI tasarımı", "is_correct": False}
                    ]},
                    {"text": "Hangi dosya formatı 3D modeller için kullanılır?", "answers": [
                        {"text": ".jpg", "is_correct": False},
                        {"text": ".fbx", "is_correct": True},
                        {"text": ".mp3", "is_correct": False},
                        {"text": ".txt", "is_correct": False}
                    ]},
                    {"text": "FPS oyunlarda 'FPS' neyin kısaltmasıdır?", "answers": [
                        {"text": "First Person Shooter", "is_correct": True},
                        {"text": "Frames Per Second", "is_correct": False},
                        {"text": "Fast Player System", "is_correct": False},
                        {"text": "File Processing System", "is_correct": False}
                    ]},
                    {"text": "Unreal Engine hangi dilde kod yazılır?", "answers": [
                        {"text": "Java", "is_correct": False},
                        {"text": "C++", "is_correct": True},
                        {"text": "Python", "is_correct": False},
                        {"text": "JavaScript", "is_correct": False}
                    ]}
                ]
            },
            {
                "title": "Frontend Development",
                "description": "HTML, CSS, JavaScript, React, Vue.js ve modern frontend teknolojileri",
                "duration": 30,
                "questions": [
                    {"text": "CSS'de flexbox hangi amaçla kullanılır?", "answers": [
                        {"text": "Animasyon yapma", "is_correct": False},
                        {"text": "Layout düzenleme", "is_correct": True},
                        {"text": "Renk değiştirme", "is_correct": False},
                        {"text": "Font belirleme", "is_correct": False}
                    ]},
                    {"text": "React'te component state'i nasıl güncellenir?", "answers": [
                        {"text": "state = newValue", "is_correct": False},
                        {"text": "setState(newValue)", "is_correct": True},
                        {"text": "updateState(newValue)", "is_correct": False},
                        {"text": "changeState(newValue)", "is_correct": False}
                    ]},
                    {"text": "JavaScript'te 'let' ve 'var' arasındaki fark nedir?", "answers": [
                        {"text": "Hiç fark yok", "is_correct": False},
                        {"text": "let block scope, var function scope", "is_correct": True},
                        {"text": "var daha hızlı", "is_correct": False},
                        {"text": "let sadece sayılar için", "is_correct": False}
                    ]},
                    {"text": "HTML5'te video oynatmak için hangi etiket kullanılır?", "answers": [
                        {"text": "<movie>", "is_correct": False},
                        {"text": "<video>", "is_correct": True},
                        {"text": "<media>", "is_correct": False},
                        {"text": "<play>", "is_correct": False}
                    ]},
                    {"text": "CSS Grid ve Flexbox arasındaki temel fark nedir?", "answers": [
                        {"text": "Grid 2D, Flexbox 1D", "is_correct": True},
                        {"text": "Flexbox daha yeni", "is_correct": False},
                        {"text": "Grid sadece mobil için", "is_correct": False},
                        {"text": "Hiç fark yok", "is_correct": False}
                    ]},
                    {"text": "JavaScript'te Promise ne işe yarar?", "answers": [
                        {"text": "Değişken tanımlama", "is_correct": False},
                        {"text": "Asenkron işlemler", "is_correct": True},
                        {"text": "DOM manipülasyonu", "is_correct": False},
                        {"text": "CSS stillendirme", "is_correct": False}
                    ]},
                    {"text": "Responsive design için hangi CSS özelliği kullanılır?", "answers": [
                        {"text": "transform", "is_correct": False},
                        {"text": "media queries", "is_correct": True},
                        {"text": "animation", "is_correct": False},
                        {"text": "transition", "is_correct": False}
                    ]},
                    {"text": "Vue.js'te veri bağlama için hangi syntax kullanılır?", "answers": [
                        {"text": "{data}", "is_correct": False},
                        {"text": "{{data}}", "is_correct": True},
                        {"text": "[data]", "is_correct": False},
                        {"text": "<data>", "is_correct": False}
                    ]}
                ]
            },
            {
                "title": "Backend Development",
                "description": "Node.js, Python, databases, APIs ve server-side teknolojiler",
                "duration": 35,
                "questions": [
                    {"text": "REST API'de GET metodu ne için kullanılır?", "answers": [
                        {"text": "Veri silme", "is_correct": False},
                        {"text": "Veri okuma", "is_correct": True},
                        {"text": "Veri güncelleme", "is_correct": False},
                        {"text": "Veri oluşturma", "is_correct": False}
                    ]},
                    {"text": "Node.js nedir?", "answers": [
                        {"text": "Veritabanı", "is_correct": False},
                        {"text": "JavaScript runtime", "is_correct": True},
                        {"text": "Web browser", "is_correct": False},
                        {"text": "CSS framework", "is_correct": False}
                    ]},
                    {"text": "SQL'de hangi komut veri eklemek için kullanılır?", "answers": [
                        {"text": "SELECT", "is_correct": False},
                        {"text": "UPDATE", "is_correct": False},
                        {"text": "INSERT", "is_correct": True},
                        {"text": "DELETE", "is_correct": False}
                    ]},
                    {"text": "HTTP status code 404 ne anlama gelir?", "answers": [
                        {"text": "Başarılı", "is_correct": False},
                        {"text": "Sunucu hatası", "is_correct": False},
                        {"text": "Bulunamadı", "is_correct": True},
                        {"text": "Yetkisiz erişim", "is_correct": False}
                    ]},
                    {"text": "MongoDB hangi tür veritabanıdır?", "answers": [
                        {"text": "İlişkisel", "is_correct": False},
                        {"text": "NoSQL", "is_correct": True},
                        {"text": "Graph", "is_correct": False},
                        {"text": "In-memory", "is_correct": False}
                    ]},
                    {"text": "Express.js nedir?", "answers": [
                        {"text": "Veritabanı", "is_correct": False},
                        {"text": "Node.js web framework", "is_correct": True},
                        {"text": "Frontend library", "is_correct": False},
                        {"text": "CSS preprocessor", "is_correct": False}
                    ]},
                    {"text": "JWT (JSON Web Token) ne için kullanılır?", "answers": [
                        {"text": "Veri depolama", "is_correct": False},
                        {"text": "Authentication", "is_correct": True},
                        {"text": "CSS styling", "is_correct": False},
                        {"text": "Image processing", "is_correct": False}
                    ]},
                    {"text": "Microservices mimarisinin avantajı nedir?", "answers": [
                        {"text": "Tek büyük uygulama", "is_correct": False},
                        {"text": "Bağımsız servisler", "is_correct": True},
                        {"text": "Daha az kod", "is_correct": False},
                        {"text": "Daha ucuz", "is_correct": False}
                    ]}
                ]
            },
            {
                "title": "Mobil Uygulama Geliştirme",
                "description": "React Native, Flutter, iOS, Android ve mobil geliştirme",
                "duration": 30,
                "questions": [
                    {"text": "React Native hangi dilde yazılır?", "answers": [
                        {"text": "Java", "is_correct": False},
                        {"text": "JavaScript", "is_correct": True},
                        {"text": "Swift", "is_correct": False},
                        {"text": "Kotlin", "is_correct": False}
                    ]},
                    {"text": "Flutter hangi şirket tarafından geliştirilmiştir?", "answers": [
                        {"text": "Facebook", "is_correct": False},
                        {"text": "Google", "is_correct": True},
                        {"text": "Apple", "is_correct": False},
                        {"text": "Microsoft", "is_correct": False}
                    ]},
                    {"text": "iOS uygulamaları hangi dilde yazılır?", "answers": [
                        {"text": "Java", "is_correct": False},
                        {"text": "Swift", "is_correct": True},
                        {"text": "C++", "is_correct": False},
                        {"text": "Python", "is_correct": False}
                    ]},
                    {"text": "Android uygulamaları için hangi IDE kullanılır?", "answers": [
                        {"text": "Xcode", "is_correct": False},
                        {"text": "Android Studio", "is_correct": True},
                        {"text": "Visual Studio", "is_correct": False},
                        {"text": "Eclipse", "is_correct": False}
                    ]},
                    {"text": "Cross-platform development nedir?", "answers": [
                        {"text": "Sadece Android", "is_correct": False},
                        {"text": "Birden fazla platform için geliştirme", "is_correct": True},
                        {"text": "Sadece iOS", "is_correct": False},
                        {"text": "Web geliştirme", "is_correct": False}
                    ]},
                    {"text": "APK dosyası nedir?", "answers": [
                        {"text": "iOS uygulama paketi", "is_correct": False},
                        {"text": "Android uygulama paketi", "is_correct": True},
                        {"text": "Web uygulaması", "is_correct": False},
                        {"text": "Veritabanı dosyası", "is_correct": False}
                    ]},
                    {"text": "Flutter'da widget nedir?", "answers": [
                        {"text": "Veritabanı", "is_correct": False},
                        {"text": "UI bileşeni", "is_correct": True},
                        {"text": "API servisi", "is_correct": False},
                        {"text": "Animasyon", "is_correct": False}
                    ]},
                    {"text": "Responsive design mobilde neden önemlidir?", "answers": [
                        {"text": "Hız için", "is_correct": False},
                        {"text": "Farklı ekran boyutları", "is_correct": True},
                        {"text": "Güvenlik için", "is_correct": False},
                        {"text": "Maliyet için", "is_correct": False}
                    ]}
                ]
            },
            {
                "title": "Veri Bilimi ve Analytics",
                "description": "Python, R, SQL, veri analizi ve data science",
                "duration": 35,
                "questions": [
                    {"text": "Pandas kütüphanesi ne için kullanılır?", "answers": [
                        {"text": "Web geliştirme", "is_correct": False},
                        {"text": "Veri manipülasyonu", "is_correct": True},
                        {"text": "Oyun geliştirme", "is_correct": False},
                        {"text": "Mobil uygulama", "is_correct": False}
                    ]},
                    {"text": "SQL'de GROUP BY ne işe yarar?", "answers": [
                        {"text": "Veri sıralama", "is_correct": False},
                        {"text": "Veri gruplama", "is_correct": True},
                        {"text": "Veri silme", "is_correct": False},
                        {"text": "Veri ekleme", "is_correct": False}
                    ]},
                    {"text": "Data Visualization için hangi Python kütüphanesi kullanılır?", "answers": [
                        {"text": "Django", "is_correct": False},
                        {"text": "Matplotlib", "is_correct": True},
                        {"text": "Flask", "is_correct": False},
                        {"text": "Requests", "is_correct": False}
                    ]},
                    {"text": "Big Data'nın 3V'si nedir?", "answers": [
                        {"text": "Volume, Velocity, Variety", "is_correct": True},
                        {"text": "Value, Version, Validation", "is_correct": False},
                        {"text": "Vector, Variable, Variance", "is_correct": False},
                        {"text": "Visual, Virtual, Vertical", "is_correct": False}
                    ]},
                    {"text": "ETL sürecinde 'T' harfi neyi ifade eder?", "answers": [
                        {"text": "Transfer", "is_correct": False},
                        {"text": "Transform", "is_correct": True},
                        {"text": "Test", "is_correct": False},
                        {"text": "Track", "is_correct": False}
                    ]},
                    {"text": "Correlation ve Causation arasındaki fark nedir?", "answers": [
                        {"text": "Aynı şey", "is_correct": False},
                        {"text": "Correlation ilişki, Causation neden-sonuç", "is_correct": True},
                        {"text": "Causation daha zayıf", "is_correct": False},
                        {"text": "Correlation daha güvenilir", "is_correct": False}
                    ]},
                    {"text": "A/B Testing nedir?", "answers": [
                        {"text": "Veri temizleme", "is_correct": False},
                        {"text": "İki versiyonu karşılaştırma", "is_correct": True},
                        {"text": "Veri görselleştirme", "is_correct": False},
                        {"text": "Makine öğrenmesi", "is_correct": False}
                    ]},
                    {"text": "Hangi dosya formatı büyük veri setleri için optimize edilmiştir?", "answers": [
                        {"text": "CSV", "is_correct": False},
                        {"text": "Parquet", "is_correct": True},
                        {"text": "TXT", "is_correct": False},
                        {"text": "DOC", "is_correct": False}
                    ]}
                ]
            },
            {
                "title": "Cloud ve DevOps",
                "description": "AWS, Docker, Kubernetes, CI/CD ve cloud teknolojileri",
                "duration": 30,
                "questions": [
                    {"text": "Docker nedir?", "answers": [
                        {"text": "Veritabanı", "is_correct": False},
                        {"text": "Containerization platform", "is_correct": True},
                        {"text": "Programlama dili", "is_correct": False},
                        {"text": "Web browser", "is_correct": False}
                    ]},
                    {"text": "CI/CD'de 'CI' neyin kısaltmasıdır?", "answers": [
                        {"text": "Code Integration", "is_correct": False},
                        {"text": "Continuous Integration", "is_correct": True},
                        {"text": "Computer Intelligence", "is_correct": False},
                        {"text": "Cloud Infrastructure", "is_correct": False}
                    ]},
                    {"text": "Kubernetes ne işe yarar?", "answers": [
                        {"text": "Veri analizi", "is_correct": False},
                        {"text": "Container orchestration", "is_correct": True},
                        {"text": "Web geliştirme", "is_correct": False},
                        {"text": "Mobil uygulama", "is_correct": False}
                    ]},
                    {"text": "AWS'de S3 nedir?", "answers": [
                        {"text": "Veritabanı servisi", "is_correct": False},
                        {"text": "Object storage servisi", "is_correct": True},
                        {"text": "Compute servisi", "is_correct": False},
                        {"text": "Network servisi", "is_correct": False}
                    ]},
                    {"text": "Infrastructure as Code (IaC) nedir?", "answers": [
                        {"text": "Manuel sistem kurulumu", "is_correct": False},
                        {"text": "Kod ile altyapı yönetimi", "is_correct": True},
                        {"text": "Sadece bulut servisleri", "is_correct": False},
                        {"text": "Veri yedekleme", "is_correct": False}
                    ]},
                    {"text": "Load Balancer ne işe yarar?", "answers": [
                        {"text": "Veri şifreleme", "is_correct": False},
                        {"text": "Trafiği dağıtma", "is_correct": True},
                        {"text": "Veri depolama", "is_correct": False},
                        {"text": "Kod derleme", "is_correct": False}
                    ]},
                    {"text": "Microservices'te API Gateway'in rolü nedir?", "answers": [
                        {"text": "Veri depolama", "is_correct": False},
                        {"text": "API isteklerini yönlendirme", "is_correct": True},
                        {"text": "Kod derleme", "is_correct": False},
                        {"text": "UI rendering", "is_correct": False}
                    ]},
                    {"text": "DevOps kültürünün temel prensibi nedir?", "answers": [
                        {"text": "Sadece development", "is_correct": False},
                        {"text": "Development ve Operations işbirliği", "is_correct": True},
                        {"text": "Sadece operations", "is_correct": False},
                        {"text": "Manuel süreçler", "is_correct": False}
                    ]}
                ]
            }
        ]
        
        # Create tests, questions and answers
        for test_data in tests_data:
            test = Test(
                id=str(uuid.uuid4()),
                title=test_data["title"],
                description=test_data["description"],
                test_type=TestType.SKILL_ASSESSMENT,
                duration_minutes=test_data["duration"]
            )
            db.add(test)
            
            for i, q_data in enumerate(test_data["questions"]):
                question = Question(
                    id=str(uuid.uuid4()),
                    test_id=test.id,
                    question_text=q_data["text"],
                    question_type=QuestionType.MULTIPLE_CHOICE,
                    order=i + 1
                )
                db.add(question)
                
                for j, a_data in enumerate(q_data["answers"]):
                    answer = Answer(
                        id=str(uuid.uuid4()),
                        question_id=question.id,
                        answer_text=a_data["text"],
                        score_value=1.0 if a_data["is_correct"] else 0.0
                    )
                    db.add(answer)
        
        db.commit()
        print(f"✅ Created {len(tests_data)} comprehensive skill tests!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_comprehensive_tests()
