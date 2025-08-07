from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from models import db, User, Feedback, FeedbackRequest
import os

routes = Blueprint('routes', __name__)

# Database initialization endpoint
@routes.route('/init-db', methods=['POST'])
def init_db():
    try:
        # Create all tables
        db.create_all()

        # Check if we need to seed the database
        if not User.query.first():
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

            return jsonify({'message': 'Database initialized and seeded successfully'}), 200
        else:
            return jsonify({'message': 'Database already initialized'}), 200

    except Exception as e:
        return jsonify({'error': f'Database initialization failed: {str(e)}'}), 500

# Manual seeding endpoint
@routes.route('/seed-db', methods=['POST'])
def seed_db():
    try:
        # Check if database is already seeded
        if User.query.first():
            return jsonify({'message': 'Database already contains data'}), 200

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

        return jsonify({'message': 'Database seeded successfully'}), 200

    except Exception as e:
        return jsonify({'error': f'Database seeding failed: {str(e)}'}), 500

# Authentication routes
@routes.route('/register', methods=['POST'])
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

@routes.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 204
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

@routes.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200


@routes.route('/users', methods=['GET'])
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


@routes.route('/feedback', methods=['POST'])
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

@routes.route('/feedback/<int:feedback_id>', methods=['PUT'])
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

@routes.route('/feedback/<int:feedback_id>/acknowledge', methods=['POST'])
@login_required
def acknowledge_feedback(feedback_id):
    feedback = Feedback.query.get_or_404(feedback_id)
    if feedback.employee_id != current_user.id:
        return jsonify({'error': 'You can only acknowledge feedback for yourself'}), 403
    feedback.acknowledged = True
    db.session.commit()
    return jsonify({'message': 'Feedback acknowledged'}), 200

@routes.route('/feedback', methods=['GET'])
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
@routes.route('/dashboard', methods=['GET'])
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

@routes.route('/all-employees', methods=['GET'])
@login_required
def get_all_employees():
    if current_user.role != 'manager':
        return jsonify({'error': 'Only managers can view all employees'}), 403
    employees = User.query.filter_by(role='employee').all()
    return jsonify({
        'employees': [{
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'role': user.role,
            'manager_id': user.manager_id
        } for user in employees]
    }), 200

@routes.route('/assign-team', methods=['POST'])
@login_required
def assign_team():
    if current_user.role != 'manager':
        return jsonify({'error': 'Only managers can assign team members'}), 403
    data = request.get_json()
    employee_ids = data.get('employee_ids', [])
    if not isinstance(employee_ids, list):
        return jsonify({'error': 'employee_ids must be a list'}), 400
    updated = []
    for emp_id in employee_ids:
        employee = User.query.filter_by(id=emp_id, role='employee').first()
        if employee:
            employee.manager_id = current_user.id
            updated.append(employee.id)
    db.session.commit()
    return jsonify({'message': 'Team assigned successfully', 'assigned_employee_ids': updated}), 200

@routes.route('/feedback-request', methods=['POST'])
@login_required
def request_feedback():
    if current_user.role != 'employee':
        return jsonify({'error': 'Only employees can request feedback'}), 403
    data = request.get_json()
    manager_id = current_user.manager_id
    if not manager_id:
        return jsonify({'error': 'No manager assigned'}), 400
    req = FeedbackRequest(
        employee_id=current_user.id,
        manager_id=manager_id,
        message=data.get('message', '')
    )
    db.session.add(req)
    db.session.commit()
    return jsonify({'message': 'Feedback request sent!'}), 201

@routes.route('/feedback-requests', methods=['GET'])
@login_required
def get_feedback_requests():
    if current_user.role != 'manager':
        return jsonify({'error': 'Only managers can view feedback requests'}), 403
    requests = FeedbackRequest.query.filter_by(manager_id=current_user.id, status='pending').all()
    return jsonify({'requests': [{
        'id': r.id,
        'employee_id': r.employee_id,
        'employee_name': User.query.get(r.employee_id).username,
        'message': r.message,
        'created_at': r.created_at.isoformat()
    } for r in requests]})