from flask import Flask
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
db_path = os.environ.get('DATABASE_URL', 'sqlite:///instance/feedback_system.db')
app.config['SQLALCHEMY_DATABASE_URI'] = db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'dev-secret-key'

db.init_app(app)
migrate = Migrate(app, db)
login_manager = LoginManager()
login_manager.init_app(app)

# Allow both local and production frontends
CORS(app, origins=[
    "http://localhost:3000",
    "https://team-feedback-portal.vercel.app"
])

from routes import routes

app.register_blueprint(routes)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 