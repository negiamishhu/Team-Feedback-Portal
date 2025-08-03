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
if os.environ.get('DATABASE_URL') and 'postgresql' in os.environ.get('DATABASE_URL', ''):
    # Check if psycopg2 is available for PostgreSQL
    try:
        import psycopg2
        app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    except ImportError:
        # Fallback to SQLite if psycopg2 is not available
        print("PostgreSQL URL provided but psycopg2 not available, using SQLite")
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/feedback_system.db'
else:
    # Development: Use SQLite with relative path
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/feedback_system.db'

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

# Initialize database tables
with app.app_context():
    try:
        db.create_all()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Database initialization error: {e}")

# CORS configuration
frontend_origin = os.environ.get('FRONTEND_ORIGIN', 'http://localhost:3000')
CORS(app, origins=[frontend_origin], supports_credentials=True)

print("Allowed CORS origins:", [frontend_origin])

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