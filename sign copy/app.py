# ==============================================================
# FILE: app.py
# DESCRIPTION:
# The complete backend application, now with the new 20-question
# personality and interest questionnaire fully integrated.
# ==============================================================

import os
import json
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import re

# --- 1. FLASK UYGULAMASI VE VERİTABANI YAPILANDIRMASI ---
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app) 
app.secret_key = 'your_super_secret_key_for_neetup'
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'neetup.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- 2. VERİTABANI MODELİ ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    security_question = db.Column(db.String(256), nullable=False)
    security_answer_hash = db.Column(db.String(256), nullable=False)
    progress = db.Column(db.Integer, nullable=False, default=0)
    personality_type = db.Column(db.String(100), nullable=True, default=None)
    test_report = db.Column(db.Text, nullable=True)

    @property
    def personality_test_completed(self):
        return self.personality_type is not None

# --- 3. KİŞİLİK TESTİ VERİLERİ VE MANTIĞI ---
# Yeni anket soruları
QUESTIONS = [
    # Extraversion
    {"id": "E1", "text": "Partilerin ilgi odağı olmaktan ve sık sık dikkat çekmekten hoşlanırım.", "trait": "extraversion"},
    {"id": "E2", "text": "Yalnız veya küçük bir arkadaş grubuyla vakit geçirmeyi tercih ederim.", "trait": "extraversion", "reverse": True},
    {"id": "E3", "text": "Yeni insanlarla etkileşime girdiğimde enerjik ve rahat hissederim.", "trait": "extraversion"},
    # Agreeableness
    {"id": "A1", "text": "Diğer insanlara ve onların iyiliğine içten bir ilgi duyarım.", "trait": "agreeableness"},
    {"id": "A2", "text": "Başkalarını eleştirmeye ve kolayca hata bulmaya eğilimliyimdir.", "trait": "agreeableness", "reverse": True},
    {"id": "A3", "text": "Başkalarının duygularını anlamakta ve onlarla empati kurmakta zorlanmam.", "trait": "agreeableness"},
    # Conscientiousness
    {"id": "C1", "text": "Çok düzenliyimdir ve görevlerime her zaman hazırlıklı olurum.", "trait": "conscientiousness"},
    {"id": "C2", "text": "Genellikle bir plan yapmadan, anlık kararlarla hareket ederim.", "trait": "conscientiousness", "reverse": True},
    {"id": "C3", "text": "İşlerimde titiz davranır ve detaylara çok dikkat ederim.", "trait": "conscientiousness"},
    # Emotional Stability
    {"id": "S1", "text": "Çoğu zaman sakinimdir ve aşırı endişelenmem.", "trait": "emotional_stability"},
    {"id": "S2", "text": "Günlük olaylar karşısında kolayca strese girer ve bunalırım.", "trait": "emotional_stability", "reverse": True},
    {"id": "S3", "text": "Nadiren üzgün veya keyifsiz hissederim.", "trait": "emotional_stability"},
    # Openness
    {"id": "O1", "text": "Canlı bir hayal gücüm var ve soyut fikirleri keşfetmekten hoşlanırım.", "trait": "openness"},
    {"id": "O2", "text": "Yeni deneyimler yerine rutinleri ve alışıldık durumları tercih ederim.", "trait": "openness", "reverse": True},
    {"id": "O3", "text": "Birçok farklı şeye karşı meraklıyım ve öğrenmekten keyif alırım.", "trait": "openness"},
    # Interests
    {"id": "INT1", "text": "Düzenli olarak spor yapmaktan veya izlemekten keyif alırım.", "trait": "sports"},
    {"id": "INT2", "text": "Yeni teknolojiler, cihazlar ve bir şeylerin nasıl çalıştığı beni cezbeder.", "trait": "technology"},
    {"id": "INT3", "text": "Sanat, müzik ve edebiyat gibi yaratıcı ifadeleri takdir ederim.", "trait": "art"},
    {"id": "INT4", "text": "Yürüyüş, kamp veya sadece doğada olmak gibi açık hava etkinliklerini severim.", "trait": "outdoors"},
    {"id": "INT5", "text": "Kitap okumak ve kendi başıma yeni konular öğrenmek konusunda tutkuluyum.", "trait": "reading_learning"}
]

def calculate_scores(answers):
    """Verilen cevaplara göre kişilik ve ilgi alanı puanlarını hesaplar."""
    scores = {
        "extraversion": [], "agreeableness": [], "conscientiousness": [],
        "emotional_stability": [], "openness": []
    }
    interests = {}
    
    question_map = {q['id']: q for q in QUESTIONS}

    for answer in answers:
        q_id = answer.get('question_id')
        q_details = question_map.get(q_id)
        if not q_details: continue

        value = int(answer.get('answer_value', 3))
        score = (6 - value) if q_details.get('reverse') else value
        
        trait = q_details['trait']
        if trait in scores:
            scores[trait].append(score)
        else:
            interests[trait] = score
            
    # Ortalama puanları hesapla
    final_scores = {trait: round(sum(s_list) / len(s_list), 1) if s_list else 0.0 for trait, s_list in scores.items()}
    
    return {**final_scores, "interests": interests}

# --- 4. HTML SAYFALARINI SUNAN ROUTE'LAR ---
@app.route('/')
def index(): return render_template('landing_page.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session: return redirect(url_for('signin_page'))
    user = db.session.get(User, session['user_id'])
    if not user:
        session.clear()
        return redirect(url_for('signin_page'))
    return render_template('dashboard.html', user=user)

@app.route('/personality-test')
def personality_test():
    if 'user_id' not in session: return redirect(url_for('signin_page'))
    return render_template('personality_test.html')

# (Diğer tüm sayfa rotaları buraya eklenecek)
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('signin_page'))
@app.route('/signup-page')
def signup_page(): return render_template('signUp.html')
@app.route('/signin-page')
def signin_page(): return render_template('signIn.html')

# --- 5. API ENDPOINT'LERİ ---
@app.route('/api/test/questions', methods=['GET'])
def get_test_questions():
    """Tüm kişilik testi sorularını döndürür."""
    if 'user_id' not in session:
        return jsonify({'message': 'Authentication required'}), 401
    return jsonify({"questions": QUESTIONS})

@app.route('/api/test/submit', methods=['POST'])
def submit_test():
    """Testin sonunda nihai sonucu hesaplar ve kaydeder."""
    if 'user_id' not in session: return jsonify({'message': 'Authentication required.'}), 401
    
    data = request.get_json()
    if not data or 'answers' not in data: return jsonify({'message': 'Eksik cevaplar.'}), 400

    user = db.session.get(User, session['user_id'])
    if not user: return jsonify({'message': 'Kullanıcı bulunamadı.'}), 404

    # Puanları hesapla
    final_report = calculate_scores(data['answers'])
    
    # En yüksek puanlı kişilik özelliğini bul
    personality_scores = {k: v for k, v in final_report.items() if k != 'interests'}
    primary_trait = max(personality_scores, key=personality_scores.get)

    # Sonucu veritabanına kaydet
    user.personality_type = primary_trait.replace('_', ' ').title()
    user.test_report = json.dumps(final_report)
    user.progress = max(user.progress, 50)
    db.session.commit()
    
    return jsonify({'message': 'Test başarıyla tamamlandı!', 'redirectUrl': '/dashboard'}), 200

# --- KULLANICI YÖNETİMİ API'LARI ---
@app.route('/api/auth/signin', methods=['POST'])
def signin():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if user and check_password_hash(user.password_hash, data.get('password')):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful!', 'redirectUrl': '/dashboard'}), 200
    return jsonify({'message': 'Invalid username or password.'}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    hashed_password = generate_password_hash(data.get('password'))
    hashed_security_answer = generate_password_hash(data.get('securityAnswer'))
    new_user = User(
        full_name=data.get('fullName'),
        email=data.get('email'),
        username=data.get('username'),
        password_hash=hashed_password,
        security_question=data.get('securityQuestion'),
        security_answer_hash=hashed_security_answer
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully!'}), 201

# --- 6. UYGULAMAYI BAŞLATMA ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=3000)
