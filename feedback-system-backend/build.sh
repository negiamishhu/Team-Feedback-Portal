#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Run database migrations
echo "Running database migrations..."
flask db upgrade

# Seed the database with initial data
echo "Seeding database..."
python seeder.py

echo "Build completed successfully!"