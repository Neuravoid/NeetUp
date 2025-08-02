"""
Bu script, roadmap_steps tablosunu güncellemek için kullanılır.
- Backend için olan mükerrer kayıtları siler
- Proje Yönetimi, Veri Analizi ve UX Tasarımı için yeni roadmap aşamalarını ekler
"""

import sys
import os
import json
from datetime import datetime
from uuid import uuid4

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import SessionLocal
from app.models.roadmap import CareerPath, UserRoadmap, RoadmapStep, StepStatus

# Roadmap şablonları
ROADMAP_TEMPLATES = {
    "Proje Yönetimi": [
        {
            "title": "Aşama 1 – Proje Yönetiminin Temelleri",
            "description": "Öğrenilecekler: Proje nedir, proje yöneticisinin rolü, proje yaşam döngüsü, paydaşlarla iletişim",
            "tasks_count": 25,
            "duration": "3 hafta (yaklaşık 18 saat)"
        },
        {
            "title": "Aşama 2 – Proje Başlatma",
            "description": "Öğrenilecekler: Proje hedefi yazma, kapsam belgesi, proje belgeleri oluşturma",
            "tasks_count": 20,
            "duration": "3 hafta (15-18 saat)"
        },
        {
            "title": "Aşama 3 – Proje Planlama",
            "description": "Öğrenilecekler: Zaman çizelgesi hazırlama, bütçe planı, risk yönetimi, iletişim planı",
            "tasks_count": 25,
            "duration": "4 hafta (20-25 saat)"
        },
        {
            "title": "Aşama 4 – Projeyi Yürütme",
            "description": "Öğrenilecekler: Takip etme, ilerleme raporları, kalite yönetimi",
            "tasks_count": 20,
            "duration": "3 hafta (15-18 saat)"
        },
        {
            "title": "Aşama 5 – Çevik (Agile) Proje Yönetimi",
            "description": "Öğrenilecekler: Agile yaklaşımı, Scrum, sprint planlama",
            "tasks_count": 25,
            "duration": "4 hafta (20 saat)"
        },
        {
            "title": "Aşama 6 – Bitirme Projesi (Capstone)",
            "description": "Öğrenilecekler: Gerçek senaryoya dayalı proje planı hazırlama",
            "tasks_count": 15,
            "duration": "2 hafta (10-12 saat)"
        }
    ],
    "Veri Analizi": [
        {
            "title": "Aşama 1 – Veri Bilimine Giriş",
            "description": "Öğrenilecekler: Veri toplama, temizleme, temel analiz süreci",
            "tasks_count": 25,
            "duration": "3 hafta (18-20 saat)"
        },
        {
            "title": "Aşama 2 – Python'a Başlangıç",
            "description": "Öğrenilecekler: Python temelleri, veri yapıları, fonksiyonlar, pandas",
            "tasks_count": 30,
            "duration": "4 hafta (25 saat)"
        },
        {
            "title": "Aşama 3 – Sayıların Ötesine Geçmek",
            "description": "Öğrenilecekler: Veriyi hikâyeye dönüştürme, iş kararları için yorumlama",
            "tasks_count": 20,
            "duration": "3 hafta (15-18 saat)"
        },
        {
            "title": "Aşama 4 – İstatistiğin Gücü",
            "description": "Öğrenilecekler: Temel istatistik, olasılık, hipotez testleri",
            "tasks_count": 25,
            "duration": "4 hafta (20-25 saat)"
        },
        {
            "title": "Aşama 5 – Regresyon Analizi",
            "description": "Öğrenilecekler: Doğrusal regresyon, çoklu regresyon, modellerin yorumlanması",
            "tasks_count": 20,
            "duration": "3 hafta (18-20 saat)"
        },
        {
            "title": "Aşama 6 – Makine Öğrenmesine Giriş",
            "description": "Öğrenilecekler: Temel algoritmalar, model kurma ve doğrulama",
            "tasks_count": 25,
            "duration": "4 hafta (22-25 saat)"
        },
        {
            "title": "Aşama 7 – Bitirme Projesi",
            "description": "Öğrenilecekler: Gerçek veri ile sıfırdan analiz projesi",
            "tasks_count": 15,
            "duration": "2 hafta (10-12 saat)"
        }
    ],
    "UX Tasarımı": [
        {
            "title": "Aşama 1 – UX Tasarımına Giriş",
            "description": "Öğrenilecekler: UX nedir, kullanıcı odaklı tasarım",
            "tasks_count": 20,
            "duration": "3 hafta (15-18 saat)"
        },
        {
            "title": "Aşama 2 – UX Tasarım Sürecine Başlamak",
            "description": "Öğrenilecekler: Empati haritaları, kullanıcı hikâyeleri, problem tanımı",
            "tasks_count": 25,
            "duration": "3 hafta (18-20 saat)"
        },
        {
            "title": "Aşama 3 – Wireframe ve Düşük Detaylı Prototip",
            "description": "Öğrenilecekler: Basit çizimler, temel prototipler",
            "tasks_count": 20,
            "duration": "3 hafta (15-18 saat)"
        },
        {
            "title": "Aşama 4 – Araştırma ve Test",
            "description": "Öğrenilecekler: Kullanıcı araştırması, test yapmak, geri bildirim",
            "tasks_count": 25,
            "duration": "4 hafta (20-22 saat)"
        },
        {
            "title": "Aşama 5 – Figma ile Yüksek Detaylı Tasarım",
            "description": "Öğrenilecekler: Renk, tipografi, responsive tasarım",
            "tasks_count": 25,
            "duration": "4 hafta (20-25 saat)"
        },
        {
            "title": "Aşama 6 – Dinamik Arayüz Oluşturma",
            "description": "Öğrenilecekler: Basit HTML/CSS/JS, etkileşimli prototipler",
            "tasks_count": 20,
            "duration": "3 hafta (18-20 saat)"
        },
        {
            "title": "Aşama 7 – Bitirme Projesi",
            "description": "Öğrenilecekler: Sosyal fayda odaklı bir ürün tasarlama",
            "tasks_count": 15,
            "duration": "2 hafta (10-12 saat)"
        }
    ],
    "Backend Geliştirme": [
        {
            "title": "Aşama 1 – Backend Geliştirmenin Temelleri",
            "description": "Öğrenilecekler: Programlama temelleri, veri yapıları, algoritmalar, HTTP protokolü",
            "tasks_count": 25,
            "duration": "3 hafta (18-20 saat)"
        },
        {
            "title": "Aşama 2 – Veritabanı Yönetimi",
            "description": "Öğrenilecekler: SQL, NoSQL, veritabanı tasarımı, ORM kullanımı",
            "tasks_count": 20,
            "duration": "3 hafta (15-18 saat)"
        },
        {
            "title": "Aşama 3 – API Geliştirme",
            "description": "Öğrenilecekler: RESTful API tasarımı, FastAPI/Django/Flask, endpoint yapılandırması",
            "tasks_count": 25,
            "duration": "4 hafta (20-25 saat)"
        },
        {
            "title": "Aşama 4 – Güvenlik ve Performans",
            "description": "Öğrenilecekler: Kimlik doğrulama, yetkilendirme, güvenlik açıkları, performans optimizasyonu",
            "tasks_count": 20,
            "duration": "3 hafta (15-18 saat)"
        },
        {
            "title": "Aşama 5 – Deployment ve DevOps",
            "description": "Öğrenilecekler: Docker, CI/CD, bulut hizmetleri, ölçeklendirme",
            "tasks_count": 25,
            "duration": "4 hafta (20-25 saat)"
        },
        {
            "title": "Aşama 6 – Mikroservisler ve İleri Konular",
            "description": "Öğrenilecekler: Mikroservis mimarisi, mesaj kuyrukları, GraphQL, WebSockets",
            "tasks_count": 20,
            "duration": "3 hafta (18-20 saat)"
        },
        {
            "title": "Aşama 7 – Gerçek Dünya Projeleri",
            "description": "Öğrenilecekler: Büyük ölçekli projeler, takım çalışması, kod kalitesi, test yazımı",
            "tasks_count": 15,
            "duration": "2 hafta (10-12 saat)"
        }
    ]
}

def main():
    db = SessionLocal()
    try:
        print("Roadmap steps tablosunu güncelleme işlemi başlatılıyor...")
        
        # 1. Kariyer alanlarını kontrol et ve gerekirse oluştur
        career_paths = {}
        for career_title in ROADMAP_TEMPLATES.keys():
            career_path = db.query(CareerPath).filter(CareerPath.title == career_title).first()
            
            if not career_path:
                print(f"'{career_title}' kariyer alanı oluşturuluyor...")
                skills = []
                if career_title == "Backend Geliştirme":
                    skills = ["Python", "API Geliştirme", "Veritabanı", "Güvenlik"]
                elif career_title == "UX Tasarımı":
                    skills = ["UI/UX", "Figma", "Kullanıcı Araştırması", "Prototipleme"]
                elif career_title == "Veri Analizi":
                    skills = ["Python", "İstatistik", "Veri Görselleştirme", "Makine Öğrenmesi"]
                elif career_title == "Proje Yönetimi":
                    skills = ["Agile", "Scrum", "Takım Yönetimi", "Risk Yönetimi"]
                
                career_path = CareerPath(
                    id=str(uuid4()),
                    title=career_title,
                    description=f"{career_title} kariyeri için yol haritası",
                    skills_required=json.dumps(skills),
                    avg_salary=90000.0
                )
                db.add(career_path)
                db.commit()
                db.refresh(career_path)
                print(f"'{career_title}' kariyer alanı oluşturuldu. ID: {career_path.id}")
            else:
                print(f"'{career_title}' kariyer alanı zaten mevcut. ID: {career_path.id}")
            
            career_paths[career_title] = career_path
        
        # 2. Backend için olan mükerrer roadmap kayıtlarını temizle
        # Önce tüm kullanıcıların roadmap'lerini al
        user_roadmaps = db.query(UserRoadmap).all()
        
        for roadmap in user_roadmaps:
            # Kariyer alanını kontrol et
            career_path = db.query(CareerPath).filter(CareerPath.id == roadmap.career_path_id).first()
            if career_path and career_path.title == "Backend Geliştirme":
                # Bu roadmap'in adımlarını al
                steps = db.query(RoadmapStep).filter(RoadmapStep.roadmap_id == roadmap.id).all()
                
                # Adım sayısını kontrol et, eğer 7'den fazla adım varsa mükerrer olabilir
                if len(steps) > 7:
                    print(f"Backend roadmap ID: {roadmap.id} için mükerrer adımlar temizleniyor...")
                    
                    # Adımları sıraya göre grupla ve her sıra için en son oluşturulanı tut
                    steps_by_order = {}
                    for step in steps:
                        if step.order not in steps_by_order or step.created_at > steps_by_order[step.order].created_at:
                            steps_by_order[step.order] = step
                    
                    # Gruplandırılmış adımlar dışındakileri sil
                    for step in steps:
                        if step != steps_by_order.get(step.order):
                            db.delete(step)
                    
                    db.commit()
                    print(f"Backend roadmap ID: {roadmap.id} için mükerrer adımlar temizlendi.")
        
        # 3. Her kariyer alanı için örnek roadmap oluştur (eğer yoksa)
        for career_title, career_path in career_paths.items():
            # Örnek kullanıcı roadmap'i oluştur (eğer yoksa)
            example_roadmap = db.query(UserRoadmap).filter(
                UserRoadmap.career_path_id == career_path.id,
                UserRoadmap.user_id == "example"
            ).first()
            
            if not example_roadmap:
                print(f"'{career_title}' için örnek roadmap oluşturuluyor...")
                example_roadmap = UserRoadmap(
                    id=str(uuid4()),
                    user_id="example",  # Örnek kullanıcı ID'si
                    career_path_id=career_path.id,
                    progress_percentage=0.0,
                    created_date=datetime.utcnow(),
                    last_updated=datetime.utcnow()
                )
                db.add(example_roadmap)
                db.commit()
                db.refresh(example_roadmap)
                print(f"'{career_title}' için örnek roadmap oluşturuldu. ID: {example_roadmap.id}")
            else:
                print(f"'{career_title}' için örnek roadmap zaten mevcut. ID: {example_roadmap.id}")
                
                # Mevcut adımları temizle
                existing_steps = db.query(RoadmapStep).filter(RoadmapStep.roadmap_id == example_roadmap.id).all()
                for step in existing_steps:
                    db.delete(step)
                db.commit()
                print(f"'{career_title}' için mevcut adımlar temizlendi.")
            
            # Şablondan adımları ekle
            template = ROADMAP_TEMPLATES[career_title]
            for i, stage in enumerate(template):
                step = RoadmapStep(
                    id=str(uuid4()),
                    roadmap_id=example_roadmap.id,
                    title=stage["title"],
                    description=stage["description"],
                    order=i + 1,  # 1'den başla
                    status=StepStatus.NOT_STARTED
                )
                db.add(step)
            
            db.commit()
            print(f"'{career_title}' için {len(template)} aşama eklendi.")
        
        print("Roadmap steps tablosu başarıyla güncellendi!")
    
    except Exception as e:
        print(f"Hata oluştu: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
