#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Fix migration issues
echo "Fixing migration issues..."
python fix_migrations.py

# Run migrations
echo "Running database migrations..."
alembic upgrade head

echo "Build completed successfully!" 