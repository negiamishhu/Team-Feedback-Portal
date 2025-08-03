#!/bin/bash

# Install dependencies
pip install -r requirements.txt

# Setup database
echo "Setting up database..."
python setup_db.py

echo "Build completed successfully!" 