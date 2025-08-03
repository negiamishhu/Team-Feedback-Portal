from flask import Flask, jsonify, request
from db import db
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from flask_migrate import Migrate
from models import User, Feedback, FeedbackRequest
from dotenv import load_dotenv
from sqlalchemy import text

load_dotenv()

app = Flask(__name__)
# Use environment variable for DB path, or default to a relative path
db_path = os.environ.get('DATABASE_URL', 'sqlite:///D:/Users/Public/Desktop/Mishuu/new/Team-Feedback-Portal/feedback-system-backend/instance/feedback_system.db')
app.config['SQLALCHEMY_DATABASE_URI'] = db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev-secret-key'

# Add these for production cross-site cookies
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True

db.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

# Allow both local and production frontends
frontend_origin = os.environ.get('FRONTEND_ORIGIN', 'https://team-feedback-portal.vercel.app')
CORS(app, origins=[frontend_origin], supports_credentials=True)

print("Allowed CORS origins:", [frontend_origin])

def setup_database():
    """Setup database tables and handle migration state"""
    with app.app_context():
        try:
            # Check if alembic_version table exists and has data
            try:
                result = db.session.execute(text("SELECT version_num FROM alembic_version LIMIT 1"))
                current_version = result.scalar()
                print(f"Current migration version: {current_version}")
                
                # If the version doesn't match our current migration, reset it
                if current_version and current_version != 'b5c0efbb251c':
                    print(f"Migration version mismatch. Clearing old version: {current_version}")
                    db.session.execute(text('DELETE FROM alembic_version'))
                    db.session.commit()
                    print("✓ Cleared old migration version")
            except Exception as e:
                print(f"No alembic_version table or error: {e}")
            
            # Create tables if they don't exist
            db.create_all()
            print("✓ Database tables ready")
            
            # Stamp with current migration head
            try:
                db.session.execute(text("INSERT INTO alembic_version (version_num) VALUES ('b5c0efbb251c') ON CONFLICT (version_num) DO NOTHING"))
                db.session.commit()
                print("✓ Migration state updated")
            except Exception as e:
                print(f"Migration stamping completed: {e}")
                
        except Exception as e:
            print(f"Database setup error: {e}")

# Setup database on app startup
setup_database()

from routes import routes

app.register_blueprint(routes, url_prefix='/api')

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.errorhandler(404)
def not_found(e):
    if request.path.startswith('/api/'):
        return jsonify({'error': 'Not found'}), 404
    return e
 

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 