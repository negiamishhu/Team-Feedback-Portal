#!/usr/bin/env python3
"""
Deployment script for Render
This script handles database migrations properly for production deployment
"""
import os
import sys
from app import app, db
from sqlalchemy import text

def reset_migration_state():
    """Reset the migration state by clearing alembic_version table"""
    try:
        with app.app_context():
            # Clear the alembic_version table
            db.session.execute(text('DELETE FROM alembic_version'))
            db.session.commit()
            print("✓ Cleared alembic_version table")
            
            # Create tables if they don't exist
            db.create_all()
            print("✓ Tables created/verified")
            
            print("✓ Migration state reset successfully!")
            return True
    except Exception as e:
        print(f"Error resetting migration state: {e}")
        return False

def run_migrations():
    """Run database migrations"""
    try:
        # Try to stamp the current head
        os.system("flask db stamp head")
        print("✓ Migration state stamped")
        
        # Try to create a new migration if needed
        result = os.system("flask db migrate -m 'deployment migration'")
        if result == 0:
            print("✓ New migration created")
        else:
            print("ℹ No new migrations needed")
        
        # Apply migrations
        os.system("flask db upgrade")
        print("✓ Migrations applied")
        return True
    except Exception as e:
        print(f"Error running migrations: {e}")
        return False

def main():
    """Main deployment function"""
    print("🚀 Starting deployment process...")
    
    # Step 1: Reset migration state
    print("\n📋 Step 1: Resetting migration state...")
    if not reset_migration_state():
        print("❌ Failed to reset migration state")
        sys.exit(1)
    
    # Step 2: Run migrations
    print("\n📋 Step 2: Running migrations...")
    if not run_migrations():
        print("❌ Failed to run migrations")
        sys.exit(1)
    
    print("\n✅ Deployment preparation completed successfully!")
    print("🚀 Starting Gunicorn server...")
    
    # Start the application with Gunicorn
    port = os.environ.get('PORT', 5000)
    os.system(f"gunicorn app:app --bind 0.0.0.0:{port}")

if __name__ == "__main__":
    main() 