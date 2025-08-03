#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Setup database
echo "Setting up database..."
python setup_db.py

# Create a simple migration stamp
echo "Stamping migration..."
alembic stamp head

echo "Build completed successfully!" 