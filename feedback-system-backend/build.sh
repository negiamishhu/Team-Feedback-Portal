#!/bin/bash

# Build script for Render deployment
echo "🚀 Starting build process..."

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r requirements.txt

# Setup database and migration state
echo "🗄️ Setting up database..."
python -c "
from app import app, db
from sqlalchemy import text
with app.app_context():
    try:
        # Clear any old migration state
        db.session.execute(text('DELETE FROM alembic_version'))
        db.session.commit()
        print('✓ Cleared old migration state')
        
        # Create tables
        db.create_all()
        print('✓ Database tables created')
        
        # Stamp with current migration
        db.session.execute(text(\"INSERT INTO alembic_version (version_num) VALUES ('b5c0efbb251c') ON CONFLICT (version_num) DO NOTHING\"))
        db.session.commit()
        print('✓ Migration state updated')
        
        print('✅ Database setup completed successfully!')
    except Exception as e:
        print(f'Error: {e}')
"

echo "✅ Build completed successfully!" 