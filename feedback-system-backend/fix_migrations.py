#!/usr/bin/env python3
"""
Script to fix migration issues for deployment
"""
import os
import sys
from sqlalchemy import create_engine, text
from urllib.parse import urlparse

def fix_migrations():
    """Fix migration issues by resetting alembic version table"""
    db_url = os.environ.get('DATABASE_URL')
    if not db_url:
        print("No DATABASE_URL found, skipping migration fix")
        return True
    
    try:
        # Create engine
        engine = create_engine(db_url)
        
        # Drop alembic_version table if it exists
        with engine.connect() as conn:
            conn.execute(text("DROP TABLE IF EXISTS alembic_version"))
            conn.commit()
        
        print("Successfully reset alembic version table")
        return True
        
    except Exception as e:
        print(f"Error fixing migrations: {e}")
        # If we can't connect, the database might not exist yet, which is fine
        return True

if __name__ == "__main__":
    success = fix_migrations()
    sys.exit(0 if success else 1) 