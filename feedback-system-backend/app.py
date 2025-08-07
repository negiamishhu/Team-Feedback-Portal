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

load_dotenv()

app = Flask(__name__)

# Database configuration for production
database_url = os.environ.get('DATABASE_URL')
if database_url and ('postgresql' in database_url or 'postgres' in database_url):
    # Fix for Render/Heroku postgres URLs that use postgres:// instead of postgresql://
    if database_url.startswith('postgres://'):
        database_url = database_url.replace('postgres://', 'postgresql://', 1)

    # Use pg8000 driver for better Python 3.13 compatibility
    if 'postgresql://' in database_url and '+pg8000' not in database_url:
        database_url = database_url.replace('postgresql://', 'postgresql+pg8000://', 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    print("Using PostgreSQL database with pg8000 driver")
else:
    # Development: Use SQLite with relative path
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/feedback_system.db'
    print("Using SQLite database")

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')

# Production settings
if os.environ.get('FLASK_ENV') == 'production':
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True
else:
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_SECURE'] = False

db.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

# Initialize database tables and seed data
with app.app_context():
    try:
        # Create instance directory if it doesn't exist
        import os
        from pathlib import Path
        from werkzeug.security import generate_password_hash

        instance_dir = Path("instance")
        instance_dir.mkdir(exist_ok=True)

        db.create_all()
        print("Database tables created successfully")

        # Seed database if empty
        if not User.query.first():
            print("Seeding database with initial data...")

            # Create a manager
            manager = User(
                username='TheManager',
                email='manager1@company.com',
                password_hash=generate_password_hash('@12345'),
                role='manager'
            )
            db.session.add(manager)
            db.session.commit()

            # Create employees
            employee1 = User(
                username='Jack',
                email='jack@company.com',
                password_hash=generate_password_hash('@123456'),
                role='employee',
                manager_id=manager.id
            )
            employee2 = User(
                username='Alex',
                email='Alex@company.com',
                password_hash=generate_password_hash('@1234567'),
                role='employee',
                manager_id=manager.id
            )
            db.session.add_all([employee1, employee2])
            db.session.commit()

            # Create sample feedback
            feedback1 = Feedback(
                manager_id=manager.id,
                employee_id=employee1.id,
                strengths='Great communication skills and team collaboration',
                areas_to_improve='Could work on time management',
                sentiment='positive'
            )
            feedback2 = Feedback(
                manager_id=manager.id,
                employee_id=employee2.id,
                strengths='Excellent technical skills',
                areas_to_improve='Needs to improve documentation',
                sentiment='neutral'
            )
            db.session.add_all([feedback1, feedback2])
            db.session.commit()

            print("Database seeded successfully with sample data")
        else:
            print("Database already contains data, skipping seeding")

    except Exception as e:
        print(f"Database initialization error: {e}")

# CORS configuration
# Detect if running locally or in production
is_local = os.environ.get('FLASK_ENV') != 'production' and not os.environ.get('DATABASE_URL')

if is_local:
    # Local development - use localhost
    default_frontend = 'http://localhost:3000'
    print("Running locally - using localhost for CORS")
else:
    # Production - use Vercel link
    default_frontend = 'https://team-feedback-portal.vercel.app'
    print("Running in production - using Vercel link for CORS")

frontend_origin = os.environ.get('FRONTEND_ORIGIN', default_frontend)

# Allow multiple origins for development and production
allowed_origins = [frontend_origin]

# Always allow localhost for development
if not is_local:
    allowed_origins.extend([
        'http://localhost:3000',
        'http://localhost:3001'
    ])

# Always allow the main Vercel domain
if 'https://team-feedback-portal.vercel.app' not in allowed_origins:
    allowed_origins.append('https://team-feedback-portal.vercel.app')

def validate_origin(origin):
    """Custom origin validation for Vercel preview deployments"""
    if origin in allowed_origins:
        return True
    # Allow any vercel.app subdomain for preview deployments
    if origin and origin.endswith('.vercel.app') and 'team-feedback-portal' in origin:
        return True
    return False

CORS(app,
     origins=validate_origin,
     supports_credentials=True,
     allow_headers=['Content-Type', 'Authorization', 'X-Requested-With'],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])

print(f"Primary frontend origin: {frontend_origin}")
print(f"Allowed CORS origins: {allowed_origins}")
print("Additional validation for *.vercel.app domains enabled")

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
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=False, host='0.0.0.0', port=port) 