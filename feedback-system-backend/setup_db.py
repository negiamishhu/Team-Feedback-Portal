#!/usr/bin/env python3
"""
Simple database setup script for deployment
"""
import os
import sqlite3
from pathlib import Path

def setup_database():
    """Setup SQLite database for deployment"""
    try:
        # Create instance directory if it doesn't exist
        instance_dir = Path("instance")
        instance_dir.mkdir(exist_ok=True)
        
        # Create SQLite database
        db_path = instance_dir / "feedback_system.db"
        
        # Connect to database (this will create it if it doesn't exist)
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username VARCHAR(80) UNIQUE NOT NULL,
                email VARCHAR(120) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role VARCHAR(20) NOT NULL,
                manager_id INTEGER,
                FOREIGN KEY (manager_id) REFERENCES user (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                manager_id INTEGER NOT NULL,
                employee_id INTEGER NOT NULL,
                strengths TEXT NOT NULL,
                areas_to_improve TEXT NOT NULL,
                sentiment VARCHAR(20) NOT NULL,
                created_at DATETIME,
                updated_at DATETIME,
                acknowledged BOOLEAN,
                FOREIGN KEY (employee_id) REFERENCES user (id),
                FOREIGN KEY (manager_id) REFERENCES user (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS feedback_request (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id INTEGER NOT NULL,
                manager_id INTEGER NOT NULL,
                message TEXT,
                created_at DATETIME,
                status VARCHAR(20),
                FOREIGN KEY (employee_id) REFERENCES user (id),
                FOREIGN KEY (manager_id) REFERENCES user (id)
            )
        ''')
        
        conn.commit()
        conn.close()
        
        print("Database setup completed successfully!")
        return True
        
    except Exception as e:
        print(f"Database setup error: {e}")
        return False

if __name__ == "__main__":
    setup_database() 