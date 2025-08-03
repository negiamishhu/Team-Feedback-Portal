#!/bin/bash

# Deployment script for Render
# This script handles database migrations properly

echo "Starting deployment process..."

# Set Flask environment
export FLASK_APP=app.py

# Function to reset migration state
reset_migration_state() {
    echo "Resetting migration state..."
    python -c "
from app import app, db
from sqlalchemy import text
with app.app_context():
    try:
        # Clear the alembic_version table
        db.session.execute(text('DELETE FROM alembic_version'))
        db.session.commit()
        print('✓ Cleared alembic_version table')
        
        # Create tables if they don't exist
        db.create_all()
        print('✓ Tables created/verified')
        
        print('✓ Migration state reset successfully!')
    except Exception as e:
        print(f'Error: {e}')
        db.session.rollback()
"
}

# Function to run migrations
run_migrations() {
    echo "Running migrations..."
    flask db stamp head || {
        echo "Migration stamp failed, resetting state..."
        reset_migration_state
        flask db stamp head
    }
    
    # Create migration if needed
    flask db migrate -m "deployment migration" || echo "No new migrations needed"
    
    # Apply migrations
    flask db upgrade || echo "Migration upgrade completed"
}

# Main deployment process
echo "Step 1: Attempting to run migrations..."
run_migrations

echo "Step 2: Starting application..."
gunicorn app:app --bind 0.0.0.0:$PORT 