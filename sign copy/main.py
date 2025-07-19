"""
main.py - Main entry point for the integrated application

This file imports both the Flask app and the bridge module and
sets up the integration between them.
"""
#import pdb; pdb.set_trace()
from app import app as flask_app  # Import the Flask app instance
from bridge import register_with_app  # Import the registration function
import subprocess
import threading
import os

# Register the personality bridge routes with the Flask app
register_with_app(flask_app)

# Sadece FastAPI süreçlerini sonlandır, Flask'a dokunma
def clean_ports():
    # 8003 port numarasında çalışan FastAPI süreçlerini sonlandır
    print("[MAIN] Port 8003 temizleniyor...")
    try:
        # MacOS için önce lsof komutuyla PID'leri bulup sonra kill ile sonlandırıyoruz
        result = subprocess.run(['lsof', '-t', '-i', ':8003'], capture_output=True, text=True)
        if result.stdout.strip():
            pids = result.stdout.strip().split('\n')
            for pid in pids:
                if pid:  # Boş satırları atlayarak
                    print(f"[MAIN] PID {pid} sonlandırılıyor (port 8003)")
                    subprocess.run(['kill', '-9', pid])
        # Ayrıca genel bir pkill de yapalım
        subprocess.run(['pkill', '-f', 'uvicorn personality_api:app'])
    except Exception as e:
        print(f"[MAIN] Port 8003 temizleme hatası: {str(e)}")
    
    # NOT: 3000 port'unu temizlemeyelim, çünkü kendi sürecimizi de öldürür.
    # Flask uygulaması 3000 port'unda çalışacak ve kendi kendisini öldürmemeli.

# FastAPI uygulamasını bağımsız olarak başlatan fonksiyon
def run_fastapi():
    print("[MAIN] Başlatılıyor: FastAPI uygulama sunucusu...")
    try:
        # Önce portları temizleyelim
        clean_ports()
        
        # Yeni bir FastAPI process başlatalım
        fastapi_process = subprocess.Popen(
            ['uvicorn', 'personality_api:app', '--host', '127.0.0.1', '--port', '8003'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # FastAPI loglarını izleyen fonksiyon
        def log_fastapi_output():
            while True:
                stdout_line = fastapi_process.stdout.readline()
                if stdout_line:
                    print(f"[FastAPI] {stdout_line.strip()}")
                stderr_line = fastapi_process.stderr.readline()
                if stderr_line:
                    print(f"[FastAPI ERROR] {stderr_line.strip()}")
                if not stdout_line and not stderr_line and fastapi_process.poll() is not None:
                    break
        
        # Log izleme thread'ini başlat
        log_thread = threading.Thread(target=log_fastapi_output)
        log_thread.daemon = True
        log_thread.start()
        
        print("[MAIN] FastAPI uygulama sunucusu başlatıldı.")
        return fastapi_process
    except Exception as e:
        print(f"[MAIN ERROR] FastAPI başlatılırken hata: {str(e)}")
        import traceback
        traceback.print_exc()
        return None

# This part is only executed when this script is run directly
if __name__ == '__main__':
    # FastAPI'yi bağımsız olarak başlat
    fastapi_process = run_fastapi()
    
    # This part is only executed when this script is run directly
    with flask_app.app_context():
        # Create all tables in the database if they don't exist
        from app import db
        db.create_all()
    
    # Start the Flask application
    flask_app.run(debug=True, port=3000)
