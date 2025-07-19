"""
bridge.py - Integration adapter between Flask app and Personality Test module

This file creates routes that bridge the Flask app.py and personalitytest.py modules
without modifying either file directly.
"""

import json
import traceback
from flask import Blueprint, jsonify, request, Response, session, redirect, url_for
import requests
from app import db, User  # Import database and User model from main app

# Create a Blueprint to register with the main Flask app
personality_bridge = Blueprint('personality_bridge', __name__)

# Constants for the personality test API
PERSONALITY_TEST_API_BASE = "http://localhost:8003"  # Port where personalitytest.py runs

@personality_bridge.route('/personality-test')
def redirect_to_test():
    """
    Route that replaces the link in dashboard.html.
    Redirects to the personality test page.
    """
    if 'user_id' not in session:
        return redirect(url_for('signin_page'))
    
    # Just redirect to the personality test page
    return redirect(url_for('personality_test_page'))

@personality_bridge.route('/api/submit-test', methods=['POST'])
def submit_test_result():
    """
    Endpoint to receive test results from personality_test.html and save to user profile.
    """
    if 'user_id' not in session:
        return jsonify({'message': 'Authentication required.'}), 401

    # Get the logged-in user
    user = db.session.get(User, session['user_id'])
    if not user:
        return jsonify({'message': 'User not found.'}), 404

    # Parse the test result data from the request
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid submission.'}), 400

    # Save the personality type to the user's profile
    # This will typically be the "top_coalition" or equivalent from the test result
    # For this example, we'll assume the result is a string like "Innovator (ENTP)"
    personality_type = data.get('result', 'Unknown Type')
    
    # Update the user's record
    user.personality_type = personality_type
    user.progress = min(user.progress + 50, 100)  # Boost progress, cap at 100%
    
    # Save changes to database
    db.session.commit()
    
    # Return success with redirect URL
    return jsonify({
        'message': 'Test completed successfully!',
        'redirectUrl': '/dashboard'
    }), 200

# Proxy for personality test API endpoints
@personality_bridge.route('/api/test/<path:subpath>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def api_proxy(subpath):
    """
    Proxy requests to the personality test API.
    This allows the personality test frontend to communicate with its backend API.
    """
    # OPTIONS isteklerini doğrudan yanıtlayalım (CORS preflight için)
    if request.method == 'OPTIONS':
        response = Response()
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Max-Age'] = '3600'
        return response
        
    # FastAPI endpoint'leri /test/ prefixi ile başlıyor, bu nedenle frontend'den gelen istekleri doğru formata dönüştürelim
    url = f"{PERSONALITY_TEST_API_BASE}/test/{subpath}"
    print(f"[PROXY] Converting /api/test/{subpath} -> {url}")
    
    # Debug için loglama ekleyelim
    print(f"[PROXY] Forwarding {request.method} request to: {url}")
    print(f"[PROXY] Headers: {dict(request.headers)}")
    if request.get_json(silent=True):
        print(f"[PROXY] JSON Body: {request.get_json()}")
    
    # Forward the request to the personality test API
    try:
        if request.method == 'GET':
            resp = requests.get(url, params=request.args, timeout=10)
        elif request.method == 'POST':
            resp = requests.post(url, json=request.get_json(silent=True), timeout=10)
        elif request.method == 'PUT':
            resp = requests.put(url, json=request.get_json(silent=True), timeout=10)
        elif request.method == 'DELETE':
            resp = requests.delete(url, timeout=10)
        else:
            return jsonify({"error": "Method not allowed"}), 405
        
        print(f"[PROXY] Response status: {resp.status_code}")
        print(f"[PROXY] Response headers: {dict(resp.headers)}")
    except requests.exceptions.RequestException as e:
        print(f"[PROXY] Error forwarding request to {url}: {str(e)}")
        return jsonify({"error": f"API proxy error: {str(e)}"}), 500
    
    # Handle the API response
    try:
        # CORS başlıklarını elle ekle - Flask proxy'den yapılan isteklerin CORS sorunlarını önlemek için
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept'
        }
        
        try:
            # Önce Content-Type başlığını kontrol edelim
            content_type = resp.headers.get('Content-Type', '')
            print(f"[PROXY] Response content type: {content_type}")
            
            # JSON yanıtları için
            if 'application/json' in content_type:
                try:
                    response_data = resp.json()
                    print(f"[PROXY] Successfully parsed JSON response: {response_data}")
                    
                    # Eğer sonuçlar endpoint'i ise kullanıcı profilini güncelle
                    if subpath.endswith("/results") and request.method == 'GET' and 'user_id' in session:
                        try:
                            user = db.session.get(User, session['user_id'])
                            if user and 'top_coalition' in response_data:
                                # Kişilik tipini kullanıcı profiline kaydet
                                personality_type = response_data.get('top_coalition', 'Unknown Type')
                                user.personality_type = personality_type
                                user.progress = min(user.progress + 50, 100)
                                db.session.commit()
                                print(f"[PROXY] Updated user profile with coalition: {personality_type}")
                        except Exception as e:
                            print(f"[PROXY] Error updating user profile: {str(e)}")
                            import traceback
                            traceback.print_exc()
                    
                    # JSON yanıtı flask.jsonify yerine manuel JSON yanıtı olarak döndür
                    # Bu çift kodlamayı önler
                    response = Response(
                        json.dumps(response_data),
                        status=resp.status_code,
                        mimetype='application/json'
                    )
                    
                    # CORS başlıklarını ekleyelim
                    for key, value in headers.items():
                        response.headers[key] = value
                except ValueError as e:
                    # JSON parse hatası - içerik yanlış formatlanmış olabilir
                    print(f"[PROXY] Error parsing JSON: {e}")
                    response = Response(
                        resp.content, 
                        status=resp.status_code,
                        content_type=content_type
                    )
                    
                    # CORS başlıklarını ekleyelim
                    for key, value in headers.items():
                        response.headers[key] = value
            else:
                # JSON olmayan içerik için (HTML, text vs)
                print(f"[PROXY] Non-JSON response, passing through as is")
                response = Response(
                    resp.content,
                    status=resp.status_code,
                    content_type=content_type
                )
                
                # CORS başlıklarını ekleyelim
                for key, value in headers.items():
                    response.headers[key] = value
            
        except ValueError as e:
            # JSON olmayan yanıtı işle
            print(f"[PROXY] Response is not JSON: {str(e)}. Content: {resp.text[:200]}...")
            response = Response(resp.content, resp.status_code, content_type=resp.headers.get('Content-Type', 'text/plain'))
            
            # Add CORS headers to the non-JSON response
            for key, value in headers.items():
                response.headers[key] = value
                
            return response
            
    except Exception as e:
        # Genel hata durumu
        print(f"[PROXY] Error processing API response: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Error processing API response: {str(e)}"}), 500

def register_with_app(app):
    """
    Register the personality_bridge blueprint with the provided Flask app.
    This function allows for the bridge to be connected to the main app
    without modifying either the original app.py or personalitytest.py files.
    
    Args:
        app: The Flask application instance to register the blueprint with
    """
    app.register_blueprint(personality_bridge)
    
    # FastAPI artık main.py tarafından başlatılıyor
    print("[BRIDGE] Personality bridge routes registered with the Flask app")
    print("[BRIDGE] Proxy endpoint: /api/test/<path:subpath> -> http://127.0.0.1:8003/<subpath>")
    print("[BRIDGE] Frontend should now use the proxy endpoint /api/test/ instead of directly accessing the FastAPI server")