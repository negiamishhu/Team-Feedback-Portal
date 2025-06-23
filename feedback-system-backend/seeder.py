from app import app, db, User, Feedback
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()

    # Create sample data if database is empty
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

    print('Database seeded successfully.') 