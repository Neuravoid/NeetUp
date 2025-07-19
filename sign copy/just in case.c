/* 

import os
from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import re

# --- INITIALIZE FLASK APP & DATABASE ---
app = Flask(__name__, template_folder='templates')
CORS(app) 

# Configure the database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- UPDATED USER MODEL ---
# The User model now includes fields for the security question and the hashed answer.
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    # --- NEW FIELDS ADDED ---
    security_question = db.Column(db.String(256), nullable=False)
    security_answer_hash = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# --- ROUTES TO SERVE HTML PAGES ---
@app.route('/')
def index():
    return redirect(url_for('signup_page'))

@app.route('/signup-page')
def signup_page():
    return render_template('signUp.html')

@app.route('/signin-page')
def signin_page():
    return render_template('signIn.html')

# --- UPDATED SIGNUP API ENDPOINT ---
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    """Handles user registration, now including security question and answer."""
    try:
        data = request.get_json()
        # --- FIXED: Add check for empty or invalid JSON request body ---
        if not data:
            return jsonify({'message': 'Invalid request. Please send a valid JSON body.'}), 400

        full_name = data.get('fullName')
        email = data.get('email')
        username = data.get('username')
        password = data.get('password')
        confirm_password = data.get('confirmPassword')
        security_question = data.get('securityQuestion')
        security_answer = data.get('securityAnswer')

        # --- UPDATED INPUT VALIDATION ---
        errors = []
        if not all([full_name, email, username, password, confirm_password, security_question, security_answer]):
            errors.append('All fields, including security question and answer, are required.')
        
        valid_questions = ["pet_name", "mother_maiden_name", "first_school"]
        if security_question and security_question not in valid_questions:
            errors.append('Invalid security question selected. Please choose from the list.')

        if email and not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            errors.append('Please enter a valid email address.')
        if password and len(password) < 8:
            errors.append('Password must be at least 8 characters long.')
        if password != confirm_password:
            errors.append('Passwords do not match.')

        if errors:
            return jsonify({'message': ' '.join(errors)}), 400

        if User.query.filter((User.email == email) | (User.username == username)).first():
            return jsonify({'message': 'A user with this email or username already exists.'}), 409

        hashed_password = generate_password_hash(password)
        hashed_security_answer = generate_password_hash(security_answer)

        new_user = User(
            full_name=full_name,
            email=email,
            username=username,
            password_hash=hashed_password,
            security_question=security_question,
            security_answer_hash=hashed_security_answer
        )
        
        db.session.add(new_user)
        db.session.commit()

        return jsonify({'message': 'User created successfully!', 'userId': new_user.id}), 201

    # --- FIXED: Improved error handling to be more specific ---
    except Exception as e:
        # Log the full error to the console for debugging
        print(f"An error occurred during signup: {e}")
        # Return a more informative error message
        return jsonify({'message': f'An unexpected server error occurred. Please check the server logs.'}), 500

# --- SIGN-IN ENDPOINT (Unchanged) ---
@app.route('/api/auth/signin', methods=['POST'])
def signin():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid request. Please send a valid JSON body.'}), 400
        
    user = User.query.filter_by(username=data.get('username')).first()
    if user and check_password_hash(user.password_hash, data.get('password')):
        return jsonify({'message': 'Login successful!', 'userId': user.id}), 200
    return jsonify({'message': 'Invalid username or password.'}), 401

# --- MAIN EXECUTION BLOCK ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=3000)

# ==============================================================
# FILE: app.py
# DESCRIPTION:
# This is the main entry point for our Python/Flask application.
# It now includes the full "Sign In" logic.
# ==============================================================

import os
from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import re

# --- INITIALIZE FLASK APP & DATABASE ---
# When initializing Flask, it is automatically configured to look for HTML 
# files in a sub-folder named "templates".
app = Flask(__name__, template_folder='templates')
CORS(app) 

# Configure the database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- USER MODEL (Unchanged) ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    security_question = db.Column(db.String(256), nullable=False)
    security_answer_hash = db.Column(db.String(256), nullable=False)

# --- ROUTES TO SERVE HTML PAGES ---
@app.route('/')
def index():
    return redirect(url_for('signup_page'))

@app.route('/signup-page')
def signup_page():
    # Looks for a file named 'signUp.html' inside the 'templates' folder.
    return render_template('signUp.html')

@app.route('/signin-page')
def signin_page():
    # Looks for a file named 'signIn.html' inside the 'templates' folder.
    return render_template('signIn.html')

# --- FIXED: EXPLANATION FOR FORGOT PASSWORD ROUTE ---
# This route is triggered when a user navigates to /forgot-password-page.
# The `href` in your sign-in page's "Forgot Password?" link correctly points here.
@app.route('/forgot-password-page')
def forgot_password_page():
    # --- TEMPORARY DEBUGGING STEP ---
    return "<h1>Success! The forgot password route is working.</h1>"

# --- NEW: A SIMPLE HOME PAGE ROUTE FOR AFTER LOGIN ---
@app.route('/home')
def home():
    # In a real app, this would be a protected route.
    return "<h1>Welcome to the Home Page!</h1><p>You have successfully logged in.</p>"


# --- UPDATED SIGN-IN API ENDPOINT ---
@app.route('/api/auth/signin', methods=['POST'])
def signin():
    """Handles user login by verifying username and password."""
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'Invalid request. Please send a valid JSON body.'}), 400

        username = data.get('username')
        password = data.get('password')

        # 1. Input Validation
        if not username or not password:
            return jsonify({'message': 'Username and password are required.'}), 400

        # 2. Find the user in the database
        user = User.query.filter_by(username=username).first()

        # 3. Verify User and Password
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'message': 'Invalid username or password.'}), 401 # 401 Unauthorized

        # 4. Successful Login
        return jsonify({
            'message': 'Login successful!',
            'userId': user.id,
            'redirectUrl': '/home' # Tell the frontend where to go next
        }), 200

    except Exception as e:
        print(f"Error in /signin: {e}")
        return jsonify({'message': 'An unexpected server error occurred.'}), 500

# --- OTHER API ENDPOINTS (Unchanged) ---
# ... /api/auth/signup ...
# ... /api/auth/request-reset ...
# ... /api/auth/reset-password ...

# --- MAIN EXECUTION BLOCK ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=3000)

    # ==============================================================
# FILE: app.py
# DESCRIPTION:
# This is the main entry point for our Python/Flask application.
# It now includes the full "Forgot Password" flow.
# ==============================================================

import os
from flask import Flask, request, jsonify, render_template, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import re

# --- INITIALIZE FLASK APP & DATABASE ---
app = Flask(__name__, template_folder='templates')
CORS(app) 

# Configure the database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- USER MODEL (Unchanged from last version) ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    security_question = db.Column(db.String(256), nullable=False)
    security_answer_hash = db.Column(db.String(256), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

# --- ROUTES TO SERVE HTML PAGES ---
@app.route('/')
def index():
    return redirect(url_for('signup_page'))

@app.route('/signup-page')
def signup_page():
    return render_template('signUp.html')

@app.route('/signin-page')
def signin_page():
    return render_template('signIn.html')

# --- NEW: ROUTE FOR THE FORGOT PASSWORD PAGE ---
@app.route('/forgot-password-page')
def forgot_password_page():
    """Serves the forgot_password.html page."""
    return render_template('forgot_password.html')


# --- SIGNUP API ENDPOINT (Unchanged) ---
@app.route('/api/auth/signup', methods=['POST'])
def signup():
    # This function remains the same as the previous version
    data = request.get_json()
    # ... (validation and user creation logic) ...
    return jsonify({'message': 'User created successfully!'}), 201

# --- SIGN-IN API ENDPOINT (Unchanged) ---
@app.route('/api/auth/signin', methods=['POST'])
def signin():
    # This function remains the same
    data = request.get_json()
    # ... (login logic) ...
    return jsonify({'message': 'Login successful!'}), 200


# --- NEW: FORGOT PASSWORD API - STEP 1 ---
@app.route('/api/auth/request-reset', methods=['POST'])
def request_reset():
    """
    Finds a user by username and email. If found, returns their security question.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'Invalid request.'}), 400
        
        username = data.get('username')
        email = data.get('email')

        if not username or not email:
            return jsonify({'message': 'Username and email are required.'}), 400

        # Find the user that matches BOTH username and email
        user = User.query.filter_by(username=username, email=email).first()

        if user:
            # Return the user's chosen security question
            return jsonify({'security_question': user.security_question}), 200
        else:
            # User not found
            return jsonify({'message': 'No account found with that username and email combination.'}), 404

    except Exception as e:
        print(f"Error in /request-reset: {e}")
        return jsonify({'message': 'An unexpected server error occurred.'}), 500


# --- NEW: FORGOT PASSWORD API - STEP 2 ---
@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    """
    Verifies the security answer and resets the user's password.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({'message': 'Invalid request.'}), 400

        username = data.get('username')
        email = data.get('email')
        security_answer = data.get('securityAnswer')
        new_password = data.get('newPassword')
        confirm_new_password = data.get('confirmNewPassword')

        # Validate all required fields
        if not all([username, email, security_answer, new_password, confirm_new_password]):
            return jsonify({'message': 'All fields are required to reset the password.'}), 400

        # Validate new password
        if new_password != confirm_new_password:
            return jsonify({'message': 'New passwords do not match.'}), 400
        if len(new_password) < 8:
            return jsonify({'message': 'New password must be at least 8 characters long.'}), 400

        # Find the user again
        user = User.query.filter_by(username=username, email=email).first()

        if not user:
            return jsonify({'message': 'User account not found.'}), 404

        # --- CRUCIAL: Verify the security answer hash ---
        if check_password_hash(user.security_answer_hash, security_answer):
            # If the answer is correct, hash the new password and update the user
            user.password_hash = generate_password_hash(new_password)
            db.session.commit()
            return jsonify({'message': 'Password has been reset successfully!'}), 200
        else:
            # If the answer is incorrect
            return jsonify({'message': 'The security answer is incorrect.'}), 401 # Unauthorized

    except Exception as e:
        print(f"Error in /reset-password: {e}")
        return jsonify({'message': 'An unexpected server error occurred.'}), 500


# --- MAIN EXECUTION BLOCK ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=3000)



# ==============================================================
# FILE: app.py
# DESCRIPTION:
# The complete backend application, now with an updated User model
# to support a fully dynamic dashboard.
# ==============================================================

import os
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import re

# --- 1. INITIALIZE FLASK APP & DATABASE ---
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app) 

app.secret_key = 'your_super_secret_key_for_neetup'

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- 2. UPDATED DATABASE MODEL ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    security_question = db.Column(db.String(256), nullable=False)
    security_answer_hash = db.Column(db.String(256), nullable=False)
    # --- DYNAMIC DASHBOARD FIELDS ---
    progress = db.Column(db.Integer, nullable=False, default=0)
    personality_test_completed = db.Column(db.Boolean, nullable=False, default=False)
    # --- NEW: Field to store the personality test result ---
    personality_type = db.Column(db.String(50), nullable=True, default=None)


# --- 3. ROUTES TO SERVE HTML PAGES ---
@app.route('/')
def index():
    return redirect(url_for('signin_page'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('signin_page'))
    
    user = db.session.get(User, session['user_id'])
    
    if not user:
        session.clear()
        return redirect(url_for('signin_page'))

    # The entire user object, including progress and personality info,
    # is passed to the dashboard template.
    return render_template('dashboard.html', user=user)

# (Other page-serving routes)
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('signin_page'))

@app.route('/signup-page')
def signup_page(): return render_template('signUp.html')

@app.route('/signin-page')
def signin_page(): return render_template('signIn.html')

@app.route('/forgot-password-page')
def forgot_password_page(): return render_template('forgot_password.html')

# --- PLACEHOLDER ROUTES FOR SIDEBAR LINKS ---
@app.route('/courses')
def courses(): return "<h1>My Courses</h1><p>This page is working.</p>"

@app.route('/progress')
def progress(): return "<h1>My Progress</h1><p>This page is working.</p>"

@app.route('/career-goals')
def career_goals(): return "<h1>My Career Goals</h1><p>This page is working.</p>"

@app.route('/personality-type')
def personality_type(): 
    # This now renders a simple placeholder page for the test.
    return render_template('personality_test.html')

@app.route('/portfolio')
def portfolio(): return "<h1>My Portfolio</h1><p>This page is working.</p>"

@app.route('/job-opportunities')
def job_opportunities(): return "<h1>Job Opportunities</h1><p>This page is working.</p>"

@app.route('/entrepreneurship-coach')
def entrepreneurship_coach(): return "<h1>Entrepreneurship Coach</h1><p>This page is working.</p>"

@app.route('/settings')
def settings(): return "<h1>Settings</h1><p>This page is working.</p>"

# --- TEMPORARY ROUTE FOR TESTING ---
@app.route('/toggle-test-status')
def toggle_test_status():
    if 'user_id' not in session:
        return redirect(url_for('signin_page'))
    
    user = db.session.get(User, session['user_id'])
    if user:
        # Flip the completion status
        user.personality_test_completed = not user.personality_test_completed
        
        # Update progress and personality type based on new status
        if user.personality_test_completed:
            user.progress = 75
            user.personality_type = "Advocate (INFJ)" # Assign a mock result
        else:
            user.progress = 25
            user.personality_type = None # Clear the result
            
        db.session.commit()
    
    return redirect(url_for('dashboard'))


# --- 4. API ENDPOINTS FOR AUTHENTICATION ---
@app.route('/api/auth/signin', methods=['POST'])
def signin():
    data = request.get_json()
    if not data: return jsonify({'message': 'Invalid request.'}), 400
    user = User.query.filter_by(username=data.get('username')).first()
    if not user or not check_password_hash(user.password_hash, data.get('password')):
        return jsonify({'message': 'Invalid username or password.'}), 401
    session['user_id'] = user.id
    return jsonify({'message': 'Login successful!', 'redirectUrl': '/dashboard'}), 200

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data: return jsonify({'message': 'Invalid request.'}), 400
    hashed_password = generate_password_hash(data.get('password'))
    hashed_security_answer = generate_password_hash(data.get('securityAnswer'))
    # New users will automatically get progress=0, test_completed=False, and type=None
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


# --- 5. MAIN EXECUTION BLOCK ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=3000)






    I already have a fully working personality test feature implemented as its own `.py`, `.html`, and `.md` files.  

These files already handle the test logic, rendering, and scoring properly.



What I want you to do is to **integrate the existing personality test into my main application (`app.py`)**, without making any changes to the existing personality test files.



Here are the specific requirements:

  

✅ Do NOT modify the personality test’s `.py`, `.html`, or `.md` files.  

✅ In `app.py`, import or call the existing personality test code when the user clicks the “Take Personality Test” link on the dashboard.  

✅ When the user submits their test results through the existing personality test code, save the results into the `personality_test` field of the logged-in user’s record in the `users.db`.  

✅ After completing the test, redirect the user back to the dashboard, where the test results are now displayed instead of the “Take Personality Test” link.  

✅ Make sure the integration works seamlessly — the personality test page still uses its own template and logic as it already does.



Also:

✅ Clearly explain where to place the personality test files in the project structure (e.g., templates/, static/, backend/).  

✅ Show how to modify `app.py` (and only `app.py`) so that the dashboard calls the personality test correctly and handles the results properly.  

✅ Make sure the `app.py` code includes the necessary routes, session/user handling, and database update logic.  

✅ Keep the explanation and code beginner-friendly and well-commented.



Summary:  

You must integrate the personality test into `app.py`, so that:

- the dashboard shows a “Take Personality Test” link if no result exists,

- clicking it runs the existing personality test code,

- the test results are saved to `users.db`,

- the dashboard then displays the saved results,

- and the personality test files remain unchanged.



Thank you!

app.py: # ==============================================================

# FILE: app.py

# DESCRIPTION:

# The complete backend, now with integrated personality test logic.

# ==============================================================



import os

import json

from flask import Flask, request, jsonify, render_template, redirect, url_for, session

from flask_sqlalchemy import SQLAlchemy

from werkzeug.security import generate_password_hash, check_password_hash

from flask_cors import CORS

import re



# --- 1. INITIALIZE FLASK APP & DATABASE ---

app = Flask(__name__, template_folder='templates', static_folder='static')

CORS(app)



app.secret_key = 'your_super_secret_key_for_neetup'



basedir = os.path.abspath(os.path.dirname(__file__))

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)



# --- 2. DATABASE MODEL ---

class User(db.Model):

id = db.Column(db.Integer, primary_key=True)

full_name = db.Column(db.String(100), nullable=False)

email = db.Column(db.String(120), unique=True, nullable=False)

username = db.Column(db.String(80), unique=True, nullable=False)

password_hash = db.Column(db.String(256), nullable=False)

security_question = db.Column(db.String(256), nullable=False)

security_answer_hash = db.Column(db.String(256), nullable=False)

progress = db.Column(db.Integer, nullable=False, default=0)

# UPDATED: Changed field name for clarity

personality_type = db.Column(db.String(100), nullable=True, default=None)



# This property checks if the personality_type field has a value.

@property

def personality_test_completed(self):

return self.personality_type is not None



# --- 3. ROUTES TO SERVE HTML PAGES ---

@app.route('/')

def index():

return redirect(url_for('signin_page'))



@app.route('/dashboard')

def dashboard():

if 'user_id' not in session:

return redirect(url_for('signin_page'))


user = db.session.get(User, session['user_id'])

if not user:

session.clear()

return redirect(url_for('signin_page'))


return render_template('dashboard.html', user=user)



@app.route('/personality-test')

def personality_test():

"""Serves the personality test page."""

if 'user_id' not in session:

return redirect(url_for('signin_page'))

# You can pass questions to the template if needed, or load them via JS

return render_template('personality_test.html')



# (Other page-serving routes)

@app.route('/logout')

def logout():

session.clear()

return redirect(url_for('signin_page'))



@app.route('/signup-page')

def signup_page(): return render_template('signUp.html')



@app.route('/signin-page')

def signin_page(): return render_template('signIn.html')



# --- FIXED: ADDED ALL MISSING PLACEHOLDER ROUTES ---

@app.route('/courses')

def courses():

return "<h1>My Courses</h1><p>This page is working.</p>"



@app.route('/progress')

def progress():

return "<h1>My Progress</h1><p>This page is working.</p>"



@app.route('/career-goals')

def career_goals():

return "<h1>My Career Goals</h1><p>This page is working.</p>"



@app.route('/personality-type')

def personality_type():

return "<h1>My Personality Type</h1><p>This page is working.</p>"



@app.route('/portfolio')

def portfolio():

return "<h1>My Portfolio</h1><p>This page is working.</p>"



@app.route('/job-opportunities')

def job_opportunities():

return "<h1>Job Opportunities</h1><p>This page is working.</p>"



@app.route('/entrepreneurship-coach')

def entrepreneurship_coach():

return "<h1>Entrepreneurship Coach</h1><p>This page is working.</p>"



@app.route('/settings')

def settings():

return "<h1>Settings</h1><p>This page is working.</p>"





# --- 4. API ENDPOINTS ---

@app.route('/api/submit-personality-test', methods=['POST'])

def submit_personality_test():

"""Receives test answers, calculates result, and saves to the user's profile."""

if 'user_id' not in session:

return jsonify({'message': 'Authentication required.'}), 401



data = request.get_json()

if not data or 'answers' not in data:

return jsonify({'message': 'Invalid submission. Missing answers.'}), 400


# Mock result for demonstration:

mock_result = "Advocate (INFJ)"


user = db.session.get(User, session['user_id'])

if user:

user.personality_type = mock_result

user.progress = user.progress + 25 if user.progress <= 75 else 100

db.session.commit()


return jsonify({

'message': 'Test completed successfully!',

'redirectUrl': '/dashboard'

}), 200


return jsonify({'message': 'User not found.'}), 404



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





# --- 5. MAIN EXECUTION BLOCK ---

if __name__ == '__main__':

with app.app_context():

db.create_all()

app.run(debug=True, port=3000)

personalitytest.py: # main.py

from fastapi import FastAPI, HTTPException, Request, Response, Depends

from fastapi.middleware.cors import CORSMiddleware

from fastapi.staticfiles import StaticFiles

from fastapi.responses import FileResponse

from pydantic import BaseModel, field_validator, EmailStr, Field

from starlette.middleware.base import BaseHTTPMiddleware

from typing import List, Dict, Any, Optional, Callable

import random

import os

import math

import json

import logging

import google.generativeai as genai

import requests

from datetime import datetime

from dotenv import load_dotenv

from email_validator import validate_email, EmailNotValidError



# SQLAlchemy imports

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, func

from sqlalchemy.ext.declarative import declarative_base

from sqlalchemy.orm import sessionmaker, Session

import uuid



# spaCy'yi koşullu olarak import et

try:

    import spacy

except ImportError:

    logging.warning("spaCy modülü yüklenemedi, NLP özellikleri devre dışı kalacak")

    spacy = None



# Load environment variables (for API keys)

load_dotenv()



# Logger configuration

logging.basicConfig(

    level=logging.INFO,

    format='%(asctime)s - %(levelname)s - %(message)s',

)

logger = logging.getLogger("apoa_api")



# --- NLP Modeli Yükle ---

try:

    import spacy

    try:

        # Önce Türkçe modeli yüklemeyi dene

        nlp = spacy.load("tr_core_news_sm")

        logger.info("spaCy Türkçe dil modeli başarıyla yüklendi.")

    except OSError:

        # Türkçe model yoksa İngilizce modeli dene

        try:

            logger.warning("Türkçe dil modeli bulunamadı, İngilizce model deneniyor...")

            nlp = spacy.load("en_core_web_sm")

            logger.info("spaCy İngilizce dil modeli yüklendi.")

        except OSError:

            # Boş bir model oluştur

            logger.warning("İngilizce dil modeli de bulunamadı, boş model oluşturuluyor.")

            nlp = spacy.blank("tr")

            logger.info("Boş Türkçe dil modeli oluşturuldu.")

except ImportError as e:

    logger.error(f"spaCy kütüphanesi yüklenemedi: {str(e)}")

    nlp = None

except Exception as e:

    logger.error(f"NLP modeli yüklenirken beklenmeyen hata: {str(e)}")

    nlp = None

    

# --- LLM API Entegrasyonu (GEMINI VERSİYONU) ---

def call_llm(user_open_text, initial_scores=None):

    """

    Kullanıcının açık uçlu yanıtlarını analiz etmek için Google Gemini API'sini çağırır.

    

    Args:

        user_open_text (str): Kullanıcının açık uçlu yanıtları

        initial_scores (dict): Büyük Beş kişilik faktörlerinin başlangıç skorları

        

    Returns:

        dict: Gemini'den gelen analiz sonuçları veya None eğer API çağrısı başarısız olursa

    """

    # 1. API Anahtarını .env dosyasından yükle

    api_key = os.getenv("GOOGLE_API_KEY")

    if not api_key:

        logger.warning("GOOGLE_API_KEY bulunamadı, basic NLP analizi kullanılacak.")

        return None

    

    # Google AI kütüphanesini yapılandır

    try:

        genai.configure(api_key=api_key)

    except Exception as e:

        logger.error(f"Google Gemini API anahtarı yapılandırılamadı: {e}")

        return None



    # 2. Boş metin kontrolü

    if not user_open_text or len(user_open_text.strip()) < 10:

        logger.warning("Kullanıcı açık uçlu yanıtları çok kısa veya boş. LLM analizi atlanıyor.")

        return None

    

    # 3. Prompt'u hazırla (OpenAI ile aynı, değişiklik yok)

    scores_str = ""

    if initial_scores:

        scores_str = "\n\nKullanıcının test sorularından hesaplanan mevcut Büyük Beş kişilik faktörü skorları (1-5 arası):\n"

        for trait, score in initial_scores.items():

            scores_str += f"- {trait}: {score}\n"

    

    # Not: Gemini için prompt'u değiştirmeye gerek yok. Aynı prompt harika çalışacaktır.

    prompt = f"""

    ## 🎯 AI Prompt (for Personality Test with Courses, AI-based Comment, and Open-ended Answer Analysis)

    > You are assisting a personality test API that works in **Turkish**.

    > The API already calculates Big Five personality scores (Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism) from multiple-choice questions.

    >

    > Now you also receive a **user's open-ended answers and interests text** in Turkish.

    >

    > Based on all of this input, your task is to analyze the text and produce:

    >

    > ---

    >

    > 1️⃣ **Extracted keywords**: important nouns and themes that appear in the open-ended text (Turkish).

    >

    > 2️⃣ **Updated Big Five scores**: if the open-ended text gives hints about personality traits, adjust the initial scores accordingly.

    >

    > 3️⃣ **Best-matching 2 personality types** ("coalitions") from the predefined list (provided by the API; names will be in Turkish).

    >

    > 4️⃣ **An AI-generated personality comment (in Turkish)**:

    > Write 3–5 sentences that summarize the person's character, talents, and tendencies, explicitly referencing the open-ended answers where possible.

    >

    > 5️⃣ **Expanded course recommendations**:

    > Suggest **at least 5 courses** (with titles in Turkish) that fit the user's personality profile and interests.

    > If possible, include diverse domains such as creative, technical, leadership, and self-development.

    >

    > 6️⃣ **Career recommendations**:

    > Suggest **3–5 careers** (in Turkish) that fit the person's profile.

    >

    > ---

    >

    > Please return the result in this JSON format:

    >

    > ```json

    > {{

    >   "nlp_keywords": ["yaratıcılık", "sanat", "liderlik", "..."],

    >   "updated_scores": {{

    >     "Openness": 4.8,

    >     "Conscientiousness": 3.2,

    >     "Extraversion": 4.5,

    >     "Agreeableness": 4.0,

    >     "Neuroticism": 2.1

    >   }},

    >   "top_coalitions": [

    >     {{

    >       "name": "Yenilikçi Kaşif",

    >       "reason": "Yaratıcılığı ve yeni fikirlere olan ilgisi nedeniyle."

    >     }},

    >     {{

    >       "name": "Sosyal Lider",

    >       "reason": "İnsanlarla iletişim kurmayı ve liderlik etmeyi sevdiği için."

    >     }}

    >   ],

    >   "personality_comment": "Açık uçlu cevaplarında belirttiğin yaratıcı projeler ve liderlik isteğin, seni hem yenilikçi hem de sosyal bir kişi olarak gösteriyor. İnsanlarla kolayca iletişim kurabiliyor ve yeni fikirler geliştirmekten keyif alıyorsun. Zaman zaman planlama konusunda zorlanabilirsin ama motivasyonun yüksek.",

    >   "career_recommendations": [

    >     "Ürün Tasarımcısı",

    >     "Reklam Yaratıcısı",

    >     "Toplum Lideri"

    >   ],

    >   "course_recommendations": [

    >     "Yaratıcı Düşünce Teknikleri",

    >     "Liderlik ve Etkin İletişim",

    >     "Girişimcilik 101",

    >     "Mindfulness ve Stres Yönetimi",

    >     "Veri Analizi Temelleri"

    >   ]

    > }}

    > ```

    >

    > Notes:

    >

    > * All output must be in Turkish.

    > * Personality comment should feel personal, warm, and based on the user's own words.

    > * Make sure the course list includes at least 5 distinct, meaningful suggestions.

    > * Make the career list relevant to both the test results and the open-ended answers.

    

    {scores_str}

    **Kullanıcının açık uçlu yanıtları:**

    {user_open_text}

    """

    

    # 4. Gemini modelini yapılandır ve API'yi çağır

    try:

        logger.info("Google Gemini API'si çağrılıyor...")

        

        # JSON çıktısı almak için generation_config'i ayarla

        generation_config = {

            "response_mime_type": "application/json",

        }

        

        # Sistem talimatını ve modeli ayarla. 

        # 'gemini-1.5-flash-latest' daha hızlı ve ucuz bir alternatiftir.

        model = genai.GenerativeModel(

            model_name="gemini-1.5-pro-latest",

            generation_config=generation_config,

            system_instruction="Sen bir doğal dil işleme ve psikoloji uzmanısın."

        )

        

        response = model.generate_content(prompt)

        

        # Gemini'den gelen yanıtı parse et

        parsed_result = json.loads(response.text)

        

        # Gerekli alanların varlığını kontrol et

        required_fields = ["updated_scores", "top_coalitions", "personality_comment"]

        for field in required_fields:

            if field not in parsed_result or not parsed_result[field]:

                logger.warning(f"Gemini yanıtında '{field}' alanı eksik veya boş.")

        

        logger.info("Google Gemini API başarıyla yanıt verdi")

        return parsed_result

    

    except json.JSONDecodeError as e:

        logger.error(f"Gemini API yanıtı JSON formatında değil: {str(e)}")

        # Ham yanıtı loglayarak hatayı anla

        logger.error(f"Alınan Ham Yanıt: {response.text}")

        return None

    except Exception as e:

        # Gemini kütüphanesinden gelebilecek diğer tüm hataları yakala

        logger.error(f"Gemini API çağrısında beklenmeyen hata: {str(e)}")

        return None



# --- PYDANTIC MODELS ---

class Answer(BaseModel):

    question_id: str

    answer_value: int



class Demographics(BaseModel):

    birth_year: int

    email: str

    full_name: str = ""  # frontend sends full_name instead of name

    country: str = ""   # frontend sends country instead of city

    education: str = "" # frontend sends education instead of education_level

    university_major: str = "" # frontend sends university_major instead of university+major

    interests: str = ""

    open_ended_1: str = "" # frontend sends additional fields

    open_ended_2: str = ""

    

    # Map frontend fields to backend fields

    @property

    def name(self) -> str:

        return self.full_name

        

    @property

    def gender(self) -> str:

        return "Belirtilmemiş"  # Default as not specified, since frontend doesn't send gender

        

    @property

    def education_level(self) -> str:

        return self.education

        

    @property

    def city(self) -> str:

        return self.country

        

    @property

    def university(self) -> str:

        if " " in self.university_major:

            return self.university_major.split(" ")[0]

        return ""

        

    @property

    def major(self) -> str:

        if " " in self.university_major:

            return " ".join(self.university_major.split(" ")[1:])

        return self.university_major

        

    @property

    def goals(self) -> str:

        return self.open_ended_1

    

    @field_validator('birth_year')

    def validate_birth_year(cls, v):

        current_year = datetime.now().year

        if v < current_year - 100 or v > current_year - 15:

            raise ValueError('Geçerli bir doğum yılı giriniz (son 100 yıl içinde ve 15 yaşından büyük)')

        return v

        

    @field_validator('email')

    def validate_email(cls, v):

        try:

            validate_email(v).email

        except EmailNotValidError:

            raise ValueError('Geçerli bir e-posta adresi giriniz')

        return v



class CompetencyAnswer(BaseModel):

    question_id: str

    answer_value: int



class CompetencyQuestion(BaseModel):

    id: int

    text: str

    category: str



class AssessmentReport(BaseModel):

    personality_scores: Dict[str, float]

    top_coalitions: List[str]

    personality_comment: str

    career_recommendations: List[str]

    course_recommendations: List[str]



# --- Request Logging Middleware ---

class RequestLoggingMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next: Callable) -> Response:

        logger.info(f"Request: {request.method} {request.url.path}")

        try:

            response = await call_next(request)

            logger.info(f"Response status: {response.status_code}")

            return response

        except Exception as e:

            logger.error(f"Error processing request: {str(e)}")

            raise



# --- FastAPI Uygulaması ---

app = FastAPI(title="NeetUp Akıllı Kişilik Testi API", version="7.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.add_middleware(RequestLoggingMiddleware)



# --- Database Setup ---

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, 'test_results.db')}"

engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()



# Define SQLAlchemy ORM model for test results

class TestResult(Base):

    __tablename__ = "test_results"

    

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))

    # JSON sütunlarını Text olarak saklayıp manuel serialize edeceğiz

    answers = Column(Text, nullable=True)

    demographics = Column(Text, nullable=True)

    competency_answers = Column(Text, nullable=True)

    top_coalition = Column(String, nullable=True)

    final_report = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)

    

    # JSON serileştirme ve deserileştirme özellikleri

    @property

    def answers_json(self):

        if not self.answers:

            return None

        try:

            return json.loads(self.answers)

        except json.JSONDecodeError:

            return None

    

    @answers_json.setter

    def answers_json(self, value):

        if value is None:

            self.answers = None

        else:

            self.answers = json.dumps(value)

    

    @property

    def demographics_json(self):

        if not self.demographics:

            return None

        try:

            return json.loads(self.demographics)

        except json.JSONDecodeError:

            return None

    

    @demographics_json.setter

    def demographics_json(self, value):

        if value is None:

            self.demographics = None

        else:

            self.demographics = json.dumps(value)

    

    @property

    def competency_answers_json(self):

        if not self.competency_answers:

            return None

        try:

            return json.loads(self.competency_answers)

        except json.JSONDecodeError:

            return None

    

    @competency_answers_json.setter

    def competency_answers_json(self, value):

        if value is None:

            self.competency_answers = None

        else:

            self.competency_answers = json.dumps(value)

    

    @property

    def final_report_json(self):

        if not self.final_report:

            return None

        try:

            return json.loads(self.final_report)

        except json.JSONDecodeError:

            return None

    

    @final_report_json.setter

    def final_report_json(self, value):

        if value is None:

            self.final_report = None

        else:

            self.final_report = json.dumps(value)

    

    def to_dict(self):

        return {

            "id": self.id,

            "answers": self.answers,

            "demographics": self.demographics,

            "competency_answers": self.competency_answers,

            "top_coalition": self.top_coalition,

            "final_report": self.final_report,

            "created_at": self.created_at

        }



# Create all tables in the database

Base.metadata.create_all(bind=engine)



# Dependency to get the database session

def get_db():

    db = SessionLocal()

    try:

        yield db

    finally:

        db.close()

        

# --- Veritabanı ve Sorular ---

# --- 20 Kişilik Soruları ---

PERSONALITY_QUESTIONS = [

    {"id": "P1", "text": "İşlerimi titizlikle ve düzenli bir şekilde yaparım.", "trait": "Conscientiousness"},

    {"id": "P2", "text": "Plan yapmadan çalışmayı tercih ederim.", "trait": "Conscientiousness", "reverse": True},

    {"id": "P3", "text": "Sosyal ortamlarda rahat hissederim.", "trait": "Extraversion"},

    {"id": "P4", "text": "Yeni insanlarla tanışmak beni heyecanlandırır.", "trait": "Extraversion"},

    {"id": "P5", "text": "Stresli durumlarda genelde sakin kalırım.", "trait": "Neuroticism", "reverse": True},

    {"id": "P6", "text": "Küçük şeyler için fazla endişelenirim.", "trait": "Neuroticism"},

    {"id": "P7", "text": "Çalışmalarımda yaratıcı çözümler bulmayı severim.", "trait": "Openness"},

    {"id": "P8", "text": "Farklı bakış açılarını anlamaya çalışırım.", "trait": "Openness"},

    {"id": "P9", "text": "Başkalarının ihtiyaçlarını önceliklendirim.", "trait": "Agreeableness"},

    {"id": "P10", "text": "Çatışmalarda uzlaşmacı olmaya çalışırım.", "trait": "Agreeableness"},

    {"id": "P11", "text": "Görevlerimi zamanında tamamlarım.", "trait": "Conscientiousness"},

    {"id": "P12", "text": "Sık sık ruh halim değişir.", "trait": "Neuroticism"},

    {"id": "P13", "text": "Topluluk içinde konuşma yapmaktan keyif alırım.", "trait": "Extraversion"},

    {"id": "P14", "text": "Soyut ve teorik konuları düşünmek ilgimi çeker.", "trait": "Openness"},

    {"id": "P15", "text": "İnsanların iyi niyetli olduğuna inanırım.", "trait": "Agreeableness"},

    {"id": "P16", "text": "Kendimi ifade etmekten çekinirim.", "trait": "Extraversion", "reverse": True},

    {"id": "P17", "text": "Bir işe başladığımda sonuna kadar devam ederim.", "trait": "Conscientiousness"},

    {"id": "P18", "text": "Eleştiriye karşı hassasım.", "trait": "Neuroticism"},

    {"id": "P19", "text": "Çalışma alanımı düzenli tutarım.", "trait": "Conscientiousness"},

    {"id": "P20", "text": "Başkalarına yardım etmek bana mutluluk verir.", "trait": "Agreeableness"}

]



# --- 15 İlgi Alanı Soruları ---

INTEREST_QUESTIONS = [

    {"id": "I1", "text": "Sanatla ilgilenmeyi severim.", "category": "Yaratıcılık"},

    {"id": "I2", "text": "Spor yapmaktan keyif alırım.", "category": "Fiziksel"},

    {"id": "I3", "text": "Doğa yürüyüşleri ve kamp ilgimi çeker.", "category": "Doğa"},

    {"id": "I4", "text": "Teknoloji ve yenilikler ilgimi çeker.", "category": "Teknoloji"},

    {"id": "I5", "text": "Yaratıcı yazılar, hikâyeler yazmak hoşuma gider.", "category": "Yaratıcılık"},

    {"id": "I6", "text": "Müzik dinlemek ya da çalmak bana iyi gelir.", "category": "Sanat"},

    {"id": "I7", "text": "Toplum hizmeti veya gönüllülük çalışmalarına katılmak isterim.", "category": "Sosyal"},

    {"id": "I8", "text": "Bilimsel makaleler okumaktan zevk alırım.", "category": "Bilimsel"},

    {"id": "I9", "text": "Seyahat etmekten hoşlanırım.", "category": "Macera"},

    {"id": "I10", "text": "Fotoğraf çekmek ve düzenlemek hoşuma gider.", "category": "Yaratıcılık"},

    {"id": "I11", "text": "İnsanlarla sohbet etmek ve yeni dostluklar kurmak ilgimi çeker.", "category": "Sosyal"},

    {"id": "I12", "text": "El işleri veya zanaat yapmak bana huzur verir.", "category": "Yaratıcılık"},

    {"id": "I13", "text": "Oyunlar (masa oyunları, bilgisayar oyunları) oynamayı severim.", "category": "Eğlence"},

    {"id": "I14", "text": "Farklı kültürleri tanımak ilgimi çeker.", "category": "Sosyal"},

    {"id": "I15", "text": "Liderlik gerektiren görevlerde bulunmak hoşuma gider.", "category": "Liderlik"}

]



# --- Tüm soruları birleştir ---

ALL_QUESTIONS_LIST = PERSONALITY_QUESTIONS + INTEREST_QUESTIONS



QUESTIONS_PER_PAGE = 5

QUESTIONS_DB = { i + 1: ALL_QUESTIONS_LIST[i * QUESTIONS_PER_PAGE:(i + 1) * QUESTIONS_PER_PAGE] for i in range((len(ALL_QUESTIONS_LIST) + QUESTIONS_PER_PAGE - 1) // QUESTIONS_PER_PAGE) }

# Note: RESULTS_STORAGE dictionary is replaced with SQLite database



# --- 10 Koalisyon Tipi Veri Tabanı (Genişletilmiş) ---

COALITIONS = {

    "Yenilikçi Kaşif": {

        "def": "Yaratıcı, meraklı ve yeni fikirleri keşfetmeyi seven bir yapıya sahipsin.", 

        "meslekler": ["Ürün Tasarımcısı", "Girişimci", "Reklam Yaratıcısı", "UX/UI Designer"], 

        "kurslar": [{"title": "Yaratıcı Düşünce Teknikleri"}, {"title": "Girişimcilik 101"}, {"title": "UX/UI Temelleri"}], 

        "keywords": ["yaratıcılık", "tasarım", "girişimcilik", "yenilik", "fikir", "keşfetmek"], 

        "profile": {"Openness": 5, "Conscientiousness": 3, "Extraversion": 4},

        "competency_questions": [

            {"id": "YK1", "text": "Yaratıcı düşünme teknikleri (ör. Brainstorming, SCAMPER) konusundaki bilginizi nasıl değerlendirirsiniz?", "type": "scale"}, 

            {"id": "YK2", "text": "Yeni ürün tasarımı süreçleri hakkında ne kadar bilgi sahibisiniz?", "type": "scale"},

            {"id": "YK3", "text": "Girişimcilik temel kavramları (ör. iş planı, MVP) konusundaki bilginiz nedir?", "type": "scale"}, 

            {"id": "YK4", "text": "UX/UI tasarım araçları (ör. Figma, Sketch) kullanım seviyeniz nedir?", "type": "scale"}, 

            {"id": "YK5", "text": "İnovasyon yönetimi ve fikir geliştirme konusunda ne kadar deneyimlisiniz?", "type": "scale"}

        ]

    },

    "Metodik Uzman": {

        "def": "Planlı, disiplinli, detaycı ve sistem kurmayı seven birisin.", 

        "meslekler": ["Mühendis", "Veri Analisti", "Muhasebeci", "Proje Yöneticisi"], 

        "kurslar": [{"title": "Proje Yönetimi"}, {"title": "Excel ve Veri Analizi"}, {"title": "Süreç İyileştirme"}], 

        "keywords": ["mühendislik", "analiz", "planlama", "sistem", "detay", "disiplin"], 

        "profile": {"Conscientiousness": 5, "Openness": 2, "Neuroticism": 2},

        "competency_questions": [

            {"id": "MU1", "text": "Proje yönetimi metodolojileri (ör. Scrum, Kanban) bilginiz nedir?", "type": "scale"}, 

            {"id": "MU2", "text": "Excel ve Google Sheets kullanım seviyeniz nedir?", "type": "scale"},

            {"id": "MU3", "text": "Süreç iyileştirme teknikleri (ör. Lean, Six Sigma) konusundaki bilginiz?", "type": "scale"}, 

            {"id": "MU4", "text": "Veri analizi araçları (ör. Power BI, Tableau) konusundaki yetkinliğiniz?", "type": "scale"}, 

            {"id": "MU5", "text": "Planlama ve zaman yönetimi tekniklerini ne kadar etkili kullanabiliyorsunuz?", "type": "scale"}

        ]

    },

    "Sosyal Lider": {

        "def": "Karizmatik, ikna edici, sosyal ve liderlik vasıfları güçlü bir karaktere sahipsin.", 

        "meslekler": ["Satış Yöneticisi", "Toplum Lideri", "Halkla İlişkiler Uzmanı", "Politikacı"], 

        "kurslar": [{"title": "Liderlik ve Etkin İletişim"}, {"title": "Topluluk Yönetimi"}, {"title": "Müzakere Teknikleri"}], 

        "keywords": ["liderlik", "yönetim", "iletişim", "ikna", "sosyal", "topluluk"], 

        "profile": {"Extraversion": 5, "Agreeableness": 4, "Conscientiousness": 4},

        "competency_questions": [

            {"id": "SL1", "text": "Liderlik becerileriniz (ekip yönetimi, motivasyon) ne düzeyde?", "type": "scale"}, 

            {"id": "SL2", "text": "Topluluk yönetimi (community management) hakkında bilginiz nedir?", "type": "scale"},

            {"id": "SL3", "text": "İkna teknikleri ve müzakere becerileriniz ne seviyede?", "type": "scale"}, 

            {"id": "SL4", "text": "Etkili sunum ve topluluk önünde konuşma becerileriniz?", "type": "scale"}, 

            {"id": "SL5", "text": "Kriz yönetimi ve çatışma çözümü konularında ne kadar deneyimlisiniz?", "type": "scale"}

        ]

    },

    "Takım Oyuncusu": {

        "def": "Yardımsever, empatik, destekleyici ve işbirliğine açık birisin.", 

        "meslekler": ["Öğretmen", "Sosyal Hizmet Uzmanı", "Hemşire", "Müşteri Temsilcisi"], 

        "kurslar": [{"title": "Empati ve Aktif Dinleme"}, {"title": "Kriz Yönetimi"}, {"title": "Psikolojiye Giriş"}], 

        "keywords": ["yardım", "eğitim", "destek", "takım", "empati", "işbirliği"], 

        "profile": {"Agreeableness": 5, "Extraversion": 4, "Neuroticism": 2},

        "competency_questions": [

            {"id": "TO1", "text": "Empati ve aktif dinleme becerilerinizi nasıl değerlendirirsiniz?", "type": "scale"}, 

            {"id": "TO2", "text": "Psikoloji ve temel danışmanlık bilgisi seviyeniz?", "type": "scale"},

            {"id": "TO3", "text": "Kriz anlarında destekleyici rol alma konusundaki yetkinliğiniz?", "type": "scale"}, 

            {"id": "TO4", "text": "Takım içinde iş birliği ve koordinasyon beceriniz?", "type": "scale"}, 

            {"id": "TO5", "text": "Eğitim planlama ve sunum yapma konularındaki bilginiz?", "type": "scale"}

        ]

    },

    "Soğukkanlı Stratejist": {

        "def": "Mantıklı, serinkanlı, analitik düşünen ve krizlerde sakin kalan bir yapıdasın.", 

        "meslekler": ["Finansal Danışman", "Kriz Yöneticisi", "İş Analisti", "Avukat"], 

        "kurslar": [{"title": "Finansal Okuryazarlık"}, {"title": "Risk Analizi"}, {"title": "Stratejik Planlama"}], 

        "keywords": ["strateji", "finans", "analiz", "mantık", "kriz", "risk"], 

        "profile": {"Neuroticism": 1, "Conscientiousness": 5, "Openness": 3},

        "competency_questions": [

            {"id": "SS1", "text": "Finansal analiz ve raporlama konusundaki bilginiz?", "type": "scale"}, 

            {"id": "SS2", "text": "Risk analizi yöntemleri (ör. SWOT, PEST) bilginiz nedir?", "type": "scale"},

            {"id": "SS3", "text": "Stratejik planlama yapma konusundaki yetkinliğiniz?", "type": "scale"}, 

            {"id": "SS4", "text": "Kriz anlarında mantıklı karar verebilme beceriniz?", "type": "scale"}, 

            {"id": "SS5", "text": "Hukuk ve sözleşme okuryazarlığınız ne düzeyde?", "type": "scale"}

        ]

    },

    "Hayalperest Sanatçı": {

        "def": "Duygusal, estetik algısı güçlü, özgün ve sanata eğilimli bir ruhun var.", 

        "meslekler": ["Ressam", "Müzisyen", "Yazar", "Tiyatrocu", "Fotoğrafçı"], 

        "kurslar": [{"title": "Sanat Tarihi"}, {"title": "Yaratıcı Yazarlık"}, {"title": "Fotoğrafçılık Temelleri"}], 

        "keywords": ["sanat", "müzik", "yazarlık", "estetik", "duygu", "hayal"], 

        "profile": {"Openness": 5, "Neuroticism": 4, "Agreeableness": 4},

        "competency_questions": [

            {"id": "HS1", "text": "Sanat tarihi ve temel kavramlar konusundaki bilginiz?", "type": "scale"}, 

            {"id": "HS2", "text": "Yaratıcı yazarlık tekniklerini ne kadar biliyorsunuz?", "type": "scale"},

            {"id": "HS3", "text": "Fotoğrafçılık temel teknikleri hakkında bilginiz?", "type": "scale"}, 

            {"id": "HS4", "text": "Müzik teorisi veya çalgı çalma seviyeniz?", "type": "scale"}, 

            {"id": "HS5", "text": "Tiyatro ve sahne sanatları konusunda yetkinliğiniz?", "type": "scale"}

        ]

    },

    "Bilimsel Araştırmacı": {

        "def": "Meraklı, detaycı, sorgulayıcı ve bilimsel yöntemlere bağlı bir düşünce yapın var.", 

        "meslekler": ["Akademisyen", "Araştırma Görevlisi", "Veri Bilimcisi", "Biyoteknolog"], 

        "kurslar": [{"title": "Bilimsel Araştırma Yöntemleri"}, {"title": "İstatistik"}, {"title": "Python ile Veri Bilimi"}], 

        "keywords": ["bilim", "araştırma", "veri", "teknoloji", "merak", "sorgulamak"], 

        "profile": {"Openness": 4, "Conscientiousness": 5, "Extraversion": 2},

        "competency_questions": [

            {"id": "BA1", "text": "Bilimsel araştırma yöntemleri hakkındaki bilginiz?", "type": "scale"}, 

            {"id": "BA2", "text": "İstatistik ve veri analizi konularındaki seviyeniz?", "type": "scale"},

            {"id": "BA3", "text": "Python ya da R gibi programlama dillerini kullanma düzeyiniz?", "type": "scale"}, 

            {"id": "BA4", "text": "Akademik yazım ve literatür taraması beceriniz?", "type": "scale"}, 

            {"id": "BA5", "text": "Laboratuvar teknikleri ve deney tasarlama bilginiz?", "type": "scale"}

        ]

    },

    "Pratik Çözümcü": {

        "def": "Hızlı düşünen, çözüm odaklı, pragmatik ve karar vermeyi seven birisin.", 

        "meslekler": ["Teknik Destek Uzmanı", "Operasyon Yöneticisi", "Lojistik Yöneticisi", "Mekanik Ustası"], 

        "kurslar": [{"title": "Problem Çözme Teknikleri"}, {"title": "Lojistik Yönetimi"}, {"title": "Temel Mekanik"}], 

        "keywords": ["çözüm", "operasyon", "pratik", "teknik", "hızlı", "karar"], 

        "profile": {"Conscientiousness": 4, "Extraversion": 3, "Neuroticism": 2},

        "competency_questions": [

            {"id": "PC1", "text": "Problem çözme teknikleri (ör. 5N1K, Ishikawa) bilginiz?", "type": "scale"}, 

            {"id": "PC2", "text": "Teknik destek süreçleri hakkında ne kadar bilginiz var?", "type": "scale"},

            {"id": "PC3", "text": "Lojistik ve tedarik zinciri yönetimi konusundaki bilginiz?", "type": "scale"}, 

            {"id": "PC4", "text": "Temel mekanik ve teknik bakım bilgisi seviyeniz?", "type": "scale"}, 

            {"id": "PC5", "text": "Operasyon yönetimi süreçleri hakkında yetkinliğiniz?", "type": "scale"}

        ]

    },

    "Duyarlı Bakıcı": {

        "def": "Şefkatli, insan odaklı ve başkalarının ihtiyaçlarını önceliklendiren bir yapıdasın.", 

        "meslekler": ["Psikolog", "Danışman", "Çocuk Gelişim Uzmanı", "Yaşlı Bakım Uzmanı"], 

        "kurslar": [{"title": "Danışmanlık Becerileri"}, {"title": "Çocuk Gelişimi"}, {"title": "Sağlıkta Etik"}], 

        "keywords": ["psikoloji", "sağlık", "insan", "şefkat", "ihtiyaç", "bakım"], 

        "profile": {"Agreeableness": 5, "Neuroticism": 3, "Extraversion": 3},

        "competency_questions": [

            {"id": "DB1", "text": "Psikolojik danışmanlık yöntemleri hakkında bilginiz?", "type": "scale"}, 

            {"id": "DB2", "text": "Çocuk gelişimi konusundaki bilgi seviyeniz?", "type": "scale"},

            {"id": "DB3", "text": "Sağlık hizmetlerinde etik kurallar konusundaki bilginiz?", "type": "scale"}, 

            {"id": "DB4", "text": "Yaşlı bakım ve destek yöntemleri hakkındaki bilginiz?", "type": "scale"}, 

            {"id": "DB5", "text": "İnsanların ihtiyaçlarını analiz etme ve planlama beceriniz?", "type": "scale"}

        ]

    },

    "Macera Tutkunu": {

        "def": "Cesur, özgür ruhlu, deneyim odaklı ve rutinlerden hoşlanmayan birisin.", 

        "meslekler": ["Seyahat Yazarı", "Outdoor Rehberi", "Fotoğrafçı", "Serbest Çalışan"], 

        "kurslar": [{"title": "Doğa Sporları Eğitimi"}, {"title": "Freelance Çalışma Stratejileri"}, {"title": "Seyahat Planlama"}], 

        "keywords": ["macera", "seyahat", "spor", "özgürlük", "deneyim", "cesaret"], 

        "profile": {"Extraversion": 5, "Openness": 5, "Conscientiousness": 2},

        "competency_questions": [

            {"id": "MT1", "text": "Seyahat planlama ve destinasyon araştırma beceriniz?", "type": "scale"}, 

            {"id": "MT2", "text": "Doğa sporları (ör. kampçılık, tırmanış) konusundaki bilginiz?", "type": "scale"},

            {"id": "MT3", "text": "Freelance çalışma teknikleri ve platform bilgisi seviyeniz?", "type": "scale"}, 

            {"id": "MT4", "text": "Fotoğrafçılık ve video prodüksiyon beceriniz?", "type": "scale"}, 

            {"id": "MT5", "text": "Kültürel çeşitlilik ve yeni deneyimlere açıklık konusundaki bilginiz?", "type": "scale"}

        ]

    },

}



# --- API ENDPOINTS ---



@app.get("/test/start")

def get_start_info(db: Session = Depends(get_db)):

    # Yeni bir test sonucu kaydı oluştur ve ID'sini döndür

    result_id = str(uuid.uuid4())

    new_result = TestResult(id=result_id, answers_json=[]) # Boş cevap listesiyle başlat

    db.add(new_result)

    db.commit()

    db.refresh(new_result)

    logger.info(f"New test session started with ID: {result_id}")

    

    # HATA BURADAYDI: "return" ifadesinin girintisi düzeltildi.

    return {

        "result_id": result_id, 

        "title": "NeetUp Kariyer ve Gelişim Testi", 

        "description": "Bu test, kişilik tipinizi, teknik becerilerinizi belirlemenize ve size uygun kurslar ile kariyerler önermenize yardımcı olacaktır.", 

        "instructions": "Lütfen tüm soruları dürüstçe cevaplayınız.", 

        "pages": len(QUESTIONS_DB),

        "stages": [

            {"id": 1, "name": "Kişilik ve İlgi Alanları Değerlendirmesi"},

            {"id": 2, "name": "Demografik Bilgiler"},

            {"id": 3, "name": "Koalisyon Yetkinlik Soruları"},

            {"id": 4, "name": "Sonuçlar ve Öneriler"}

        ]

    }



@app.get("/test/questions/{page_number}")

def get_questions_for_page(page_number: int):

    if page_number not in QUESTIONS_DB: raise HTTPException(404, "Sayfa bulunamadı.")

    return {"questions": QUESTIONS_DB[page_number], "current_page": page_number, "total_pages": len(QUESTIONS_DB)}



@app.post("/test/answers/{result_id}")

def submit_answers(result_id: str, answers: List[Answer], db: Session = Depends(get_db)):

    try:

        # Mevcut kaydı ID ile bul

        test_result = db.query(TestResult).filter(TestResult.id == result_id).first()

        if not test_result:

            raise HTTPException(status_code=404, detail="Test sonucu bulunamadı.")

            

        # Mevcut cevapları al ve yenilerini ekle

        existing_answers = test_result.answers_json or []

        for answer in answers:

            existing_answers.append({"question_id": answer.question_id, "answer": answer.answer_value})

        

        test_result.answers_json = existing_answers # JSON property setter ile güncelle

        

        db.commit()

        db.refresh(test_result)

        

        logger.info(f"Answers added to test ID: {result_id}")

        return {"success": True, "result_id": result_id}

    except Exception as e:

        logger.error(f"Error submitting answers for ID {result_id}: {str(e)}")

        db.rollback()

        raise HTTPException(status_code=500, detail="Cevaplar kaydedilirken bir hata oluştu.")



@app.post("/test/demographics/{result_id}")

def submit_demographics(result_id: str, demographics: Demographics, db: Session = Depends(get_db)):

    try:

        logger.info(f"Demographics endpoint called with result_id: {result_id}")

        

        # Query the database for the test result

        test_result = db.query(TestResult).filter(TestResult.id == result_id).first()

        

        if not test_result:

            logger.info(f"Creating new result entry for ID: {result_id}")

            test_result = TestResult(id=result_id)

            test_result.answers_json = []  # Boş JSON dizisi

            db.add(test_result)

        

        # Update demographics data - JSON property kullan

        test_result.demographics_json = demographics.model_dump()

        logger.info(f"Demographics saved successfully for ID: {result_id}")

        

        # Preliminary personality scoring to determine top coalition for competency questions

        all_answers = test_result.answers_json or []

        

        # Calculate preliminary personality scores

        scores = { "Openness": [], "Conscientiousness": [], "Extraversion": [], "Agreeableness": [], "Neuroticism": [] }

        all_questions_map = {q["id"]: q for q in PERSONALITY_QUESTIONS}

        

        

        

        for answer in all_answers:

            q_id = answer.get("question_id")

            if q_id in all_questions_map:

                q_details = all_questions_map[q_id]

                trait, user_answer = q_details.get("trait"), answer.get("answer", 3)

                final_score = (6 - user_answer) if q_details.get("reverse") else user_answer

                if trait in scores: scores[trait].append(final_score)

        

        final_scores = {trait: round(sum(s_list) / len(s_list), 2) if s_list else 3.0 for trait, s_list in scores.items()}

        

        # Determine the top coalition based on personality scores

        coalition_scores = {}

        for name, data in COALITIONS.items():

            score = 0

            distance = 0

            for trait, user_score in final_scores.items():

                ideal_score = data["profile"].get(trait, 3.0)

                distance += (user_score - ideal_score)**2

            score += (5 - math.sqrt(distance)) * 2

            coalition_scores[name] = round(max(0, score), 2)

        

        sorted_coalitions = sorted(coalition_scores.items(), key=lambda item: item[1], reverse=True)

        top_coalition = sorted_coalitions[0][0] if sorted_coalitions else list(COALITIONS.keys())[0]

        

        # Eğer koalisyon değiştiyse, önbelleği temizle

        old_coalition = test_result.top_coalition

        if old_coalition != top_coalition:

            logger.info(f"Koalisyon değişti: {old_coalition} -> {top_coalition}, önbellek temizleniyor")

            test_result.final_report = None  # Önbelleği temizle

        

        # Update top_coalition

        test_result.top_coalition = top_coalition

        logger.info(f"Determined top coalition for competency questions: {top_coalition}")

        

        # Commit changes to database

        db.commit()

        db.refresh(test_result)

        

        return {"success": True, "top_coalition": top_coalition}

    except Exception as e:

        logger.error(f"Error saving demographics: {str(e)}")

        # Rollback transaction on error

        db.rollback()

        raise HTTPException(status_code=500, detail=f"Demografik bilgiler kaydedilirken bir hata oluştu: {str(e)}")



# Alternative endpoint to support different URL patterns the frontend might be using

@app.post("/demographics/{result_id}")

def submit_demographics_alt(result_id: str, demographics: Demographics, db: Session = Depends(get_db)):

    logger.info(f"Alternative demographics endpoint called with result_id: {result_id}")

    return submit_demographics(result_id, demographics, db)



@app.get("/test/competency_questions/{result_id}")

def get_competency_questions(result_id: str, db: Session = Depends(get_db)):

    logger.info(f"Competency questions requested for result_id: {result_id}")

    

    # Query the database for the test result

    test_result = db.query(TestResult).filter(TestResult.id == result_id).first()

    

    if not test_result:

        raise HTTPException(404, "Sonuç bulunamadı.")

    

    top_coalition = test_result.top_coalition

    if not top_coalition:

        raise HTTPException(400, "Bu kullanıcı için henüz bir koalisyon belirlenmemiş. Önce demografik bilgileri tamamlayın.")

    

    questions = []

    if top_coalition in COALITIONS and "competency_questions" in COALITIONS[top_coalition]:

        # Eski koalisyon kaydını temizle ve yeni koalisyonu kaydet

        test_result.top_coalition = top_coalition  # Güncel koalisyonu yeniden kaydet

        db.commit()  # Değişiklikleri kaydet

        logger.info(f"Koalisyon güncellendi ve kaydedildi: {top_coalition}")

        

        # Soruları hazırla

        for question in COALITIONS[top_coalition]["competency_questions"]:

            questions.append({

                "id": question["id"],

                "text": question["text"],

                "type": question["type"],

                "category": top_coalition

            })

    

    logger.info(f"Returning {len(questions)} competency questions for coalition: {top_coalition}")

    return {"questions": questions, "coalition": top_coalition}



@app.post("/test/competency_answers/{result_id}")

def submit_competency_answers(result_id: str, answers: List[CompetencyAnswer], db: Session = Depends(get_db)):

    try:

        logger.info(f"Competency answers submitted for result_id: {result_id}")

        

        # Query the database for the test result

        test_result = db.query(TestResult).filter(TestResult.id == result_id).first()

        

        if not test_result:

            raise HTTPException(404, "Sonuç bulunamadı.")

        

        # Initialize competency_answers if it doesn't exist using the JSON property getter

        competency_answers = test_result.competency_answers_json or []

        

        # Append new answers

        for answer in answers:

            competency_answers.append({

                "question_id": answer.question_id,

                "answer_value": answer.answer_value

            })

        

        # Update the database record using the JSON property setter

        test_result.competency_answers_json = competency_answers

        

        # Commit changes

        db.commit()

        db.refresh(test_result)

        

        logger.info(f"Saved {len(answers)} competency answers for ID: {result_id}")

        return {"success": True}

    except Exception as e:

        logger.error(f"Error saving competency answers: {str(e)}")

        # Rollback transaction on error

        db.rollback()

        raise HTTPException(status_code=500, detail=f"Yetkinlik cevapları kaydedilirken bir hata oluştu: {str(e)}")



# Alternative endpoint - support both path patterns

@app.get("/test/results/{result_id}")

@app.get("/results/{result_id}")

def get_test_results(result_id: str, db: Session = Depends(get_db)):

    try:

        # Query the database for the test result

        test_result = db.query(TestResult).filter(TestResult.id == result_id).first()

        

        if not test_result:

            raise HTTPException(404, "Sonuç bulunamadı.")

        

        # Check if we have cached results already

        if test_result.final_report_json:

            logger.info(f"Returning cached final report for ID: {result_id}")

            # Return a copy of the cached report

            return test_result.final_report_json

            

        demographics = test_result.demographics_json

        if not demographics:

            raise HTTPException(400, "Demografik bilgiler henüz girilmemiş.")



        # Check if competency answers exist

        competency_answers = test_result.competency_answers_json or []

        if not competency_answers:

            logger.warning(f"Competency answers not found for ID: {result_id}. Final report may be less accurate.")

        

        answers = test_result.answers_json or []

        # Eğer cevap yoksa, varsayılan cevaplarla demo sonucunu oluştur

        if not answers:

            logger.warning(f"Uyarı: {result_id} ID'li sonuç için cevaplar bulunamadı, demo sonuçlar kullanılıyor.")

            # Her soru için rastgele fakat dengeli yanıtlar oluştur (3 etrafında)

            answers = []

            for q_id, question in enumerate(ALL_QUESTIONS_LIST):

                # Ortalama cevaplar etrafında rastgele değerler üret

                random_answer = random.randint(2, 4)  # 2-4 arası rastgele cevaplar

                answers.append({

                    "question_id": question["id"],

                    "answer": random_answer

                })

            test_result.answers_json = answers

            db.commit()

        

        all_answers = test_result.answers_json or []

        

        # Calculate personality scores

        scores = { "Openness": [], "Conscientiousness": [], "Extraversion": [], "Agreeableness": [], "Neuroticism": [] }

        all_questions_map = {q['id']: q for q in ALL_QUESTIONS_LIST}

        for answer in all_answers:

            q_details = all_questions_map.get(answer.get('question_id'))

            if q_details and 'trait' in q_details:  # Only process personality questions

                trait, user_answer = q_details.get("trait"), answer.get('answer', 3)

                final_score = (6 - user_answer) if q_details.get("reverse") else user_answer

                if trait in scores: scores[trait].append(final_score)

        final_scores = {trait: round(sum(s_list) / len(s_list), 2) if s_list else 3.0 for trait, s_list in scores.items()}



        # Combine all open-ended text for analysis

        open_ended_text = ""

        if "interests" in demographics:

            open_ended_text += f"\n\nInterests: {demographics.get('interests', '')}"

        if "goals" in demographics:

            open_ended_text += f"\n\nGoals: {demographics.get('goals', '')}"

            

        # Add competency answers to analysis text

        if competency_answers:

            open_ended_text += "\n\nCompetency Questions and Answers:\n"

            top_coalition = test_result.top_coalition or ""

            competency_questions = {}

            if top_coalition and top_coalition in COALITIONS and "competency_questions" in COALITIONS[top_coalition]:

                for i, question_text in enumerate(COALITIONS[top_coalition]["competency_questions"]):

                    competency_questions[f"C{i+1}"] = question_text

            

            for answer in competency_answers:

                question_id = answer.get("question_id")

                question_text = competency_questions.get(question_id, question_id)

                answer_text = answer.get("answer_text", "")

                open_ended_text += f"\nQ: {question_text}\nA: {answer_text}\n"

        

        # Log important test data 

        user_name = demographics.get('name', '')

        logger.info(f"Processing results for ID: {result_id}, user: {user_name}")

        logger.info(f"Final scores before LLM: {final_scores}")

        

        # LLM-bazlı analizi çağır (başlangıç skorlarını da ileterek)

        ai_response = call_llm(open_ended_text, final_scores)

        

        # Eğer LLM analizi başarılıysa, onun sonuçlarını kullan

        if ai_response:

            logger.info(f"LLM analysis succeeded for result ID: {result_id}")

            nlp_keywords = ai_response.get("nlp_keywords", [])

            

            # LLM'nin önerdiği skorlar varsa, kullan

            if "updated_scores" in ai_response and isinstance(ai_response["updated_scores"], dict):

                # Skorların geçerli aralıkta olduğunu kontrol et (1-5)

                valid_scores = {}

                for trait, score in ai_response["updated_scores"].items():

                    try:

                        score_val = float(score)

                        if 1 <= score_val <= 5:

                            valid_scores[trait] = score_val

                        else:

                            logger.warning(f"Invalid score value for {trait}: {score} (out of range 1-5)")

                            valid_scores[trait] = final_scores.get(trait, 3.0)  # Use original score as fallback

                    except (ValueError, TypeError):

                        logger.warning(f"Invalid score format for {trait}: {score}")

                        valid_scores[trait] = final_scores.get(trait, 3.0)  # Use original score as fallback

                

                # Tüm gerekli özellikler var mı diye kontrol et

                for trait in final_scores.keys():

                    if trait not in valid_scores:

                        valid_scores[trait] = final_scores[trait]

                

                final_scores = valid_scores

                logger.info(f"Updated scores after LLM: {final_scores}")

            

            # Top koalisyonları doğrudan LLM'den al

            llm_coalitions = []

            if "top_coalitions" in ai_response and isinstance(ai_response["top_coalitions"], list):

                # Geçerli koalisyon isimlerini filtrele

                for coalition in ai_response.get("top_coalitions", []):

                    if isinstance(coalition, dict) and "name" in coalition and coalition["name"] in COALITIONS:

                        llm_coalitions.append(coalition["name"])

            

            # Kişilik yorumu - eğer boşsa veya çok kısaysa varsayılan bir yorum oluştur

            personality_comment = ai_response.get("personality_comment", "")

            if not personality_comment or len(personality_comment.strip()) < 20:

                user_first_name = demographics.get('name', '').split()[0] if demographics.get('name') else 'Kullanıcı'

                personality_comment = f"Merhaba {user_first_name}, açık uçlu yanıtlarını inceledik ve kendi ifadelerinden yola çıkarak kişilik profilini değerlendirdik. Sonuçlarında özellikle {', '.join(trait for trait, score in sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[:2])} özelliklerin öne çıkıyor."

            

            # Kariyer ve kurs önerileri

            ai_career_recommendations = ai_response.get("career_recommendations", [])

            ai_course_recommendations = ai_response.get("course_recommendations", [])

        else:

            logger.info(f"LLM analysis failed or skipped for result ID: {result_id}, using basic analysis")

            # LLM analizi başarısız olursa, basic spaCy analizi kullan

            nlp_keywords = []

            # Kişisel bir mesaj oluştur

            user_first_name = demographics.get('name', '').split()[0] if demographics.get('name') else 'Kullanıcı'

            personality_comment = f"Merhaba {user_first_name}, cevaplarını analiz ettik ve kişilik özelliklerini belirledik. Testine göre, en belirgin özelliklerin: {', '.join(trait for trait, score in sorted(final_scores.items(), key=lambda x: x[1], reverse=True)[:2])}." 

            

            # spaCy ile anahtar kelimeleri çıkar

            if nlp and open_ended_text.strip():

                try:

                    doc = nlp(open_ended_text)

                    nlp_keywords = list(set([token.lemma_.lower() for token in doc if token.pos_ in ["NOUN", "PROPN"] and not token.is_stop and len(token.lemma_) > 2]))

                except Exception as e:

                    logger.error(f"spaCy analysis error: {str(e)}")

                    nlp_keywords = []



        # LLM analizi başarılı olduysa ve önerilen koalisyonlar varsa onları kullan, yoksa geleneksel hesaplamaya devam et

        coalition_descriptions = {}

        if ai_response and "top_coalitions" in ai_response and len(llm_coalitions) >= 2:

            logger.info(f"Using LLM-suggested coalitions: {llm_coalitions[:2]}")

            top_coalitions = llm_coalitions[:2]

            

            # LLM'nin neden açıklamalarını tutmak için

            coalition_reasons = {}

            for coalition in ai_response.get("top_coalitions", []):

                if isinstance(coalition, dict) and "name" in coalition and "reason" in coalition:

                    if coalition["name"] in COALITIONS:  # Geçerli bir koalisyon mu?

                        coalition_reasons[coalition["name"]] = coalition["reason"]

            

            # Koalisyon açıklamaları için LLM'nin verdiği nedenleri kullan

            coalition_descriptions = coalition_reasons

        else:            

            logger.info("Using traditional coalition calculation method")

            # Geleneksel yöntemle koalisyon hesaplama

            coalition_scores = {}

            for name, data in COALITIONS.items():

                score = 0

                distance = 0

                for trait, user_score in final_scores.items():

                    ideal_score = data["profile"].get(trait, 3.0)

                    distance += (user_score - ideal_score)**2

                score += (5 - math.sqrt(distance)) * 2 

                

                # Anahtar kelime eşleşmeleri için bonus puanlar

                keyword_matches = 0

                for keyword in nlp_keywords:

                    if keyword in data["keywords"]:

                        keyword_matches += 1

                        score += 3  # NLP eşleşmesi için bonus puan

                        

                logger.debug(f"Coalition '{name}' score: {score}, keyword matches: {keyword_matches}")

                coalition_scores[name] = round(max(0, score), 2)



            sorted_coalitions = sorted(coalition_scores.items(), key=lambda item: item[1], reverse=True)

            top_coalitions = [c[0] for c in sorted_coalitions[:2]]

            logger.info(f"Traditional method selected coalitions: {top_coalitions}")

        

        # En az 2 koalisyon tipi olduğundan emin ol

        if len(top_coalitions) < 2:

            logger.warning(f"Not enough top coalitions found ({len(top_coalitions)}), adding default coalition")

            # Eğer yeteri kadar koalisyon bulunamadıysa, en yüksek skorlu özellik için uygun bir koalisyon ekle

            highest_trait = max(final_scores.items(), key=lambda x: x[1])[0]

            if highest_trait == "Openness" and "Yenilikçi Kaşif" not in top_coalitions:

                top_coalitions.append("Yenilikçi Kaşif")

            elif highest_trait == "Conscientiousness" and "Metodik Uzman" not in top_coalitions:

                top_coalitions.append("Metodik Uzman")

            elif highest_trait == "Extraversion" and "Sosyal Lider" not in top_coalitions:

                top_coalitions.append("Sosyal Lider")

            elif highest_trait == "Agreeableness" and "Takım Oyuncusu" not in top_coalitions:

                top_coalitions.append("Takım Oyuncusu")

            elif highest_trait == "Neuroticism" and "Soğukanlı Stratejist" not in top_coalitions:

                top_coalitions.append("Soğukanlı Stratejist")

            else:

                # Rastgele bir koalisyon ekle

                remaining_coalitions = [c for c in COALITIONS.keys() if c not in top_coalitions]

                if remaining_coalitions:

                    top_coalitions.append(random.choice(remaining_coalitions))

        

        # En fazla 2 koalisyon seç

        top_coalitions = top_coalitions[:2]

        personality_type = " & ".join(top_coalitions)

        logger.info(f"Final personality type: {personality_type}")

        

        # Kariyer önerilerini oluştur - LLM'den veya geleneksel yöntemle

        if ai_response and "career_recommendations" in ai_response and len(ai_response["career_recommendations"]) >= 3:

            logger.info("Using LLM-suggested careers")

            suggested_careers = ai_career_recommendations

        else:

            logger.info("Using traditional career recommendations")

            suggested_careers = list(set([job for c_name in top_coalitions for job in COALITIONS[c_name]["meslekler"]]))

            # ilgi alanlarından kariyer eşleştirme

            interests = demographics.get('interests', '').lower()

            if interests:

                for career in list(suggested_careers):  # Kopya liste üzerinde işlem yap

                    if career.lower() in interests:

                        # İlgi alanlarında bulunan kariyerleri öne çıkar

                        suggested_careers.remove(career)

                        suggested_careers.insert(0, career)

        

        # Kurs önerilerini oluştur - LLM'den veya geleneksel yöntemle

        if ai_response and "course_recommendations" in ai_response and len(ai_response["course_recommendations"]) >= 5:

            logger.info("Using LLM-suggested courses")

            suggested_courses = [

                {"title": course, "description": f"Bu kurs, '{course}' alanındaki becerilerini geliştirerek hedeflerine ulaşmana yardımcı olabilir.", "difficulty": "Orta", "url": "#"} 

                for course in ai_course_recommendations

            ]

        else:

            logger.info("Using traditional course recommendations")

            suggested_courses_raw = [course for c_name in top_coalitions for course in COALITIONS[c_name]["kurslar"]]

            # Kursları başlıklarına göre gruplayarak tekrarı önle

            suggested_courses = list({c["title"]: c for c in suggested_courses_raw}.values())

            

            # Yeterli kurs önerisi yoksa, diğer koalisyonlardan ekle

            if len(suggested_courses) < 5:

                logger.info(f"Not enough courses ({len(suggested_courses)}), adding more from other coalitions")

                remaining_coalitions = [c for c in COALITIONS.keys() if c not in top_coalitions]

                random.shuffle(remaining_coalitions)  # Rastgele sırala

                

                for coalition in remaining_coalitions:

                    if len(suggested_courses) >= 5:

                        break

                        

                    for course in COALITIONS[coalition]["kurslar"]:

                        if course["title"] not in {c["title"] for c in suggested_courses}:

                            suggested_courses.append(course)

                        

                        if len(suggested_courses) >= 5:

                            break

        

        # Kişisel ilgi alanlarına ve demografik bilgilere göre taktiksel öneriler oluştur

        user_first_name = demographics.get('name', '').split()[0] if demographics.get('name') else 'Kullanıcı'

        interests = demographics.get('interests', '').lower()

        education = demographics.get('education', '').lower()

        open_ended_1 = demographics.get('open_ended_1', '').lower()

        

        # Kişiselleştirilmiş temel öneriler

        tactical_suggestions = [

            f"{user_first_name}, kariyer hedeflerin için sektörünle ilgili topluluk ve etkinliklere katılman faydalı olabilir.",

            "Yaratıcılığını artırmak için farklı alanlardan ilham almayı dene.", 

            f"Kişisel gelişimin için önerilen {suggested_courses[0]['title']} kursunu değerlendirebilirsin."

        ]

        

        # Kişilik özelliklerine göre öneriler

        if final_scores["Extraversion"] < 3 and any(k in nlp_keywords for k in ["lider", "yönetici", "girişim", "sunum"]):

            tactical_suggestions.append("Liderlik hedeflerinle içe dönük yapın arasında bir denge kurmak için, küçük gruplarda sorumluluk alarak başlayabilirsin.")

        

        if final_scores["Openness"] > 4 and "Yaratıcılık" in interests:

            tactical_suggestions.append("Yüksek açıklık puanınla yaratıcı projelere yönelmek sana büyük tatmin sağlayabilir. Farklı disiplinleri birleştiren projeler dene.")

        

        if final_scores["Neuroticism"] > 3.5:

            tactical_suggestions.append("Günlük meditasyon ve mindfulness egzersizleri, stres yönetimini güçlendirmeye yardımcı olabilir.")

            

        if "Metodik Uzman" in top_coalitions or final_scores["Conscientiousness"] > 4:

            tactical_suggestions.append("Planlama ve organizasyon becerilerin güçlü. Bu yönünü projelerinde ve kariyer hedeflerinde sistematik bir yaklaşım kullanarak değerlendirebilirsin.")

        

        # Eğitim durumuna göre öneriler

        if "lisans" in education or "yüksek" in education:

            tactical_suggestions.append("Akademik geçmişinle ilişkili sektörlerde staj veya gönüllü çalışma fırsatları aramak, kariyer geçişini kolaylaştırabilir.")

            

        # İlgi alanlarına göre öneriler

        if "yazılım" in interests or "kodlama" in interests or "programlama" in interests:

            tactical_suggestions.append("Teknik yeteneklerini gösterebileceğin bir portfolio veya Github profili oluşturmak, iş aramada sana avantaj sağlayabilir.")



        # En fazla 5 öneriyle sınırla

        tactical_suggestions = tactical_suggestions[:5]

        logger.info(f"Generated {len(tactical_suggestions)} tactical suggestions")



        user_first_name = demographics.get('name', '').split()[0] if demographics.get('name') else 'Kullanıcı'



        # Anahtar kelimeleri zenginleştir ve sınıflandır

        formatted_keywords = []

        if nlp_keywords:

            # En önemli 15 anahtar kelimeyi al (maksimum)

            selected_keywords = nlp_keywords[:15]

            

            # Anahtar kelime kategorileri

            skill_keywords = ["tasarım", "kodlama", "analiz", "yönetim", "iletişim", "yazılım", "proje", "planlama", "araştırma"]

            interest_keywords = ["sanat", "bilim", "müzik", "spor", "seyahat", "kitap", "teknoloji", "doğa", "fotoğraf", "yemek"]

            personality_keywords = ["lider", "yaratıcı", "analitik", "detaycı", "sosyal", "takım", "başarı", "motive", "disiplinli", "sabırlı"]

            

            # Kelimeleri sınıflandır

            for keyword in selected_keywords:

                keyword_type = "other"

                if any(k in keyword.lower() for k in skill_keywords):

                    keyword_type = "skill"

                elif any(k in keyword.lower() for k in interest_keywords):

                    keyword_type = "interest"

                elif any(k in keyword.lower() for k in personality_keywords):

                    keyword_type = "personality"

                    

                formatted_keywords.append({

                    "text": keyword,

                    "type": keyword_type

                })

            

            logger.info(f"Categorized {len(formatted_keywords)} keywords")

        

        # Tüm güçlü yönleri bir araya getir

        strengths = []

        for c in top_coalitions:

            coalition_desc = coalition_descriptions.get(c, COALITIONS[c]["def"])

            if coalition_desc not in strengths:

                strengths.append(coalition_desc)

                

        # Areas to improve - en düşük skorlu özelliğe göre öneri

        areas_to_improve = []

        lowest_trait = min(final_scores.items(), key=lambda x: x[1])[0]

        if lowest_trait == "Openness":

            areas_to_improve.append("Yeni deneyimlere ve farklı fikirlere daha açık olmak için konfor alanının dışında aktiviteler deneyebilirsin.")

        elif lowest_trait == "Conscientiousness":

            areas_to_improve.append("Günlük planlamayı alışkanlık haline getirerek ve küçük hedefler belirleyerek daha disiplinli bir yaklaşım geliştirebilirsin.")

        elif lowest_trait == "Extraversion":

            areas_to_improve.append("Sosyal ortamlarda daha aktif olmak için ilgi duyduğun konularda grup etkinliklerine katılmayı deneyebilirsin.")

        elif lowest_trait == "Agreeableness":

            areas_to_improve.append("Başkalarının bakış açısını anlamak için aktif dinleme tekniklerini geliştirebilirsin.")

        elif lowest_trait == "Neuroticism":

            areas_to_improve.append("Duygusal dalgalanmaları dengelemek için stres yönetim teknikleri ve düzenli meditasyon çalışmaları faydalı olabilir.")



        # Kullanıcının cevapladığı yetkinlik sorularını raporuna ekleyelim

        competency_answers = test_result.competency_answers_json or []

        competency_insights = []

        top_coalition = test_result.top_coalition or (top_coalitions[0] if top_coalitions else "")

        

        if competency_answers and top_coalition and top_coalition in COALITIONS and "competency_questions" in COALITIONS[top_coalition]:

            competency_questions = {}

            for i, question_text in enumerate(COALITIONS[top_coalition]["competency_questions"]):

                competency_questions[f"C{i+1}"] = question_text

            

            competency_qa_pairs = []

            for answer in competency_answers:

                question_id = answer.get("question_id")

                question_text = competency_questions.get(question_id, question_id)

                answer_text = answer.get("answer_text", "")

                competency_qa_pairs.append({

                    "question": question_text,

                    "answer": answer_text

                })

                

                # Özgül cevaplardan bazı görüşler çıkar

                if len(answer_text) > 10:  # Anlamlı bir cevap var mı diye kontrol

                    insight_text = f"Yetkinlik sorusuna verdiğin cevaba göre, {top_coalition} tipine uygun bir yaklaşım sergiliyorsun."

                    competency_insights.append(insight_text)

            

            # Eğer LLM yanıt veremediyse ve bazı insights yoksa, basit insights ekle

            if not competency_insights and competency_qa_pairs:

                competency_insights.append(f"{top_coalition} koalisyon tipine uygun açık uçlu cevapların yetkinliklerini güçlendiriyor.")

        

        # En fazla 2 insight ile sınırla

        competency_insights = competency_insights[:2]

        

        # Sonuç raporunu hazırla

        final_report = {

            "summary": {

                "greeting": f"Merhaba {user_first_name}, kişilik analiz raporun hazır!",

                "personality_type": personality_type,

                "scores": final_scores,

                "strengths": strengths,

                "description": [coalition_descriptions.get(c, COALITIONS[c]["def"]) for c in top_coalitions],

                "areas_to_improve": areas_to_improve,

                "nlp_analysis": {

                    "keywords": formatted_keywords,  # Kategorili anahtar kelimeler

                    "extracted_keywords": nlp_keywords[:10],  # Frontend uyumluluğu için eski formatı da koru

                    "used_llm": bool(ai_response)   # LLM analizi kullanıldığını belirt

                },

                "personality_comment": personality_comment,  # LLM'den gelen kişilik yorumunu ekle

                "competency_insights": competency_insights  # Yetkinlik sorularından çıkarılan görüşler

            },

            "career_recommendations": [

                {

                    "title": career,

                    "why": f"{personality_type} profilin ve ilgi alanların bu kariyerle örtüşüyor.", 

                    "skills_to_learn": ["İlgili alanda staj", "Sektörel ağ kurma"]

                } for career in (ai_career_recommendations[:5] if ai_response and "career_recommendations" in ai_response else suggested_careers[:5])

            ],

            "course_recommendations": [

                {

                    "title": course["title"] if isinstance(course, dict) else course, 

                    "description": f"Bu kurs, '{course['title'] if isinstance(course, dict) else course}' alanındaki yeteneklerini geliştirerek hedeflerine ulaşmana yardımcı olabilir.", 

                    "difficulty": "Orta", 

                    "url": "#"

                } for course in (suggested_courses[:5])  # En az 5 kurs önerisi döndür

            ],

            "tactical_suggestions": tactical_suggestions,

            "competency_assessment": {

                "coalition": top_coalition,

                "answers": competency_qa_pairs if competency_answers else []

            }

        }

        

        try:

            # Serialize final report to ensure it can be stored properly

            serialized_report = json.loads(json.dumps(final_report))

            

            # Cache the final report in database using JSON property

            test_result.final_report_json = final_report

            db.commit()

            db.refresh(test_result)

            

            # Return the final report

            return final_report

        except Exception as serialize_error:

            # If we can't serialize/store the report, still return it to the client

            logger.error(f"Failed to cache report but continuing: {str(serialize_error)}")

            return final_report

    except Exception as e:

        logger.error(f"Sunucu Hatası: /results/{result_id} - {e}")

        # Rollback transaction on error

        db.rollback()

        raise HTTPException(status_code=500, detail="Sonuçlar oluşturulurken beklenmedik bir sunucu hatası oluştu.")



# --- Statik Dosya Sunumu ---

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")



@app.get("/", response_class=FileResponse)

async def read_index():

    index_path = os.path.join(STATIC_DIR, "index.html")

    if not os.path.exists(index_path): raise HTTPException(404, "index.html dosyası 'static' klasöründe bulunamadı.")

    return index_path



if __name__ == "__main__":

    import uvicorn

    port = 8003  # Port değiştirildi - 8000, 8001, 8002 kullanımda

    logger.info(f"Starting API server on http://localhost:{port}")

    uvicorn.run(app, host="0.0.0.0", port=port)


# ==============================================================
# FILE: app.py
# DESCRIPTION:
# A single, clean, and corrected version of the main Python/Flask application.
# ==============================================================

import os
import json
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import re

# --- 1. INITIALIZE FLASK APP & DATABASE ---
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app) 

app.secret_key = 'your_super_secret_key_for_neetup'

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'users.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- 2. DATABASE MODEL ---
class User(db.Model):
    # CORRECTED: Indented all columns and properties to be inside the class.
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    security_question = db.Column(db.String(256), nullable=False)
    security_answer_hash = db.Column(db.String(256), nullable=False)
    progress = db.Column(db.Integer, nullable=False, default=0)
    personality_type = db.Column(db.String(100), nullable=True, default=None)

    @property
    def personality_test_completed(self):
        return self.personality_type is not None

# --- 3. ROUTES TO SERVE HTML PAGES ---
@app.route('/')
def index():
    # ADDED: A root route to redirect to a default page.
    return redirect(url_for('landing_page'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('signin_page'))
    user = db.session.get(User, session['user_id'])
    if not user:
        session.clear()
        return redirect(url_for('signin_page'))
    return render_template('dashboard.html', user=user)

@app.route('/personality-test-page')
def personality_test_page():
    if 'user_id' not in session:
        return redirect(url_for('signin_page'))
    return render_template('personality_test.html')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('signin_page'))

@app.route('/signup-page')
def signup_page(): 
    return render_template('signUp.html')

@app.route('/signin-page')
def signin_page(): 
    return render_template('signIn.html')
    
@app.route('/forgot-password-page')
def forgot_password_page(): 
    return render_template('forgot_password.html')

# --- ADDED: All placeholder routes for the dashboard sidebar ---
@app.route('/courses')
def courses():
    return "<h1>My Courses</h1><p>This page is working.</p>"

@app.route('/progress')
def progress():
    return "<h1>My Progress</h1><p>This page is working.</p>"

@app.route('/career-goals')
def career_goals():
    return "<h1>My Career Goals</h1><p>This page is working.</p>"

@app.route('/personality-type')
def personality_type():
    return "<h1>My Personality Type</h1><p>This page is working.</p>"

@app.route('/portfolio')
def portfolio():
    return "<h1>My Portfolio</h1><p>This page is working.</p>"

@app.route('/job-opportunities')
def job_opportunities():
    return "<h1>Job Opportunities</h1><p>This page is working.</p>"

@app.route('/entrepreneurship-coach')
def entrepreneurship_coach():
    return "<h1>Entrepreneurship Coach</h1><p>This page is working.</p>"

@app.route('/settings')
def settings():
    return "<h1>Settings</h1><p>This page is working.</p>"


# --- 4. API ENDPOINTS ---
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

@app.route('/api/auth/request-reset', methods=['POST'])
def request_password_reset():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    return jsonify({'security_question': user.security_question}), 200

@app.route('/api/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    email = data.get('email')
    security_answer = data.get('security_answer')
    new_password = data.get('new_password')
    if not all([email, security_answer, new_password]):
        return jsonify({'message': 'All fields are required.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'User not found'}), 404
    
    if not check_password_hash(user.security_answer_hash, security_answer):
        return jsonify({'message': 'Incorrect security answer'}), 400
    
    user.password_hash = generate_password_hash(new_password)
    db.session.commit()
    return jsonify({'message': 'Password reset successful'}), 200

@app.route('/api/submit-test', methods=['POST'])
def submit_test():
    if 'user_id' not in session:
        return jsonify({'message': 'Authentication required.'}), 401
    data = request.get_json()
    if not data:
        return jsonify({'message': 'Invalid submission.'}), 400
    
    mock_result = "Innovator (ENTP)"
    user = db.session.get(User, session['user_id'])
    if user:
        user.personality_type = mock_result
        user.progress = user.progress + 50 if user.progress <= 50 else 100
        db.session.commit()
        return jsonify({'message': 'Test completed successfully!', 'redirectUrl': '/dashboard'}), 200
    return jsonify({'message': 'User not found.'}), 404

# --- 5. MAIN EXECUTION BLOCK ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=3000)

    hayır zaten sign/

├── static/

│   └── NeetUp.PNG

├── templates/

│   ├── signIn.html

│   ├── signUp.html

│   ├── dashboard.html

│   └── personality_test.html  <-- Testin HTML arayüzü

└── app.py  
└── personality_api.py    
└── bridge.py
└── requirements.txt
└── users.db
└── venv
└── .env
└── yetkinlik_sorulari_olcekli.md
└── main.py


# ==============================================================
# FILE: app.py
# DESCRIPTION:
# The complete backend application, integrating user authentication
# and the full personality test logic into a single Flask app.
# ==============================================================

import os
import json
import uuid
import math
import random
from datetime import datetime
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

# --- 1. INITIALIZE FLASK APP & DATABASE ---
app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app) 

app.secret_key = 'your_super_secret_key_for_neetup'

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'neetup_database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# --- 2. DATABASE MODELS ---

# Main user table
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

    @property
    def personality_test_completed(self):
        return self.personality_type is not None

# Table to store temporary test results during the test
class TestResult(db.Model):
    id = db.Column(db.String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = db.Column(db.Integer, nullable=True) # Link to the User table
    answers = db.Column(db.Text, nullable=True)
    demographics = db.Column(db.Text, nullable=True)
    final_report = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# --- 3. PERSONALITY TEST DATA (Migrated from personalitytest.py) ---
# (PERSONALITY_QUESTIONS, INTEREST_QUESTIONS, COALITIONS data would be here)
# For brevity, this is omitted but should be copied from your personalitytest.py file.
PERSONALITY_QUESTIONS = [{"id": "P1", "text": "İşlerimi titizlikle ve düzenli bir şekilde yaparım.", "trait": "Conscientiousness"}, {"id": "P2", "text": "Plan yapmadan çalışmayı tercih ederim.", "trait": "Conscientiousness", "reverse": True}] # Example
INTEREST_QUESTIONS = [{"id": "I1", "text": "Sanatla ilgilenmeyi severim.", "category": "Yaratıcılık"}] # Example
COALITIONS = {"Yenilikçi Kaşif": {"def": "Yaratıcı...", "meslekler": [], "kurslar": [], "keywords": [], "profile": {}}} # Example

ALL_QUESTIONS_LIST = PERSONALITY_QUESTIONS + INTEREST_QUESTIONS
QUESTIONS_PER_PAGE = 5
QUESTIONS_DB = { i + 1: ALL_QUESTIONS_LIST[i * QUESTIONS_PER_PAGE:(i + 1) * QUESTIONS_PER_PAGE] for i in range((len(ALL_QUESTIONS_LIST) + QUESTIONS_PER_PAGE - 1) // QUESTIONS_PER_PAGE) }


# --- 4. ROUTES TO SERVE HTML PAGES ---
@app.route('/')
def index():
    return render_template('landing_page.html')

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('signin_page'))
    user = db.session.get(User, session['user_id'])
    if not user:
        session.clear()
        return redirect(url_for('signin_page'))
    return render_template('dashboard.html', user=user)

@app.route('/personality-test')
def personality_test_page():
    if 'user_id' not in session:
        return redirect(url_for('signin_page'))
    return render_template('personality_test.html')

# (Other page routes like logout, signup, signin remain the same)
@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('signin_page'))
@app.route('/signup-page')
def signup_page(): return render_template('signUp.html')
@app.route('/signin-page')
def signin_page(): return render_template('signIn.html')


# --- 5. API ENDPOINTS ---

# --- PERSONALITY TEST API (Migrated from FastAPI to Flask) ---

@app.route('/api/test/start', methods=['GET'])
def start_test():
    """Starts a new test and returns a unique ID for it."""
    if 'user_id' not in session:
        return jsonify({'message': 'Authentication required'}), 401
    
    new_result = TestResult(user_id=session['user_id'], answers="[]")
    db.session.add(new_result)
    db.session.commit()
    
    return jsonify({
        "result_id": new_result.id,
        "title": "NeetUp Kariyer ve Gelişim Testi",
        "description": "Bu test, kişilik tipinizi...",
        "instructions": "Lütfen tüm soruları dürüstçe cevaplayınız.",
        "pages": len(QUESTIONS_DB)
    })

@app.route('/api/test/questions/<int:page_number>', methods=['GET'])
def get_test_questions(page_number):
    if page_number not in QUESTIONS_DB:
        return jsonify({"message": "Sayfa bulunamadı."}), 404
    return jsonify({"questions": QUESTIONS_DB[page_number], "current_page": page_number, "total_pages": len(QUESTIONS_DB)})

@app.route('/api/test/submit-answers', methods=['POST'])
def submit_test_answers():
    """Saves answers for a test session and calculates the final result."""
    if 'user_id' not in session:
        return jsonify({'message': 'Authentication required.'}), 401
        
    data = request.get_json()
    result_id = data.get('resultId')
    answers = data.get('answers')
    demographics = data.get('demographics')

    if not result_id or not answers or not demographics:
        return jsonify({'message': 'Eksik bilgi gönderildi.'}), 400

    # --- MIGRATED LOGIC (SIMPLIFIED) ---
    # Here you would place the complex calculation logic from your personalitytest.py
    # This includes calling the LLM, calculating scores, etc.
    # For now, we simulate a result.
    final_personality_type = "Yenilikçi Kaşif"
    final_report_data = {"summary": {"personality_type": final_personality_type}, "recommendations": []}

    # --- DATABASE UPDATE ---
    # 1. Update the temporary TestResult record
    test_result_entry = db.session.get(TestResult, result_id)
    if test_result_entry and test_result_entry.user_id == session['user_id']:
        test_result_entry.demographics = json.dumps(demographics)
        test_result_entry.final_report = json.dumps(final_report_data)
    
    # 2. Update the main User record with the final result
    user = db.session.get(User, session['user_id'])
    if user:
        user.personality_type = final_personality_type
        user.progress = 75 # Set progress upon completion

    db.session.commit()

    return jsonify({
        'message': 'Test tamamlandı!',
        'redirectUrl': '/dashboard'
    }), 200

# --- AUTHENTICATION API (Unchanged) ---
@app.route('/api/auth/signin', methods=['POST'])
def signin():
    # ... existing signin logic ...
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if user and check_password_hash(user.password_hash, data.get('password')):
        session['user_id'] = user.id
        return jsonify({'message': 'Login successful!', 'redirectUrl': '/dashboard'}), 200
    return jsonify({'message': 'Invalid username or password.'}), 401

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    # ... existing signup logic ...
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

# --- 6. MAIN EXECUTION BLOCK ---
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=3000)

*/