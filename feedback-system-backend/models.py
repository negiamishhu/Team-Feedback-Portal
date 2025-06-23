from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
from datetime import datetime
from db import db
 

class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # 'manager' or 'employee'
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    
    # Relationships
    team_members = db.relationship('User', backref=db.backref('manager', remote_side=[id]))
    feedback_given = db.relationship('Feedback', backref='manager', foreign_keys='Feedback.manager_id')
    feedback_received = db.relationship('Feedback', backref='employee', foreign_keys='Feedback.employee_id')

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    employee_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    strengths = db.Column(db.Text, nullable=False)
    areas_to_improve = db.Column(db.Text, nullable=False)
    sentiment = db.Column(db.String(20), nullable=False)  # 'positive', 'neutral', 'negative'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    acknowledged = db.Column(db.Boolean, default=False) 