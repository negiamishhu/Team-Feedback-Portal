from flask import Flask, jsonify, request
from db import db
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from flask_migrate import Migrate
from models import User, Feedback
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Use environment variable for DB path, or default to a relative path
db_path = os.environ.get('DATABASE_URL', 'sqlite:///D:/Users/Public/Desktop/Mishuu/new/Team-Feedback-Portal/feedback-system-backend/instance/feedback_system.db')
app.config['SQLALCHEMY_DATABASE_URI'] = db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev-secret-key' 

db.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

# Allow both local and production frontends
frontend_origin = os.environ.get('FRONTEND_ORIGIN', 'https://team-feedback-portal.vercel.app')
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
    app.run(debug=True, host='0.0.0.0', port=5000) 