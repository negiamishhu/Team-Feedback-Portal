from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from models import db, User, Feedback
import os

routes = Blueprint('routes', __name__)

# Authentication routes
@routes.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=generate_password_hash(data['password']),
        role=data['role']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@routes.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        login_user(user)
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
                'manager_id': user.manager_id
            }
        }), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@routes.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

# User management routes
@routes.route('/api/users', methods=['GET'])
@login_required
def get_users():
    if current_user.role == 'manager':
        team_members = User.query.filter_by(manager_id=current_user.id).all()
        return jsonify({
            'users': [{
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role
            } for user in team_members]
        }), 200
    else:
        return jsonify({
            'users': [{
                'id': current_user.id,
                'username': current_user.username,
                'email': current_user.email,
                'role': current_user.role
            }]
        }), 200

# Feedback routes
@routes.route('/api/feedback', methods=['POST'])
@login_required
def create_feedback():
    if current_user.role != 'manager':
        return jsonify({'error': 'Only managers can create feedback'}), 403
    data = request.get_json()
    employee = User.query.filter_by(id=data['employee_id'], manager_id=current_user.id).first()
    if not employee:
        return jsonify({'error': 'Employee not found or not under your management'}), 404
    feedback = Feedback(
        manager_id=current_user.id,
        employee_id=data['employee_id'],
        strengths=data['strengths'],
        areas_to_improve=data['areas_to_improve'],
        sentiment=data['sentiment']
    )
    db.session.add(feedback)
    db.session.commit()
    return jsonify({'message': 'Feedback created successfully', 'id': feedback.id}), 201

@routes.route('/api/feedback/<int:feedback_id>', methods=['PUT'])
@login_required
def update_feedback(feedback_id):
    feedback = Feedback.query.get_or_404(feedback_id)
    if current_user.role == 'manager':
        if feedback.manager_id != current_user.id:
            return jsonify({'error': 'You can only edit your own feedback'}), 403
    else:
        return jsonify({'error': 'Employees cannot edit feedback'}), 403
    data = request.get_json()
    feedback.strengths = data['strengths']
    feedback.areas_to_improve = data['areas_to_improve']
    feedback.sentiment = data['sentiment']
    feedback.updated_at = datetime.utcnow()
    db.session.commit()
    return jsonify({'message': 'Feedback updated successfully'}), 200

@routes.route('/api/feedback/<int:feedback_id>/acknowledge', methods=['POST'])
@login_required
def acknowledge_feedback(feedback_id):
    feedback = Feedback.query.get_or_404(feedback_id)
    if feedback.employee_id != current_user.id:
        return jsonify({'error': 'You can only acknowledge feedback for yourself'}), 403
    feedback.acknowledged = True
    db.session.commit()
    return jsonify({'message': 'Feedback acknowledged'}), 200

@routes.route('/api/feedback', methods=['GET'])
@login_required
def get_feedback():
    if current_user.role == 'manager':
        feedback_list = Feedback.query.filter_by(manager_id=current_user.id).all()
    else:
        feedback_list = Feedback.query.filter_by(employee_id=current_user.id).all()
    return jsonify({
        'feedback': [{
            'id': f.id,
            'manager_id': f.manager_id,
            'employee_id': f.employee_id,
            'strengths': f.strengths,
            'areas_to_improve': f.areas_to_improve,
            'sentiment': f.sentiment,
            'created_at': f.created_at.isoformat(),
            'updated_at': f.updated_at.isoformat(),
            'acknowledged': f.acknowledged,
            'manager_name': User.query.get(f.manager_id).username,
            'employee_name': User.query.get(f.employee_id).username
        } for f in feedback_list]
    }), 200

# Dashboard routes
@routes.route('/api/dashboard', methods=['GET'])
@login_required
def get_dashboard():
    if current_user.role == 'manager':
        team_members = User.query.filter_by(manager_id=current_user.id).all()
        team_feedback = Feedback.query.filter_by(manager_id=current_user.id).all()
        total_feedback = len(team_feedback)
        sentiment_counts = {
            'positive': len([f for f in team_feedback if f.sentiment == 'positive']),
            'neutral': len([f for f in team_feedback if f.sentiment == 'neutral']),
            'negative': len([f for f in team_feedback if f.sentiment == 'negative'])
        }
        return jsonify({
            'type': 'manager',
            'team_size': len(team_members),
            'total_feedback': total_feedback,
            'sentiment_counts': sentiment_counts,
            'recent_feedback': [{
                'id': f.id,
                'employee_name': User.query.get(f.employee_id).username,
                'sentiment': f.sentiment,
                'created_at': f.created_at.isoformat(),
                'acknowledged': f.acknowledged
            } for f in sorted(team_feedback, key=lambda x: x.created_at, reverse=True)[:5]]
        }), 200
    else:
        received_feedback = Feedback.query.filter_by(employee_id=current_user.id).all()
        return jsonify({
            'type': 'employee',
            'total_feedback': len(received_feedback),
            'unacknowledged_count': len([f for f in received_feedback if not f.acknowledged]),
            'recent_feedback': [{
                'id': f.id,
                'manager_name': User.query.get(f.manager_id).username,
                'sentiment': f.sentiment,
                'created_at': f.created_at.isoformat(),
                'acknowledged': f.acknowledged
            } for f in sorted(received_feedback, key=lambda x: x.created_at, reverse=True)[:5]]
        }), 200

# Initialize database
@routes.route('/api/init-db', methods=['POST'])
def init_database():
    if os.environ.get("FLASK_ENV") == "production":
        return jsonify({'error': 'Not allowed in production'}), 403
    db.create_all()
    return jsonify({'message': 'Database initialized successfully'}), 200 